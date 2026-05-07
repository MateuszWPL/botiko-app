import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');
  const botId  = req.nextUrl.searchParams.get('botId');

  if (!rawUrl || !botId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Botiko-WidgetChecker/1.0',
        Accept: 'text/html',
      },
      // 10s timeout
      signal: AbortSignal.timeout(10_000),
      // Don't follow too many redirects
      redirect: 'follow',
    });

    const html = await res.text();

    // Check for the embed script with matching bot id
    const hasScript =
      html.includes(`data-bot-id="${botId}"`) ||
      html.includes(`data-bot-id='${botId}'`);

    return NextResponse.json({
      detected: hasScript,
      httpStatus: res.status,
      url: targetUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json(
      { detected: false, error: 'fetch_failed', detail: message, url: targetUrl },
      { status: 200 },
    );
  }
}
