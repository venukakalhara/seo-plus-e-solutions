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
const env = { ...process.env,TURSO_DATABASE_URL:'',TURSO_AUTH_TOKEN:'', SEO_DATA_DIR: testDir, NEXT_PUBLIC_SITE_URL: origin };
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
  const enquiry={name:'Private enquiry',email:'customer@example.com',service:'Web Development',message:'Please build a business website.',website:''};
  response=await request('/api/enquiries',{method:'POST',body:enquiry,authenticated:false});
  assert.equal(response.status,201);assert.ok((await response.json()).reference);
  assert.equal((await request('/api/enquiries',{method:'POST',body:{...enquiry,email:'invalid'},authenticated:false})).status,400);
  assert.equal((await request('/api/enquiries',{method:'POST',body:enquiry,requestOrigin:'https://untrusted.example',authenticated:false})).status,400);
  assert.equal((await request('/api/enquiries',{method:'POST',body:{...enquiry,website:'spam'},authenticated:false})).status,400);
  assert.ok(!(await (await request('/contact')).text()).includes('Private enquiry'));
  assert.equal((await request('/api/orders',{method:'POST',body:{productId:product.id,customer:'Online customer',phone:'customer@example.com',quantity:1},authenticated:false})).status,400);
  await save('product',{...product,available:true});
  response=await request('/api/orders',{method:'POST',body:{productId:product.id,customer:'Online customer',phone:'customer@example.com',quantity:2,unitPrice:1,status:'completed'},authenticated:false});
  assert.equal(response.status,201);const publicOrder=await response.json();assert.equal(publicOrder.total,2500);
  response=await request('/api/orders/track',{method:'POST',body:{code:publicOrder.code},authenticated:false});
  const tracked=await response.json();assert.equal(tracked.status,'pending');assert.equal(tracked.total,2500);assert.ok(!('phone' in tracked));assert.ok(!('customer' in tracked));
  assert.equal((await request('/api/orders/track',{method:'POST',body:{code:'0'.repeat(48)},authenticated:false})).status,404);
  assert.equal((await request('/api/orders/track',{method:'POST',body:{code:publicOrder.reference},authenticated:false})).status,404);
  const publicState=await (await request('/api/admin/data')).json();
  const savedRequest=publicState.orders.find(o=>o.id===publicOrder.reference);
  await save('order',{...savedRequest,status:'confirmed'});
  assert.equal((await (await request('/api/orders/track',{method:'POST',body:{code:publicOrder.code},authenticated:false})).json()).status,'confirmed');
  assert.equal(publicState.enquiries[0].email,enquiry.email);
  assert.equal((await request('/api/enquiries',{method:'POST',body:{...enquiry,message:'x'.repeat(13000)},authenticated:false})).status,400);

  const localized=await (await request('/si/services')).text();assert.match(localized,/<html lang="si"/);assert.ok(localized.includes('href="/si/contact"'));
  const english=await (await request('/services')).text();assert.match(english,/<html lang="en"/);assert.ok(english.includes('What your quote covers'));
  console.log('PASS: enquiry validation, private tracking, server pricing, sold-out protection and localized rendering.');
  console.log('PASS: draft/published catalogue, WhatsApp details, sold-out state and server validation.');
  data=await save('order',{productId:product.id,customer:'Test customer',phone:'Test contact',quantity:2,status:'pending',notes:'Local integration test'});
  const order=data.orders.find(o=>o.customer==='Test customer');
  assert.equal(order.unitPrice,1250);
  await save('product',{...product,price:2000});
  data=await save('order',{...order,status:'completed'});
  assert.equal(data.orders.find(o=>o.id===order.id).unitPrice,1250,'Existing order pricing must remain unchanged.');
  assert.equal(data.orders.find(o=>o.id===order.id).status,'completed');
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
  assert.ok((await (await request('/')).text()).includes('Projects Completed'));
  const state=await (await request('/api/admin/data')).json();
  assert.equal(state.products.length,1);
  assert.equal(state.orders.length,2);assert.equal(state.enquiries.length,1);
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
