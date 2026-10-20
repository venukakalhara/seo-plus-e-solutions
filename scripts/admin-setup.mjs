import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { randomBytes, scryptSync } from 'node:crypto';
import path from 'node:path';
import { emitKeypressEvents } from 'node:readline';
import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch {}
async function hiddenPassword(prompt) {
  if (!process.stdin.isTTY) throw new Error('Run this command in an interactive terminal.');
  process.stdout.write(prompt);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve,reject)=>{
    let value='';
    function finish(){process.stdin.off('keypress',handler);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');}
    function handler(text,key){
      if(key?.ctrl&&key?.name==='c'){finish();reject(new Error('Setup cancelled.'));return;}
      if(key?.name==='return'){finish();resolve(value);return;}
      if(key?.name==='backspace'){value=value.slice(0,-1);return;}
      if(text&&!key?.ctrl&&!key?.meta&&text.charCodeAt(0)>=32)value+=text;
    }
    process.stdin.on('keypress',handler);
  });
}
try {
  const password=process.env.ADMIN_SETUP_PASSWORD || await hiddenPassword('New admin password (12+ characters; input hidden): ');
  if(password.length<12||password.length>256)throw new Error('Use a password between 12 and 256 characters.');
  if(!process.env.ADMIN_SETUP_PASSWORD && password!==await hiddenPassword('Confirm password: '))throw new Error('Passwords do not match.');
  const directory=path.resolve(process.env.SEO_DATA_DIR||'data');
  mkdirSync(directory,{recursive:true});
  const db=new DatabaseSync(path.join(directory,'seo-plus.sqlite'));
  db.exec('PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS admin(id INTEGER PRIMARY KEY CHECK(id=1),salt TEXT NOT NULL,hash TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS login_attempts(id INTEGER PRIMARY KEY,at INTEGER NOT NULL);');
  const salt=randomBytes(32).toString('hex');
  const hash=scryptSync(password,salt,64).toString('hex');
  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('INSERT INTO admin(id,salt,hash) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET salt=excluded.salt,hash=excluded.hash').run(salt,hash);
    db.exec('DELETE FROM sessions; DELETE FROM login_attempts; COMMIT');
  } catch(error) {db.exec('ROLLBACK');throw error;}
  db.close();
  console.log('Admin password configured. Previous sessions revoked. Sign in at /admin.');
}catch(error){console.error(error.message);process.exitCode=1;}
