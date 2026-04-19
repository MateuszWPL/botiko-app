// Order matters: env and heavy deps must be mocked BEFORE imports.

jest.mock('../../config/env', () => ({
  env: {
    STRIPE_SECRET_KEY: 'sk_test_mock',
    STRIPE_WEBHOOK_SECRET: 'whsec_mock',
    STRIPE_PRICE_ID: 'price_starter_mock',
    STRIPE_PRO_PRICE_ID: null,
    APP_URL: 'https://app.botiko.pl',
    CRON_SECRET: 'cron_secret_mock',
  },
}));

jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

jest.mock('../../common/services/notification.service', () => ({
  NotificationService: jest.fn(),
}));

// Stripe constructor mock — returns a fake stripe instance.
const mockStripeInstance = {
  webhooks: {
    constructEvent: jest.fn(),
  },
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
  subscriptions: {
    retrieve: jest.fn(),
  },
  billingPortal: {
    sessions: {
      create: jest.fn(),
    },
  },
};

jest.mock('stripe', () => jest.fn(() => mockStripeInstance));

import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../common/services/notification.service';

// ── helpers ──────────────────────────────────────────────────────────────────

function makePrismaMock(overrides: Record<string, unknown> = {}) {
  return {
    tenant: {
      findUnique: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
      findFirst: jest.fn().mockResolvedValue({ id: 'tenant-1' }),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    },
    processedStripeEvent: {
      create: jest.fn().mockResolvedValue({}),
    },
    billingEvent: {
      create: jest.fn().mockResolvedValue({}),
    },
    ...overrides,
  };
}

async function buildService(prisma: object = makePrismaMock()) {
  const module = await Test.createTestingModule({
    providers: [
      BillingService,
      { provide: PrismaService, useValue: prisma },
      {
        provide: NotificationService,
        useValue: { sendTrialNotificationEmail: jest.fn() },
      },
    ],
  }).compile();
  return { service: module.get(BillingService), prisma };
}

/** Build a fake Buffer body + stub constructEvent to return a valid event. */
function stubWebhookEvent(eventType: string, data: object) {
  const rawBody = Buffer.from(JSON.stringify({ type: eventType, data }));
  const fakeEvent = {
    id: `evt_${eventType.replace(/\./g, '_')}_01`,
    type: eventType,
    data: { object: data },
  };
  mockStripeInstance.webhooks.constructEvent.mockReturnValue(fakeEvent);
  return { rawBody, fakeEvent };
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('BillingService — handleWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── signature verification ─────────────────────────────────────────────────
  describe('signature verification', () => {
    it('throws BadRequestException with generic message on invalid signature', async () => {
      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('No signatures found matching the expected signature');
      });

      const { service } = await buildService();
      const rawBody = Buffer.from('{}');

      await expect(
        service.handleWebhook(rawBody, 'bad-signature'),
      ).rejects.toThrow(BadRequestException);
    });

    it('does NOT echo Stripe error details to the caller (audit A9)', async () => {
      const secretMsg = 'Webhook secret is sk_live_supersecretkey123';
      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error(secretMsg);
      });

      const { service } = await buildService();
      let caught: Error | null = null;
      try {
        await service.handleWebhook(Buffer.from('{}'), 'bad');
      } catch (e) {
        caught = e as Error;
      }

      expect(caught).not.toBeNull();
      // Error message exposed to caller must not leak the internal error
      expect(caught!.message).not.toContain(secretMsg);
      expect(caught!.message).toMatch(/Invalid signature/i);
    });
  });

  // ── idempotency ────────────────────────────────────────────────────────────
  describe('idempotency (audit A1)', () => {
    it('returns silently without re-processing a duplicate event (P2002)', async () => {
      const prisma = makePrismaMock({
        processedStripeEvent: {
          // Simulate unique constraint violation on second delivery
          create: jest.fn().mockRejectedValue({ code: 'P2002' }),
        },
      });

      const { rawBody } = stubWebhookEvent('customer.subscription.updated', {
        id: 'sub_1',
        status: 'active',
        customer: 'cus_1',
      });

      const { service } = await buildService(prisma);
      // Should resolve (not throw) when event is a duplicate
      await expect(
        service.handleWebhook(rawBody, 'sig_valid'),
      ).resolves.toBeUndefined();

      // tenant.update must NOT have been called
      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });

    it('re-throws unexpected DB errors (not P2002)', async () => {
      const prisma = makePrismaMock({
        processedStripeEvent: {
          create: jest.fn().mockRejectedValue(new Error('DB connection lost')),
        },
      });

      const { rawBody } = stubWebhookEvent('customer.subscription.updated', {
        id: 'sub_1',
        status: 'active',
      });

      const { service } = await buildService(prisma);
      await expect(service.handleWebhook(rawBody, 'sig_valid')).rejects.toThrow(
        'DB connection lost',
      );
    });
  });

  // ── checkout.session.completed ─────────────────────────────────────────────
  describe('checkout.session.completed', () => {
    it('sets tenant.isActive = true and stores stripeCustomerId + subscriptionId', async () => {
      const prisma = makePrismaMock();
      // Mock line_items expand call
      mockStripeInstance.checkout.sessions.retrieve.mockResolvedValue({
        line_items: { data: [{ price: { id: 'price_starter_mock' } }] },
      });

      const session = {
        id: 'cs_test_1',
        client_reference_id: 'tenant-1',
        customer: 'cus_abc',
        subscription: 'sub_abc',
        status: 'complete',
        payment_status: 'paid',
      };
      const { rawBody } = stubWebhookEvent(
        'checkout.session.completed',
        session,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tenant-1' },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({
            isActive: true,
            stripeCustomerId: 'cus_abc',
            stripeSubscriptionId: 'sub_abc',
          }),
        }),
      );
    });

    it('skips activation when payment_status is not paid/no_payment_required and status is not complete', async () => {
      const prisma = makePrismaMock();

      const session = {
        id: 'cs_test_2',
        client_reference_id: 'tenant-1',
        customer: 'cus_abc',
        subscription: 'sub_abc',
        status: 'open',
        payment_status: 'unpaid',
      };
      const { rawBody } = stubWebhookEvent(
        'checkout.session.completed',
        session,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });

    it('skips silently when client_reference_id is missing', async () => {
      const prisma = makePrismaMock();
      const session = {
        id: 'cs_test_3',
        client_reference_id: null,
        customer: 'cus_abc',
        subscription: 'sub_abc',
        status: 'complete',
        payment_status: 'paid',
      };
      const { rawBody } = stubWebhookEvent(
        'checkout.session.completed',
        session,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });
  });

  // ── customer.subscription.updated ─────────────────────────────────────────
  describe('customer.subscription.updated', () => {
    it('sets isActive = false when status is "unpaid" (Stripe exhausted retries)', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'unpaid', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.updated',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({ isActive: false }),
        }),
      );
    });

    it('sets isActive = false when status is "canceled"', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'canceled', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.updated',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({ isActive: false }),
        }),
      );
    });

    it('does NOT change isActive when status is "past_due" (grace period — bot stays ON)', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'past_due', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.updated',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      // tenant.update must NOT be called because past_due is a no-op
      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });

    it('does NOT change isActive when status is "incomplete" (initial payment pending)', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'incomplete', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.updated',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });

    it('sets isActive = true when status returns to "active" (e.g. payment recovered)', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'active', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.updated',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({ isActive: true }),
        }),
      );
    });
  });

  // ── customer.subscription.deleted ─────────────────────────────────────────
  describe('customer.subscription.deleted', () => {
    it('sets tenant.isActive = false on subscription deletion', async () => {
      const prisma = makePrismaMock();
      const sub = { id: 'sub_1', status: 'canceled', customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent(
        'customer.subscription.deleted',
        sub,
      );

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({ isActive: false }),
        }),
      );
    });
  });

  // ── invoice.payment_failed ────────────────────────────────────────────────
  describe('invoice.payment_failed', () => {
    it('does NOT update tenant (log only — deactivation handled by subscription.updated)', async () => {
      const prisma = makePrismaMock();
      const invoice = { customer: 'cus_1' };
      const { rawBody } = stubWebhookEvent('invoice.payment_failed', invoice);

      const { service } = await buildService(prisma);
      await service.handleWebhook(rawBody, 'sig_valid');

      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });
  });

  // ── unknown events ─────────────────────────────────────────────────────────
  describe('unhandled events', () => {
    it('handles unknown event types gracefully (no-op)', async () => {
      const prisma = makePrismaMock();
      const { rawBody } = stubWebhookEvent('payment_intent.created', {
        id: 'pi_1',
      });

      const { service } = await buildService(prisma);
      await expect(
        service.handleWebhook(rawBody, 'sig_valid'),
      ).resolves.toBeUndefined();

      expect(prisma.tenant.update).not.toHaveBeenCalled();
    });
  });
});
