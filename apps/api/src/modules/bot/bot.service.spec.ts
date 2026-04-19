jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('../knowledge/knowledge.service', () => ({
  KnowledgeService: jest.fn(),
}));
jest.mock('../../brand-templates', () => ({
  getBrandTemplate: jest.fn().mockReturnValue({
    systemPrompt: 'You are a helpful assistant.',
    suggestedResponses: ['Jakie są godziny otwarcia?', 'Ile kosztuje zabieg?'],
    faqTemplates: [],
  }),
}));

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BotService } from './bot.service';
import { PrismaService } from '../../prisma/prisma.service';
import { KnowledgeService } from '../knowledge/knowledge.service';

const mockBotRow = {
  id: 'bot-1',
  name: 'TestBot',
  welcomeMsg: 'Cześć!',
  primaryColor: '#FF0000',
  allowedDomains: [],
  isActive: true,
  offlineMessage: null,
  businessHoursStart: null,
  businessHoursEnd: null,
  businessDays: [],
  businessSchedule: null,
  personality: null,
  companyName: null,
  companyPhone: null,
  companyAddress: null,
  suggestedQuestions: [],
  leadFormAfterMessages: 2,
  avatarEmoji: '🤖',
  tenant: { industry: 'BEAUTY' },
};

function buildPrismaMock(botFindResult: object | null = mockBotRow) {
  return {
    bot: {
      findFirst: jest.fn().mockResolvedValue(botFindResult),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({ ...mockBotRow, id: 'new-bot' }),
    },
    tenant: {
      findUnique: jest.fn().mockResolvedValue({ industry: 'BEAUTY' }),
    },
  };
}

async function buildService(prisma = buildPrismaMock()) {
  const module = await Test.createTestingModule({
    providers: [
      BotService,
      { provide: PrismaService, useValue: prisma },
      { provide: KnowledgeService, useValue: { addChunk: jest.fn() } },
    ],
  }).compile();

  return { service: module.get(BotService), prisma };
}

describe('BotService.getPublicConfig — isActive gate', () => {
  it('rzuca NotFoundException gdy bot nie istnieje lub tenant.isActive = false', async () => {
    // findFirst returns null when WHERE filters out inactive tenant/bot
    const { service } = await buildService(buildPrismaMock(null));

    await expect(service.getPublicConfig('bot-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('zwraca config gdy bot i tenant są aktywni', async () => {
    const { service } = await buildService();

    const config = await service.getPublicConfig('bot-1');

    expect(config.id).toBe('bot-1');
    expect(config.name).toBe('TestBot');
  });
});

describe('BotService.getPublicConfig — suggestedQuestions', () => {
  it('zwraca suggestedQuestions z brand template gdy bot ma pustą listę', async () => {
    // suggestedQuestions: [] — powinien użyć template
    const { service } = await buildService();

    const config = await service.getPublicConfig('bot-1');

    expect(config.suggestedQuestions).toEqual([
      'Jakie są godziny otwarcia?',
      'Ile kosztuje zabieg?',
    ]);
  });

  it('zwraca własne suggestedQuestions gdy bot ma ustawioną listę', async () => {
    const customBot = {
      ...mockBotRow,
      suggestedQuestions: ['Kiedy jesteście otwarci?', 'Czy macie parking?'],
    };
    const prisma = buildPrismaMock(customBot);
    const { service } = await buildService(prisma);

    const config = await service.getPublicConfig('bot-1');

    expect(config.suggestedQuestions).toEqual([
      'Kiedy jesteście otwarci?',
      'Czy macie parking?',
    ]);
  });

  it('nie wywołuje getBrandTemplate dla suggestedQuestions gdy bot ma własną listę', async () => {
    const brandTemplatesMock = jest.requireMock(
      '../../brand-templates',
    ) as unknown as {
      getBrandTemplate: { mockClear: () => void };
    };
    brandTemplatesMock.getBrandTemplate.mockClear();

    const customBot = {
      ...mockBotRow,
      suggestedQuestions: ['Moje pytanie'],
    };
    const { service } = await buildService(buildPrismaMock(customBot));
    const config = await service.getPublicConfig('bot-1');

    // getBrandTemplate is still called (for systemPrompt etc), but suggestedQuestions
    // should come from bot, not template
    expect(config.suggestedQuestions).toEqual(['Moje pytanie']);
  });
});
