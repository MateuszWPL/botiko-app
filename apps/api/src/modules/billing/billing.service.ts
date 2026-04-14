import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import StripeLib from 'stripe';
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
// ReturnType gives the actual Stripe client instance type
type StripeInstance = ReturnType<typeof StripeLib>;

/** Active subscription statuses — trialing counts as active */
const ACTIVE_STATUSES: string[] = ['active', 'trialing', 'past_due'];

// Minimal local shapes for webhook event payloads
interface StripeSession {
  client_reference_id: string | null;
  customer: string | { id?: string } | null;
  subscription: string | { id?: string } | null;
  url: string | null;
}
interface StripeSubscription {
  id: string;
  status: string;
}
interface StripeInvoice {
  customer: string | { id?: string } | null;
}
interface StripeEvent {
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

    // Auto-deactivate if trial expired and no subscription
    if (
      tenant.isActive &&
      !tenant.stripeSubscriptionId &&
      trialEndsAt &&
      new Date(trialEndsAt) < new Date()
    ) {
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { isActive: false },
      });
      this.logger.log(`Trial expired — auto-deactivated tenant: ${tenantId}`);
      return {
        plan: tenant.plan,
        isActive: false,
        hasSubscription: false,
        stripeCustomerId: tenant.stripeCustomerId,
        trialEndsAt,
      };
    }

    return {
      plan: tenant.plan,
      isActive: tenant.isActive,
      hasSubscription: !!tenant.stripeSubscriptionId,
      stripeCustomerId: tenant.stripeCustomerId,
      trialEndsAt,
    };
  }

  /**
   * Called by external cron (e.g. Vercel Cron, Railway CRON, Upstash).
   * Sends trial reminder emails and deactivates expired trials.
   * Idempotent: emails only sent on exact trial day (day 11 = 3 days left, day 13 = 1 day left, day 14+ = expired).
   */
  async runTrialNotifications(): Promise<{ processed: number; emails: number }> {
    const tenants = await this.prisma.tenant.findMany({
      where: { stripeSubscriptionId: null },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        users: { select: { email: true }, take: 1 },
      },
    });

    const now = new Date();
    let emails = 0;

    for (const tenant of tenants) {
      const trialEnd = new Date(tenant.createdAt);
      trialEnd.setDate(trialEnd.getDate() + 14);

      const msLeft = trialEnd.getTime() - now.getTime();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      const ownerEmail = tenant.users[0]?.email;

      // Auto-deactivate expired trials
      if (daysLeft <= 0 && tenant.isActive) {
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { isActive: false },
        });
        this.logger.log(`Cron: trial expired — deactivated tenant: ${tenant.id}`);
      }

      // Send emails only on specific days (idempotent — cron runs once daily)
      if (ownerEmail && [3, 1, 0].includes(daysLeft)) {
        await this.notification.sendTrialNotificationEmail({
          toEmail: ownerEmail,
          tenantName: tenant.name,
          daysLeft: Math.max(0, daysLeft),
        });
        emails++;
      }
    }

    this.logger.log(`Trial cron: processed ${tenants.length} tenants, sent ${emails} emails`);
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

    const session = await this.stripe!.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
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
        'No active subscription found. Please subscribe first.',
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
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn(`Webhook signature verification failed: ${msg}`);
      throw new BadRequestException(
        `Webhook signature verification failed: ${msg}`,
      );
    }

    this.logger.log(`Stripe webhook received: ${event.type}`);

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
        await this.onPaymentFailed(event.data.object as StripeInvoice);
        break;
      default:
        // Unhandled events are fine — we only care about the above
        break;
    }
  }

  // ─── Private webhook handlers ────────────────────────────────────────────

  private async onCheckoutCompleted(session: StripeSession): Promise<void> {
    const tenantId = session.client_reference_id;
    if (!tenantId) {
      this.logger.warn(
        'checkout.session.completed missing client_reference_id',
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

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        isActive: true,
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
      },
    });

    this.logger.log(`Checkout completed — tenant activated: ${tenantId}`);
  }

  private async onSubscriptionUpdated(
    subscription: StripeSubscription,
  ): Promise<void> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      select: { id: true },
    });
    if (!tenant) return;

    const isActive = ACTIVE_STATUSES.includes(subscription.status);

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive },
    });

    this.logger.log(
      `Subscription ${subscription.id} updated → isActive: ${String(isActive)}`,
    );
  }

  private async onSubscriptionDeleted(
    subscription: StripeSubscription,
  ): Promise<void> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      select: { id: true },
    });
    if (!tenant) return;

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive: false },
    });

    this.logger.log(`Subscription deleted — tenant deactivated: ${tenant.id}`);
  }

  private async onPaymentFailed(invoice: StripeInvoice): Promise<void> {
    const customerId =
      typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
    if (!customerId) return;

    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (!tenant) return;

    await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: { isActive: false },
    });

    this.logger.warn(`Payment failed — tenant deactivated: ${tenant.id}`);
  }

  private requireStripe(): void {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Billing not configured');
    }
  }
}
