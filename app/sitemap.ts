import type { MetadataRoute } from 'next';
import { REGISTRY, BREED_PAGES, HUBS, SITE } from '@/lib/registry';

export const dynamic = 'force-static';

const LAUNCH = '2026-10-10';

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${SITE.url}${path}`;

  const staticPages: { path: string; pr: number; lm?: string }[] = [
    { path: '/', pr: 1.0 },
    { path: '/about/', pr: 0.5 },
    { path: '/how-we-calculate/', pr: 0.5 },
    { path: '/editorial-policy/', pr: 0.4 },
    // Author page rewritten 2026-11-03 (honest bio, corrections log, Person schema).
    { path: '/authors/sikander-malik/', pr: 0.4, lm: '2026-11-03' },
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
      lastModified: p.lm ?? LAUNCH,
      changeFrequency: 'monthly' as const,
      priority: p.pr,
    })),
    // The /embed/ index only; the five iframe pages are noindex, so they stay out.
    { url: u('/embed/'), lastModified: '2026-10-22', changeFrequency: 'monthly' as const, priority: 0.5 },
    ...HUBS.map((h) => ({
      url: u(`/${h.slug}/`),
      // dog-size-charts intro edited 2026-10-23 (added Cavapoo/Labradoodle links).
      lastModified: h.slug === 'dog-size-charts' ? '2026-10-23' : LAUNCH,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Medication dosing pages carry medicalIndexable:false and are left out of the
    // sitemap (so IndexNow, which reads this sitemap, does not resubmit them either)
    // while they are noindexed pending a vet review.
    ...REGISTRY.filter((t) => t.medicalIndexable !== false).map((t) => ({
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
