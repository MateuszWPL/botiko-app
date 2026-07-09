import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { webEnv } from './lib/env';

const PROTECTED_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

// Supabase session cookies always start with 'sb-'
function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-'));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);

  // Fast path for public routes with no session cookie.
  // No session = nothing to refresh, no redirect needed → skip Supabase entirely.
  if (!isProtected && !isAuthPage && !hasSessionCookie(request)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    webEnv.SUPABASE_URL,
    webEnv.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getSession() reads and decodes the JWT locally, no network round-trip unless
  // the access token is expired and needs a refresh. Much faster than getUser()
  // which always hits the Supabase auth API. Full re-validation happens in
  // server components via getUser() for actual data access.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard/overview';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
