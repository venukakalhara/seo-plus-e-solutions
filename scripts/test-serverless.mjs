import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const listener=net.createServer();
await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));
const port=listener.address().port;
await new Promise(resolve=>listener.close(resolve));
const origin=`http://localhost:${port}`;
const forbiddenDir=path.resolve('state',`serverless-${randomUUID()}`);
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port',String(port)],{env:{...process.env,TURSO_DATABASE_URL:'',TURSO_AUTH_TOKEN:'',VERCEL:'1',SEO_DATA_DIR:forbiddenDir,NEXT_PUBLIC_SITE_URL:origin},stdio:['ignore','pipe','pipe']});
let output='';server.stdout.on('data',data=>output+=data);server.stderr.on('data',data=>output+=data);
async function post(route,body,cookie){return fetch(origin+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});}
try {
 let ready=false;for(let i=0;i<60;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await delay(300);}assert.ok(ready,output);
 for(const route of ['/store','/projects','/blog','/admin','/updates/example','/si/store']){
  const response=await fetch(origin+route);assert.equal(response.status,200,route);
  const html=await response.text();assert.ok(html.includes('WhatsApp'),route);assert.ok(!html.includes('mkdir'),route);
 }
 for(const route of ['/api/enquiries','/api/orders','/api/orders/track','/api/admin/session']){
  const response=await post(route,{});assert.equal(response.status,503,route);const body=await response.json();assert.match(body.error,/storage.*unavailable/);assert.ok(!JSON.stringify(body).includes(forbiddenDir));
 }
 const response=await fetch(origin+'/api/admin/data',{headers:{Cookie:`seo_admin_session=${'a'.repeat(64)}`}});assert.equal(response.status,503);
 assert.equal((await fetch(origin+'/sitemap.xml')).status,200);
 assert.equal(existsSync(forbiddenDir),false,'Serverless requests must never create a local database.');
 console.log('PASS: serverless public/admin pages render; writes return 503; no local database or false success.');
} finally {const stopped=new Promise(resolve=>server.once('exit',resolve));server.kill();await stopped;}
