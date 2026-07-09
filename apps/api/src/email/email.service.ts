import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import { env } from '../config/env';
import {
  welcomeEmail,
  onboardingReminderD1Email,
  trialHalfwayD7Email,
  trialConversionD12Email,
  trialExpiredD14Email,
} from './templates/onboarding';
import {
  paymentConfirmedEmail,
  recurringInvoiceEmail,
  paymentFailedEmail,
  subscriptionCancelledEmail,
} from './templates/billing';

export type EmailCategory = 'onboarding' | 'trial';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly prisma: PrismaService) {
    this.resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
    if (!this.resend) {
      this.logger.warn('RESEND_API_KEY not set: EmailService disabled');
    }
  }

  // ─── Onboarding / drip (idempotent via EmailLog) ───────────────────────────

  async sendWelcome(opts: {
    userId: string;
    email: string;
    firstName: string;
  }): Promise<void> {
    if (await this.alreadySent(opts.userId, 'welcome')) return;
    const tpl = welcomeEmail({
      firstName: opts.firstName,
      unsubscribeUrl: this.unsubUrl(
        this.generateUnsubToken(opts.userId, 'onboarding'),
      ),
    });
    await this.send(opts.email, tpl.subject, tpl.html);
    await this.logSent(opts.userId, 'welcome');
  }

  async sendDripD1(opts: {
    userId: string;
    email: string;
    firstName: string;
  }): Promise<void> {
    if (await this.isOptedOut(opts.userId, 'onboarding')) return;
    if (await this.alreadySent(opts.userId, 'd1_reminder')) return;
    const tpl = onboardingReminderD1Email({
      firstName: opts.firstName,
      unsubscribeUrl: this.unsubUrl(
        this.generateUnsubToken(opts.userId, 'onboarding'),
      ),
    });
    await this.send(opts.email, tpl.subject, tpl.html);
    await this.logSent(opts.userId, 'd1_reminder');
  }

  async sendDripD7(opts: {
    userId: string;
    email: string;
    firstName: string;
    leadsCount: number;
    conversationsCount: number;
    topQuestion: string;
    trialDaysLeft: number;
  }): Promise<void> {
    if (await this.isOptedOut(opts.userId, 'trial')) return;
    if (await this.alreadySent(opts.userId, 'd7_halfway')) return;
    const tpl = trialHalfwayD7Email({
      firstName: opts.firstName,
      leadsCount: opts.leadsCount,
      conversationsCount: opts.conversationsCount,
      topQuestion: opts.topQuestion,
      trialDaysLeft: opts.trialDaysLeft,
      unsubscribeUrl: this.unsubUrl(
        this.generateUnsubToken(opts.userId, 'trial'),
      ),
    });
    await this.send(opts.email, tpl.subject, tpl.html);
    await this.logSent(opts.userId, 'd7_halfway');
  }

  async sendDripD12(opts: {
    userId: string;
    email: string;
    firstName: string;
    leadsCount: number;
    conversationsCount: number;
    trialEndsAt: string;
  }): Promise<void> {
    if (await this.isOptedOut(opts.userId, 'trial')) return;
    if (await this.alreadySent(opts.userId, 'd12_conversion')) return;
    const tpl = trialConversionD12Email({
      firstName: opts.firstName,
      leadsCount: opts.leadsCount,
      conversationsCount: opts.conversationsCount,
      trialEndsAt: opts.trialEndsAt,
      unsubscribeUrl: this.unsubUrl(
        this.generateUnsubToken(opts.userId, 'trial'),
      ),
    });
    await this.send(opts.email, tpl.subject, tpl.html);
    await this.logSent(opts.userId, 'd12_conversion');
  }

  async sendDripD14(opts: {
    userId: string;
    email: string;
    firstName: string;
  }): Promise<void> {
    if (await this.alreadySent(opts.userId, 'd14_expired')) return;
    const tpl = trialExpiredD14Email({
      firstName: opts.firstName,
      unsubscribeUrl: this.unsubUrl(
        this.generateUnsubToken(opts.userId, 'trial'),
      ),
    });
    await this.send(opts.email, tpl.subject, tpl.html);
    await this.logSent(opts.userId, 'd14_expired');
  }

  // ─── Billing transactional (Stripe idempotency guard is upstream) ──────────

  async sendPaymentConfirmed(opts: {
    email: string;
    firstName: string;
    amount: string;
    paymentMethod: string;
    last4: string;
    nextPaymentDate: string;
  }): Promise<void> {
    const tpl = paymentConfirmedEmail(opts);
    await this.send(opts.email, tpl.subject, tpl.html);
  }

  async sendRecurringInvoice(opts: {
    email: string;
    month: string;
    year: string;
    amount: string;
    paymentMethod: string;
    last4: string;
    periodStart: string;
    periodEnd: string;
    invoiceUrl: string;
  }): Promise<void> {
    const tpl = recurringInvoiceEmail(opts);
    await this.send(opts.email, tpl.subject, tpl.html);
  }

  async sendPaymentFailed(opts: {
    email: string;
    firstName: string;
    paymentMethod: string;
    last4: string;
    retryDate: string;
  }): Promise<void> {
    const tpl = paymentFailedEmail(opts);
    await this.send(opts.email, tpl.subject, tpl.html);
  }

  async sendSubscriptionCancelled(opts: {
    email: string;
    firstName: string;
    endDate: string;
  }): Promise<void> {
    const tpl = subscriptionCancelledEmail(opts);
    await this.send(opts.email, tpl.subject, tpl.html);
  }

  // ─── Unsubscribe tokens ────────────────────────────────────────────────────

  generateUnsubToken(userId: string, category: EmailCategory): string {
    const payload = Buffer.from(
      JSON.stringify({ u: userId, c: category }),
    ).toString('base64url');
    const sig = createHmac('sha256', env.JWT_SECRET)
      .update(payload)
      .digest('base64url');
    return `${payload}.${sig}`;
  }

  verifyUnsubToken(
    token: string,
  ): { userId: string; category: EmailCategory } | null {
    const dot = token.lastIndexOf('.');
    if (dot < 0) return null;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = createHmac('sha256', env.JWT_SECRET)
      .update(payload)
      .digest('base64url');
    const sigBuf = Buffer.from(sig, 'base64url');
    const expectedBuf = Buffer.from(expected, 'base64url');
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }
    try {
      const { u, c } = JSON.parse(
        Buffer.from(payload, 'base64url').toString(),
      ) as {
        u: string;
        c: EmailCategory;
      };
      if (!u || !c) return null;
      return { userId: u, category: c };
    } catch {
      return null;
    }
  }

  async unsubscribe(userId: string, category: EmailCategory): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailOptOut: true },
    });
    if (!user) return;
    if (user.emailOptOut.includes(category)) return;
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailOptOut: { push: category } },
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private unsubUrl(token: string): string {
    return `${env.API_URL}/api/v1/email/unsubscribe?token=${encodeURIComponent(token)}`;
  }

  private async alreadySent(
    userId: string,
    templateId: string,
  ): Promise<boolean> {
    const log = await this.prisma.emailLog.findUnique({
      where: { userId_templateId: { userId, templateId } },
      select: { id: true },
    });
    return !!log;
  }

  private async isOptedOut(
    userId: string,
    category: EmailCategory,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailOptOut: true },
    });
    return user?.emailOptOut.includes(category) ?? false;
  }

  private async logSent(userId: string, templateId: string): Promise<void> {
    try {
      await this.prisma.emailLog.create({ data: { userId, templateId } });
    } catch {
      // Unique constraint violation = race condition, safe to ignore
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) return;
    try {
      await this.resend.emails.send({
        from: `Botiko.pl <${env.RESEND_FROM_EMAIL}>`,
        to,
        subject,
        html,
      });
    } catch (err: unknown) {
      this.logger.error(`Failed to send email to ${to}: ${String(err)}`);
    }
  }
}

/** Extract a displayable first name from an email address prefix. */
export function emailToFirstName(email: string): string {
  const prefix = email.split('@')[0];
  const part = prefix.split(/[._+-]/)[0];
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}
