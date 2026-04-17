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
});
