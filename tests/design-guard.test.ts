import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

// design.md section 12 + section 2: a test that fails if banned patterns appear.
// Guards the whole app/components/lib tree against Tailwind default-palette
// classes, gradients, purple/violet/indigo/neon, and emoji.

const ROOT = join(__dirname, '..');
const DIRS = ['app', 'components', 'lib'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '.next') continue;
      walk(p, out);
    } else if (['.ts', '.tsx', '.css'].includes(extname(p))) {
      out.push(p);
    }
  }
  return out;
}

const files = DIRS.flatMap((d) => walk(join(ROOT, d)));

function walkHtml(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, out);
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
// Tailwind default palette color classes, e.g. bg-blue-500, text-slate-700.
const paletteClass = new RegExp(
  `\\b(?:bg|text|border|ring|fill|stroke|from|via|to|decoration|outline|divide|placeholder)-(?:${PALETTE})-(?:50|[1-9]00|950)\\b`,
);
const gradient = /\b(?:bg-gradient-to-|bg-\[linear-gradient|bg-\[radial-gradient)/;
const linearGradientCss = /(?:linear|radial|conic)-gradient\(/;
const bannedHue = /\b(?:purple|violet|indigo)\b/i;
// Emoji ranges (pictographs, dingbats, flags, variation selectors).
const emoji =
  /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}\u{FE0F}]/u;

describe('design guardrails', () => {
  it('no Tailwind default-palette color classes', () => {
    const hits = files.filter((f) => paletteClass.test(readFileSync(f, 'utf8')));
    expect(hits, `palette classes in:\n${hits.join('\n')}`).toEqual([]);
  });

  it('no gradients', () => {
    const hits = files.filter((f) => {
      const s = readFileSync(f, 'utf8');
      return gradient.test(s) || linearGradientCss.test(s);
    });
    expect(hits, `gradients in:\n${hits.join('\n')}`).toEqual([]);
  });

  it('no purple / violet / indigo', () => {
    const hits = files.filter((f) => bannedHue.test(readFileSync(f, 'utf8')));
    expect(hits, `banned hue in:\n${hits.join('\n')}`).toEqual([]);
  });

  it('no emoji in source', () => {
    const hits = files.filter((f) => emoji.test(readFileSync(f, 'utf8')));
    expect(hits, `emoji in:\n${hits.join('\n')}`).toEqual([]);
  });

  // A13 / design.md: no em dashes in visible text. Allowed only in the <title>
  // metadata (the `title:` property) and in a source citation name. Catches both
  // the literal character and the HTML entities (&mdash; slipped through once).
  const EM_DASH = /—|&mdash;|&#8212;|&#x2014;/i;
  it('no em dash in source body text (literal or entity)', () => {
    const violations: string[] = [];
    for (const f of files) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (!EM_DASH.test(line)) return;
        if (/\btitle:/.test(line)) return; // <title> metadata
        if (/\bname:\s*['"`].*—/.test(line) || /citation/.test(line)) return; // source titles
        violations.push(`${relative(ROOT, f)}:${i + 1}  ${line.trim().slice(0, 80)}`);
      });
    }
    expect(violations, `em dash in body text:\n${violations.join('\n')}`).toEqual([]);
  });

  // The thorough check: scan the full rendered HTML of every exported page for
  // em dashes in the visible body (excluding <head> and <script>, where the
  // <title> metadata and Next.js payload legitimately carry them). This covers
  // body copy produced by templates from data, not just literals in source.
  // Requires a prior `next build`; otherwise it reports that it was skipped.
  const OUT = join(ROOT, 'out');
  const htmlFiles: string[] = existsSync(OUT) ? walkHtml(OUT) : [];
  it('no em dash in any rendered page body', () => {
    if (!htmlFiles.length) {
      console.warn('design-guard: out/ not found — run `npm run build` to scan rendered HTML.');
      return;
    }
    const violations: string[] = [];
    for (const f of htmlFiles) {
      const body = readFileSync(f, 'utf8')
        .replace(/<head[\s\S]*?<\/head>/i, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '');
      if (body.includes('—')) violations.push(relative(ROOT, f));
    }
    expect(violations, `em dash in rendered body of:\n${violations.join('\n')}`).toEqual([]);
  });
});

// Trust pages set their <title> as a literal, which the source scan above skips
// (title: lines are exempt). Check those titles use "X | PawScales", not an em dash.
describe('trust page titles use a pipe, not an em dash', () => {
  const TRUST = [
    'how-we-calculate', 'editorial-policy', 'contact', 'privacy-policy', 'terms',
    'disclaimer', 'affiliate-disclosure', 'sitemap', 'photo-credits',
  ].map((s) => join(ROOT, 'app', s, 'page.tsx'));
  TRUST.push(join(ROOT, 'app', 'authors', 'sikander-malik', 'page.tsx'));

  it('each trust page title is "X | PawScales" with no em dash', () => {
    for (const f of TRUST) {
      expect(existsSync(f), `${relative(ROOT, f)} exists`).toBe(true);
      const m = readFileSync(f, 'utf8').match(/title:\s*'([^']*PawScales[^']*)'/);
      expect(m, `${relative(ROOT, f)} has a PawScales title`).toBeTruthy();
      expect(m![1], `${relative(ROOT, f)} title`).toContain('| PawScales');
      expect(m![1], `${relative(ROOT, f)} title has no em dash`).not.toMatch(/—|&mdash;/);
    }
  });
});
