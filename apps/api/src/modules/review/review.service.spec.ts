jest.mock('../../prisma/prisma.service', () => ({ PrismaService: jest.fn() }));
jest.mock('../../common/services/notification.service', () => ({
  NotificationService: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../common/services/notification.service';

function buildPrismaMock() {
  return {
    tenant: {
      findUnique: jest.fn().mockResolvedValue({ name: 'Salon Beauty' }),
    },
    review: {
      create: jest.fn().mockResolvedValue({ id: 'review-1' }),
    },
  };
}

const mockNotification = {
  sendReviewEmail: jest.fn().mockResolvedValue(undefined),
};

async function buildService(prisma = buildPrismaMock()) {
  const module = await Test.createTestingModule({
    providers: [
      ReviewService,
      { provide: PrismaService, useValue: prisma },
      { provide: NotificationService, useValue: mockNotification },
    ],
  }).compile();

  return { service: module.get(ReviewService), prisma };
}

describe('ReviewService.create', () => {
  beforeEach(() => jest.clearAllMocks());

  it('zapisuje ocenę w bazie z poprawnym ratingiem i tenantId', async () => {
    const prisma = buildPrismaMock();
    const { service } = await buildService(prisma);

    await service.create('tenant-1', 'owner@example.com', { rating: 5 });

    expect(prisma.review.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tenantId: 'tenant-1',
          rating: 5,
          userEmail: 'owner@example.com',
        }),
      }),
    );
  });

  it.each([1, 2, 3, 4, 5])('zapisuje poprawny rating %d', async (rating) => {
    const { service } = await buildService();
    await expect(
      service.create('tenant-1', 'owner@example.com', { rating }),
    ).resolves.toBeUndefined();
  });

  it('wysyła powiadomienie email po zapisaniu oceny', async () => {
    const { service } = await buildService();

    await service.create('tenant-1', 'owner@example.com', {
      rating: 4,
      message: 'Świetna aplikacja!',
    });

    expect(mockNotification.sendReviewEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        rating: 4,
        message: 'Świetna aplikacja!',
        userEmail: 'owner@example.com',
      }),
    );
  });

  it('nie rzuca wyjątku gdy powiadomienie email się nie powiedzie', async () => {
    mockNotification.sendReviewEmail.mockRejectedValueOnce(
      new Error('Resend API down'),
    );
    const { service } = await buildService();

    await expect(
      service.create('tenant-1', 'owner@example.com', { rating: 3 }),
    ).resolves.toBeUndefined();
  });

  it('używa pustego stringa jako userName gdy tenant nie istnieje', async () => {
    const prisma = buildPrismaMock();
    (prisma.tenant.findUnique as jest.Mock).mockResolvedValue(null);
    const { service } = await buildService(prisma);

    await service.create('tenant-unknown', 'owner@example.com', { rating: 2 });

    expect(prisma.review.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userName: '' }),
      }),
    );
  });
});
