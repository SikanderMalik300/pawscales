import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  chocolateDose, classifyDose, chocType, ozForLevel, CHOC_TYPES, THRESHOLDS, type ChocKey,
} from '@/lib/calc/chocolate';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

const dose = (typeKey: ChocKey, amount: number, amountUnit: 'oz' | 'g', weight: number, weightUnit: 'lb' | 'kg') =>
  chocolateDose({ typeKey, amount, amountUnit, weight, weightUnit })!;

describe('chocolate: the three worked examples (20 lb dog)', () => {
  it('2 oz milk -> ~14 mg/kg, below the toxic dose', () => {
    const r = dose('milk', 2, 'oz', 20, 'lb');
    expect(r.mg).toBe(128);
    expect(r.mgPerKg).toBeCloseTo(14.1, 1);
    expect(r.band).toBe('low');
  });
  it('2 oz semisweet/dark -> ~35 mg/kg, stomach upset', () => {
    const r = dose('semisweet', 2, 'oz', 20, 'lb');
    expect(r.mg).toBe(320);
    expect(r.band).toBe('upset');
  });
  it("2 oz baker's -> ~97 mg/kg, seizure band", () => {
    const r = dose('baker', 2, 'oz', 20, 'lb');
    expect(r.mg).toBe(880);
    expect(r.band).toBe('seizure');
  });
});

describe('chocolate: band thresholds are inclusive at 20, 40, 60', () => {
  it('exact boundaries fall in the higher band', () => {
    expect(classifyDose(19.9)).toBe('low');
    expect(classifyDose(20)).toBe('upset');
    expect(classifyDose(39.9)).toBe('upset');
    expect(classifyDose(40)).toBe('cardiac');
    expect(classifyDose(59.9)).toBe('cardiac');
    expect(classifyDose(60)).toBe('seizure');
  });
});

describe('chocolate chart ounces round DOWN, never over the trigger', () => {
  const WEIGHTS = [10, 20, 50, 80];
  const LEVELS = [THRESHOLDS.upset, THRESHOLDS.cardiac, THRESHOLDS.seizure];
  it('every shown ounce value is at or below the exact trigger amount', () => {
    for (const t of CHOC_TYPES) {
      for (const w of WEIGHTS) {
        for (const mgKg of LEVELS) {
          const shown = ozForLevel(t.mgPerOz, w, mgKg);
          const exact = (mgKg * w * LB_TO_KG) / t.mgPerOz;
          expect(shown, `${t.key} ${w}lb ${mgKg}mg/kg`).toBeLessThanOrEqual(exact + 1e-9);
        }
      }
    }
  });
  it('floors rather than rounds to nearest', () => {
    expect(ozForLevel(250, 10, 20)).toBe(0.3); // very dark, 10 lb, mild (exact 0.363)
    expect(ozForLevel(64, 10, 60)).toBe(4.2); // milk, 10 lb, seizure (exact 4.252)
  });
});

describe('chocolate: white chocolate stays tiny', () => {
  it('even a large amount of white chocolate is a small dose', () => {
    const r = dose('white', 16, 'oz', 10, 'lb'); // a whole pound for a small dog
    expect(r.mgPerKg).toBeLessThan(THRESHOLDS.upset);
    expect(r.band).toBe('low');
  });
});

describe('chocolate: unit conversions are consistent', () => {
  it('ounces and grams give the same dose for the same real amount', () => {
    const inOz = dose('milk', 1, 'oz', 22, 'lb');
    const inG = dose('milk', 28.35, 'g', 22, 'lb'); // 1 oz in grams
    expect(Math.abs(inOz.mgPerKg - inG.mgPerKg)).toBeLessThan(0.3);
  });
  it('lb and kg give the same dose for the same real weight', () => {
    const inLb = dose('milk', 2, 'oz', 22, 'lb');
    const inKg = dose('milk', 2, 'oz', 22 * 0.45359237, 'kg');
    expect(inLb.mgPerKg).toBeCloseTo(inKg.mgPerKg, 5);
  });
  it('content uses the Merck high end and the USDA very-dark figure', () => {
    expect(chocType('semisweet').mgPerOz).toBe(160); // high end of 150-160
    expect(chocType('verydark').mgPerG).toBe(8.82); // USDA 882 mg/100 g
    expect(chocType('white').mgPerOz).toBe(1.1);
  });
});

describe('chocolate: safety copy is on the page for every band', () => {
  const root = join(__dirname, '..');
  const calc = readFileSync(join(root, 'components/tools/ChocolateCalculator.tsx'), 'utf8');
  const page = readFileSync(join(root, 'components/ChocolatePage.tsx'), 'utf8');

  it('the ASPCA number and the no-induced-vomiting line show with every result', () => {
    expect(calc).toMatch(/888\) 426-4435/);
    expect(calc).toMatch(/make your dog vomit at home unless a vet/i);
  });
  it('every band has a detail message that points to a vet or the ASPCA', () => {
    for (const b of ['low', 'upset', 'cardiac', 'seizure']) {
      const re = new RegExp(`${b}:\\s*'[^']*(?:vet|ASPCA|emergency)[^']*'`, 'i');
      expect(re.test(calc), `${b} detail mentions vet/ASPCA`).toBe(true);
    }
  });
  it('has the xylitol / raisins / macadamia ingredients warning', () => {
    expect(calc).toMatch(/xylitol/i);
    expect(calc).toMatch(/macadamia/i);
    expect(page).toMatch(/raisins/i);
  });
  it('never claims chocolate is "safe" for dogs', () => {
    expect(/\bsafe\b/i.test(calc)).toBe(false);
  });
});

describe('chocolate registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('dog-chocolate-toxicity-calculator')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
