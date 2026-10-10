import type { Metadata } from 'next';
import { SITE, type ToolEntry } from '@/lib/registry';

/** Per-tool metadata, including the build-time OG image (public/og/<slug>.png). */
export function toolMetadata(tool: ToolEntry): Metadata {
  const url = `${SITE.url}/${tool.slug}/`;
  const og = `/og/${tool.slug}.png`;
  return {
    title: tool.title,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.metaDescription,
      url,
      type: 'website',
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [og] },
  };
}
