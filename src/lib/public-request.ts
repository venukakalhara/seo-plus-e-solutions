import { sameOrigin } from './admin-auth';
import { db } from './database';

export async function publicInput(request: Request) {
  if (!sameOrigin(request)) throw new Error('Invalid request origin.');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing request.');
  let size = 0; const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 12000) { await reader.cancel(); throw new Error('Request too large.'); }
    chunks.push(value);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.website) throw new Error('Invalid request.');
  // Persistent global ceiling does not trust spoofable forwarding headers.
  await db().prepare('DELETE FROM public_attempts WHERE at<?').run(Date.now() - 60000);
  const attempt=await db().prepare('INSERT INTO public_attempts(at) SELECT ? WHERE (SELECT COUNT(*) FROM public_attempts)<60 RETURNING at').get(Date.now());
  if (!attempt) throw new Error('Too many requests. Please try again in a minute.');
  return input as Record<string, unknown>;
}
