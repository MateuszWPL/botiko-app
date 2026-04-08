import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('api/v1/leads')
@UseGuards(AuthGuard, TenantGuard)
export class LeadController {}
