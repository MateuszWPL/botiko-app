import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  BotService,
  type BotDetail,
  type BotPublicConfig,
} from './bot.service';
import { createBotSchema, type CreateBotDto } from './dto/create-bot.dto';
import { updateBotSchema, type UpdateBotDto } from './dto/update-bot.dto';
import { redeemPairingSchema, type RedeemPairingDto } from './dto/pair.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Controller('api/v1/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  // Public endpoint: widget fetches bot config (no auth required)
  @Get(':id/config')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  getConfig(
    @Param('id') id: string,
    @Headers('origin') origin?: string,
  ): Promise<BotPublicConfig> {
    return this.botService.getPublicConfig(id, origin);
  }

  // Public: the official WordPress plugin redeems a one-click pairing token to
  // authorize its domain. Gated by possession of the unguessable single-use
  // token; rate-limited as defence-in-depth.
  @Post('pair')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(redeemPairingSchema))
  redeemPairing(
    @Body() dto: RedeemPairingDto,
  ): Promise<{ botId: string; botName: string }> {
    return this.botService.redeemPairing(dto.token, dto.domain);
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

  // Owner-authenticated: generate a short-lived, single-use pairing token for
  // the WordPress plugin. The raw token is returned once and shown in the panel.
  @Post(':id/pairing-token')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, TenantGuard)
  createPairingToken(
    @Param('id') id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    return this.botService.createPairingToken(tenantId, id);
  }
}
