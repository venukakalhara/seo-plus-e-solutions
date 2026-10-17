import type { Metadata } from 'next';
import './globals.css';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url || 'http://localhost:3000'),
  title: { default: 'SEO PLUS — Your next digital advantage', template: '%s | SEO PLUS' },
  description: site.description,
  robots: { index: Boolean(site.url), follow: Boolean(site.url) },
  openGraph: { title: 'SEO PLUS — Your next digital advantage', description: site.description, type: 'website', images: [{ url: '/seo-plus-logo.png', width: 1280, height: 1280, alt: 'SEO PLUS' }] },
  twitter: { card: 'summary', title: 'SEO PLUS E-Solutions', description: site.description },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
