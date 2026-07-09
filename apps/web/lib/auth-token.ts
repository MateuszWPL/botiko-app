import { createClient } from './supabase';

/**
 * Returns a valid Supabase access token for authenticating API calls.
 *
 * `getSession()` reads the stored session but does NOT proactively refresh it,
 * if the tab was left idle past the token's expiry (auto-refresh timer paused
 * while backgrounded), the stored token is empty/expired and the API rejects
 * the request with 401 "Missing authorization token". This happened when
 * overwriting a knowledge-base entry after the dashboard sat open a while.
 *
 * Here we refresh proactively when the token is missing or within 60s of
 * expiry, so mutations don't fail with a stale session. Returns '' only when
 * the refresh token itself is gone (user must log in again), callers surface a
 * clear "session expired" message in that case.
 */
export async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = session?.expires_at ?? 0;
  const needsRefresh = !session?.access_token || expiresAt - nowSec < 60;

  if (needsRefresh) {
    const {
      data: { session: refreshed },
    } = await supabase.auth.refreshSession();
    return refreshed?.access_token ?? session?.access_token ?? '';
  }

  return session.access_token;
}
