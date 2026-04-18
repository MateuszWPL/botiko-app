import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LeadService, type LeadResponse } from './lead.service';
import { createLeadSchema, type CreateLeadDto } from './dto/create-lead.dto';
import { createLeadManualSchema, type CreateLeadManualDto } from './dto/create-lead-manual.dto';
import {
  updateLeadStatusSchema,
  type UpdateLeadStatusDto,
} from './dto/update-lead-status.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { DomainWhitelistGuard } from '../../common/guards/domain-whitelist.guard';
import { BotThrottleGuard } from '../../common/guards/bot-throttle.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('api/v1/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  // Public endpoint — widget submits lead
  // 5 req/min per IP (antyspam) + 60 req/min per botId (BotThrottleGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(BotThrottleGuard, DomainWhitelistGuard)
  @UsePipes(new ZodValidationPipe(createLeadSchema))
  create(@Body() dto: CreateLeadDto): Promise<{ id: string }> {
    return this.leadService.create(dto);
  }

  // Protected endpoint — dashboard adds lead manually (without widget)
  @Post('manual')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, TenantGuard)
  @UsePipes(new ZodValidationPipe(createLeadManualSchema))
  createManual(
    @Body() dto: CreateLeadManualDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ id: string }> {
    return this.leadService.createManual(tenantId, dto);
  }

  // Protected endpoint — dashboard fetches leads
  @Get()
  @UseGuards(AuthGuard, TenantGuard)
  findAll(@CurrentTenant() tenantId: string): Promise<LeadResponse[]> {
    return this.leadService.findAll(tenantId);
  }

  // Protected endpoint — update lead status
  @Patch(':id/status')
  @UseGuards(AuthGuard, TenantGuard)
  @UsePipes(new ZodValidationPipe(updateLeadStatusSchema))
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusDto,
    @CurrentTenant() tenantId: string,
  ): Promise<{ id: string; status: string }> {
    return this.leadService.updateStatus(tenantId, id, dto.status);
  }

  // Protected endpoint — delete lead (RODO: right to erasure)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, TenantGuard)
  deleteLead(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<void> {
    return this.leadService.delete(tenantId, id);
  }
}
