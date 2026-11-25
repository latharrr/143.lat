import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { launched } from '@/content/services';
import { WORK } from '@/content/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/services', '/work', '/about', '/contact', ...launched.map(s => `/services/${s.slug}`), ...WORK.map(w => `/work/${w.slug}`)];
  return paths.map(p => ({ url: `${SITE.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : p.startsWith('/services/') ? 0.9 : 0.7 }));
}
