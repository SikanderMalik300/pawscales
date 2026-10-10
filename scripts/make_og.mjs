// Build-time OG images (design.md v2 section 8): 1200x630, left hub-color block
// with the page title, right the page photo. No gradient, no emoji.
import { mkdir, writeFile } from 'node:fs/promises';
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
      <rect x="64" y="60" width="26" height="26" rx="6" fill="#1F5C45"/>
      <text x="100" y="80" font-size="24" font-weight="600" fill="#111312" letter-spacing="-0.5">PawScales</text>
      <text font-size="54" font-weight="500" fill="#111312" letter-spacing="-1">${tspans}</text>
      <text x="64" y="570" font-size="22" fill="#5E6360">pawscales.com · built on real data</text>
    </g>
  </svg>`);
}

await mkdir(OUT, { recursive: true });
let n = 0;
for (const p of PAGES) {
  const photoPath = join(SRC, `${p.photo}.jpg`);
  const right = existsSync(photoPath)
    ? await sharp(photoPath).resize(600, 630, { fit: 'cover', position: 'attention' }).toBuffer()
    : await sharp({ create: { width: 600, height: 630, channels: 3, background: '#F5F3EF' } }).jpeg().toBuffer();

  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#FFFFFF' } })
    .composite([
      { input: leftSvg(p.title, p.color), top: 0, left: 0 },
      { input: right, top: 0, left: 600 },
    ])
    .png()
    .toFile(join(OUT, `${p.slug}.png`));
  n++;
}
console.log(`Wrote ${n} OG images to public/og/`);
