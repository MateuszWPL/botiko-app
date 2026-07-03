import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PLUGIN_ZIP_BASE64 } from './botiko-plugin-base64';

// Reads cookies at request time (never statically optimized). The ZIP is
// embedded as base64 in a bundled module, so serving it does NOT depend on
// Vercel file-tracing (which unreliably placed the raw .zip in the lambda,
// causing the download to fail).
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

  const bytes = new Uint8Array(Buffer.from(PLUGIN_ZIP_BASE64, 'base64'));

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${DOWNLOAD_FILENAME}"`,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
