import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
const local=new DatabaseSync(':memory:');
const unused=path.resolve('state',`cloud-test-${randomUUID()}`);
Object.assign(process.env,{VERCEL:'1',SEO_DATA_DIR:unused,TURSO_DATABASE_URL:'libsql://test-only.turso.io',TURSO_AUTH_TOKEN:'test-only-token'});
let connections=0;let failing=false;let options;
function execute(statement){const {sql,args=[]}=typeof statement==='string'?{sql:statement}:statement;return {rows:local.prepare(sql).all(...args)};}
mock.module('@libsql/client/web',{namedExports:{createClient(config){connections++;options=config;return {
 async execute(statement){if(failing)throw new Error('secret-test-only-token');return execute(statement);},
 async batch(statements){local.exec('BEGIN');try{const values=statements.map(execute);local.exec('COMMIT');return values;}catch(error){local.exec('ROLLBACK');throw error;}},
 close(){},
};}}});
const {getDatabase,StorageUnavailableError}=await import('../src/lib/database-client.mjs');
const [first,second]=await Promise.all([getDatabase(),getDatabase()]);
assert.equal(first,second);assert.equal(connections,1);assert.equal(options.url,'https://test-only.turso.io');assert.equal(options.authToken,'test-only-token');
await first.execute({sql:'INSERT INTO records(id,kind,value) VALUES(?,?,?)',args:['one','enquiry',JSON.stringify({name:"Customer's name"})]});
assert.equal((await second.execute('SELECT COUNT(*) AS count FROM records')).rows[0].count,1);
await assert.rejects(first.batch([{sql:'INSERT INTO records VALUES(?,?,?)',args:['two','order','{}']},'INSERT INTO missing_table VALUES(1)']),StorageUnavailableError);
assert.equal((await first.execute('SELECT COUNT(*) AS count FROM records')).rows[0].count,1,'Cloud writes must roll back as one batch');
failing=true;await assert.rejects(first.execute('SELECT 1'),error=>error instanceof StorageUnavailableError&&!error.message.includes('token'));
assert.equal(existsSync(unused),false,'Cloud mode must not create local storage');first.close();local.close();mock.restoreAll();
console.log('PASS: cloud adapter selection, shared initialization, bound values, atomic batch and sanitized failures (mock SDK; no live cloud account).');
