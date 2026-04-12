import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  BotService,
  type BotDetail,
  type BotPublicConfig,
} from './bot.service';
import { createBotSchema, type CreateBotDto } from './dto/create-bot.dto';
import { updateBotSchema, type UpdateBotDto } from './dto/update-bot.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('api/v1/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  // Public endpoint — widget fetches bot config (no auth required)
  @Get(':id/config')
  getConfig(@Param('id') id: string): Promise<BotPublicConfig> {
    return this.botService.getPublicConfig(id);
  }

  @Get()
  @UseGuards(AuthGuard, TenantGuard)
  findAll(@CurrentTenant() tenantId: string): Promise<BotDetail[]> {
    return this.botService.findAllByTenant(tenantId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, TenantGuard)
  findOne(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<BotDetail> {
    return this.botService.findById(tenantId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, TenantGuard)
  @UsePipes(new ZodValidationPipe(createBotSchema))
  create(
    @Body() dto: CreateBotDto,
    @CurrentTenant() tenantId: string,
  ): Promise<BotDetail> {
    return this.botService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, TenantGuard)
  @UsePipes(new ZodValidationPipe(updateBotSchema))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBotDto,
    @CurrentTenant() tenantId: string,
  ): Promise<BotDetail> {
    return this.botService.update(tenantId, id, dto);
  }
}
