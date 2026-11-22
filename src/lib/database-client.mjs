import { mkdirSync } from 'node:fs';
import path from 'node:path';

export class StorageUnavailableError extends Error {
 constructor(){super('Online storage is temporarily unavailable. Please contact us on WhatsApp.');this.name='StorageUnavailableError';}
}
export function isServerlessStorage(env=process.env,cwd=process.cwd()) {
 return env.VERCEL==='1'||Boolean(env.AWS_LAMBDA_FUNCTION_NAME)||cwd.replace(/\\/g,'/').startsWith('/var/task');
}
const schema=[
 'CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,kind TEXT NOT NULL,value TEXT NOT NULL)',
 'CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER NOT NULL)',
 'CREATE TABLE IF NOT EXISTS login_attempts(id INTEGER PRIMARY KEY,at INTEGER NOT NULL)',
 'CREATE TABLE IF NOT EXISTS admin(id INTEGER PRIMARY KEY CHECK(id=1),salt TEXT NOT NULL,hash TEXT NOT NULL)',
 'CREATE TABLE IF NOT EXISTS order_tracking(token TEXT PRIMARY KEY,order_id TEXT NOT NULL)',
 'CREATE TABLE IF NOT EXISTS public_attempts(at INTEGER NOT NULL)',
];
let pending;
export function getDatabase(){
 if(!pending)pending=openDatabase().catch(()=>{pending=undefined;throw new StorageUnavailableError();});
 return pending;
}
async function openDatabase(){
 const url=process.env.TURSO_DATABASE_URL;const authToken=process.env.TURSO_AUTH_TOKEN;
 if(url||authToken){
  if(!url||!authToken)throw new StorageUnavailableError();
  const parsed=new URL(url);
  if(!['libsql:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new StorageUnavailableError();
  const {createClient}=await import('@libsql/client/web');
  const client=createClient({url:parsed.href.replace(/^libsql:/,'https:'),authToken});
  try {await client.batch(schema,'write');} catch {client.close();throw new StorageUnavailableError();}
  return {
   async execute(statement){try{return await client.execute(statement);}catch{throw new StorageUnavailableError();}},
   async batch(statements){try{return await client.batch(statements,'write');}catch{throw new StorageUnavailableError();}},
   close(){client.close();pending=undefined;},
  };
 }
 if(isServerlessStorage())throw new StorageUnavailableError();
 const {DatabaseSync}=await import('node:sqlite');
 const directory=path.resolve(process.env.SEO_DATA_DIR||path.join(process.cwd(),'data'));
 mkdirSync(directory,{recursive:true});
 const local=new DatabaseSync(path.join(directory,'seo-plus.sqlite'));
 try {local.exec('PRAGMA journal_mode=WAL;PRAGMA busy_timeout=5000;'+schema.join(';'));}catch{local.close();throw new StorageUnavailableError();}
 function execute(statement){
  const {sql,args=[]}=typeof statement==='string'?{sql:statement}:statement;
  const stmt=local.prepare(sql);
  // all() also executes writes and supports RETURNING, matching libSQL's result shape.
  return {rows:stmt.all(...args)};
 }
 return {
  async execute(statement){return execute(statement);},
  async batch(statements){local.exec('BEGIN IMMEDIATE');try{const results=statements.map(execute);local.exec('COMMIT');return results;}catch(error){local.exec('ROLLBACK');throw error;}},
  close(){local.close();pending=undefined;},
 };
}
