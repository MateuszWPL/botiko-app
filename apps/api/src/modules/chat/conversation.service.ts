import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';

export type ConversationStatus = 'Aktywna' | 'Lead' | 'Zakończona';

export interface ConversationSummary {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  firstMessage: string | null;
  lastMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  durationSeconds: number;
  status: ConversationStatus;
  leadName: string | null;
}

export interface ConversationDetail {
  id: string;
  botId: string;
  sessionId: string;
  createdAt: Date;
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }[];
}

interface FindAllOptions {
  search?: string;
  statusFilter?: ConversationStatus;
  daysBack?: number;
  limit?: number;
}

export interface KnowledgeHealth {
  /** Total ASSISTANT messages in the last 30 days. */
  totalAnswers: number;
  /** ASSISTANT messages served from the RAG fallback path (bot didn't know). */
  fallbackAnswers: number;
  /** fallbackAnswers / totalAnswers as a 0-100 percentage. */
  fallbackRate: number;
  /** Total knowledge chunks across all of the tenant's bots. */
  chunkCount: number;
}

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  private getStatus(
    messageCount: number,
    leadExists: boolean,
    createdAt: Date,
  ): ConversationStatus {
    if (leadExists) return 'Lead';
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceCreated > 30) return 'Zakończona';
    return 'Aktywna';
  }

  async findAll(
    tenantId: string,
    options: FindAllOptions = {},
  ): Promise<ConversationSummary[]> {
    const { search = '', statusFilter, daysBack = 90, limit = 100 } = options;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - daysBack);

    const [conversations, leads] = await Promise.all([
      this.prisma.conversation.findMany({
        where: {
          bot: { tenantId },
          createdAt: { gte: dateFrom },
        },
        select: {
          id: true,
          botId: true,
          sessionId: true,
          createdAt: true,
          _count: { select: { messages: true } },
          messages: {
            select: { content: true, role: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.lead.findMany({
        where: { tenantId, sessionId: { not: null } },
        select: { sessionId: true, name: true },
      }),
    ]);

    // sessionId → decrypted lead name map (leads fetched raw, names encrypted)
    // We store encrypted names so we pass them through — decryption happens in LeadService
    // Here we just identify which sessions have a lead by sessionId
    const leadBySession = new Map<string, string>(
      leads
        .filter((l) => l.sessionId !== null)
        .map((l) => [l.sessionId as string, l.name]),
    );

    return conversations
      .map((c) => {
        const userMessages = c.messages.filter((m) => m.role === 'USER');
        const firstMsg = userMessages[0]?.content ?? null;
        const lastMsg = c.messages[c.messages.length - 1]?.content ?? null;

        const encryptedLeadName = leadBySession.get(c.sessionId) ?? null;
        const leadExists = encryptedLeadName !== null;
        let leadName: string | null = null;
        if (encryptedLeadName) {
          try {
            leadName = this.encryption.decrypt(encryptedLeadName);
          } catch {
            leadName = null;
          }
        }

        const status = this.getStatus(
          c._count.messages,
          leadExists,
          c.createdAt,
        );
        const durationSeconds =
          userMessages.length > 0
            ? Math.floor(
                (new Date(
                  c.messages[c.messages.length - 1]?.createdAt || c.createdAt,
                ).getTime() -
                  new Date(userMessages[0].createdAt).getTime()) /
                  1000,
              )
            : 0;

        return {
          id: c.id,
          botId: c.botId,
          sessionId: c.sessionId,
          messageCount: c._count.messages,
          firstMessage: firstMsg,
          lastMessage: lastMsg,
          createdAt: c.createdAt,
          updatedAt:
            c.messages[c.messages.length - 1]?.createdAt || c.createdAt,
          durationSeconds,
          status,
          leadName,
        };
      })
      .filter((c) => {
        if (statusFilter && c.status !== statusFilter) return false;
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            c.firstMessage?.toLowerCase().includes(searchLower) ||
            c.sessionId.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });
  }

  /**
   * Knowledge base health for the dashboard indicator. A high fallback rate
   * means the bot keeps hitting "I don't know" — the client's knowledge base
   * needs more content.
   */
  async getKnowledgeHealth(tenantId: string): Promise<KnowledgeHealth> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    const [totalAnswers, fallbackAnswers, chunkCount] = await Promise.all([
      this.prisma.message.count({
        where: {
          role: 'ASSISTANT',
          createdAt: { gte: dateFrom },
          conversation: { bot: { tenantId } },
        },
      }),
      this.prisma.message.count({
        where: {
          role: 'ASSISTANT',
          wasFallback: true,
          createdAt: { gte: dateFrom },
          conversation: { bot: { tenantId } },
        },
      }),
      this.prisma.knowledgeChunk.count({
        where: { bot: { tenantId } },
      }),
    ]);

    const fallbackRate =
      totalAnswers > 0
        ? Math.round((fallbackAnswers / totalAnswers) * 100)
        : 0;

    return { totalAnswers, fallbackAnswers, fallbackRate, chunkCount };
  }

  async findBySession(
    tenantId: string,
    sessionId: string,
  ): Promise<ConversationDetail | null> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { sessionId, bot: { tenantId } },
      select: {
        id: true,
        botId: true,
        sessionId: true,
        createdAt: true,
        messages: {
          select: { id: true, role: true, content: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return conversation;
  }

  async findById(
    tenantId: string,
    conversationId: string,
  ): Promise<ConversationDetail> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, bot: { tenantId } },
      select: {
        id: true,
        botId: true,
        sessionId: true,
        createdAt: true,
        messages: {
          select: { id: true, role: true, content: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }
}
