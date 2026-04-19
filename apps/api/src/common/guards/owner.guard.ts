import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from './auth.guard';

/**
 * Guards billing-sensitive operations (checkout, customer portal) to
 * OWNER-role users only.
 *
 * Why this guard exists (audit A10):
 * In MVP every tenant has a single user who is always the owner. When the
 * team-member invite feature ships, MEMBER users must NOT be able to:
 *   - Cancel the subscription (portal)
 *   - Start a second checkout (duplicate charge)
 *   - See the raw Stripe Customer ID / subscription metadata
 *
 * Usage: @UseGuards(AuthGuard, TenantGuard, OwnerGuard)
 *
 * The guard must come AFTER AuthGuard + TenantGuard so request.user and
 * request.tenantId are already populated.
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = await this.prisma.user.findUnique({
      where: { email: req.user.email },
      select: { role: true },
    });

    if (user?.role !== 'OWNER') {
      throw new ForbiddenException('Only the account owner can manage billing');
    }

    return true;
  }
}
