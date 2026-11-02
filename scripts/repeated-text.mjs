// Finds paragraphs of 25+ words that repeat (identically or almost) on 3+ pages,
// excluding site chrome (header/nav/footer), the author box, and the disclaimer
// lines (day-15 Task 3). Shared by the CLI below and tests/repeated-text.test.ts.
//
// "Almost identical" is detected by a shared run of words: two paragraphs that
// share any 10-word normalised phrase are treated as the same template text, so
// breed paragraphs that differ only by the breed name still cluster together.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MIN_WORDS = 25;
export const MIN_PAGES = 3;
const SHINGLE = 10; // length of the shared phrase that links two paragraphs

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ',
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&ndash;': '–', '&mdash;': '—', '&middot;': '·', '&hellip;': '…',
  '&#39;': "'", '&#8217;': '’', '&#8211;': '–', '&deg;': '°',
};

const decode = (s) =>
  s.replace(/&#x?[0-9a-f]+;|&[a-z]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m);

/** Visible text of a <p>/<li> inner-HTML: drop tags, decode entities, collapse. */
function cleanText(inner) {
  return decode(inner.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Lower-case, strip punctuation, collapse spaces: the comparison form. */
export const normalize = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

export const wordCount = (s) => (normalize(s) ? normalize(s).split(' ').length : 0);

/** The disclaimer box/lines are excluded by the task, as is anything left from
 *  chrome. A paragraph counts if it is long enough and is not a disclaimer line. */
const isDisclaimer = (text) =>
  /veterinary advice|medical disclaimer|not a diagnosis/i.test(text);

/** Extract candidate paragraphs from one page's rendered HTML. */
export function paragraphsFromHtml(html) {
  const body = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '') // author box + note asides
    // The Sources list is bibliographic: the same paper is cited identically on
    // every page that uses it, which is correct, not template duplication.
    .replace(/<section id="sources"[\s\S]*?<\/section>/gi, '');

  const out = [];
  for (const m of body.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = cleanText(m[2]);
    if (!text || isDisclaimer(text)) continue;
    if (wordCount(text) >= MIN_WORDS) out.push(text);
  }
  return out;
}

function shingles(normWords) {
  const set = new Set();
  for (let i = 0; i + SHINGLE <= normWords.length; i++) {
    set.add(normWords.slice(i, i + SHINGLE).join(' '));
  }
  return set;
}

/** pages: [{ id, html }]. Returns clusters of near-identical paragraphs that
 *  span >= MIN_PAGES distinct pages, worst (most pages) first. Two paragraphs are
 *  "the same template text" when they share at least `threshold` of the shorter
 *  one's 10-word phrases, so a single shared safety sentence will not merge two
 *  otherwise-different paragraphs, but a breed paragraph that differs only by the
 *  breed name still clusters. */
export function findRepeats(pages, { minPages = MIN_PAGES, threshold = 0.5 } = {}) {
  // Flatten to paragraph records, each with its set of 10-word phrases.
  const recs = [];
  for (const { id, html } of pages) {
    for (const text of paragraphsFromHtml(html)) {
      recs.push({ id, text, sh: shingles(normalize(text).split(' ')) });
    }
  }

  const parent = recs.map((_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };

  for (let i = 0; i < recs.length; i++) {
    for (let j = i + 1; j < recs.length; j++) {
      if (find(i) === find(j)) continue;
      const a = recs[i].sh, b = recs[j].sh;
      if (!a.size || !b.size) continue;
      const [small, big] = a.size <= b.size ? [a, b] : [b, a];
      let inter = 0;
      for (const s of small) if (big.has(s)) inter++;
      if (inter / small.size >= threshold) union(i, j);
    }
  }

  // Gather clusters.
  const clusters = new Map();
  recs.forEach((r, i) => {
    const root = find(i);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root).push(r);
  });

  const result = [];
  for (const members of clusters.values()) {
    const pageIds = [...new Set(members.map((m) => m.id))];
    if (pageIds.length < minPages) continue;
    // representative = the longest variant
    const sample = members.slice().sort((a, b) => b.text.length - a.text.length)[0].text;
    const variants = [...new Map(members.map((m) => [m.id, m.text])).entries()]
      .map(([id, text]) => ({ id, text }));
    result.push({ pages: pageIds.sort(), count: pageIds.length, words: wordCount(sample), sample, variants });
  }
  return result.sort((a, b) => b.count - a.count || b.words - a.words);
}

// ---- CLI: scan the built out/ directory and print a report ----
function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Load out/ pages as [{id, html}], optionally excluding path fragments. */
export function loadOutPages(outDir, { exclude = [] } = {}) {
  if (!existsSync(outDir)) return [];
  return walkHtml(outDir)
    .filter((f) => f.endsWith(`${sep}index.html`) || f.endsWith('/index.html'))
    .map((f) => ({ id: '/' + relative(outDir, f).replace(/\\/g, '/').replace(/index\.html$/, ''), file: f }))
    .filter((p) => !exclude.some((x) => p.id.includes(x)))
    .map((p) => ({ id: p.id, html: readFileSync(p.file, 'utf8') }));
}

function main() {
  const outDir = join(process.cwd(), 'out');
  if (!existsSync(outDir)) {
    console.error('out/ not found. Run `npm run build` first.');
    process.exit(1);
  }
  // Report on everything except embeds and the dev /design/ page.
  const pages = loadOutPages(outDir, { exclude: ['/embed/', '/design/'] });
  const repeats = findRepeats(pages);
  console.log(`Scanned ${pages.length} pages. Paragraphs of ${MIN_WORDS}+ words repeating on ${MIN_PAGES}+ pages:\n`);
  if (!repeats.length) { console.log('None.'); return; }
  repeats.forEach((r, i) => {
    console.log(`#${i + 1}  ${r.count} pages, ~${r.words} words`);
    console.log(`  pages: ${r.pages.join(', ')}`);
    console.log(`  text:  ${r.sample}\n`);
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
