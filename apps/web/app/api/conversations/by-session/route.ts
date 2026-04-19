import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '../../../../lib/api';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json(null);

  try {
    const data = await fetchWithAuth(
      `/api/v1/conversations/by-session/${encodeURIComponent(sessionId)}`,
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null);
  }
}
