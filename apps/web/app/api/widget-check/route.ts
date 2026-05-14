import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Private/loopback ranges that must never be fetched
const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
]);

// Blocks RFC-1918, loopback, link-local, and metadata IPs
function isBlockedIp(hostname: string): boolean {
  // IPv6 loopback
  if (hostname === '::1' || hostname === '[::]' || hostname === '[:1]') return true;
  const parts = hostname.replace(/^\[|\]$/g, '').split('.');
  if (parts.length !== 4) return false;
  const [a, b] = parts.map(Number);
  return (
    a === 10 ||                        // 10.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
    (a === 192 && b === 168) ||        // 192.168.0.0/16
    a === 127 ||                       // 127.0.0.0/8 loopback
    (a === 169 && b === 254) ||        // 169.254.0.0/16 link-local (AWS metadata)
    a === 0                            // 0.0.0.0/8
  );
}

function assertSafeUrl(url: URL): void {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http/https URLs allowed');
  }
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || isBlockedIp(hostname)) {
    throw new Error('URL points to a restricted address');
  }
}

const BOT_CHECKER_UA =
  'Mozilla/5.0 (compatible; BotikoWidgetChecker/1.0; +https://botiko.pl)';

const MAX_REDIRECTS = 5;

async function fetchFollowingRedirects(
  startUrl: URL,
): Promise<{ html: string; status: number } | { error: string }> {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let res: Response;
    try {
      res = await fetch(currentUrl.toString(), {
        headers: {
          'User-Agent': BOT_CHECKER_UA,
          Accept: 'text/html',
        },
        signal: AbortSignal.timeout(10_000),
        redirect: 'manual',
      });
    } catch {
      return { error: 'fetch_failed' };
    }

    if (res.status >= 300 && res.status < 400) {
      if (hop === MAX_REDIRECTS) {
        return { error: 'too_many_redirects' };
      }
      const location = res.headers.get('location');
      if (!location) {
        return { error: 'redirect_no_location' };
      }
      let nextUrl: URL;
      try {
        nextUrl = new URL(location, currentUrl.toString());
        assertSafeUrl(nextUrl);
      } catch {
        return { error: 'unsafe_redirect' };
      }
      currentUrl = nextUrl;
      continue;
    }

    const html = await res.text();
    return { html, status: res.status };
  }

  return { error: 'too_many_redirects' };
}

export async function GET(req: NextRequest) {
  // Require authenticated Supabase session
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawUrl = req.nextUrl.searchParams.get('url');
  const botId  = req.nextUrl.searchParams.get('botId');

  if (!rawUrl || !botId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  // Validate botId is a UUID to prevent HTML-injection in the contains check
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(botId)) {
    return NextResponse.json({ error: 'Invalid botId' }, { status: 400 });
  }

  const targetUrlStr = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetUrlStr);
    assertSafeUrl(targetUrl);
  } catch {
    return NextResponse.json({ detected: false, error: 'invalid_url' }, { status: 400 });
  }

  const result = await fetchFollowingRedirects(targetUrl);

  if ('error' in result) {
    return NextResponse.json({ detected: false, error: result.error }, { status: 200 });
  }

  const hasScript =
    result.html.includes(`data-bot-id="${botId}"`) ||
    result.html.includes(`data-bot-id='${botId}'`);

  return NextResponse.json({ detected: hasScript, httpStatus: result.status });
}
