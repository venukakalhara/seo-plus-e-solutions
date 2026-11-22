import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const issues=[];
const cloud=Boolean(process.env.TURSO_DATABASE_URL&&process.env.TURSO_AUTH_TOKEN);
if(Boolean(process.env.TURSO_DATABASE_URL)!==Boolean(process.env.TURSO_AUTH_TOKEN))issues.push('Set both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
if(cloud){try{if(!['libsql:','https:'].includes(new URL(process.env.TURSO_DATABASE_URL).protocol))throw new Error();}catch{issues.push('TURSO_DATABASE_URL must be a libsql:// or https:// database URL.');}}
if(!cloud&&(process.env.VERCEL==='1'||process.env.AWS_LAMBDA_FUNCTION_NAME))issues.push('Configure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN for serverless hosting. Do not set SEO_DATA_DIR to /tmp.');
try { const url=new URL(process.env.NEXT_PUBLIC_SITE_URL);if(url.protocol!=='https:'||['localhost','127.0.0.1'].includes(url.hostname)||url.pathname!=='/')issues.push('Set NEXT_PUBLIC_SITE_URL to the production HTTPS origin, without a path.'); }
catch { issues.push('Set NEXT_PUBLIC_SITE_URL before launching. Without it, indexing remains disabled.'); }
if(!cloud&&!process.env.SEO_DATA_DIR)issues.push('Set SEO_DATA_DIR to persistent server storage and arrange backups.');
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('Launch configuration checks passed. Rebuild after changing public environment values.');
