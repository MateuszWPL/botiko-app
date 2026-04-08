import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('api/v1/bot')
@UseGuards(AuthGuard, TenantGuard)
export class BotController {}
