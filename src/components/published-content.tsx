'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from './language';
import { Header, Footer } from './chrome';
import type { Entry } from '@/lib/store-types';
export function PublishedContent({entries}:{entries:Entry[]}) {
 const {t}=useLanguage();
 if(!entries.length)return null;
 return <section className="container page-content"><div className="eyebrow">{t('LATEST FROM SEO PLUS','SEO PLUS වෙතින් අලුත්ම දේ')}</div><div className="store-grid">{entries.map(e=><article className="managed-content-card" key={e.id}><h2>{t(e.title,e.titleSi)}</h2><p>{t(e.summary,e.summarySi)}</p><Link className="text-link" href={`/updates/${e.id}`}>{t('Read more','තව කියවන්න')}<ArrowRight size={16}/></Link></article>)}</div></section>;
}
export function PublishedEntry({entry}:{entry:Entry}) {const {t}=useLanguage();return <><Header/><main id="main" className="container article-page"><Link className="text-link" href={entry.kind==='blog'?'/blog':'/projects'}>{t('← Back','← ආපසු')}</Link><h1>{t(entry.title,entry.titleSi)}</h1><p className="lede">{t(entry.summary,entry.summarySi)}</p>{t(entry.body,entry.bodySi).split(/\n\s*\n/).map((p,i)=><p className="entry-paragraph" key={i}>{p}</p>)}</main><Footer/></>;}
