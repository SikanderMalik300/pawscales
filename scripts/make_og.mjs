// Build-time OG images (design.md v2 section 8): 1200x630, left hub-color block
// with the page title, right the page photo. No gradient, no emoji.
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = join(process.cwd(), 'scripts', 'photo-src');
const OUT = join(process.cwd(), 'public', 'og');

const HUB = { dog: '#DDEBDF', cat: '#DCE9F2', size: '#F4E9C8', home: '#E9F2B5' };

// slug (file name) -> { title, color, photo }
const PAGES = [
  { slug: 'home', title: 'Free dog and cat calculators, built on real data', color: HUB.home, photo: 'hero' },
  { slug: 'puppy-weight-calculator', title: 'Puppy Weight Calculator', color: HUB.dog, photo: 'puppy-weight-calculator' },
  { slug: 'dog-pregnancy-calculator', title: 'Dog Pregnancy Calculator', color: HUB.dog, photo: 'dog-pregnancy-calculator' },
  { slug: 'dog-years-calculator', title: 'Dog Years Calculator', color: HUB.dog, photo: 'dog-years-calculator' },
  { slug: 'dog-food-calculator', title: 'Dog Food Calculator', color: HUB.dog, photo: 'dog-food-calculator' },
  { slug: 'raw-dog-food-calculator', title: 'Raw Dog Food Calculator', color: HUB.dog, photo: 'raw-dog-food-calculator' },
  { slug: 'dog-heat-cycle-calculator', title: 'Dog Heat Cycle Calculator', color: HUB.dog, photo: 'dog-heat-cycle-calculator' },
  { slug: 'cat-years-calculator', title: 'Cat Years Calculator', color: HUB.cat, photo: 'cat-years-calculator' },
  { slug: 'kitten-age-chart', title: 'Kitten Age Chart', color: HUB.cat, photo: 'kitten-age-chart' },
  { slug: 'cat-food-calculator', title: 'Cat Food Calculator', color: HUB.cat, photo: 'cat-food-calculator' },
  { slug: 'dog-crate-size-chart', title: 'Dog Crate Size Chart', color: HUB.size, photo: 'dog-crate-size-chart' },
  { slug: 'dog-collar-size-chart', title: 'Dog Collar Size Chart', color: HUB.size, photo: 'dog-collar-size-chart' },
  { slug: 'dog-harness-size-chart', title: 'Dog Harness Size Chart', color: HUB.size, photo: 'dog-harness-size-chart' },
  { slug: 'dog-calculators', title: 'Dog calculators', color: HUB.dog, photo: 'hub-dog' },
  { slug: 'cat-calculators', title: 'Cat calculators', color: HUB.cat, photo: 'hub-cat' },
  { slug: 'dog-size-charts', title: 'Dog size charts', color: HUB.size, photo: 'hub-size' },
  { slug: 'golden-retriever-weight-chart', title: 'Golden Retriever Weight Chart', color: HUB.size, photo: 'golden-retriever-weight-chart' },
  { slug: 'german-shepherd-weight-chart', title: 'German Shepherd Weight Chart', color: HUB.size, photo: 'german-shepherd-weight-chart' },
  { slug: 'default', title: 'Free dog and cat calculators, built on real data', color: HUB.home, photo: 'hero' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(title, max = 20) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 4);
}

function leftSvg(title, color) {
  const lines = wrap(title);
  const startY = 315 - (lines.length - 1) * 33;
  const tspans = lines
    .map((l, i) => `<tspan x="64" y="${startY + i * 66}">${esc(l)}</tspan>`)
    .join('');
  return Buffer.from(`
  <svg width="600" height="630" viewBox="0 0 600 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="630" fill="${color}"/>
    <g font-family="Helvetica, Arial, sans-serif">
      <text x="120" y="82" font-size="26" font-weight="600" fill="#111312" letter-spacing="-0.5">PawScales</text>
      <text font-size="54" font-weight="500" fill="#111312" letter-spacing="-1">${tspans}</text>
      <text x="64" y="570" font-size="22" fill="#5E6360">pawscales.com · built on real data</text>
    </g>
  </svg>`);
}

// The brand mark (pawscales-mark.svg), rendered once and composited top-left.
const markSvg = await readFile(join(process.cwd(), 'public', 'pawscales-mark.svg'));
const markPng = await sharp(markSvg, { density: 300 }).resize(44, 44).png().toBuffer();

// Focal points (id -> {fx, fy}) read from lib/data/photos.ts so OG crops match
// the on-page crops. The OG photo panel is 600x630; we crop around the focal point.
const photosSrc = await readFile(join(process.cwd(), 'lib', 'data', 'photos.ts'), 'utf8');
const FOCAL = {};
for (const m of photosSrc.matchAll(/id:\s*'([^']+)',[\s\S]*?focalX:\s*([0-9.]+),\s*focalY:\s*([0-9.]+),/g)) {
  FOCAL[m[1]] = { fx: Number(m[2]), fy: Number(m[3]) };
}

async function focalCrop(path, fx, fy, W = 600, H = 630) {
  const meta = await sharp(path).metadata();
  const scale = Math.max(W / meta.width, H / meta.height);
  const sw = Math.round(meta.width * scale);
  const sh = Math.round(meta.height * scale);
  const left = Math.round(Math.min(Math.max(fx * sw - W / 2, 0), sw - W));
  const top = Math.round(Math.min(Math.max(fy * sh - H / 2, 0), sh - H));
  return sharp(path).resize(sw, sh).extract({ left, top, width: W, height: H }).toBuffer();
}

await mkdir(OUT, { recursive: true });
let n = 0;
for (const p of PAGES) {
  const photoPath = join(SRC, `${p.photo}.jpg`);
  const focal = FOCAL[p.photo] ?? { fx: 0.5, fy: 0.5 };
  const right = existsSync(photoPath)
    ? await focalCrop(photoPath, focal.fx, focal.fy)
    : await sharp({ create: { width: 600, height: 630, channels: 3, background: '#F5F3EF' } }).jpeg().toBuffer();

  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#FFFFFF' } })
    .composite([
      { input: leftSvg(p.title, p.color), top: 0, left: 0 },
      { input: markPng, top: 50, left: 64 },
      { input: right, top: 0, left: 600 },
    ])
    .png()
    .toFile(join(OUT, `${p.slug}.png`));
  n++;
}
console.log(`Wrote ${n} OG images to public/og/`);
