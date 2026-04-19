import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

// Supabase PKCE auth callback — exchanges one-time code for a session.
// Email links (magic link, password reset, email confirm) all land here first.
// After exchange, redirects to `next` param (default: dashboard).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard/overview';

  // Sanitize redirect target — only allow relative paths to prevent open redirect
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard/overview';

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
