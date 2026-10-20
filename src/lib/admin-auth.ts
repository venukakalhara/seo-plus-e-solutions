import { cookies } from 'next/headers';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './database';
export const sessionCookie = 'seo_admin_session';
export function adminConfigured() { return Boolean(db().prepare('SELECT id FROM admin WHERE id=1').get()); }
function digest(token: string) { return createHash('sha256').update(token).digest('hex'); }
export async function authenticated() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return Boolean(db().prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(digest(token), Date.now()));
}
export function login(password: unknown) {
  const now = Date.now();
  db().prepare('DELETE FROM login_attempts WHERE at<?').run(now - 15 * 60 * 1000);
  const attempts = db().prepare('SELECT COUNT(*) AS count FROM login_attempts').get();
  if (Number(attempts?.count) >= 10) throw new Error('Too many attempts. Try again in 15 minutes.');
  const admin = db().prepare('SELECT salt,hash FROM admin WHERE id=1').get();
  if (!admin) throw new Error('Admin setup is required. Run npm run admin:setup on the server.');
  db().prepare('INSERT INTO login_attempts(at) VALUES(?)').run(now);
  if (typeof password !== 'string' || password.length > 256) throw new Error('Incorrect password.');
  const calculated = scryptSync(password, String(admin.salt), 64);
  const expected = Buffer.from(String(admin.hash), 'hex');
  if (expected.length !== calculated.length || !timingSafeEqual(expected, calculated)) throw new Error('Incorrect password.');
  db().exec('DELETE FROM login_attempts');
  db().prepare('DELETE FROM sessions WHERE expires<?').run(now);
  const token = randomBytes(32).toString('hex');
  db().prepare('INSERT INTO sessions(token,expires) VALUES(?,?)').run(digest(token), now + 8 * 60 * 60 * 1000);
  return token;
}
export async function logout() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (token) db().prepare('DELETE FROM sessions WHERE token=?').run(digest(token));
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  return Boolean(origin && new URL(expected).origin === origin);
}
