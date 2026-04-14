import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ConversationSummary {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
  firstMessage: string | null;
  createdAt: Date;
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

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<ConversationSummary[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: { bot: { tenantId } },
      select: {
        id: true,
        botId: true,
        sessionId: true,
        createdAt: true,
        _count: { select: { messages: true } },
        messages: {
          where: { role: 'USER' },
          select: { content: true },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return conversations.map((c) => ({
      id: c.id,
      botId: c.botId,
      sessionId: c.sessionId,
      messageCount: c._count.messages,
      firstMessage: c.messages[0]?.content ?? null,
      createdAt: c.createdAt,
    }));
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
