import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const issues=[];
try { const url=new URL(process.env.NEXT_PUBLIC_SITE_URL);if(url.protocol!=='https:'||['localhost','127.0.0.1'].includes(url.hostname)||url.pathname!=='/')issues.push('Set NEXT_PUBLIC_SITE_URL to the production HTTPS origin, without a path.'); }
catch { issues.push('Set NEXT_PUBLIC_SITE_URL before launching. Without it, indexing remains disabled.'); }
if(!process.env.SEO_DATA_DIR)issues.push('Set SEO_DATA_DIR to persistent server storage and arrange backups.');
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('Launch configuration checks passed. Rebuild after changing public environment values.');
