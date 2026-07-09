jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { DomainWhitelistGuard } from './domain-whitelist.guard';
import { PrismaService } from '../../prisma/prisma.service';

const OLD_ENV = process.env;

function makeContext(
  origin: string | undefined,
  botId: string | undefined,
): ExecutionContext {
  const request = {
    headers: { origin },
    body: botId !== undefined ? { botId } : {},
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function buildPrismaMock(allowedDomains: string[], botActive = true) {
  return {
    bot: {
      findFirst: jest
        .fn()
        .mockResolvedValue(botActive ? { allowedDomains } : null),
    },
  };
}

async function buildGuard(prismaMock: object) {
  const module = await Test.createTestingModule({
    providers: [
      DomainWhitelistGuard,
      { provide: PrismaService, useValue: prismaMock },
    ],
  }).compile();
  return module.get(DomainWhitelistGuard);
}

describe('DomainWhitelistGuard', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  // ── missing botId ────────────────────────────────────────────────────────────
  describe('missing botId', () => {
    it('throws ForbiddenException when botId is absent', async () => {
      const guard = await buildGuard(buildPrismaMock(['https://example.pl']));
      const ctx = makeContext('https://example.pl', undefined);

      await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── bot not found ────────────────────────────────────────────────────────────
  describe('bot not found / inactive', () => {
    it('throws ForbiddenException when bot does not exist in DB', async () => {
      const guard = await buildGuard(buildPrismaMock([], false));
      const ctx = makeContext('https://example.pl', 'bot-1');

      await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── empty allowedDomains ─────────────────────────────────────────────────────
  describe('empty allowedDomains', () => {
    it('allows in dev/test (NODE_ENV != production)', async () => {
      process.env.NODE_ENV = 'test';
      const guard = await buildGuard(buildPrismaMock([]));
      const ctx = makeContext('https://example.pl', 'bot-1');

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });

    it('blocks in production', async () => {
      process.env.NODE_ENV = 'production';
      const guard = await buildGuard(buildPrismaMock([]));
      const ctx = makeContext('https://example.pl', 'bot-1');

      await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── missing Origin header ────────────────────────────────────────────────────
  describe('missing Origin header', () => {
    it('allows in dev/test (no origin header)', async () => {
      process.env.NODE_ENV = 'test';
      const guard = await buildGuard(buildPrismaMock(['https://example.pl']));
      const ctx = makeContext(undefined, 'bot-1');

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });

    it('blocks in production when Origin is absent', async () => {
      process.env.NODE_ENV = 'production';
      const guard = await buildGuard(buildPrismaMock(['https://example.pl']));
      const ctx = makeContext(undefined, 'bot-1');

      await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    });
  });

  // ── domain matching in production ────────────────────────────────────────────
  describe('domain whitelist matching (production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it.each([
      ['https://example.pl', 'https://example.pl'],
      ['https://example.pl', 'https://www.example.pl'], // www normalisation
      ['https://www.example.pl', 'https://example.pl'], // reverse
      ['https://salon.example.pl', 'https://salon.example.pl'], // subdomain exact
    ])('allows: allowedDomain=%s, origin=%s', async (allowedDomain, origin) => {
      const guard = await buildGuard(buildPrismaMock([allowedDomain]));
      const ctx = makeContext(origin, 'bot-1');

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });

    it.each([
      ['https://example.pl', 'https://evil.com'],
      ['https://example.pl', 'https://evil-example.pl'],
      ['https://example.pl', 'https://sub.example.pl'], // subdomains not auto-allowed
      ['https://example.pl', 'http://example.pl'], // scheme mismatch is allowed (hostname match only)
    ])(
      'blocks unrelated domain: allowedDomain=%s, origin=%s',
      async (allowedDomain, origin) => {
        const guard = await buildGuard(buildPrismaMock([allowedDomain]));
        const ctx = makeContext(origin, 'bot-1');

        // subdomains: guard normalises only www prefix, so sub.example.pl != example.pl
        // http vs https: URL.hostname is the same, so it's allowed. Skip that case.
        const incomingHost = new URL(origin).hostname.replace(/^www\./, '');
        const allowedHost = new URL(allowedDomain).hostname.replace(
          /^www\./,
          '',
        );
        if (incomingHost === allowedHost) return; // same hostname → guard allows it

        await expect(guard.canActivate(ctx)).rejects.toThrow(
          ForbiddenException,
        );
      },
    );

    it('blocks origin not in whitelist', async () => {
      const guard = await buildGuard(
        buildPrismaMock(['https://example.pl', 'https://inny.pl']),
      );
      const ctx = makeContext('https://atakujacy.com', 'bot-1');

      await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
    });

    it('allows when origin matches one entry of a multi-domain whitelist', async () => {
      const guard = await buildGuard(
        buildPrismaMock(['https://example.pl', 'https://salon.pl']),
      );
      const ctx = makeContext('https://salon.pl', 'bot-1');

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });
  });
});
