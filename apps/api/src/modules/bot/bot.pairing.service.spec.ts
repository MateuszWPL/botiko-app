jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('../../brand-templates', () => ({
  getBrandTemplate: jest.fn().mockReturnValue({
    systemPrompt: 'x',
    suggestedResponses: [],
  }),
}));

import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { BotService } from './bot.service';
import { PrismaService } from '../../prisma/prisma.service';

type AnyMock = Record<string, jest.Mock>;

function buildPrisma() {
  const prisma: {
    bot: AnyMock;
    botPairingToken: AnyMock;
    $transaction: jest.Mock;
  } = {
    bot: {
      findFirst: jest.fn().mockResolvedValue({ id: 'bot-1' }),
      findUnique: jest.fn().mockResolvedValue({
        id: 'bot-1',
        name: 'TestBot',
        allowedDomains: [],
      }),
      update: jest.fn().mockResolvedValue({}),
    },
    botPairingToken: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findUnique: jest.fn().mockResolvedValue({ botId: 'bot-1' }),
    },
    // Supports both forms: array (createPairingToken) and interactive callback
    // (redeemPairing, which runs against the same mock as `tx`).
    $transaction: jest.fn((arg: unknown) =>
      Array.isArray(arg)
        ? Promise.all(arg as unknown[])
        : (arg as (tx: unknown) => unknown)(prisma),
    ),
  };
  return prisma;
}

async function buildService(prisma: ReturnType<typeof buildPrisma>) {
  const moduleRef = await Test.createTestingModule({
    providers: [BotService, { provide: PrismaService, useValue: prisma }],
  }).compile();
  return moduleRef.get(BotService);
}

describe('BotService.createPairingToken', () => {
  it('rzuca ForbiddenException gdy bot nie należy do tenanta', async () => {
    const prisma = buildPrisma();
    prisma.bot.findFirst.mockResolvedValue(null);
    const service = await buildService(prisma);

    await expect(
      service.createPairingToken('tenant-1', 'bot-1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('zwraca prefiksowany token, zapisuje TYLKO hash i czyści stare tokeny', async () => {
    const prisma = buildPrisma();
    const service = await buildService(prisma);

    const { token, expiresAt } = await service.createPairingToken(
      'tenant-1',
      'bot-1',
    );

    expect(token).toMatch(/^botiko_pair_[a-f0-9]{48}$/);
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(prisma.botPairingToken.deleteMany).toHaveBeenCalledWith({
      where: { botId: 'bot-1' },
    });

    const createCalls = prisma.botPairingToken.create.mock.calls as Array<
      [{ data: { tokenHash: string } }]
    >;
    const created = createCalls[0][0];
    // Raw token must never be persisted — only its SHA-256.
    expect(created.data.tokenHash).toBe(
      createHash('sha256').update(token).digest('hex'),
    );
    expect(created.data.tokenHash).not.toContain('botiko_pair_');
  });
});

describe('BotService.redeemPairing', () => {
  it('autoryzuje domenę i zwraca botId/botName przy poprawnym tokenie', async () => {
    const prisma = buildPrisma();
    const service = await buildService(prisma);

    const result = await service.redeemPairing(
      'botiko_pair_abc',
      'https://example.pl',
    );

    expect(result).toEqual({ botId: 'bot-1', botName: 'TestBot' });
    const updateCalls = prisma.bot.update.mock.calls as Array<
      [{ data: { allowedDomains: string[] } }]
    >;
    const updateArg = updateCalls[0][0];
    expect(updateArg.data.allowedDomains).toEqual([
      'https://example.pl',
      'https://www.example.pl',
    ]);
  });

  it('odrzuca nieznany token', async () => {
    const prisma = buildPrisma();
    prisma.botPairingToken.updateMany.mockResolvedValue({ count: 0 });
    prisma.botPairingToken.findUnique.mockResolvedValue(null);
    const service = await buildService(prisma);

    await expect(
      service.redeemPairing('botiko_pair_x', 'https://example.pl'),
    ).rejects.toThrow(/Nieprawidłowy kod/);
  });

  it('odrzuca token już użyty', async () => {
    const prisma = buildPrisma();
    prisma.botPairingToken.updateMany.mockResolvedValue({ count: 0 });
    prisma.botPairingToken.findUnique.mockResolvedValue({
      botId: 'bot-1',
      usedAt: new Date(),
    });
    const service = await buildService(prisma);

    await expect(
      service.redeemPairing('botiko_pair_x', 'https://example.pl'),
    ).rejects.toThrow(/już użyty/);
  });

  it('odrzuca token wygasły', async () => {
    const prisma = buildPrisma();
    prisma.botPairingToken.updateMany.mockResolvedValue({ count: 0 });
    prisma.botPairingToken.findUnique.mockResolvedValue({
      botId: 'bot-1',
      usedAt: null,
    });
    const service = await buildService(prisma);

    await expect(
      service.redeemPairing('botiko_pair_x', 'https://example.pl'),
    ).rejects.toThrow(/wygas/);
  });

  it('jest idempotentny — nie dubluje już dodanej domeny (www-insensitive)', async () => {
    const prisma = buildPrisma();
    prisma.botPairingToken.findUnique.mockResolvedValue({ botId: 'bot-1' });
    prisma.bot.findUnique.mockResolvedValue({
      id: 'bot-1',
      name: 'TestBot',
      allowedDomains: ['https://example.pl'],
    });
    const service = await buildService(prisma);

    const result = await service.redeemPairing(
      'botiko_pair_x',
      'https://www.example.pl',
    );

    expect(result.botId).toBe('bot-1');
    expect(prisma.bot.update).not.toHaveBeenCalled();
  });

  it('odrzuca gdy osiągnięto limit 5 domen', async () => {
    const prisma = buildPrisma();
    prisma.botPairingToken.findUnique.mockResolvedValue({ botId: 'bot-1' });
    prisma.bot.findUnique.mockResolvedValue({
      id: 'bot-1',
      name: 'TestBot',
      allowedDomains: [
        'https://a.pl',
        'https://b.pl',
        'https://c.pl',
        'https://d.pl',
        'https://e.pl',
      ],
    });
    const service = await buildService(prisma);

    await expect(
      service.redeemPairing('botiko_pair_x', 'https://new.pl'),
    ).rejects.toThrow(/limit 5/);
  });
});
