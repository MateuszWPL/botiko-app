import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Per-bot rate limiter.
 *
 * Throttles requests to public widget endpoints (chat, leads) on a
 * per-botId basis, independent of client IP. Complements the built-in
 * per-IP ThrottlerGuard — an attacker using a pool of proxies can
 * bypass per-IP limits but still hits this bot-scoped cap.
 *
 * Storage is in-memory (single process) — acceptable for MVP.
 * Restart resets the window, which is strictly safer (never over-blocks
 * legitimate traffic across deploys).
 */
// Shared in-memory state — single source of truth for all BotThrottleGuard
// instances, regardless of which module instantiated them. This keeps the
// per-bot counter consistent across /chat and /leads endpoints.
const BUCKETS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 60;

let gcTimer: NodeJS.Timeout | null = null;
function ensureGc(): void {
  if (gcTimer) return;
  gcTimer = setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS;
    for (const [key, timestamps] of BUCKETS) {
      const recent = timestamps.filter((t) => t > cutoff);
      if (recent.length === 0) BUCKETS.delete(key);
      else BUCKETS.set(key, recent);
    }
  }, 5 * 60_000);
  gcTimer.unref();
}

@Injectable()
export class BotThrottleGuard implements CanActivate {
  constructor() {
    ensureGc();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const body = req.body as { botId?: unknown } | undefined;
    const botId = typeof body?.botId === 'string' ? body.botId : null;

    // No botId → let downstream DTO validation reject the request
    if (!botId) return true;

    const now = Date.now();
    const cutoff = now - WINDOW_MS;
    const timestamps = BUCKETS.get(botId) ?? [];
    const recent = timestamps.filter((t) => t > cutoff);

    if (recent.length >= LIMIT) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    BUCKETS.set(botId, recent);
    return true;
  }
}
