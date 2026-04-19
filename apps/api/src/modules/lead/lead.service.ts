import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LeadStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { NotificationService } from '../../common/services/notification.service';
import type { CreateLeadDto } from './dto/create-lead.dto';
import type { CreateLeadManualDto } from './dto/create-lead-manual.dto';

export interface LeadResponse {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  botId: string;
  createdAt: Date;
}

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly notification: NotificationService,
  ) {}

  async create(dto: CreateLeadDto): Promise<{ id: string }> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: dto.botId, isActive: true },
      select: {
        id: true,
        name: true,
        tenantId: true,
        tenant: {
          select: {
            users: { select: { email: true }, take: 1 },
          },
        },
      },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const id = randomUUID();

    // PII encrypted at rest — RODO compliance (name, phone, message)
    await this.prisma.lead.create({
      data: {
        id,
        tenantId: bot.tenantId,
        botId: dto.botId,
        sessionId: dto.sessionId ?? null,
        name: this.encryption.encrypt(dto.name),
        phone: this.encryption.encrypt(dto.phone),
        message: dto.message ? this.encryption.encrypt(dto.message) : null,
        status: 'NEW',
      },
    });

    this.logger.log(`New lead: ${id} for bot: ${dto.botId}`);

    // Non-blocking email notification — failure must not affect lead save response
    const ownerEmail = bot.tenant.users[0]?.email;
    if (ownerEmail) {
      this.notification
        .sendNewLeadEmail({
          leadId: id,
          name: dto.name,
          phone: dto.phone,
          botName: bot.name,
          toEmail: ownerEmail,
        })
        .catch((err: unknown) => {
          this.logger.error('Unexpected notification error', err);
        });
    }

    return { id };
  }

  async createManual(tenantId: string, dto: CreateLeadManualDto): Promise<{ id: string }> {
    const bot = await this.prisma.bot.findFirst({
      where: { tenantId, isActive: true },
      select: { id: true },
    });

    if (!bot) {
      throw new NotFoundException('No active bot found for tenant');
    }

    const id = randomUUID();

    await this.prisma.lead.create({
      data: {
        id,
        tenantId,
        botId: bot.id,
        name: this.encryption.encrypt(dto.name),
        phone: this.encryption.encrypt(dto.phone),
        message: dto.message ? this.encryption.encrypt(dto.message) : null,
        status: 'NEW',
      },
    });

    this.logger.log(`Manual lead created: ${id} by tenant: ${tenantId}`);
    return { id };
  }

  async findAll(tenantId: string): Promise<LeadResponse[]> {
    const leads = await this.prisma.lead.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        phone: true,
        message: true,
        status: true,
        botId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return leads.map((lead) => ({
      ...lead,
      // Decrypt PII for authorized tenant access
      name: this.safeDecrypt(lead.name),
      phone: this.safeDecrypt(lead.phone),
      message: lead.message ? this.safeDecrypt(lead.message) : null,
    }));
  }

  async updateStatus(
    tenantId: string,
    leadId: string,
    status: string,
  ): Promise<{ id: string; status: string }> {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId },
      select: { id: true },
    });

    if (!lead) {
      throw new ForbiddenException('Lead not found or access denied');
    }

    const updated = await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: status as LeadStatus },
      select: { id: true, status: true },
    });

    return updated;
  }

  async delete(tenantId: string, leadId: string): Promise<void> {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId },
      select: { id: true },
    });

    if (!lead) {
      throw new ForbiddenException('Lead not found or access denied');
    }

    await this.prisma.lead.delete({ where: { id: leadId } });
    this.logger.log(`Lead deleted: ${leadId} by tenant: ${tenantId}`);
  }

  private safeDecrypt(value: string): string {
    try {
      return this.encryption.decrypt(value);
    } catch {
      return '[encrypted]';
    }
  }
}
