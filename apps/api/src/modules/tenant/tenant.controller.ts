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
    const { websiteUrl, industry } = z
      .object({
        websiteUrl: z
          .string()
          .trim()
          .min(4)
          .refine((v) => {
            const withScheme = v.startsWith('http') ? v : 'https://' + v;
            try {
              const u = new URL(withScheme);
              if (u.protocol !== 'http:' && u.protocol !== 'https:')
                return false;
              const h = u.hostname.toLowerCase();
              const parts = h.split('.');
              const [a, b] = parts.map(Number);
              const isPrivate =
                h === 'localhost' ||
                a === 127 ||
                a === 10 ||
                (a === 172 && b >= 16 && b <= 31) ||
                (a === 192 && b === 168) ||
                (a === 169 && b === 254);
              return !isPrivate;
            } catch {
              return false;
            }
          }, 'Nieprawidłowy lub niedozwolony adres URL')
          .optional(),
        industry: z
          .enum(['BEAUTY', 'HEALTH', 'FOOD', 'AUTO', 'OTHER'])
          .optional(),
      })
      .parse(body);
    await this.tenantService.updateProfile(tenantId, { websiteUrl, industry });
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
