import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', ...(site.url ? { allow: '/', disallow: ['/admin', '/si/admin', '/api/', '/track-order', '/si/track-order'] } : { disallow: '/' }) }, ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}) };
}
