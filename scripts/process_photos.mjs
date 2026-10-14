// Process source photos into responsive AVIF/WebP/JPEG derivatives
// (design.md v2 section 8). Reads scripts/photo-src/<id>.jpg, writes
// public/photos/<id>-<crop>-<w>.{avif,webp,jpg} using a focal-point cover crop.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

// Keep focal points in sync with lib/data/photos.ts
const PHOTOS = [
  ['hero', 0.5, 0.4, ['hero', 'ld', 'sq']],
  ['puppy-weight-calculator', 0.45, 0.78, ['sq', 'ld']],
  ['dog-pregnancy-calculator', 0.45, 0.5, ['sq', 'ld']],
  ['dog-years-calculator', 0.5, 0.4, ['sq', 'ld']],
  ['dog-food-calculator', 0.5, 0.5, ['sq', 'ld']],
  ['raw-dog-food-calculator', 0.4, 0.45, ['sq', 'ld']],
  ['dog-heat-cycle-calculator', 0.5, 0.5, ['sq', 'ld']],
  ['cat-years-calculator', 0.55, 0.4, ['sq', 'ld']],
  ['kitten-age-chart', 0.38, 0.5, ['sq', 'ld']],
  ['cat-food-calculator', 0.45, 0.5, ['sq', 'ld']],
  ['dog-crate-size-chart', 0.45, 0.45, ['sq', 'ld']],
  ['dog-collar-size-chart', 0.5, 0.45, ['sq', 'ld']],
  ['dog-harness-size-chart', 0.45, 0.35, ['sq', 'ld']],
  ['golden-retriever-weight-chart', 0.42, 0.42, ['sq', 'ld']],
  ['german-shepherd-weight-chart', 0.5, 0.3, ['sq', 'ld']],
  ['goldendoodle-size-chart', 0.5, 0.4, ['sq', 'ld']],
  ['bernedoodle-size-chart', 0.45, 0.4, ['sq', 'ld']],
  ['cat-weight-chart', 0.3, 0.42, ['sq', 'ld']],
  ['hub-dog', 0.5, 0.45, ['sq', 'ld']],
  ['hub-cat', 0.5, 0.4, ['sq', 'ld']],
  ['hub-size', 0.5, 0.5, ['sq', 'ld']],
];

const CROPS = {
  sq: { ratio: 1, widths: [300, 600] },
  ld: { ratio: 3 / 4, widths: [560, 1120] }, // 4:3 (h = w * 3/4)
  hero: { ratio: 2 / 3, widths: [720, 1440] }, // 3:2
};

const SRC = join(process.cwd(), 'scripts', 'photo-src');
const OUT = join(process.cwd(), 'public', 'photos');

function gravity(fx, fy) {
  const v = fy < 0.38 ? 'north' : fy > 0.62 ? 'south' : '';
  const h = fx < 0.38 ? 'west' : fx > 0.62 ? 'east' : '';
  return (v + h) || 'center';
}

await mkdir(OUT, { recursive: true });
let count = 0;
const report = [];

for (const [id, fx, fy, crops] of PHOTOS) {
  const srcPath = join(SRC, `${id}.jpg`);
  if (!existsSync(srcPath)) {
    report.push(`MISSING source: ${id}`);
    continue;
  }
  const input = await readFile(srcPath);
  const pos = gravity(fx, fy);
  for (const crop of crops) {
    const { ratio, widths } = CROPS[crop];
    for (const w of widths) {
      const h = Math.round(w * ratio);
      const base = sharp(input).resize(w, h, { fit: 'cover', position: pos });
      const stem = join(OUT, `${id}-${crop}-${w}`);
      await base.clone().avif({ quality: 60 }).toFile(`${stem}.avif`);
      await base.clone().webp({ quality: 75 }).toFile(`${stem}.webp`);
      await base.clone().jpeg({ quality: 72, mozjpeg: true }).toFile(`${stem}.jpg`);
      count += 3;
    }
  }
  report.push(`ok ${id} (${pos}) -> ${crops.join(',')}`);
}

console.log(report.join('\n'));
console.log(`\nWrote ${count} files to public/photos/`);
