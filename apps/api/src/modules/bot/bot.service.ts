import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getBrandTemplate } from '../../brand-templates';
import { KnowledgeService } from '../knowledge/knowledge.service';
import type { CreateBotDto } from './dto/create-bot.dto';
import type { UpdateBotDto } from './dto/update-bot.dto';

export interface BotPublicConfig {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  offlineMessage: string | null;
  businessHoursStart: number | null;
  businessHoursEnd: number | null;
  businessDays: number[];
  suggestedQuestions: string[];
}

export interface BotDetail {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
  allowedDomains: string[];
  isActive: boolean;
  createdAt?: Date;
}

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
        'Plan STARTER allows only 1 bot per account. Update your bot instead.',
      );
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { industry: true },
    });

    const bot = await this.prisma.bot.create({
      data: {
        tenantId,
        name: dto.name,
        welcomeMsg: dto.welcomeMsg,
        primaryColor: dto.primaryColor,
        allowedDomains: dto.allowedDomains,
      },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
        allowedDomains: true,
        isActive: true,
      },
    });

    // Fire-and-forget: seed industry FAQ templates as initial knowledge chunks.
    // Gives new users a working bot out of the box even before they add custom content.
    // Errors are logged but never fail bot creation.
    if (tenant) {
      const template = getBrandTemplate(tenant.industry);
      void this.seedFaqTemplates(tenantId, bot.id, template.faqTemplates);
    }

    this.logger.log(`Bot created: ${bot.id} for tenant: ${tenantId}`);
    return bot;
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
    // Audit B6: gate on BOTH bot.isActive AND tenant.isActive. Without the
    // tenant check, a widget belonging to a suspended / non-paying tenant
    // still loads (fetches config, bootstraps UI) — only chat requests
    // eventually fail. Filtering here means the widget simply stays hidden
    // when the tenant is inactive, mirroring the behaviour of a missing bot.
    const bot = await this.prisma.bot.findFirst({
      where: {
        id: botId,
        isActive: true,
        tenant: { isActive: true },
      },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
        offlineMessage: true,
        businessHoursStart: true,
        businessHoursEnd: true,
        businessDays: true,
        tenant: { select: { industry: true } },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const { tenant, ...rest } = bot;
    const template = getBrandTemplate(tenant.industry);

    return { ...rest, suggestedQuestions: template.suggestedResponses };
  }

  async findById(tenantId: string, botId: string): Promise<BotDetail> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, tenantId },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
        allowedDomains: true,
        isActive: true,
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
  }

  async findAllByTenant(tenantId: string): Promise<BotDetail[]> {
    return await this.prisma.bot.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
        allowedDomains: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
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

    return this.prisma.bot.update({
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
      },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
        allowedDomains: true,
        isActive: true,
      },
    });
  }
}
