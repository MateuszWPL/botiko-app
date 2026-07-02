import { readFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Read cookies + filesystem at request time (never statically optimized).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Bump together with wordpress-plugin/botiko/botiko.php when refreshing the ZIP
// (see wordpress-plugin/PUBLISHING.md — ścieżka A).
const PLUGIN_VERSION = '1.0.6';
const DOWNLOAD_FILENAME = `botiko-ai-customer-service-bot-${PLUGIN_VERSION}.zip`;

export async function GET() {
  // Gate to logged-in users. An <a href download> is a same-origin navigation,
  // so the Supabase auth cookies ride along — no Bearer header needed.
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // The ZIP lives next to this route (outside /public → never served statically).
  // `new URL(..., import.meta.url)` is the pattern Vercel file-tracing detects.
  const zipUrl = new URL('./botiko-plugin.zip', import.meta.url);

  let buf: Buffer;
  try {
    buf = await readFile(zipUrl);
  } catch {
    return new NextResponse('Plik wtyczki jest chwilowo niedostępny.', { status: 500 });
  }

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${DOWNLOAD_FILENAME}"`,
      'Content-Length': String(buf.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
