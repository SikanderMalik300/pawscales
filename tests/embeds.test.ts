import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { EMBED_TOOLS, embedSnippet, isEmbedTool } from '@/lib/embeds';
import { bySlug } from '@/lib/registry';

const ROOT = join(__dirname, '..');

describe('embed snippet', () => {
  it('iframes the embed page but credits the main tool page (the backlink)', () => {
    for (const t of EMBED_TOOLS) {
      const snip = embedSnippet(t);
      // the iframe points at the embed page
      expect(snip).toContain(`src="https://pawscales.com/embed/${t.slug}/"`);
      // the credit <p> links to the MAIN tool page, with plain "PawScales" anchor text
      expect(snip).toContain(`<a href="https://pawscales.com/${t.slug}/">PawScales</a>`);
      // the credit line must not link to the embed page
      const pLine = snip.split('\n').find((l) => l.startsWith('<p'))!;
      expect(pLine, `${t.slug} credit line`).not.toContain('/embed/');
    }
  });
  it('covers the embeddable tools, which all exist in the registry', () => {
    expect(EMBED_TOOLS.length).toBe(6);
    for (const t of EMBED_TOOLS) expect(bySlug(t.slug), t.slug).toBeTruthy();
    expect(isEmbedTool('dog-years-calculator')).toBe(true);
    expect(isEmbedTool('dog-heat-cycle-calculator')).toBe(true);
    expect(isEmbedTool('benadryl-dosage-calculator')).toBe(false);
  });
});

describe('framing headers', () => {
  const headers = readFileSync(join(ROOT, 'public', '_headers'), 'utf8');
  it('allows framing on /embed/* and removes X-Frame-Options there', () => {
    const embedBlock = headers.slice(headers.indexOf('/embed/*'));
    expect(embedBlock).toMatch(/Content-Security-Policy:\s*frame-ancestors \*/);
    expect(embedBlock).toMatch(/!\s*X-Frame-Options/);
  });
  it('keeps every other page unframeable (global X-Frame-Options SAMEORIGIN)', () => {
    const globalBlock = headers.slice(0, headers.indexOf('/embed/*'));
    expect(globalBlock).toMatch(/X-Frame-Options:\s*SAMEORIGIN/);
  });
});

// Rendered-HTML checks (need a prior `next build`).
const OUT = join(ROOT, 'out');
describe('embed pages (rendered)', () => {
  it('each embed page is noindex, credits the tool page, and has no site chrome', () => {
    if (!existsSync(OUT)) {
      console.warn('embeds: out/ not found; run `npm run build` to scan rendered HTML.');
      return;
    }
    for (const t of EMBED_TOOLS) {
      const f = join(OUT, 'embed', t.slug, 'index.html');
      expect(existsSync(f), `${t.slug} embed page built`).toBe(true);
      const html = readFileSync(f, 'utf8');
      expect(html, `${t.slug} noindex`).toMatch(/name="robots" content="noindex/);
      expect(html, `${t.slug} canonical`).toContain(`rel="canonical" href="https://pawscales.com/${t.slug}/"`);
      expect(html, `${t.slug} credit`).toContain('Calculator by');
      expect(html, `${t.slug} credit link`).toContain(`href="https://pawscales.com/${t.slug}/"`);
      // chrome-free: the site footer tagline must be absent
      expect(html, `${t.slug} no footer`).not.toContain('Free dog and cat calculators, built on real data');
    }
  });
});
