import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Industry } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '../../config/env';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);
  private readonly supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the current tenant's profile, used by the dashboard to prefill
   * setup wizard fields (e.g. allowedDomains from websiteUrl).
   */
  async getMe(tenantId: string): Promise<{
    id: string;
    name: string;
    websiteUrl: string | null;
    industry: string;
  }> {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
      select: { id: true, name: true, websiteUrl: true, industry: true },
    });
    return tenant;
  }

  /**
   * Updates editable tenant profile fields. Changing `industry` swaps the
   * brand prompt template + default suggested questions going forward;
   * already-seeded knowledge chunks are user content and stay untouched.
   */
  async updateProfile(
    tenantId: string,
    patch: { websiteUrl?: string; industry?: Industry },
  ): Promise<void> {
    const data: { websiteUrl?: string; industry?: Industry } = {};

    if (patch.websiteUrl !== undefined) {
      let normalized = patch.websiteUrl.trim();
      if (!normalized.startsWith('http')) normalized = 'https://' + normalized;
      data.websiteUrl = normalized;
    }
    if (patch.industry !== undefined) {
      data.industry = patch.industry;
    }
    if (Object.keys(data).length === 0) return;

    await this.prisma.tenant.update({ where: { id: tenantId }, data });
  }

  /**
   * Permanently deletes all tenant data (RODO: right to erasure).
   * Order matters: FK constraints require child records deleted first.
   */
  async deleteAccount(tenantId: string, userId: string): Promise<void> {
    // Collect all bot IDs for this tenant (needed to delete conversations)
    const bots = await this.prisma.bot.findMany({
      where: { tenantId },
      select: { id: true },
    });
    const botIds = bots.map((b) => b.id);

    await this.prisma.$transaction(async (tx) => {
      // 1. Messages (child of Conversation)
      if (botIds.length > 0) {
        const conversations = await tx.conversation.findMany({
          where: { botId: { in: botIds } },
          select: { id: true },
        });
        const conversationIds = conversations.map((c) => c.id);

        if (conversationIds.length > 0) {
          await tx.message.deleteMany({
            where: { conversationId: { in: conversationIds } },
          });
        }

        // 2. Conversations
        await tx.conversation.deleteMany({ where: { botId: { in: botIds } } });

        // 3. KnowledgeChunks
        await tx.knowledgeChunk.deleteMany({
          where: { botId: { in: botIds } },
        });
      }

      // 4. Leads
      await tx.lead.deleteMany({ where: { tenantId } });

      // 5. Bots
      await tx.bot.deleteMany({ where: { tenantId } });

      // 6. Users (Prisma record)
      await tx.user.deleteMany({ where: { tenantId } });

      // 7. Tenant
      await tx.tenant.delete({ where: { id: tenantId } });
    });

    this.logger.log(`Tenant deleted: ${tenantId}`);

    // Delete Supabase Auth user: non-blocking, failure logged but not thrown
    // (Prisma data is already gone, Auth cleanup is best-effort)
    this.supabase.auth.admin
      .deleteUser(userId)
      .then(({ error }) => {
        if (error) {
          this.logger.error(
            `Supabase auth user delete failed for ${userId}`,
            error,
          );
        }
      })
      .catch((err: unknown) => {
        this.logger.error(`Unexpected error deleting auth user ${userId}`, err);
      });
  }
}
