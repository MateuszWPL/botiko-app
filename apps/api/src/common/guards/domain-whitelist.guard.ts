import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DomainWhitelistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const origin = request.headers.origin;
    const botId = (request.body as Record<string, unknown>)?.botId as
      | string
      | undefined;

    if (!botId) {
      throw new ForbiddenException('botId is required');
    }

    const bot = await this.prisma.bot.findFirst({
      where: { id: botId, isActive: true },
      select: { allowedDomains: true },
    });

    if (!bot) {
      throw new ForbiddenException('Bot not found');
    }

    // If no domains configured, allow all (useful during development/setup)
    if (bot.allowedDomains.length === 0) {
      return true;
    }

    // No origin header — allow in dev only; block in production to prevent whitelist bypass
    if (!origin) {
      if (process.env.NODE_ENV !== 'production') {
        return true;
      }
      throw new ForbiddenException('Origin header is required');
    }

    const isAllowed = bot.allowedDomains.some((domain) => {
      try {
        const allowed = new URL(domain);
        const incoming = new URL(origin);
        return allowed.hostname === incoming.hostname;
      } catch {
        return false;
      }
    });

    if (!isAllowed) {
      throw new ForbiddenException('Origin not allowed');
    }

    return true;
  }
}
