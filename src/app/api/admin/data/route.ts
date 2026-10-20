import { NextResponse } from 'next/server';
import { authenticated, sameOrigin } from '@/lib/admin-auth';
import { dashboard, saveProduct, saveEntry, saveOrder } from '@/lib/database';
export const runtime = 'nodejs';
export async function GET() {
  if (!await authenticated()) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  return NextResponse.json(dashboard(), { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!await authenticated()) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 100000) return NextResponse.json({ error: 'Content too large.' }, { status: 413 });
  try {
    const body = JSON.parse(raw);
    if (!body.value || typeof body.value !== 'object') throw new Error('Invalid content.');
    if (body.type === 'product') saveProduct(body.value);
    else if (body.type === 'entry') saveEntry(body.value);
    else if (body.type === 'order') saveOrder(body.value);
    else throw new Error('Unknown content type.');
    return NextResponse.json(dashboard(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not save.' }, { status: 400 });
  }
}
