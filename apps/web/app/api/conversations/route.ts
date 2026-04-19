import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '../../../lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const params = new URLSearchParams();
  if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
  if (searchParams.get('status')) params.set('status', searchParams.get('status')!);
  if (searchParams.get('daysBack')) params.set('daysBack', searchParams.get('daysBack')!);
  if (searchParams.get('limit')) params.set('limit', searchParams.get('limit')!);

  const qs = params.toString();
  const data = await fetchWithAuth(`/api/v1/conversations${qs ? `?${qs}` : ''}`);
  return NextResponse.json(data);
}
