import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getBrandTemplate } from '../../brand-templates';
import { KnowledgeService } from '../knowledge/knowledge.service';
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
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  businessSchedule: DaySchedule[] | null;
  suggestedQuestions: string[];
  leadFormAfterMessages: number;
  avatarEmoji: string;
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
  suggestedQuestions: true,
  leadFormAfterMessages: true,
  avatarEmoji: true,
} as const;

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

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
        ...(dto.companyAddress != null && { companyAddress: dto.companyAddress }),
      },
      select: BOT_SELECT,
    });

    if (tenant) {
      const template = getBrandTemplate(tenant.industry);
      void this.seedFaqTemplates(tenantId, bot.id, template.faqTemplates);
    }

    this.logger.log(`Bot created: ${bot.id} for tenant: ${tenantId}`);
    return this.castBot(bot);
  }

  private seedFaqTemplates(
    tenantId: string,
    botId: string,
    faqs: Array<{ question: string; answer: string }>,
  ): Promise<void> {
    if (faqs.length === 0) return Promise.resolve();

    return (async () => {
      for (const faq of faqs) {
        const content = `Pytanie: ${faq.question}\nOdpowiedź: ${faq.answer}`;
        try {
          await this.knowledgeService.addChunk(tenantId, botId, { content });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(`FAQ seed failed for bot ${botId}: ${msg}`);
        }
      }
      this.logger.log(
        `FAQ templates seeded for bot: ${botId} (${String(faqs.length)} chunks)`,
      );
    })();
  }

  async getPublicConfig(botId: string): Promise<BotPublicConfig> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId },
      select: {
        ...BOT_SELECT,
        tenant: {
          select: {
            industry: true,
            isActive: true,
            createdAt: true,
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
      offlineMessage: rest.offlineMessage,
      businessHoursStart: rest.businessHoursStart,
      businessHoursEnd: rest.businessHoursEnd,
      businessDays: rest.businessDays,
      businessSchedule: this.parseSchedule(rest.businessSchedule),
      suggestedQuestions,
      leadFormAfterMessages: rest.leadFormAfterMessages,
      avatarEmoji: rest.avatarEmoji,
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
