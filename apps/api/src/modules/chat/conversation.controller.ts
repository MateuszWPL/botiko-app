import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ConversationService,
  type ConversationDetail,
  type ConversationSummary,
} from './conversation.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('api/v1/conversations')
@UseGuards(AuthGuard, TenantGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string): Promise<ConversationSummary[]> {
    return this.conversationService.findAll(tenantId);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<ConversationDetail> {
    return this.conversationService.findById(tenantId, id);
  }
}
