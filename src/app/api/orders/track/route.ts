import { NextResponse } from 'next/server';
import { trackOrder } from '@/lib/database';
import { publicInput } from '@/lib/public-request';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const result = trackOrder((await publicInput(request)).code);
    return NextResponse.json(result || { error: 'Order not found. Check your private tracking code.' }, { status: result ? 200 : 404, headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unable to check this order.' }, { status: 400 }); }
}
