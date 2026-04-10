import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  RawBody,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  AuthGuard,
  type AuthenticatedRequest,
} from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BillingService, type BillingStatus } from './billing.service';

@Controller('api/v1/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /** Current plan & activation status — dashboard reads this */
  @Get('status')
  @UseGuards(AuthGuard, TenantGuard)
  getStatus(@CurrentTenant() tenantId: string): Promise<BillingStatus> {
    return this.billingService.getStatus(tenantId);
  }

  /** Create Stripe Checkout session → returns redirect URL */
  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, TenantGuard)
  createCheckout(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: AuthenticatedRequest['user'],
  ): Promise<{ url: string }> {
    return this.billingService.createCheckoutSession(tenantId, user.email);
  }

  /** Create Stripe Customer Portal session → returns redirect URL */
  @Post('portal')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, TenantGuard)
  createPortal(@CurrentTenant() tenantId: string): Promise<{ url: string }> {
    return this.billingService.createPortalSession(tenantId);
  }

  /**
   * Stripe webhook — public endpoint, no AuthGuard.
   * Signature verified inside BillingService using STRIPE_WEBHOOK_SECRET.
   * Throttle set high to not block legitimate Stripe retries.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ): Promise<void> {
    return this.billingService.handleWebhook(rawBody, signature);
  }
}
