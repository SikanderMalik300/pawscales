import type { MetadataRoute } from 'next';
import { REGISTRY, BREED_PAGES, HUBS, SITE } from '@/lib/registry';

export const dynamic = 'force-static';

const LAUNCH = '2026-10-10';

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${SITE.url}${path}`;

  const staticPages = [
    { path: '/', pr: 1.0 },
    { path: '/about/', pr: 0.5 },
    { path: '/how-we-calculate/', pr: 0.5 },
    { path: '/editorial-policy/', pr: 0.4 },
    { path: '/authors/sikander-malik/', pr: 0.4 },
    { path: '/contact/', pr: 0.4 },
    { path: '/privacy-policy/', pr: 0.3 },
    { path: '/terms/', pr: 0.3 },
    { path: '/disclaimer/', pr: 0.3 },
    { path: '/affiliate-disclosure/', pr: 0.3 },
    { path: '/sitemap/', pr: 0.3 },
    { path: '/photo-credits/', pr: 0.3 },
  ];

  return [
    ...staticPages.map((p) => ({
      url: u(p.path),
      lastModified: LAUNCH,
      changeFrequency: 'monthly' as const,
      priority: p.pr,
    })),
    ...HUBS.map((h) => ({
      url: u(`/${h.slug}/`),
      lastModified: LAUNCH,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...REGISTRY.map((t) => ({
      url: u(`/${t.slug}/`),
      lastModified: t.lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...BREED_PAGES.map((t) => ({
      url: u(`/${t.slug}/`),
      lastModified: t.lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
