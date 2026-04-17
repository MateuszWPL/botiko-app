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
import { NotificationService } from '../../common/services/notification.service';
import { env } from '../../config/env';

export interface BillingStatus {
  plan: string;
  isActive: boolean;
  hasSubscription: boolean;
  stripeCustomerId: string | null;
  trialEndsAt: string | null;
}

// Stripe v22 + nodenext CJS: StripeLib is StripeConstructor (callable)
type StripeInstance = ReturnType<typeof StripeLib>;

/**
 * Subscription statuses we treat as "bot should serve traffic".
 *
 * Excluded from the previous `past_due` (security audit A3): we no longer
 * auto-activate a tenant on `past_due`. Deactivation only happens on
 * `unpaid` / `canceled` / `incomplete_expired`, giving Stripe time to
 * retry the card before the bot goes dark.
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
  customer: string | { id?: string } | null;
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
      },
    });

    if (!tenant) throw new NotFoundException('Tenant not found');

    const trialEndsAt = tenant.stripeSubscriptionId
      ? null
      : (() => {
          const d = new Date(tenant.createdAt);
          d.setDate(d.getDate() + 14);
          return d.toISOString();
        })();

    return {
      plan: tenant.plan,
      isActive: tenant.isActive,
      hasSubscription: !!tenant.stripeSubscriptionId,
      stripeCustomerId: tenant.stripeCustomerId,
      trialEndsAt,
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
        lastTrialEmailSentAt: true,
        users: { select: { email: true }, take: 1 },
      },
    });

    const now = new Date();
    const todayKey = toDayKey(now);
    let emails = 0;

    for (const tenant of tenants) {
      const trialEnd = new Date(tenant.createdAt);
      trialEnd.setDate(trialEnd.getDate() + 14);

      const msLeft = trialEnd.getTime() - now.getTime();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      const ownerEmail = tenant.users[0]?.email;

      // Auto-deactivate expired trials (idempotent — guarded by isActive)
      if (daysLeft <= 0 && tenant.isActive) {
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { isActive: false },
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
        await this.onCheckoutCompleted(event.data.object as StripeSession);
        break;
      case 'customer.subscription.updated':
        await this.onSubscriptionUpdated(
          event.data.object as StripeSubscription,
        );
        break;
      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(
          event.data.object as StripeSubscription,
        );
        break;
      case 'invoice.payment_failed':
        // Audit A3: do NOT deactivate here. Stripe retries the charge
        // several times; reacting to the first failure kills service for
        // a customer whose 3DS timed out. Deactivation is handled by
        // `customer.subscription.updated` once the status flips to unpaid.
        await this.onPaymentFailedLogOnly(event.data.object as StripeInvoice);
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

  private async onCheckoutCompleted(session: StripeSession): Promise<void> {
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

    this.logger.log(
      `Checkout completed — tenant activated: ${tenantId}, plan: ${plan}`,
    );
  }

  private async onSubscriptionUpdated(
    subscription: StripeSubscription,
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

    this.logger.log(
      `Subscription ${subscription.id} updated → isActive: ${String(shouldActivate)} (status=${subscription.status})`,
    );
  }

  private async onSubscriptionDeleted(
    subscription: StripeSubscription,
  ): Promise<void> {
    const tenant = await this.resolveTenantForSubscription(subscription);
    if (!tenant) return;

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive: false },
    });

    this.logger.log(`Subscription deleted — tenant deactivated: ${tenant.id}`);
  }

  /** Payment failure — log-only (deactivation handled by subscription.updated). */
  private async onPaymentFailedLogOnly(invoice: StripeInvoice): Promise<void> {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    this.logger.warn(
      `invoice.payment_failed for customer ${customerId ?? '<unknown>'} — awaiting subscription.updated before deactivating`,
    );
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
}

/** Day key "YYYY-MM-DD" in the server's timezone — good enough for daily idempotency. */
function toDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
