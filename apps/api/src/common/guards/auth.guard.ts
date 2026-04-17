import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { env } from '../../config/env';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
  tenantId: string;
}

interface CacheEntry {
  userId: string;
  email: string;
  tenantId: string;
  expiresAt: number;
}

/**
 * Audit C2: in-memory JWT verification cache.
 *
 * Without this, every dashboard request (page load, API call) triggers an
 * outbound HTTP round-trip to Supabase Auth. At 100 RPS that's 100 external
 * calls/second — Supabase rate limits and latency become a bottleneck.
 *
 * Cache entry TTL is intentionally short (60 s) so revoked tokens stop
 * working within 1 minute. Supabase JWTs expire after 1 hour by default,
 * so a 60-second local cache window is an acceptable security trade-off.
 *
 * Implementation: LRU via Map (insertion-ordered). GC runs on every 200th
 * access to avoid unbounded growth under load.
 */
const JWT_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;
const CACHE_MAX_SIZE = 500;
let gcCounter = 0;

function gcCache(): void {
  const now = Date.now();
  for (const [key, entry] of JWT_CACHE) {
    if (entry.expiresAt < now) JWT_CACHE.delete(key);
    // Stop after removing some entries to bound the gc cost
    if (JWT_CACHE.size <= CACHE_MAX_SIZE * 0.8) break;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const cached = this.fromCache(token);
    if (cached) {
      request.user = { id: cached.userId, email: cached.email };
      request.tenantId = cached.tenantId;
      return true;
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const tenantId = data.user.user_metadata?.tenant_id as string | undefined;
    if (!tenantId) {
      throw new UnauthorizedException('User has no associated tenant');
    }

    this.toCache(token, {
      userId: data.user.id,
      email: data.user.email ?? '',
      tenantId,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    request.user = {
      id: data.user.id,
      email: data.user.email ?? '',
    };
    request.tenantId = tenantId;

    return true;
  }

  private fromCache(token: string): CacheEntry | null {
    const entry = JWT_CACHE.get(token);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      JWT_CACHE.delete(token);
      return null;
    }
    return entry;
  }

  private toCache(token: string, entry: CacheEntry): void {
    if (++gcCounter % 200 === 0) gcCache();
    // Evict oldest entry if at capacity
    if (JWT_CACHE.size >= CACHE_MAX_SIZE) {
      const oldest = JWT_CACHE.keys().next().value;
      if (oldest) JWT_CACHE.delete(oldest);
    }
    JWT_CACHE.set(token, entry);
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
