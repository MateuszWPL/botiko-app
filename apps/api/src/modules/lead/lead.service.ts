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
import type { CreateLeadDto } from './dto/create-lead.dto';

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
  ) {}

  async create(dto: CreateLeadDto): Promise<{ id: string }> {
    const bot = await this.prisma.bot.findFirst({
      where: { id: dto.botId, isActive: true },
      select: { id: true, tenantId: true },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const id = randomUUID();

    // PII encrypted at rest — RODO compliance
    await this.prisma.lead.create({
      data: {
        id,
        tenantId: bot.tenantId,
        botId: dto.botId,
        name: this.encryption.encrypt(dto.name),
        phone: this.encryption.encrypt(dto.phone),
        message: dto.message ?? null,
        status: 'NEW',
      },
    });

    this.logger.log(`New lead: ${id} for bot: ${dto.botId}`);
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

  private safeDecrypt(value: string): string {
    try {
      return this.encryption.decrypt(value);
    } catch {
      // If decryption fails (e.g. legacy data), return masked value
      return '[encrypted]';
    }
  }
}
