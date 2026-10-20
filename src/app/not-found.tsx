'use client';
import Link from 'next/link';
import { Header, Footer } from '@/components/chrome';
import { useLanguage } from '@/components/language';
export default function NotFound(){const {t}=useLanguage();return <><Header/><main id="main" className="container article-page"><div className="eyebrow">404</div><h1>{t('Page not found.','පිටුව හමු නොවීය.')}</h1><p>{t('Please return to the home page to continue.','ඉදිරියට යාමට මුල් පිටුවට ආපසු යන්න.')}</p><Link className="button button-gold" href="/">{t('Back to SEO PLUS','SEO PLUS වෙත ආපසු')}</Link></main><Footer/></>;}
