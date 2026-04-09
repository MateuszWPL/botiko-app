import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateBotDto } from './dto/create-bot.dto';
import type { UpdateBotDto } from './dto/update-bot.dto';

export interface BotPublicConfig {
  id: string;
  name: string;
  welcomeMsg: string;
  primaryColor: string;
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

  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateBotDto): Promise<BotDetail> {
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

    this.logger.log(`Bot created: ${bot.id} for tenant: ${tenantId}`);
    return bot;
  }

  async getPublicConfig(botId: string): Promise<BotPublicConfig> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, isActive: true },
      select: {
        id: true,
        name: true,
        welcomeMsg: true,
        primaryColor: true,
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
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
