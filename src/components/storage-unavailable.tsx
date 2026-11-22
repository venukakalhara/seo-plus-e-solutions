'use client';
import { Header, Footer } from './chrome';
import { useLanguage } from './language';
import { site } from '@/lib/site';
export function StorageUnavailable({admin=false}:{admin?:boolean}) {
 const {t}=useLanguage();
 return <><Header/><main id="main" className="container article-page"><h1>{t('Temporarily unavailable','තාවකාලිකව ලබාගත නොහැක')}</h1><p role="status">{t('Our online catalogue and saved records are currently unavailable. Please contact us on WhatsApp for assistance.','අපගේ අන්තර්ජාල නාමාවලිය සහ සුරැකි වාර්තා දැනට ලබාගත නොහැක. සහාය සඳහා WhatsApp හරහා අප අමතන්න.')}</p>{admin&&<p>Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel environment settings, then redeploy. Use a Turso libSQL database with this adapter. Do not use /tmp for orders or admin accounts.</p>}<a className="button button-gold" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">{t('Contact us on WhatsApp','WhatsApp හරහා අමතන්න')}</a></main><Footer/></>;
}
