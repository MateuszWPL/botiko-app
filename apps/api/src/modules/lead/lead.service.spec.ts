jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('../../common/services/notification.service', () => ({
  NotificationService: jest.fn(),
}));

// Real EncryptionService with a fixed test key
const TEST_KEY = 'a'.repeat(64);
jest.mock('../../config/env', () => ({ env: { ENCRYPTION_KEY: TEST_KEY } }));

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LeadService } from './lead.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationService } from '../../common/services/notification.service';

const CUID = 'cjld2cjxh0000qzrmn831i7rn';

const mockBot = {
  id: 'bot-1',
  name: 'TestBot',
  tenantId: 'tenant-1',
  tenant: { users: [{ email: 'owner@example.com' }] },
};

function buildPrismaMock(botOverride: object | null = mockBot) {
  return {
    bot: { findFirst: jest.fn().mockResolvedValue(botOverride) },
    lead: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
    },
  };
}

async function buildService(prisma = buildPrismaMock()) {
  const module = await Test.createTestingModule({
    providers: [
      LeadService,
      EncryptionService,
      { provide: PrismaService, useValue: prisma },
      {
        provide: NotificationService,
        useValue: { sendNewLeadEmail: jest.fn().mockResolvedValue(undefined) },
      },
    ],
  }).compile();

  return { service: module.get(LeadService), prisma };
}

const validDto = {
  botId: CUID,
  name: 'Jan Kowalski',
  phone: '+48 600 123 456',
  consentGiven: true as const,
};

describe('LeadService.create — PII encryption', () => {
  it('zapisuje name i phone w formacie iv:authTag:ciphertext (zaszyfrowane)', async () => {
    const prisma = buildPrismaMock();
    const { service } = await buildService(prisma);

    await service.create(validDto);

    const createCall = (prisma.lead.create as jest.Mock).mock.calls[0][0];
    const { name, phone } = createCall.data as { name: string; phone: string };

    // Muszą być stringiem hex iv:authTag:ciphertext
    const encryptedPattern = /^[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/;
    expect(name).toMatch(encryptedPattern);
    expect(phone).toMatch(encryptedPattern);
  });

  it('nie zapisuje danych w postaci jawnego tekstu', async () => {
    const prisma = buildPrismaMock();
    const { service } = await buildService(prisma);

    await service.create(validDto);

    const createCall = (prisma.lead.create as jest.Mock).mock.calls[0][0];
    const { name, phone } = createCall.data as { name: string; phone: string };

    expect(name).not.toContain('Jan Kowalski');
    expect(phone).not.toContain('+48 600 123 456');
  });

  it('szyfruje opcjonalną wiadomość gdy podana', async () => {
    const prisma = buildPrismaMock();
    const { service } = await buildService(prisma);

    await service.create({ ...validDto, message: 'Chcę umówić się na wizytę' });

    const createCall = (prisma.lead.create as jest.Mock).mock.calls[0][0];
    const { message } = createCall.data as { message: string };

    expect(message).toMatch(/^[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/);
    expect(message).not.toContain('Chcę');
  });

  it('zapisuje message: null gdy nie podano wiadomości', async () => {
    const prisma = buildPrismaMock();
    const { service } = await buildService(prisma);

    await service.create(validDto);

    const createCall = (prisma.lead.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.message).toBeNull();
  });

  it('rzuca NotFoundException gdy bot nie istnieje', async () => {
    const { service } = await buildService(buildPrismaMock(null));

    await expect(service.create(validDto)).rejects.toThrow(NotFoundException);
  });
});

describe('LeadService.findAll — deszyfrowanie PII', () => {
  it('zwraca odszyfrowane name i phone', async () => {
    const encryption = new EncryptionService();
    const encryptedName = encryption.encrypt('Anna Nowak');
    const encryptedPhone = encryption.encrypt('+48 500 999 888');

    const prisma = buildPrismaMock();
    (prisma.lead.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'lead-1',
        name: encryptedName,
        phone: encryptedPhone,
        message: null,
        status: 'NEW',
        botId: 'bot-1',
        sessionId: null,
        createdAt: new Date(),
      },
    ]);

    const { service } = await buildService(prisma);
    const leads = await service.findAll('tenant-1');

    expect(leads[0].name).toBe('Anna Nowak');
    expect(leads[0].phone).toBe('+48 500 999 888');
  });

  it('zwraca "[encrypted]" zamiast rzucać wyjątku gdy dane uszkodzone', async () => {
    const prisma = buildPrismaMock();
    (prisma.lead.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'lead-2',
        name: 'uszkodzone_dane_bez_dwukropkow',
        phone: 'rowniez_zepsute',
        message: null,
        status: 'NEW',
        botId: 'bot-1',
        sessionId: null,
        createdAt: new Date(),
      },
    ]);

    const { service } = await buildService(prisma);
    const leads = await service.findAll('tenant-1');

    expect(leads[0].name).toBe('[encrypted]');
    expect(leads[0].phone).toBe('[encrypted]');
  });
});
