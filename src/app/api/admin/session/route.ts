import { NextResponse } from 'next/server';
import { login, logout, sameOrigin, sessionCookie } from '@/lib/admin-auth';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const body = await request.text();
  if (body.length > 1024) return NextResponse.json({error:'Request too large.'},{status:413});
  try {
    const token = login(JSON.parse(body).password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie, token, { httpOnly: true, sameSite: 'strict', secure: new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).protocol === 'https:', path: '/', maxAge: 8 * 60 * 60 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Login failed.' }, { status: 401 });
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  await logout();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
