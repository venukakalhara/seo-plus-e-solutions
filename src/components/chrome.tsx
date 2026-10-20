'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { LanguageSwitch, useLanguage } from './language';
import { site } from '@/lib/site';
export const navigation = [['', 'Home', 'මුල් පිටුව'], ['about', 'About', 'අප ගැන'], ['services', 'Services', 'සේවා'], ['solutions', 'Solutions', 'විසඳුම්'], ['store', 'Store', 'වෙළඳසැල'], ['projects', 'Projects', 'ව්‍යාපෘති'], ['blog', 'Blog', 'ලිපි'], ['contact', 'Contact', 'අමතන්න']];
export function Brand() { return <Link href="/" className="brand" aria-label="SEO PLUS home"><svg className="brand-art" viewBox="70 365 1140 520" role="img" aria-label="SEO PLUS" preserveAspectRatio="xMidYMid meet"><image href="/seo-plus-logo.png" width="1280" height="1280"/></svg></Link>; }
export function Header() {
 const { t } = useLanguage(); const path = usePathname(); const [open, setOpen] = useState(false);
 return <header className="site-header"><div className="container header-inner"><Brand/><nav id="main-navigation" aria-label={t('Main navigation', 'ප්‍රධාන මෙනුව')} className={`navigation ${open ? 'is-open' : ''}`} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); document.getElementById('navigation-toggle')?.focus(); } }}>{navigation.map(([slug,en,si]) => <Link href={`/${slug}`} key={slug} aria-current={path === `/${slug}` ? 'page' : undefined} onClick={() => setOpen(false)}>{t(en,si)}</Link>)}</nav><div className="header-tools"><LanguageSwitch/><Link className="nav-cta quote-link" href="/contact">{t('Get a Quote','මිල විමසන්න')} <ArrowRight size={16}/></Link><button id="navigation-toggle" className="menu-toggle" aria-controls="main-navigation" aria-expanded={open} aria-label={t(open ? 'Close menu' : 'Open menu',open ? 'මෙනුව වසන්න' : 'මෙනුව අරින්න')} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></div></header>;
}
export function Footer() {
 const {t}=useLanguage();
 return <footer className="expanded-footer"><div className="reference-container"><div className="footer-columns">
  <div className="footer-brand-column"><Brand/><p>{t('Technology, creativity and strategy. Connected to move your business forward.','ඔබේ ව්‍යාපාරය ඉදිරියට ගෙන යන තාක්ෂණය, නිර්මාණශීලීත්වය සහ උපායමාර්ග.')}</p><span className="footer-brand-line">YOUR NEXT DIGITAL ADVANTAGE.</span></div>
  <nav aria-label={t('Explore the website','වෙබ් අඩවිය ගවේෂණය කරන්න')}><h3>{t('Explore','ගවේෂණය කරන්න')}</h3>{[['/about','About us','අප ගැන'],['/solutions','Solutions','විසඳුම්'],['/projects','Projects','ව්‍යාපෘති'],['/blog','Insights','ලිපි']].map(([url,en,si])=><Link key={url} href={url}>{t(en,si)}</Link>)}</nav>
  <nav aria-label={t('Services and store','සේවා සහ වෙළඳසැල')}><h3>{t('What we do','අපගේ සේවා')}</h3>{[['/services','Digital services','ඩිජිටල් සේවා'],['/store','Software store','මෘදුකාංග වෙළඳසැල'],['/contact','Get a quote','මිල විමසන්න']].map(([url,en,si])=><Link key={url} href={url}>{t(en,si)}</Link>)}</nav>
  <div className="footer-contact-column"><h3>{t('Let’s connect','සම්බන්ධ වෙමු')}</h3><p>{t('Have something in mind? We’d love to hear it.','ඔබේ සිතේ අදහසක් තියෙනවාද? අප සමඟ කතා කරන්න.')}</p><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">+94 77 971 3652 <ArrowRight size={16}/></a>{site.email&&<a href={`mailto:${site.email}`}>{site.email}</a>}</div>
 </div><div className="footer-legal"><span>© {new Date().getFullYear()} SEO PLUS E-Solutions.</span><Link href="/privacy">{t('Privacy','පෞද්ගලිකත්වය')}</Link><a href="#">{t('Back to top ↑','ඉහළට ↑')}</a></div></div></footer>;
}
