// Mock env before imports
jest.mock('../../config/env', () => ({
  env: {
    SUPABASE_URL: 'https://placeholder.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-placeholder',
  },
}));

// Mock @supabase/supabase-js so no real HTTP calls are made
const mockGetUser = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

function makeContext(authHeader: string | undefined): ExecutionContext {
  const request = {
    headers: { authorization: authHeader },
    user: undefined,
    tenantId: undefined,
  };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard: P0: token validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rzuca UnauthorizedException gdy brak tokenu', async () => {
    const guard = new AuthGuard();
    await expect(guard.canActivate(makeContext(undefined))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rzuca UnauthorizedException gdy token ma zły format (nie Bearer)', async () => {
    const guard = new AuthGuard();
    await expect(
      guard.canActivate(makeContext('Basic sometoken')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('P0: anon-key nie bypassuje AuthGuard, Supabase odrzuca klucz niebędący JWT', async () => {
    // Anon key is an API key, not a user JWT. Supabase getUser returns error for it.
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'invalid JWT' },
    });

    const guard = new AuthGuard();
    await expect(
      guard.canActivate(
        makeContext('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anon.key'),
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('P0: token bez tenant_id w metadata jest odrzucany', async () => {
    // Valid Supabase JWT but user has no tenant_id in user_metadata
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          user_metadata: {}, // no tenant_id
        },
      },
      error: null,
    });

    const guard = new AuthGuard();
    await expect(
      guard.canActivate(makeContext('Bearer valid.jwt.token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('przepuszcza żądanie z poprawnym tokenem i tenant_id', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'owner@example.com',
          user_metadata: { tenant_id: 'tenant-1' },
        },
      },
      error: null,
    });

    const guard = new AuthGuard();
    await expect(
      guard.canActivate(makeContext('Bearer valid.jwt.token')),
    ).resolves.toBe(true);
  });

  it('używa cache: drugi identyczny token nie wywołuje Supabase API', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          email: 'owner@example.com',
          user_metadata: { tenant_id: 'tenant-1' },
        },
      },
      error: null,
    });

    const guard = new AuthGuard();
    const token = 'Bearer cached.jwt.token';

    await guard.canActivate(makeContext(token));
    await guard.canActivate(makeContext(token));

    // Supabase should have been called only once (second hit from cache)
    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });
});
