import type { MetadataRoute } from 'next';
import { articles, site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return site.url ? [{ url: site.url }, ...articles.map(a => ({ url: `${site.url}/blog/${a.slug}` }))] : [];
}
