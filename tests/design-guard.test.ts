import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

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
});
