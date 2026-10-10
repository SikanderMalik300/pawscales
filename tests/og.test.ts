import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REGISTRY, HUBS } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';

const OG = join(__dirname, '..', 'public', 'og');

describe('every page has an OG image', () => {
  it('each registry tool exposes og:image and twitter:image', () => {
    for (const tool of REGISTRY) {
      const md = toolMetadata(tool);
      const og = (md.openGraph as any)?.images?.[0]?.url;
      const tw = (md.twitter as any)?.images?.[0];
      expect(og, `${tool.slug} og:image`).toBe(`/og/${tool.slug}.png`);
      expect(tw, `${tool.slug} twitter:image`).toBe(`/og/${tool.slug}.png`);
    }
  });

  it('the OG image file exists for every tool, hub, home and default', () => {
    const slugs = [
      ...REGISTRY.map((t) => t.slug),
      ...HUBS.map((h) => h.slug),
      'home',
      'default',
    ];
    const missing = slugs.filter((s) => !existsSync(join(OG, `${s}.png`)));
    expect(missing, `missing OG images: ${missing.join(', ')}`).toEqual([]);
  });
});
