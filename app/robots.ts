import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/** Public website pages are crawlable; the app behind login is not. */
export default function robots(): MetadataRoute.Robots {
  const privateAreas = ['/dashboard', '/admin', '/numbers', '/bots', '/products', '/chats', '/subscribers', '/agents', '/billing', '/reset-password', '/forgot-password'];
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: privateAreas }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
