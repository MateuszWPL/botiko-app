import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ConversationSummary {
  id: string;
  botId: string;
  sessionId: string;
  messageCount: number;
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
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return conversations.map((c) => ({
      id: c.id,
      botId: c.botId,
      sessionId: c.sessionId,
      messageCount: c._count.messages,
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
