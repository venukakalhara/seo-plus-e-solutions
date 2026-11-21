import { NextResponse } from 'next/server';
import { createPublicOrder } from '@/lib/database';
import { publicInput } from '@/lib/public-request';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try { return NextResponse.json(createPublicOrder(await publicInput(request)), { status: 201, headers: { 'Cache-Control': 'no-store' } }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save order.' }, { status: 400 }); }
}
