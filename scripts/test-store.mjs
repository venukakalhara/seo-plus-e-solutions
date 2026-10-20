import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, unlinkSync, rmdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import net from 'node:net';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// Exercise a real production server against a disposable, isolated database.
mkdirSync('state', { recursive: true });
const testDir = mkdtempSync(path.resolve('state/store-test-'));
const password = randomBytes(24).toString('hex');
const socket = net.createServer();
await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
const port = socket.address().port;
await new Promise(resolve => socket.close(resolve));
const origin = `http://localhost:${port}`;
const env = { ...process.env, SEO_DATA_DIR: testDir, NEXT_PUBLIC_SITE_URL: origin };
const setup = spawnSync(process.execPath, ['scripts/admin-setup.mjs'], { env: { ...env, ADMIN_SETUP_PASSWORD: password }, encoding: 'utf8' });
assert.equal(setup.status, 0, setup.stderr);
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', b => { output += b; });
server.stderr.on('data', b => { output += b; });
let cookie = '';
async function request(url, { method = 'GET', body, authenticated = true, requestOrigin = origin } = {}) {
  return fetch(`${origin}${url}`, {
    method, headers: { ...(method !== 'GET' ? { Origin: requestOrigin, 'Content-Type': 'application/json' } : {}), ...(authenticated && cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
async function save(type, value) {
  const response = await request('/api/admin/data', { method: 'POST', body: { type, value } });
  const json = await response.json();
  assert.equal(response.status, 200, JSON.stringify(json));
  return json;
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await request('/store')).ok) { ready = true; break; } } catch {}
    await delay(300);
  }
  assert.ok(ready, output);
  assert.equal((await request('/api/admin/data', { authenticated: false })).status, 401);
  assert.equal((await request('/api/admin/data', { method: 'POST', authenticated: false, body: {type:'product',value:{}} })).status, 401);
  let response = await request('/api/admin/session', { method:'POST', body:{password:'incorrect'} });
  assert.equal(response.status,401);
  response = await request('/api/admin/session', { method:'POST', body:{password}, requestOrigin:'https://untrusted.example' });
  assert.equal(response.status,403);
  response = await request('/api/admin/session', { method:'POST', body:{password} });
  assert.equal(response.status,200);
  assert.match(response.headers.get('set-cookie'),/HttpOnly/i);
  assert.match(response.headers.get('set-cookie'),/SameSite=strict/i);
  cookie=response.headers.get('set-cookie').split(';')[0];
  console.log('PASS: unauthenticated access, login failure, origin protection and session cookies.');
  let data=await save('product',{
    title:'Integration subscription',titleSi:'පරීක්ෂණ දායකත්වය',
    description:'Integration test catalogue item.',descriptionSi:'පරීක්ෂණ දායකත්ව විස්තර.',
    category:'Testing',duration:'1 month',durationSi:'මාසයක්',price:1250,available:true,published:false,
  });
  let product=data.products[0];
  assert.ok(product.id);
  assert.ok(!(await (await request('/store')).text()).includes('Integration subscription'));
  data=await save('product',{...product,published:true});
  product=data.products[0];
  let html=await (await request('/store')).text();
  assert.ok(html.includes('Integration subscription'));
  assert.ok(html.includes('https://wa.me/94779713652?text='));
  assert.ok(html.includes('1,250.00'));
  data=await save('product',{...product,available:false});
  html=await (await request('/store')).text();
  assert.ok(html.includes('Currently sold out'));
  assert.ok(!html.includes('https://wa.me/94779713652?text='));
  const invalid=await request('/api/admin/data',{method:'POST',body:{type:'product',value:{...product,price:-1}}});
  assert.equal(invalid.status,400);
  const forbidden=await request('/api/admin/data',{method:'POST',requestOrigin:'https://untrusted.example',body:{type:'product',value:product}});
  assert.equal(forbidden.status,403);
  console.log('PASS: draft/published catalogue, WhatsApp details, sold-out state and server validation.');
  data=await save('order',{productId:product.id,customer:'Test customer',phone:'Test contact',quantity:2,status:'pending',notes:'Local integration test'});
  const order=data.orders[0];
  assert.equal(order.unitPrice,1250);
  await save('product',{...product,price:2000});
  data=await save('order',{...order,status:'completed'});
  assert.equal(data.orders[0].unitPrice,1250,'Existing order pricing must remain unchanged.');
  assert.equal(data.orders[0].status,'completed');
  assert.ok(!(await (await request('/store')).text()).includes('Test customer'));
  console.log('PASS: order persistence, status updates, historical prices and customer-data isolation.');
  data=await save('entry',{kind:'blog',title:'Managed integration article',titleSi:'පරීක්ෂණ ලිපිය',summary:'Managed content summary.',summarySi:'ලිපි සාරාංශය.',body:'First paragraph.\\n\\nSecond paragraph.',bodySi:'ලිපියේ අන්තර්ගතය.',published:false});
  let entry=data.entries[0];
  assert.equal((await request(`/updates/${entry.id}`)).status,404);
  data=await save('entry',{...entry,published:true});
  assert.ok((await (await request('/blog')).text()).includes(entry.title));
  assert.equal((await request(`/updates/${entry.id}`)).status,200);
  await save('entry',{...entry,published:false});
  assert.equal((await request(`/updates/${entry.id}`)).status,404);
  data=await save('entry',{...entry,id:undefined,kind:'project',title:'Managed project',published:true});
  assert.ok((await (await request('/projects')).text()).includes('Managed project'));
  assert.ok((await (await request('/')).text()).includes('50'));
  const state=await (await request('/api/admin/data')).json();
  assert.equal(state.products.length,1);
  assert.equal(state.orders.length,1);
  await request('/api/admin/session',{method:'DELETE'});
  assert.equal((await request('/api/admin/data')).status,401);
  console.log('PASS: blog/project publishing, direct draft protection, saved records and logout revocation.');
} finally {
  const stopped = new Promise(resolve => server.once('exit', resolve));
  server.kill();
  await stopped;
  // Only remove files created inside this exact temporary test directory.
  const resolved = path.resolve(testDir);
  assert.ok(resolved.startsWith(path.resolve('state')+path.sep+'store-test-'));
  for (const filename of readdirSync(resolved)) {
    assert.ok(['seo-plus.sqlite','seo-plus.sqlite-wal','seo-plus.sqlite-shm'].includes(filename));
    unlinkSync(path.join(resolved,filename));
  }
  rmdirSync(resolved);
}
