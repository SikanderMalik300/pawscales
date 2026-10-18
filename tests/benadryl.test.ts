import { describe, it, expect } from 'vitest';
import {
  benadrylDose, doseForLb, BENADRYL, HALF_MG, TABLET_MG,
  DOG_CHART_LB, CAT_CHART_LB, type Species,
} from '@/lib/calc/benadryl';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SPECIES: Species[] = ['dog', 'cat'];
const allWeights = (s: Species) =>
  (s === 'dog' ? DOG_CHART_LB : CAT_CHART_LB).concat([3, 4, 5, 6, 7, 9, 14, 18, 22, 35, 70, 120]);

describe('Benadryl dose — never exceeds the source maximum', () => {
  it('the highest tablet amount is never above the max mg/kg (dogs 4, cats 3)', () => {
    for (const s of SPECIES) {
      for (const lb of allWeights(s)) {
        const d = doseForLb(s, lb)!;
        if (d.noTablet) continue;
        const mgPerKg = d.highTabletMg! / (lb * LB_TO_KG);
        expect(mgPerKg, `${s} ${lb}lb high`).toBeLessThanOrEqual(BENADRYL[s].maxMgKg + 1e-9);
      }
    }
  });
});

describe('Benadryl dose — lowest tablet reaches the minimum', () => {
  it('the lowest tablet amount is always at least 2 mg/kg', () => {
    for (const s of SPECIES) {
      for (const lb of allWeights(s)) {
        const d = doseForLb(s, lb)!;
        if (d.noTablet) continue;
        const mgPerKg = d.lowTabletMg! / (lb * LB_TO_KG);
        expect(mgPerKg, `${s} ${lb}lb low`).toBeGreaterThanOrEqual(BENADRYL[s].minMgKg - 1e-9);
      }
    }
  });
});

describe('Benadryl shown mg window — low up, high down, never over max', () => {
  it('the shown high end (and never-exceed) is never over weight x max', () => {
    for (const s of SPECIES) {
      for (const lb of allWeights(s)) {
        const d = doseForLb(s, lb)!;
        const kg = lb * LB_TO_KG;
        expect(d.highMgShown, `${s} ${lb}lb high shown`).toBeLessThanOrEqual(BENADRYL[s].maxMgKg * kg + 1e-9);
        expect(d.lowMgShown, `${s} ${lb}lb low shown`).toBeGreaterThanOrEqual(BENADRYL[s].minMgKg * kg - 1e-9);
        expect(Number.isInteger(d.lowMgShown) && Number.isInteger(d.highMgShown)).toBe(true);
      }
    }
  });
});

describe('Benadryl rounding — the corrected cases', () => {
  it('50 lb dog is 2 to 3.5 tablets', () => {
    const d = doseForLb('dog', 50)!;
    expect(d.noTablet).toBe(false);
    expect(d.lowTablets).toBe(2);
    expect(d.highTablets).toBe(3.5);
  });
  it('25 lb dog is 1 to 1.5 tablets', () => {
    const d = doseForLb('dog', 25)!;
    expect([d.lowTablets, d.highTablets]).toEqual([1, 1.5]);
  });
  it('tablets move in half steps of 12.5 mg', () => {
    expect(HALF_MG).toBe(12.5);
    expect(TABLET_MG).toBe(25);
  });
});

describe('Benadryl — too small for tablets', () => {
  it('the no-tablet message shows for pets under about 6 lb', () => {
    for (const lb of [3, 4, 5]) {
      expect(doseForLb('dog', lb)!.noTablet, `dog ${lb}lb`).toBe(true);
      expect(doseForLb('dog', lb)!.tooSmall, `dog ${lb}lb tooSmall`).toBe(true);
    }
  });
  it('a dose that falls between tablet steps is flagged, but not as too small', () => {
    const d = doseForLb('cat', 15)!; // 13.6–20.4 mg: 12.5 under min, 25 over max
    expect(d.noTablet).toBe(true);
    expect(d.tooSmall).toBe(false);
  });
});

describe('Benadryl — species separation', () => {
  it('cats use the cat range only (max 3 mg/kg, q12h)', () => {
    expect(BENADRYL.cat.maxMgKg).toBe(3);
    expect(BENADRYL.cat.freq).toMatch(/12 hours/);
    // a weight that would be fine for a dog can exceed the cat max
    const kg = 10 * LB_TO_KG;
    const cat = benadrylDose('cat', kg)!;
    if (!cat.noTablet) expect(cat.highTabletMg! / kg).toBeLessThanOrEqual(3 + 1e-9);
  });
  it('dogs allow up to 4 mg/kg', () => {
    expect(BENADRYL.dog.maxMgKg).toBe(4);
  });
});

describe('Benadryl safety layer is present', () => {
  const root = join(__dirname, '..');
  const calc = readFileSync(join(root, 'components/tools/BenadrylCalculator.tsx'), 'utf8');
  const page = readFileSync(join(root, 'components/BenadrylPage.tsx'), 'utf8');
  it('the calculator shows "ask your vet first" with every result', () => {
    expect(calc).toMatch(/Ask your vet before giving any medicine/i);
    // the warning sits in the result branch, not behind the "no input" guard
    expect(calc.indexOf('Ask your vet')).toBeGreaterThan(calc.indexOf('Enter your pet'));
  });
  it('the page carries the decongestant, xylitol and ASPCA warnings', () => {
    expect(page).toMatch(/pseudoephedrine/i);
    expect(page).toMatch(/xylitol/i);
    expect(page).toMatch(/888\) 426-4435/);
  });
  it('never claims the medicine is "safe" unqualified', () => {
    expect(/\bsafe\b/i.test(calc)).toBe(false);
  });
});

describe('Benadryl registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('benadryl-dosage-calculator')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
