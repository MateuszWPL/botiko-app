import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getBrandTemplate } from '../../brand-templates';
import { isTenantOnline } from '../../common/tenant-status';
import type { CreateBotDto } from './dto/create-bot.dto';
import type { UpdateBotDto } from './dto/update-bot.dto';

export interface DaySchedule {
  enabled: boolean;
  start: number;
  end: number;
}

export interface BotPublicConfig {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  online: boolean;
  companyPhone: string | null;
  companyAddress: string | null;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  businessSchedule: DaySchedule[] | null;
  suggestedQuestions: string[];
  leadFormAfterMessages: number;
  avatarEmoji: string;
  /**
   * Whether the requesting Origin may embed this bot. Computed server-side
   * from the Origin header so the public config does not leak the tenant's
   * full domain list. The authoritative gate stays in DomainWhitelistGuard.
   */
  domainAllowed: boolean;
}

export interface BotDetail {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  businessSchedule: DaySchedule[] | null;
  personality: string | null;
  companyName: string | null;
  companyPhone: string | null;
  companyAddress: string | null;
  companyEmail: string | null;
  nip: string | null;
  owner: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
  reservationUrl: string | null;
  suggestedQuestions: string[];
  leadFormAfterMessages: number;
  avatarEmoji: string;
  industry?: string;
  createdAt?: Date;
}

const BOT_SELECT = {
  id: true,
  name: true,
  welcomeMsg: true,
  primaryColor: true,
  allowedDomains: true,
  isActive: true,
  offlineMessage: true,
  businessHoursStart: true,
  businessHoursEnd: true,
  businessDays: true,
  businessSchedule: true,
  personality: true,
  companyName: true,
  companyPhone: true,
  companyAddress: true,
  companyEmail: true,
  nip: true,
  owner: true,
  websiteUrl: true,
  googleMapsUrl: true,
  reservationUrl: true,
  suggestedQuestions: true,
  leadFormAfterMessages: true,
  avatarEmoji: true,
} as const;

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateBotDto): Promise<BotDetail> {
    const existing = await this.prisma.bot.count({ where: { tenantId } });
    if (existing >= 1) {
      throw new ForbiddenException(
        'Twoje konto może mieć tylko jednego bota. Edytuj istniejącego bota zamiast tworzyć nowego.',
      );
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { industry: true, websiteUrl: true },
    });

    // Auto-populate allowedDomains from Tenant.websiteUrl when not provided.
    // websiteUrl is stored as https://<host> (www-stripped) by register.dto.ts.
    let allowedDomains = dto.allowedDomains;
    if (allowedDomains.length === 0 && tenant?.websiteUrl) {
      try {
        const host = new URL(tenant.websiteUrl).hostname;
        allowedDomains = [`https://${host}`, `https://www.${host}`];
      } catch {
        // malformed websiteUrl — keep empty
      }
    }

    const bot = await this.prisma.bot.create({
      data: {
        tenantId,
        name: dto.name,
        welcomeMsg: dto.welcomeMsg,
        primaryColor: dto.primaryColor,
        allowedDomains,
        ...(dto.companyName != null && { companyName: dto.companyName }),
        ...(dto.companyPhone != null && { companyPhone: dto.companyPhone }),
        ...(dto.companyAddress != null && {
          companyAddress: dto.companyAddress,
        }),
      },
      select: BOT_SELECT,
    });

    this.logger.log(`Bot created: ${bot.id} for tenant: ${tenantId}`);
    return this.castBot(bot);
  }

  async getPublicConfig(
    botId: string,
    requestOrigin?: string,
  ): Promise<BotPublicConfig> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId },
      select: {
        ...BOT_SELECT,
        tenant: {
          select: {
            industry: true,
            isActive: true,
            createdAt: true,
            trialEndsAt: true,
            stripeSubscriptionId: true,
          },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const { tenant, ...rest } = bot;
    const online = rest.isActive && isTenantOnline(tenant);
    const template = getBrandTemplate(tenant.industry);

    const suggestedQuestions =
      rest.suggestedQuestions.length > 0
        ? rest.suggestedQuestions
        : template.suggestedResponses;

    return {
      id: rest.id,
      name: rest.name,
      welcomeMsg: rest.welcomeMsg,
      primaryColor: rest.primaryColor,
      online,
      companyPhone: rest.companyPhone,
      companyAddress: rest.companyAddress,
      offlineMessage: rest.offlineMessage,
      businessHoursStart: rest.businessHoursStart,
      businessHoursEnd: rest.businessHoursEnd,
      businessDays: rest.businessDays,
      businessSchedule: this.parseSchedule(rest.businessSchedule),
      suggestedQuestions,
      leadFormAfterMessages: rest.leadFormAfterMessages,
      avatarEmoji: rest.avatarEmoji,
      domainAllowed: isOriginAllowed(rest.allowedDomains, requestOrigin),
    };
  }

  async findById(tenantId: string, botId: string): Promise<BotDetail> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: {
        ...BOT_SELECT,
        tenant: { select: { industry: true } },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const { tenant, ...rest } = bot;
    return { ...this.castBot(rest), industry: tenant.industry };
  }

  async findAllByTenant(tenantId: string): Promise<BotDetail[]> {
    const bots = await this.prisma.bot.findMany({
      where: { tenantId },
      select: {
        ...BOT_SELECT,
        tenant: { select: { industry: true } },
      },
      orderBy: { name: 'asc' },
    });

    return bots.map(({ tenant, ...rest }) => ({
      ...this.castBot(rest),
      industry: tenant.industry,
    }));
  }

  async update(
    tenantId: string,
    botId: string,
    dto: UpdateBotDto,
  ): Promise<BotDetail> {
    const existing = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: { id: true },
    });

    if (!existing) {
      throw new ForbiddenException('Bot not found or access denied');
    }

    // Derive legacy business hours fields from businessSchedule for widget compat
    let legacyFields: {
      businessHoursStart?: number | null;
      businessHoursEnd?: number | null;
      businessDays?: number[];
    } = {};

    if (dto.businessSchedule) {
      const enabledDays = dto.businessSchedule
        .map((d, i) => ({ ...d, idx: i }))
        .filter((d) => d.enabled);
      legacyFields = {
        businessHoursStart: enabledDays[0]?.start ?? null,
        businessHoursEnd: enabledDays[0]?.end ?? null,
        businessDays: enabledDays.map((d) => d.idx),
      };
    } else if (dto.businessSchedule === null) {
      legacyFields = {
        businessHoursStart: null,
        businessHoursEnd: null,
        businessDays: [],
      };
    }

    await this.prisma.bot.update({
      where: { id: botId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.welcomeMsg !== undefined && { welcomeMsg: dto.welcomeMsg }),
        ...(dto.primaryColor !== undefined && {
          primaryColor: dto.primaryColor,
        }),
        ...(dto.allowedDomains !== undefined && {
          allowedDomains: dto.allowedDomains,
        }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.offlineMessage !== undefined && {
          offlineMessage: dto.offlineMessage,
        }),
        ...(dto.businessHoursStart !== undefined && {
          businessHoursStart: dto.businessHoursStart,
        }),
        ...(dto.businessHoursEnd !== undefined && {
          businessHoursEnd: dto.businessHoursEnd,
        }),
        ...(dto.businessDays !== undefined && {
          businessDays: dto.businessDays,
        }),
        ...(dto.businessSchedule !== undefined && {
          businessSchedule:
            dto.businessSchedule === null
              ? Prisma.DbNull
              : dto.businessSchedule,
        }),
        ...legacyFields,
        ...(dto.personality !== undefined && { personality: dto.personality }),
        ...(dto.companyName !== undefined && { companyName: dto.companyName }),
        ...(dto.companyPhone !== undefined && {
          companyPhone: dto.companyPhone,
        }),
        ...(dto.companyAddress !== undefined && {
          companyAddress: dto.companyAddress,
        }),
        // Links/email: store '' (cleared field) as null.
        ...(dto.companyEmail !== undefined && {
          companyEmail: dto.companyEmail || null,
        }),
        ...(dto.nip !== undefined && { nip: dto.nip || null }),
        ...(dto.owner !== undefined && { owner: dto.owner || null }),
        ...(dto.websiteUrl !== undefined && {
          websiteUrl: dto.websiteUrl || null,
        }),
        ...(dto.googleMapsUrl !== undefined && {
          googleMapsUrl: dto.googleMapsUrl || null,
        }),
        ...(dto.reservationUrl !== undefined && {
          reservationUrl: dto.reservationUrl || null,
        }),
        ...(dto.suggestedQuestions !== undefined && {
          suggestedQuestions: dto.suggestedQuestions,
        }),
        ...(dto.leadFormAfterMessages !== undefined && {
          leadFormAfterMessages: dto.leadFormAfterMessages,
        }),
        ...(dto.avatarEmoji !== undefined && { avatarEmoji: dto.avatarEmoji }),
      },
    });

    return this.findById(tenantId, botId);
  }

  /**
   * Generate a short-lived, single-use pairing token for the WordPress plugin.
   * Owner-authenticated (the controller enforces AuthGuard + TenantGuard).
   * Only the SHA-256 hash is stored; the raw token is returned once.
   */
  async createPairingToken(
    tenantId: string,
    botId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: { id: true },
    });
    if (!bot) {
      throw new ForbiddenException('Bot not found or access denied');
    }

    const token = `botiko_pair_${randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + PAIRING_TTL_MS);

    // Keep at most one active pairing token per bot — delete + create atomically
    // so two concurrent "generate" clicks can't leave two valid tokens.
    await this.prisma.$transaction([
      this.prisma.botPairingToken.deleteMany({ where: { botId } }),
      this.prisma.botPairingToken.create({
        data: {
          tokenHash: hashToken(token),
          botId,
          tenantId,
          expiresAt,
        },
      }),
    ]);

    this.logger.log(`Pairing token issued for bot: ${botId}`);
    return { token, expiresAt };
  }

  /**
   * Redeem a pairing token from the WordPress plugin: marks the token used
   * (atomically, single-use) and authorizes the site's domain on the bot.
   * Public endpoint, gated solely by possession of the unguessable token.
   */
  async redeemPairing(
    token: string,
    domain: string,
  ): Promise<{ botId: string; botName: string }> {
    const tokenHash = hashToken(token);

    return this.prisma.$transaction(async (tx) => {
      // Atomic single-use claim: only an unused, unexpired token flips to used.
      const claimed = await tx.botPairingToken.updateMany({
        where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });

      if (claimed.count !== 1) {
        const existing = await tx.botPairingToken.findUnique({
          where: { tokenHash },
        });
        if (!existing) {
          throw new BadRequestException('Nieprawidłowy kod połączenia.');
        }
        if (existing.usedAt) {
          throw new BadRequestException(
            'Ten kod został już użyty. Wygeneruj nowy w panelu Botiko.',
          );
        }
        throw new BadRequestException(
          'Kod połączenia wygasł. Wygeneruj nowy w panelu Botiko.',
        );
      }

      const tokenRow = await tx.botPairingToken.findUnique({
        where: { tokenHash },
        select: { botId: true },
      });
      const bot = await tx.bot.findUnique({
        where: { id: tokenRow!.botId },
        select: { id: true, name: true, allowedDomains: true },
      });
      if (!bot) {
        throw new BadRequestException('Bot już nie istnieje.');
      }

      const next = addSiteDomain(bot.allowedDomains, domain);
      if (next === null) {
        throw new BadRequestException(
          'Osiągnięto limit 5 domen. Usuń jedną w panelu Botiko, aby dodać tę stronę.',
        );
      }
      if (next !== bot.allowedDomains) {
        await tx.bot.update({
          where: { id: bot.id },
          data: { allowedDomains: next },
        });
      }

      this.logger.log(`Bot ${bot.id} paired with domain (one-click).`);
      return { botId: bot.id, botName: bot.name };
    });
  }

  private parseSchedule(raw: unknown): DaySchedule[] | null {
    if (!raw || !Array.isArray(raw)) return null;
    return raw as DaySchedule[];
  }

  private castBot(raw: {
    id: string;
    name: string;
    welcomeMsg: string;
    primaryColor: string;
    allowedDomains: string[];
    isActive: boolean;
    offlineMessage: string | null;
    businessHoursStart: number | null;
    businessHoursEnd: number | null;
    businessDays: number[];
    businessSchedule: unknown;
    personality: string | null;
    companyName: string | null;
    companyPhone: string | null;
    companyAddress: string | null;
    companyEmail: string | null;
    nip: string | null;
    owner: string | null;
    websiteUrl: string | null;
    googleMapsUrl: string | null;
    reservationUrl: string | null;
    suggestedQuestions: string[];
    leadFormAfterMessages: number;
    avatarEmoji: string;
  }): BotDetail {
    return {
      ...raw,
      businessSchedule: this.parseSchedule(raw.businessSchedule),
    };
  }
}

/**
 * Whether `origin` is allowed to embed a bot given its `allowedDomains`.
 *
 * Mirrors DomainWhitelistGuard's matching (www-insensitive hostname compare).
 * Returns true when the bot has no domains configured yet (so the widget shows
 * online during onboarding) or when the Origin header is absent (UX-only field;
 * the server-side guard remains the real gate). Only an Origin that is present
 * AND demonstrably not in the list yields false.
 */
function isOriginAllowed(
  allowedDomains: string[],
  requestOrigin?: string,
): boolean {
  if (allowedDomains.length === 0) return true;
  if (!requestOrigin) return true;

  let incomingHost: string;
  try {
    incomingHost = new URL(requestOrigin).hostname.replace(/^www\./, '');
  } catch {
    return false;
  }

  return allowedDomains.some((domain) => {
    try {
      const allowedHost = new URL(domain).hostname.replace(/^www\./, '');
      return allowedHost === incomingHost;
    } catch {
      return false;
    }
  });
}

/** Pairing tokens are valid for 15 minutes. */
const PAIRING_TTL_MS = 15 * 60 * 1000;

/** SHA-256 of a raw pairing token — only the hash is ever persisted. */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Add a paired site's domain to a bot's allow-list.
 *
 * Returns the original array unchanged when the host is already allowed
 * (www-insensitive — idempotent re-pairing), a new array with the domain
 * appended when there is room, or `null` when the 5-domain limit blocks it.
 * Mirrors the create() convention of storing both `https://host` and the www
 * variant. `originUrl` is a validated URL (Zod `.url()` upstream).
 */
function addSiteDomain(existing: string[], originUrl: string): string[] | null {
  let host: string;
  try {
    host = new URL(originUrl).hostname.replace(/^www\./, '');
  } catch {
    return existing;
  }
  // Defence in depth: a hostless URL (e.g. `https://`) must never be stored.
  if (host === '') return existing;

  const already = existing.some((d) => {
    try {
      return new URL(d).hostname.replace(/^www\./, '') === host;
    } catch {
      return false;
    }
  });
  if (already) return existing;

  if (existing.length >= 5) return null;

  const variants = [`https://${host}`, `https://www.${host}`];
  const room = 5 - existing.length;
  return [...existing, ...variants.slice(0, room)];
}
