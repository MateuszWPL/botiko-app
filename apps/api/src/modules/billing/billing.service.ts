import { randomUUID } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import StripeLib from 'stripe';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { trialEndDate } from '../../common/tenant-status';
import { NotificationService } from '../../common/services/notification.service';
import { EmailService, emailToFirstName } from '../../email/email.service';
import { env } from '../../config/env';

export interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
  trialEndsAt: string | null;
  trialDaysTotal: number | null;
}

// Stripe v22 + nodenext CJS: StripeLib is StripeConstructor (callable)
type StripeInstance = ReturnType<typeof StripeLib>;

/**
 * Subscription statuses we treat as "bot should serve traffic".
 *
 * Intentional omissions (audit A12):
 * - `past_due` is NOT in this list. Stripe moves a subscription to `past_due`
 *   after the first failed payment attempt and keeps retrying (smart retry)
 *   for several days. During that window the subscription is still live
 *   and the card may succeed on the next attempt. We do NOT deactivate on
 *   `past_due` — the bot continues serving traffic during the grace period.
 *   Deactivation only fires when Stripe gives up and sets status to `unpaid`
 *   (after exhausting all retries) or `canceled`.
 *
 * - `incomplete` is NOT in this list. It means the initial payment hasn't
 *   been confirmed yet (e.g. 3DS pending). We wait for Stripe to confirm.
 *
 * Grace period summary:
 *   active / trialing → bot ON
 *   past_due          → bot ON (Stripe still retrying — grace period)
 *   incomplete        → bot ON (initial payment pending)
 *   unpaid            → bot OFF (Stripe exhausted retries)
 *   canceled          → bot OFF
 *   incomplete_expired → bot OFF
 *   paused            → bot OFF
 */
const ACTIVE_STATUSES: string[] = ['active', 'trialing'];
const DEACTIVATING_STATUSES: string[] = [
  'unpaid',
  'canceled',
  'incomplete_expired',
  'paused',
];

interface StripeSession {
  id: string;
  client_reference_id: string | null;
  customer: string | { id?: string } | null;
  subscription: string | { id?: string } | null;
  url: string | null;
  status?: string;
  payment_status?: string;
}
interface StripeSubscription {
  id: string;
  status: string;
  customer?: string | { id?: string } | null;
}
interface StripeInvoice {
  id?: string;
  customer: string | { id?: string } | null;
  amount_paid?: number;
  currency?: string;
  billing_reason?: string;
  hosted_invoice_url?: string | null;
  period_start?: number;
  period_end?: number;
  charge?: string | null;
  subscription?: string | null;
}
interface StripeEvent {
  id: string;
  type: string;
  data: { object: unknown };
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly stripe: StripeInstance | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
    private readonly emailService: EmailService,
  ) {
    this.stripe = env.STRIPE_SECRET_KEY
      ? new StripeLib(env.STRIPE_SECRET_KEY, {
          apiVersion: '2026-03-25.dahlia',
        })
      : null;

    if (!this.stripe) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set — billing endpoints disabled',
      );
    }
  }

  async getStatus(tenantId: string): Promise<BillingStatus> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        plan: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        createdAt: true,
        trialEndsAt: true,
      },
    });

    if (!tenant) throw new NotFoundException('Tenant not found');

    // Audit A11: do NOT auto-deactivate tenants here (race condition when
    // dashboard is open in multiple tabs — each tab fires a parallel UPDATE,
    // last-write wins in unexpected ways). Trial expiry is handled exclusively
    // by the cron endpoint `POST /api/v1/billing/cron/trial-notifications`,
    // which runs once per day. Read-only here.
    const onTrial = !tenant.stripeSubscriptionId;
    const trialEnd = trialEndDate(tenant);
    // Total trial length (createdAt → trialEndsAt), so the dashboard progress
    // bar renders correctly for 14-day trials and longer pilot periods alike.
    const trialDaysTotal = onTrial
      ? Math.max(
          1,
          Math.round(
            (trialEnd.getTime() - tenant.createdAt.getTime()) / 86_400_000,
          ),
        )
      : null;

    return {
      plan: tenant.plan,
      isActive: tenant.isActive,
      hasSubscription: !!tenant.stripeSubscriptionId,
      stripeCustomerId: tenant.stripeCustomerId,
      trialEndsAt: onTrial ? trialEnd.toISOString() : null,
      trialDaysTotal,
    };
  }

  /**
   * Called by external cron (Vercel Cron, Railway, Upstash).
   * Sends trial reminder emails and deactivates expired trials.
   *
   * Idempotency (audit A7): `Tenant.lastTrialEmailSentAt` records the day
   * we last sent a reminder. If cron fires twice in the same day we skip
   * the second round, so users never get duplicate emails.
   */
  async runTrialNotifications(): Promise<{
    processed: number;
    emails: number;
  }> {
    const tenants = await this.prisma.tenant.findMany({
      where: { stripeSubscriptionId: null },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        trialEndsAt: true,
        lastTrialEmailSentAt: true,
        users: { select: { email: true }, take: 1 },
      },
    });

    const now = new Date();
    const todayKey = toDayKey(now);
    let emails = 0;

    for (const tenant of tenants) {
      const trialEnd = trialEndDate(tenant);

      const msLeft = trialEnd.getTime() - now.getTime();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      const ownerEmail = tenant.users[0]?.email;

      // Auto-deactivate expired trials (idempotent — guarded by isActive)
      if (daysLeft <= 0 && tenant.isActive) {
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { isActive: false },
        });
        await this.logBillingEvent(tenant.id, 'TRIAL_EXPIRED', {
          trialEndDate: trialEnd.toISOString(),
        });
        this.logger.log(
          `Cron: trial expired — deactivated tenant: ${tenant.id}`,
        );
      }

      // Only send on specific days AND not yet sent today.
      const shouldSend =
        ownerEmail &&
        [3, 1, 0].includes(daysLeft) &&
        (!tenant.lastTrialEmailSentAt ||
          toDayKey(tenant.lastTrialEmailSentAt) !== todayKey);

      if (shouldSend && ownerEmail) {
        await this.notification.sendTrialNotificationEmail({
          toEmail: ownerEmail,
          tenantName: tenant.name,
          daysLeft: Math.max(0, daysLeft),
        });
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { lastTrialEmailSentAt: now },
        });
        emails++;
      }
    }

    this.logger.log(
      `Trial cron: processed ${tenants.length} tenants, sent ${emails} emails`,
    );
    return { processed: tenants.length, emails };
  }

  async createCheckoutSession(
    tenantId: string,
    userEmail: string,
  ): Promise<{ url: string }> {
    this.requireStripe();

    if (!env.STRIPE_PRICE_ID) {
      throw new BadRequestException('Stripe price not configured');
    }

    // Audit A2: block double subscription.
    // If the tenant already has an active Stripe subscription, a second
    // Checkout would create a parallel subscription and the card would
    // be charged twice. Refuse and steer to the customer portal instead.
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { stripeSubscriptionId: true, stripeCustomerId: true },
    });

    if (tenant?.stripeSubscriptionId) {
      let stillActive = false;
      try {
        const sub = await this.stripe!.subscriptions.retrieve(
          tenant.stripeSubscriptionId,
        );
        stillActive = ACTIVE_STATUSES.includes(sub.status);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(
          `Failed to retrieve subscription ${tenant.stripeSubscriptionId}: ${msg}`,
        );
        // If Stripe can't confirm the subscription, fail closed — the
        // safer behaviour is to send the user to the portal to manage
        // the existing record rather than risk a duplicate charge.
        stillActive = true;
      }

      if (stillActive) {
        throw new ConflictException(
          'Masz już aktywną subskrypcję. Użyj portalu klienta, aby nią zarządzać.',
        );
      }
    }

    const session = await this.stripe!.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: userEmail,
      client_reference_id: tenantId,
      subscription_data: { trial_period_days: 14 },
      success_url: `${env.APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${env.APP_URL}/dashboard/billing?canceled=true`,
      locale: 'pl',
    });

    if (!session.url) {
      throw new BadRequestException('Failed to create checkout session');
    }

    this.logger.log(`Checkout session created for tenant: ${tenantId}`);
    return { url: session.url };
  }

  async createPortalSession(tenantId: string): Promise<{ url: string }> {
    this.requireStripe();

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { stripeCustomerId: true },
    });

    if (!tenant?.stripeCustomerId) {
      throw new BadRequestException(
        'Brak aktywnej subskrypcji. Subskrybuj plan najpierw.',
      );
    }

    const session = await this.stripe!.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${env.APP_URL}/dashboard/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    this.requireStripe();

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: StripeEvent;
    try {
      event = this.stripe!.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      ) as StripeEvent;
    } catch (err: unknown) {
      // Audit A9: don't echo raw Stripe error back to callers. Log
      // details server-side, return generic 400 to the client.
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn(`Webhook signature verification failed: ${msg}`);
      throw new BadRequestException('Invalid signature');
    }

    // Audit A1: idempotency. Stripe retries webhooks aggressively on any
    // non-2xx (and occasionally on 2xx under network blips), so a naïve
    // handler could activate the same tenant multiple times. We INSERT
    // the event id first; if it's a duplicate the unique constraint
    // rejects it and we return silently.
    const alreadyProcessed = await this.recordEvent(event.id, event.type);
    if (alreadyProcessed) {
      this.logger.log(
        `Stripe webhook duplicate ignored: ${event.id} (${event.type})`,
      );
      return;
    }

    this.logger.log(`Stripe webhook received: ${event.type} (${event.id})`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(
          event.data.object as StripeSession,
          event.id,
        );
        break;
      case 'customer.subscription.updated':
        await this.onSubscriptionUpdated(
          event.data.object as StripeSubscription,
          event.id,
        );
        break;
      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(
          event.data.object as StripeSubscription,
          event.id,
        );
        break;
      case 'invoice.payment_succeeded':
        await this.onInvoicePaymentSucceeded(
          event.data.object as StripeInvoice,
        );
        break;
      case 'invoice.payment_failed':
        // Audit A3: do NOT deactivate here. Stripe retries the charge
        // several times; reacting to the first failure kills service for
        // a customer whose 3DS timed out. Deactivation is handled by
        // `customer.subscription.updated` once the status flips to unpaid.
        await this.onInvoicePaymentFailed(event.data.object as StripeInvoice);
        break;
      default:
        // Unhandled events — safe no-op, already recorded for idempotency.
        break;
    }
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Records a Stripe event id. Returns true when the event was already
   * processed (caller should short-circuit), false on first sighting.
   */
  private async recordEvent(id: string, type: string): Promise<boolean> {
    try {
      await this.prisma.processedStripeEvent.create({ data: { id, type } });
      return false;
    } catch (err: unknown) {
      // Prisma surfaces unique-constraint violations with code 'P2002'
      const code =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code?: string }).code
          : undefined;
      if (code === 'P2002') {
        return true;
      }
      // Any other error is unexpected — don't swallow, force a 500 so
      // Stripe retries (and eventually surfaces the issue in logs).
      throw err;
    }
  }

  private async onCheckoutCompleted(
    session: StripeSession,
    stripeEventId: string,
  ): Promise<void> {
    const tenantId = session.client_reference_id;
    if (!tenantId) {
      this.logger.warn(
        'checkout.session.completed missing client_reference_id',
      );
      return;
    }

    // Audit A6: verify tenant exists before we blindly write to it.
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
    if (!tenant) {
      this.logger.warn(
        `checkout.session.completed for unknown tenant: ${tenantId}`,
      );
      return;
    }

    // Audit A5: only treat the session as paid when Stripe confirms it.
    // Subscription-mode sessions with payment_status === 'paid' or
    // status === 'complete' are the legitimate success states.
    const paid =
      session.payment_status === 'paid' ||
      session.payment_status === 'no_payment_required' ||
      session.status === 'complete';
    if (!paid) {
      this.logger.warn(
        `checkout.session.completed not paid (status=${String(session.status)}, payment_status=${String(session.payment_status)}) — skipping activation for tenant ${tenantId}`,
      );
      return;
    }

    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    // Retrieve line_items for plan resolution. If the call fails we log
    // and throw — Stripe will retry the webhook rather than silently
    // activating the tenant on the wrong plan (audit A8).
    let plan: Plan = Plan.STARTER;
    try {
      const fullSession = await this.stripe!.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] },
      );
      const priceId = fullSession.line_items?.data[0]?.price?.id;
      plan = this.resolvePlan(priceId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Could not retrieve session line_items for tenant ${tenantId}: ${msg}`,
      );
      throw err;
    }

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        isActive: true,
        plan,
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
      },
    });

    await this.logBillingEvent(tenantId, 'ACTIVATED', {
      stripeEventId,
      stripeSessionId: session.id,
      plan,
    });

    this.logger.log(
      `Checkout completed — tenant activated: ${tenantId}, plan: ${plan}`,
    );
  }

  private async onSubscriptionUpdated(
    subscription: StripeSubscription,
    stripeEventId: string,
  ): Promise<void> {
    const tenant = await this.resolveTenantForSubscription(subscription);
    if (!tenant) {
      this.logger.warn(
        `subscription.updated: no tenant matched ${subscription.id} — ignoring`,
      );
      return;
    }

    // Audit A3: deactivate only on terminal / unpaid statuses.
    const shouldActivate = ACTIVE_STATUSES.includes(subscription.status);
    const shouldDeactivate = DEACTIVATING_STATUSES.includes(
      subscription.status,
    );

    if (!shouldActivate && !shouldDeactivate) {
      // past_due, incomplete — leave tenant alone, Stripe is still trying.
      this.logger.log(
        `Subscription ${subscription.id} status=${subscription.status} — no activity change`,
      );
      return;
    }

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        isActive: shouldActivate,
        // Backfill the subscription id if we only matched via customer
        stripeSubscriptionId: subscription.id,
      },
    });

    const eventName = shouldActivate ? 'ACTIVATED' : 'DEACTIVATED';
    await this.logBillingEvent(tenant.id, eventName, {
      stripeEventId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    });

    this.logger.log(
      `Subscription ${subscription.id} updated → isActive: ${String(shouldActivate)} (status=${subscription.status})`,
    );
  }

  private async onSubscriptionDeleted(
    subscription: StripeSubscription,
    stripeEventId: string,
  ): Promise<void> {
    const tenant = await this.resolveTenantForSubscription(subscription);
    if (!tenant) return;

    const tenantWithUsers = await this.prisma.tenant.findUnique({
      where: { id: tenant.id },
      select: {
        users: { where: { role: 'OWNER' }, take: 1, select: { email: true } },
      },
    });

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive: false },
    });

    await this.logBillingEvent(tenant.id, 'DEACTIVATED', {
      stripeEventId,
      stripeSubscriptionId: subscription.id,
      reason: 'subscription_deleted',
    });

    this.logger.log(`Subscription deleted — tenant deactivated: ${tenant.id}`);

    const ownerEmail = tenantWithUsers?.users?.[0]?.email;
    if (ownerEmail) {
      // End of paid period = now (subscription cancelled immediately or at period end)
      const endDate = new Date().toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      await this.emailService
        .sendSubscriptionCancelled({
          email: ownerEmail,
          firstName: emailToFirstName(ownerEmail),
          endDate,
        })
        .catch((err: unknown) =>
          this.logger.error('Failed to send cancellation email', err),
        );
    }
  }

  private async onInvoicePaymentSucceeded(
    invoice: StripeInvoice,
  ): Promise<void> {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    if (!customerId) return;

    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId },
      select: {
        id: true,
        users: {
          where: { role: 'OWNER' },
          take: 1,
          select: { id: true, email: true },
        },
      },
    });
    if (!tenant) return;

    const ownerEmail = tenant.users?.[0]?.email;
    if (!ownerEmail) return;

    const firstName = emailToFirstName(ownerEmail);
    const amountPln =
      invoice.amount_paid != null
        ? `${(invoice.amount_paid / 100).toFixed(2)} ${(invoice.currency ?? 'pln').toUpperCase()}`
        : '99,00 PLN';

    // Get card details from Stripe charge (best-effort)
    let cardBrand = 'Karta';
    let last4 = '****';
    if (this.stripe && invoice.charge) {
      try {
        const charge = await this.stripe.charges.retrieve(invoice.charge, {
          expand: ['payment_method_details'],
        });
        const card = (
          charge as unknown as {
            payment_method_details?: {
              card?: { brand?: string; last4?: string };
            };
          }
        ).payment_method_details?.card;
        if (card?.brand)
          cardBrand = card.brand.charAt(0).toUpperCase() + card.brand.slice(1);
        if (card?.last4) last4 = card.last4;
      } catch {
        // Non-critical — fall back to defaults
      }
    }

    const isFirstPayment = invoice.billing_reason === 'subscription_create';

    if (isFirstPayment) {
      // Calculate next billing date (~30 days from period_end)
      const nextDate = invoice.period_end
        ? new Date(invoice.period_end * 1000).toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '';
      await this.emailService.sendPaymentConfirmed({
        email: ownerEmail,
        firstName,
        amount: amountPln,
        paymentMethod: cardBrand,
        last4,
        nextPaymentDate: nextDate,
      });
    } else {
      const periodDate = invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : new Date();
      const periodEndDate = invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : new Date();
      await this.emailService.sendRecurringInvoice({
        email: ownerEmail,
        month: String(periodDate.getMonth() + 1).padStart(2, '0'),
        year: String(periodDate.getFullYear()),
        amount: amountPln,
        paymentMethod: cardBrand,
        last4,
        periodStart: periodDate.toLocaleDateString('pl-PL'),
        periodEnd: periodEndDate.toLocaleDateString('pl-PL'),
        invoiceUrl:
          invoice.hosted_invoice_url ?? `${env.APP_URL}/dashboard/billing`,
      });
    }
  }

  private async onInvoicePaymentFailed(invoice: StripeInvoice): Promise<void> {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    this.logger.warn(
      `invoice.payment_failed for customer ${customerId ?? '<unknown>'} — awaiting subscription.updated before deactivating`,
    );

    if (!customerId) return;
    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId },
      select: {
        users: { where: { role: 'OWNER' }, take: 1, select: { email: true } },
      },
    });
    const ownerEmail = tenant?.users?.[0]?.email;
    if (!ownerEmail) return;

    // Estimate retry in ~3 days (Stripe's smart retry default)
    const retryDate = new Date(Date.now() + 3 * 86_400_000).toLocaleDateString(
      'pl-PL',
      {
        day: 'numeric',
        month: 'long',
      },
    );

    await this.emailService.sendPaymentFailed({
      email: ownerEmail,
      firstName: emailToFirstName(ownerEmail),
      paymentMethod: 'Karta',
      last4: '****',
      retryDate,
    });
  }

  /**
   * Resolve the tenant for a subscription webhook.
   *
   * Audit A4: handle out-of-order delivery. We may receive
   * `subscription.updated` before `checkout.session.completed` has set
   * `stripeSubscriptionId` on the tenant — so we fall back to matching
   * by `stripeCustomerId` (set on the Stripe side first).
   */
  private async resolveTenantForSubscription(
    subscription: StripeSubscription,
  ): Promise<{ id: string } | null> {
    const bySubscription = await this.prisma.tenant.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      select: { id: true },
    });
    if (bySubscription) return bySubscription;

    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;
    if (!customerId) return null;

    return this.prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
  }

  private requireStripe(): void {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Billing not configured');
    }
  }

  /**
   * Maps a Stripe price ID to the corresponding Plan enum value.
   * Extend this when adding PRO or PREMIUM tiers — add STRIPE_PRO_PRICE_ID
   * to env.ts and map it here.
   */
  private resolvePlan(priceId: string | null | undefined): Plan {
    if (
      priceId &&
      env.STRIPE_PRO_PRICE_ID &&
      priceId === env.STRIPE_PRO_PRICE_ID
    ) {
      return Plan.PRO;
    }
    return Plan.STARTER;
  }

  /**
   * Appends an immutable record to the billing audit log (audit A13).
   *
   * Non-blocking: failures are caught and logged, never thrown. The audit
   * log is a best-effort record — a write failure must not abort the main
   * billing operation that triggered it.
   */
  private async logBillingEvent(
    tenantId: string,
    event: string,
    meta?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.prisma.billingEvent.create({
        data: {
          id: randomUUID(),
          tenantId,
          event,
          meta: meta ? JSON.stringify(meta) : undefined,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to write billing audit log: ${msg}`);
    }
  }
}

/** Day key "YYYY-MM-DD" in the server's timezone — good enough for daily idempotency. */
function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
