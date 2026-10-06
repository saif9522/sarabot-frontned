import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { SOLUTIONS } from '@/components/site/solutions';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly') =>
    ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page('', 1, 'weekly'),
    page('/pricing', 0.9, 'weekly'),
    page('/solutions', 0.9),
    ...SOLUTIONS.map((s) => page(`/solutions/${s.slug}`, 0.85)),
    page('/how-it-works', 0.8),
    page('/whatsapp-web', 0.8),
    page('/about', 0.6),
    page('/signup', 0.6),
    page('/login', 0.4, 'yearly'),
    page('/privacy', 0.3, 'yearly'),
    page('/terms', 0.3, 'yearly'),
    page('/refund-policy', 0.3, 'yearly'),
  ];
}
