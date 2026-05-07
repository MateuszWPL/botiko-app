import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TenantService } from './tenant.service';

@Controller('api/v1/tenant')
@UseGuards(AuthGuard, TenantGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('me')
  getMe(@CurrentTenant() tenantId: string) {
    return this.tenantService.getMe(tenantId);
  }

  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMe(
    @CurrentTenant() tenantId: string,
    @Body() body: unknown,
  ): Promise<void> {
    const { websiteUrl } = z
      .object({ websiteUrl: z.string().trim().min(4) })
      .parse(body);
    await this.tenantService.updateWebsiteUrl(tenantId, websiteUrl);
  }

  // RODO: right to erasure — permanently deletes all tenant data
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAccount(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: { id: string; email: string },
  ): Promise<void> {
    return this.tenantService.deleteAccount(tenantId, user.id);
  }
}
