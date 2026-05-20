import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService, emailToFirstName } from './email.service';

/**
 * Daily drip email scheduler.
 *
 * Called externally via POST /api/v1/email/cron/drip (CRON_SECRET guarded).
 * Trigger from Railway/Vercel Cron/Upstash at 09:00 Warsaw time daily.
 *
 * Milestone logic (relative to Tenant.createdAt):
 *   D+1  — onboarding reminder (if bot has no knowledge chunks)
 *   D+7  — trial halfway (stats summary)
 *   D+12 — conversion push (2 days left warning)
 *   D+14 — trial expired notice
 *
 * Idempotency: EmailLog table prevents duplicate sends.
 */
@Injectable()
export class EmailSchedulerService {
  private readonly logger = new Logger(EmailSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async runDrip(): Promise<{ processed: number; sent: number }> {
    const tenants = await this.prisma.tenant.findMany({
      where: { stripeSubscriptionId: null },
      select: {
        id: true,
        createdAt: true,
        isActive: true,
        bots: {
          take: 1,
          select: {
            id: true,
            _count: { select: { knowledge: true } },
          },
        },
        users: {
          where: { role: 'OWNER' },
          take: 1,
          select: { id: true, email: true },
        },
      },
    });

    const now = new Date();
    let sent = 0;

    for (const tenant of tenants) {
      const owner = tenant.users[0];
      if (!owner) continue;

      const ageMs = now.getTime() - tenant.createdAt.getTime();
      const ageDays = Math.floor(ageMs / 86_400_000);
      const firstName = emailToFirstName(owner.email);

      try {
        sent += await this.processTenant({
          userId: owner.id,
          email: owner.email,
          firstName,
          tenantId: tenant.id,
          ageDays,
          trialEndsAt: new Date(tenant.createdAt.getTime() + 14 * 86_400_000),
          botId: tenant.bots[0]?.id,
          hasKnowledge: (tenant.bots[0]?._count.knowledge ?? 0) > 0,
          isActive: tenant.isActive,
        });
      } catch (err: unknown) {
        this.logger.error(
          `Drip cron failed for tenant ${tenant.id}: ${String(err)}`,
        );
      }
    }

    this.logger.log(
      `Drip cron: checked ${tenants.length} tenants, queued ${sent} emails`,
    );
    return { processed: tenants.length, sent };
  }

  private async processTenant(opts: {
    userId: string;
    email: string;
    firstName: string;
    tenantId: string;
    ageDays: number;
    trialEndsAt: Date;
    botId?: string;
    hasKnowledge: boolean;
    isActive: boolean;
  }): Promise<number> {
    let sent = 0;
    const {
      userId,
      email,
      firstName,
      ageDays,
      trialEndsAt,
      botId,
      hasKnowledge,
    } = opts;

    if (ageDays === 1 && !hasKnowledge) {
      await this.email.sendDripD1({ userId, email, firstName });
      sent++;
    }

    if (ageDays === 7) {
      const stats = botId
        ? await this.getBotStats(botId, opts.tenantId)
        : defaultStats();
      await this.email.sendDripD7({
        userId,
        email,
        firstName,
        ...stats,
      });
      sent++;
    }

    if (ageDays === 12) {
      const stats = botId
        ? await this.getBotStats(botId, opts.tenantId)
        : defaultStats();
      await this.email.sendDripD12({
        userId,
        email,
        firstName,
        leadsCount: stats.leadsCount,
        conversationsCount: stats.conversationsCount,
        trialEndsAt: trialEndsAt.toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
      sent++;
    }

    if (ageDays >= 14) {
      await this.email.sendDripD14({ userId, email, firstName });
      sent++;
    }

    return sent;
  }

  private async getBotStats(
    botId: string,
    tenantId: string,
  ): Promise<{
    leadsCount: number;
    conversationsCount: number;
    topQuestion: string;
  }> {
    const [leadsCount, conversationsCount, topMessage] = await Promise.all([
      this.prisma.lead.count({ where: { tenantId } }),
      this.prisma.conversation.count({ where: { botId } }),
      this.prisma.message.findFirst({
        where: { conversation: { botId }, role: 'USER' },
        orderBy: { createdAt: 'desc' },
        select: { content: true },
      }),
    ]);

    return {
      leadsCount,
      conversationsCount,
      topQuestion:
        topMessage?.content.slice(0, 120) ?? 'Jakie są godziny otwarcia?',
    };
  }
}

function defaultStats() {
  return {
    leadsCount: 0,
    conversationsCount: 0,
    topQuestion: 'Jakie są godziny otwarcia?',
  };
}
