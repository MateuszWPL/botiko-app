import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DomainWhitelistGuard implements CanActivate {
  private readonly logger = new Logger(DomainWhitelistGuard.name);

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const origin = request.headers.origin;
    const botId = (request.body as Record<string, unknown>)?.botId as
      | string
      | undefined;

    if (!botId) {
      throw new ForbiddenException({
        message: 'botId is required',
        code: 'DOMAIN_NOT_ALLOWED',
      });
    }

    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, isActive: true },
      select: { allowedDomains: true },
    });

    if (!bot) {
      throw new ForbiddenException({
        message: 'Bot not found',
        code: 'DOMAIN_NOT_ALLOWED',
      });
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // Empty allowedDomains:
    //  - In production: HARD FAIL. An unconfigured bot must not be usable
    //    on arbitrary sites — otherwise competitors / abusers can embed it.
    //  - In dev/test: allow, so onboarding flow works before the user
    //    finishes setup.
    if (bot.allowedDomains.length === 0) {
      if (isProduction) {
        this.logger.warn(
          `Blocked chat/lead for bot ${botId}: no allowedDomains configured`,
        );
        throw new ForbiddenException({
          message: 'Bot is not properly configured',
          code: 'DOMAIN_NOT_ALLOWED',
        });
      }
      return true;
    }

    // No Origin header:
    //  - In production: block. Every legitimate browser request carries
    //    an Origin on POST requests; absence suggests a scripted call
    //    (curl, server-side attacker) attempting to bypass the whitelist.
    //  - In dev: allow, so local curl tests work.
    if (!origin) {
      if (!isProduction) return true;
      throw new ForbiddenException({
        message: 'Origin header is required',
        code: 'DOMAIN_NOT_ALLOWED',
      });
    }

    const isAllowed = bot.allowedDomains.some((domain) => {
      try {
        const allowedHost = new URL(domain).hostname;
        const incomingHost = new URL(origin).hostname;
        // Treat www and non-www as the same domain so clients don't need to
        // register both variants (e.g. example.pl ↔ www.example.pl).
        const normalize = (h: string) => h.replace(/^www\./, '');
        return normalize(allowedHost) === normalize(incomingHost);
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      throw new ForbiddenException({
        message: 'Origin not allowed',
        code: 'DOMAIN_NOT_ALLOWED',
      });
    }

    return true;
  }
}
