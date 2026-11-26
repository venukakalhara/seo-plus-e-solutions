import Script from 'next/script';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import './globals.css';
import './multipage.css';
import './store-admin.css';
import './fonts.css';
import './reference-design.css';
import './home-experience.css';
import './hero-motion.css';
import './improvements.css';
import { site } from '@/lib/site';
import { LanguageProvider } from '@/components/language';

export const metadata: Metadata = {
  metadataBase: new URL(site.url || 'http://localhost:3000'),
  title: { default: 'SEO PLUS — Your next digital advantage', template: '%s | SEO PLUS' },
  description: site.description,
  robots: { index: Boolean(site.url), follow: Boolean(site.url) },
  openGraph: { title: 'SEO PLUS — Your next digital advantage', description: site.description, type: 'website', images: [{ url: '/seo-plus-logo.png', width: 1280, height: 1280, alt: 'SEO PLUS' }] },
  twitter: { card: 'summary', title: 'SEO PLUS E-Solutions', description: site.description },
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const language=(await headers()).get('x-site-language')==='si'?'si':'en';
  const organization={ '@context':'https://schema.org', '@type':'Organization', name:site.name, url:site.url, logo:site.url?`${site.url}/seo-plus-logo.png`:undefined, ...(site.email?{email:site.email}:{}) };
  return <html lang={language}><head><Script src="/browser-compat.js" strategy="beforeInteractive"/></head><body>{site.url&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization).replace(/</g,'\\u003c')}}/>}<LanguageProvider language={language}><a className="skip-link" href="#main">Skip to content / අන්තර්ගතයට යන්න</a>{children}</LanguageProvider></body></html>;
}
