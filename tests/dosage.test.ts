import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LB_TO_KG } from '@/lib/units';
import { BENADRYL } from '@/lib/calc/benadryl';
import { CETIRIZINE_DOG } from '@/lib/calc/zyrtec';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

// Each dosage page leads with its low mg/kg; any "X mg per pound" conversion in
// its copy must equal that mg/kg divided by ~2.2 (1 lb = 0.4536 kg).
const PAGES = [
  {
    name: 'Benadryl',
    leadMgKg: BENADRYL.dog.minMgKg, // 2 mg/kg -> ~0.9 mg/lb (stated "1")
    sources: [
      'app/(site)/benadryl-dosage-calculator/page.tsx',
      'components/BenadrylPage.tsx',
      'components/tools/BenadrylCalculator.tsx',
    ],
  },
  {
    name: 'Zyrtec',
    leadMgKg: CETIRIZINE_DOG.minMgKg, // 1 mg/kg -> ~0.45 mg/lb (stated "0.5")
    sources: [
      'app/(site)/zyrtec-dosage-calculator/page.tsx',
      'components/ZyrtecPage.tsx',
      'components/tools/ZyrtecCalculator.tsx',
    ],
  },
];

describe('dosage pages: "mg per pound" matches mg/kg / 2.2', () => {
  for (const p of PAGES) {
    it(`${p.name}: every "mg per pound" figure is ~ ${p.leadMgKg} mg/kg x 0.45`, () => {
      const expected = p.leadMgKg * LB_TO_KG; // mg per pound
      const text = p.sources.map(read).join('\n');
      const hits = [...text.matchAll(/([\d.]+)\s*mg per pound/gi)].map((m) => Number(m[1]));
      expect(hits.length, `${p.name} states a mg-per-pound figure`).toBeGreaterThan(0);
      for (const stated of hits) {
        // allow rounding to the nearest 0.5 mg/lb
        expect(Math.abs(stated - expected), `${p.name} states ${stated}, expected ~${expected.toFixed(2)}`).toBeLessThanOrEqual(0.25);
      }
    });
  }
});
