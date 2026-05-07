// Factory mocks prevent module body from running (avoids env.ts process.exit)
jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));
jest.mock('../knowledge/embedding.service', () => ({
  EmbeddingService: jest.fn(),
}));
jest.mock('../../brand-templates', () => ({
  getBrandTemplate: jest
    .fn()
    .mockReturnValue({ systemPrompt: 'You are a helpful assistant.' }),
}));

import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from '../knowledge/embedding.service';
import { AI_SERVICE } from '../ai/ai.service.interface';

const mockBot = {
  id: 'bot-1',
  name: 'Testowy Bot',
  isActive: true,
  tenant: {
    id: 'tenant-1',
    industry: 'BEAUTY',
    plan: 'STARTER',
    isActive: true,
    createdAt: new Date(),
    stripeSubscriptionId: 'sub_test_active',
  },
};

const mockConversation = {
  id: 'conv-1',
  botId: 'bot-1',
  sessionId: 'session-1',
  messages: [],
};

function buildPrismaMock(overrides: Record<string, unknown> = {}) {
  return {
    bot: {
      findFirst: jest.fn().mockResolvedValue(mockBot),
    },
    conversation: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(mockConversation),
      count: jest.fn().mockResolvedValue(0),
    },
    message: {
      create: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    $transaction: jest.fn().mockResolvedValue([]),
    $executeRaw: jest.fn().mockResolvedValue(1),
    ...overrides,
  };
}

const mockEmbeddingService = {
  findRelevantChunks: jest.fn().mockResolvedValue([]),
};

const mockAiService = {
  chat: jest.fn().mockResolvedValue({ content: 'AI answer', tokenUsage: 50 }),
};

async function buildService(prismaMock = buildPrismaMock()) {
  const module = await Test.createTestingModule({
    providers: [
      ChatService,
      { provide: PrismaService, useValue: prismaMock },
      { provide: EmbeddingService, useValue: mockEmbeddingService },
      { provide: AI_SERVICE, useValue: mockAiService },
    ],
  }).compile();

  return {
    service: module.get(ChatService),
    prisma: prismaMock,
  };
}

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
    mockAiService.chat.mockResolvedValue({
      content: 'AI answer',
      tokenUsage: 50,
    });
  });

  describe('sendMessage — fallback', () => {
    it('returns fallback response when no relevant chunks found', async () => {
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService();

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'Pytanie bez odpowiedzi',
      });

      expect(result.message).toContain('Nie mam dokładnej odpowiedzi');
      expect(result.showLeadForm).toBe(true);
      expect(mockAiService.chat).not.toHaveBeenCalled();
    });

    it('returns fallback when all chunks have similarity below threshold', async () => {
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([
        { content: 'some content', similarity: 0.1 },
        { content: 'other content', similarity: 0.2 },
      ]);
      const { service } = await buildService();

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'Pytanie bez odpowiedzi',
      });

      expect(result.showLeadForm).toBe(true);
      expect(mockAiService.chat).not.toHaveBeenCalled();
    });

    it('saves user message and fallback response to DB', async () => {
      const prisma = buildPrismaMock();
      const { service } = await buildService(prisma);

      await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'Pytanie bez odpowiedzi',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('sendMessage — escalation', () => {
    const escalationCases = [
      'chcę rozmawiać z człowiekiem',
      'połącz mnie z konsultantem',
      'nie chcę bota',
      'oddzwoń do mnie',
      'zadzwoń do mnie',
      'speak to human',
    ];

    it.each(escalationCases)(
      'returns escalation response for: "%s"',
      async (message) => {
        const { service } = await buildService();

        const result = await service.sendMessage({
          botId: 'bot-1',
          sessionId: 'session-1',
          message,
        });

        expect(result.message).toContain('porozmawiać z naszym zespołem');
        expect(result.showLeadForm).toBe(true);
        expect(mockAiService.chat).not.toHaveBeenCalled();
        expect(mockEmbeddingService.findRelevantChunks).not.toHaveBeenCalled();
      },
    );

    it('saves escalation exchange to DB', async () => {
      const prisma = buildPrismaMock();
      const { service } = await buildService(prisma);

      await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'chcę z człowiekiem',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('sendMessage — normal flow', () => {
    beforeEach(() => {
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([
        { content: 'Strzyżenie kosztuje 80 zł', similarity: 0.85 },
      ]);
    });

    it('calls AI when relevant context exists', async () => {
      const { service } = await buildService();

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'Ile kosztuje strzyżenie?',
      });

      expect(mockAiService.chat).toHaveBeenCalled();
      expect(result.message).toBe('AI answer');
      expect(result.showLeadForm).toBeUndefined();
    });

    it('returns NotFoundException when bot not found', async () => {
      const prisma = buildPrismaMock({
        bot: { findFirst: jest.fn().mockResolvedValue(null) },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({
          botId: 'missing',
          sessionId: 's1',
          message: 'hi',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when monthly limit reached', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(1000), // at STARTER limit (1000/month)
        },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({ botId: 'bot-1', sessionId: 's1', message: 'hi' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── tenant.isActive gate ─────────────────────────────────────────────────────
  describe('sendMessage — tenant isActive gate', () => {
    it('throws ForbiddenException with generic message when tenant.isActive is false', async () => {
      const inactiveBot = {
        ...mockBot,
        tenant: { ...mockBot.tenant, isActive: false },
      };
      const prisma = buildPrismaMock({
        bot: { findFirst: jest.fn().mockResolvedValue(inactiveBot) },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({
          botId: 'bot-1',
          sessionId: 's1',
          message: 'Ile kosztuje strzyżenie?',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('does NOT leak plan/billing details in the error message', async () => {
      const inactiveBot = {
        ...mockBot,
        tenant: { ...mockBot.tenant, isActive: false },
      };
      const prisma = buildPrismaMock({
        bot: { findFirst: jest.fn().mockResolvedValue(inactiveBot) },
      });
      const { service } = await buildService(prisma);

      let caught: Error | null = null;
      try {
        await service.sendMessage({
          botId: 'bot-1',
          sessionId: 's1',
          message: 'Ile kosztuje strzyżenie?',
        });
      } catch (e) {
        caught = e as Error;
      }

      expect(caught).not.toBeNull();
      expect(caught!.message).not.toMatch(/plan|billing|STARTER|stripe/i);
      expect(caught!.message).toMatch(/unavailable/i);
    });
  });

  // ── checkPlanLimit ───────────────────────────────────────────────────────────
  describe('sendMessage — checkPlanLimit (STARTER 1000/month)', () => {
    it('passes when count is below limit (999)', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(999),
        },
      });
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService(prisma);

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 's1',
        message: 'Ile kosztuje strzyżenie?',
      });

      expect(result.message).toBeDefined();
      expect(result.message).toContain('Nie mam dokładnej odpowiedzi');
    });

    it('throws ForbiddenException exactly at limit (1000)', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(1000),
        },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({
          botId: 'bot-1',
          sessionId: 's1',
          message: 'Ile kosztuje strzyżenie?',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('has no limit for plans not in PLAN_CONVERSATION_LIMITS (e.g. ENTERPRISE)', async () => {
      const enterpriseBot = {
        ...mockBot,
        tenant: { ...mockBot.tenant, plan: 'ENTERPRISE' },
      };
      const prisma = buildPrismaMock({
        bot: { findFirst: jest.fn().mockResolvedValue(enterpriseBot) },
        conversation: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(99999),
        },
      });
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService(prisma);

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 's1',
        message: 'Ile kosztuje strzyżenie?',
      });
      expect(result.message).toBeDefined();
    });
  });

  // ── checkBotMessageCap ───────────────────────────────────────────────────────
  describe('sendMessage — checkBotMessageCap (10 000 msg/month)', () => {
    it('throws ForbiddenException when bot monthly message count hits 10 000', async () => {
      const prisma = buildPrismaMock({
        message: {
          create: jest.fn().mockResolvedValue({}),
          // First call is checkBotMessageCap — return 10 000 (cap exceeded)
          count: jest.fn().mockResolvedValue(10_000),
        },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({
          botId: 'bot-1',
          sessionId: 's1',
          message: 'Ile kosztuje strzyżenie?',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('passes when bot monthly message count is below 10 000 (9 999)', async () => {
      const prisma = buildPrismaMock({
        message: {
          create: jest.fn().mockResolvedValue({}),
          count: jest.fn().mockResolvedValue(9_999),
        },
      });
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService(prisma);

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 's1',
        message: 'Ile kosztuje strzyżenie?',
      });
      expect(result.message).toBeDefined();
    });
  });

  // ── checkConversationMessageCap ──────────────────────────────────────────────
  describe('sendMessage — checkConversationMessageCap (50 msg/sesję)', () => {
    it('throws ForbiddenException when user hits 50 messages in one session', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          // findFirst: existing conversation (so cap check can count its messages)
          findFirst: jest.fn().mockResolvedValue(mockConversation),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(0), // plan limit OK
        },
        message: {
          create: jest.fn().mockResolvedValue({}),
          count: jest
            .fn()
            .mockResolvedValueOnce(0) // checkBotMessageCap — ok
            .mockResolvedValueOnce(50), // checkConversationMessageCap — at limit
        },
      });
      const { service } = await buildService(prisma);

      await expect(
        service.sendMessage({
          botId: 'bot-1',
          sessionId: 'session-1',
          message: 'Ile kosztuje strzyżenie?',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('passes when session has 49 messages (one below cap)', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          findFirst: jest.fn().mockResolvedValue(mockConversation),
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(0),
        },
        message: {
          create: jest.fn().mockResolvedValue({}),
          count: jest
            .fn()
            .mockResolvedValueOnce(0) // checkBotMessageCap — ok
            .mockResolvedValueOnce(49), // checkConversationMessageCap — just under
        },
      });
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService(prisma);

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'session-1',
        message: 'Ile kosztuje strzyżenie?',
      });
      expect(result.message).toBeDefined();
    });

    it('does not throw when conversation does not exist yet (new session)', async () => {
      const prisma = buildPrismaMock({
        conversation: {
          findFirst: jest.fn().mockResolvedValue(null), // new session
          create: jest.fn().mockResolvedValue(mockConversation),
          count: jest.fn().mockResolvedValue(0),
        },
        message: {
          create: jest.fn().mockResolvedValue({}),
          count: jest.fn().mockResolvedValue(0),
        },
      });
      mockEmbeddingService.findRelevantChunks.mockResolvedValue([]);
      const { service } = await buildService(prisma);

      const result = await service.sendMessage({
        botId: 'bot-1',
        sessionId: 'new-session-xyz',
        message: 'Ile kosztuje strzyżenie?',
      });
      expect(result.message).toBeDefined();
    });
  });
});
