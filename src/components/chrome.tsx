'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { LanguageSwitch, useLanguage } from './language';
export const navigation = [['', 'Home', 'මුල් පිටුව'], ['about', 'About', 'අප ගැන'], ['services', 'Services', 'සේවා'], ['solutions', 'Solutions', 'විසඳුම්'], ['store', 'Store', 'වෙළඳසැල'], ['projects', 'Projects', 'ව්‍යාපෘති'], ['blog', 'Blog', 'ලිපි'], ['contact', 'Contact', 'අමතන්න']];
export function Brand() { return <Link href="/" className="brand" aria-label="SEO PLUS home"><span className="brand-crop"><Image src="/seo-plus-logo.png" alt="SEO PLUS" width={1280} height={1280} priority sizes="150px"/></span></Link>; }
export function Header() {
 const { t } = useLanguage(); const path = usePathname(); const [open, setOpen] = useState(false);
 return <header className="site-header"><div className="container header-inner"><Brand/><nav id="main-navigation" aria-label={t('Main navigation', 'ප්‍රධාන මෙනුව')} className={`navigation ${open ? 'is-open' : ''}`} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); document.getElementById('navigation-toggle')?.focus(); } }}>{navigation.map(([slug,en,si]) => <Link href={`/${slug}`} key={slug} aria-current={path === `/${slug}` ? 'page' : undefined} onClick={() => setOpen(false)}>{t(en,si)}</Link>)}</nav><div className="header-tools"><LanguageSwitch/><Link className="nav-cta quote-link" href="/contact">{t('Get a Quote','මිල විමසන්න')} <ArrowRight size={16}/></Link><button id="navigation-toggle" className="menu-toggle" aria-controls="main-navigation" aria-expanded={open} aria-label={t(open ? 'Close menu' : 'Open menu',open ? 'මෙනුව වසන්න' : 'මෙනුව අරින්න')} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></div></header>;
}
export function Footer() { const {t} = useLanguage(); return <footer className="footer container"><div className="footer-top"><div><Brand/><p>{t('Technology. Creativity. Growth.','තාක්ෂණය. නිර්මාණශීලීත්වය. වර්ධනය.')}</p></div><Link className="footer-contact" href="/contact">{t('Let’s build your next chapter.','ඔබේ ඊළඟ පියවර එක්ව ගොඩනඟමු.')} <ArrowRight/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SEO PLUS E-Solutions.</span><Link href="/services">{t('Our services','අපගේ සේවා')}</Link><Link href="/contact">{t('Contact','අමතන්න')}</Link><Link href="/privacy">{t('Privacy','පෞද්ගලිකත්වය')}</Link></div></footer>; }
