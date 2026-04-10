jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('../../common/services/encryption.service', () => ({ EncryptionService: jest.fn() }));
jest.mock('../../common/services/notification.service', () => ({ NotificationService: jest.fn() }));

import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LeadService } from './lead.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationService } from '../../common/services/notification.service';

const mockBot = {
  id: 'bot-1',
  name: 'Salon Urody',
  tenantId: 'tenant-1',
  tenant: { users: [{ email: 'owner@example.com' }] },
};

function buildMocks() {
  const prisma = {
    bot: { findFirst: jest.fn().mockResolvedValue(mockBot) },
    lead: { create: jest.fn().mockResolvedValue({}) },
  };

  const encryption = {
    encrypt: jest.fn((v: string) => `enc:${v}`),
    decrypt: jest.fn((v: string) => v.replace('enc:', '')),
  };

  const notification = {
    sendNewLeadEmail: jest.fn().mockResolvedValue(undefined),
  };

  return { prisma, encryption, notification };
}

async function buildService(mocks = buildMocks()) {
  const module = await Test.createTestingModule({
    providers: [
      LeadService,
      { provide: PrismaService, useValue: mocks.prisma },
      { provide: EncryptionService, useValue: mocks.encryption },
      { provide: NotificationService, useValue: mocks.notification },
    ],
  }).compile();

  return { service: module.get(LeadService), ...mocks };
}

describe('LeadService.create', () => {
  beforeEach(() => jest.clearAllMocks());

  it('saves lead and returns id', async () => {
    const { service, prisma } = await buildService();

    const result = await service.create({
      botId: 'bot-1',
      name: 'Jan Kowalski',
      phone: '500100200',
      consentGiven: true,
    });

    expect(result).toHaveProperty('id');
    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          botId: 'bot-1',
          status: 'NEW',
        }),
      }),
    );
  });

  it('encrypts name and phone before saving', async () => {
    const { service, prisma, encryption } = await buildService();

    await service.create({ botId: 'bot-1', name: 'Jan', phone: '500', consentGiven: true });

    expect(encryption.encrypt).toHaveBeenCalledWith('Jan');
    expect(encryption.encrypt).toHaveBeenCalledWith('500');
    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'enc:Jan',
          phone: 'enc:500',
        }),
      }),
    );
  });

  it('calls sendNewLeadEmail with correct data', async () => {
    const { service, notification } = await buildService();

    await service.create({ botId: 'bot-1', name: 'Jan', phone: '500', consentGiven: true });

    // Allow async fire-and-forget to settle
    await Promise.resolve();

    expect(notification.sendNewLeadEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jan',
        phone: '500',
        botName: 'Salon Urody',
        toEmail: 'owner@example.com',
      }),
    );
  });

  it('does not call sendNewLeadEmail when tenant has no users', async () => {
    const mocks = buildMocks();
    mocks.prisma.bot.findFirst.mockResolvedValue({
      ...mockBot,
      tenant: { users: [] },
    });
    const { service, notification } = await buildService(mocks);

    await service.create({ botId: 'bot-1', name: 'Jan', phone: '500', consentGiven: true });
    await Promise.resolve();

    expect(notification.sendNewLeadEmail).not.toHaveBeenCalled();
  });

  it('returns lead id even when sendNewLeadEmail throws', async () => {
    const mocks = buildMocks();
    mocks.notification.sendNewLeadEmail.mockRejectedValue(new Error('Resend down'));
    const { service } = await buildService(mocks);

    // Should not throw — fire-and-forget with .catch
    const result = await service.create({
      botId: 'bot-1',
      name: 'Jan',
      phone: '500',
      consentGiven: true,
    });

    expect(result).toHaveProperty('id');
  });

  it('throws NotFoundException when bot not found', async () => {
    const mocks = buildMocks();
    mocks.prisma.bot.findFirst.mockResolvedValue(null);
    const { service } = await buildService(mocks);

    await expect(
      service.create({ botId: 'missing', name: 'Jan', phone: '500', consentGiven: true }),
    ).rejects.toThrow(NotFoundException);
  });
});
