import type { MetadataRoute } from 'next';
import { articles, site } from '@/lib/site';
import { records } from '@/lib/database';
import type { Entry } from '@/lib/store-types';
export const dynamic='force-dynamic';
export default function sitemap(): MetadataRoute.Sitemap {
  return site.url ? ['', '/about', '/services', '/solutions', '/store', '/projects', '/blog', '/contact', '/privacy', ...articles.map(a => `/blog/${a.slug}`), ...records<Entry>('entry').filter(e=>e.published).map(e=>`/updates/${e.id}`)].flatMap(path => ['', '/si'].map(prefix => ({ url: `${site.url}${prefix}${path}`, alternates: { languages: { en: `${site.url}${path}`, si: `${site.url}/si${path}` } } }))) : [];
}
