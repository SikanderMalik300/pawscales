import { describe, it, expect } from 'vitest';
import {
  cetirizineDog, dogDoseForLb, CETIRIZINE_DOG, CETIRIZINE_CAT, DOG_CHART_LB,
} from '@/lib/calc/zyrtec';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const allLb = DOG_CHART_LB.concat([3, 4, 5, 6, 8, 12, 18, 22, 35, 50, 70, 120]);

describe('Zyrtec (cetirizine) dog dose — caps', () => {
  it('never shows more than 20 mg or 2 mg/kg per dose', () => {
    for (const lb of allLb) {
      const d = dogDoseForLb(lb)!;
      if (d.noTablet) continue;
      expect(d.highTabletMg!, `${lb}lb <= 20mg`).toBeLessThanOrEqual(20);
      expect(d.highTabletMg! / (lb * LB_TO_KG), `${lb}lb <= 2mg/kg`).toBeLessThanOrEqual(2 + 1e-9);
    }
  });
  it('the lowest shown dose is at least 1 mg/kg, except for large dogs', () => {
    for (const lb of allLb) {
      const d = dogDoseForLb(lb)!;
      if (d.noTablet || d.largeDog) continue;
      expect(d.lowTabletMg! / (lb * LB_TO_KG), `${lb}lb >= 1mg/kg`).toBeGreaterThanOrEqual(1 - 1e-9);
    }
  });
});

describe('Zyrtec dog dose — the checked weights', () => {
  it('10 lb: 5 mg, half a tablet', () => {
    const d = dogDoseForLb(10)!;
    expect(d.lowTabletMg).toBe(5);
    expect([d.lowTablets, d.highTablets]).toEqual([0.5, 0.5]);
  });
  it('25 lb: 15 to 20 mg (1.5 to 2 tablets)', () => {
    const d = dogDoseForLb(25)!;
    expect([d.lowTabletMg, d.highTabletMg]).toEqual([15, 20]);
    expect([d.lowTablets, d.highTablets]).toEqual([1.5, 2]);
  });
  it('44 lb: 20 mg (2 tablets), still within the normal range', () => {
    const d = dogDoseForLb(44)!;
    expect(d.highTabletMg).toBe(20);
    expect(d.lowTablets).toBe(2);
  });
  it('80 lb: large dog, flat 20 mg (2 tablets) with the Merck note', () => {
    const d = dogDoseForLb(80)!;
    expect(d.largeDog).toBe(true);
    expect(d.lowTabletMg).toBe(20);
    expect(d.lowTablets).toBe(2);
  });
  it('4 lb: too small for tablets', () => {
    const d = dogDoseForLb(4)!;
    expect(d.noTablet).toBe(true);
    expect(d.tooSmall).toBe(true);
  });
});

describe('Zyrtec — the big-dog threshold', () => {
  it('the flat 20 mg kicks in from about 20 kg (44 lb)', () => {
    expect(cetirizineDog(19.9)!.largeDog).toBe(false);
    expect(cetirizineDog(20)!.largeDog).toBe(true);
  });
});

describe('Zyrtec — cat flat dose', () => {
  it('cats are a flat per-cat dose, not weight based', () => {
    expect(CETIRIZINE_CAT.lowMg).toBe(5);
    expect(CETIRIZINE_CAT.highMg).toBe(10);
  });
});

describe('Zyrtec — config and safety copy', () => {
  const root = join(__dirname, '..');
  const calc = readFileSync(join(root, 'components/tools/ZyrtecCalculator.tsx'), 'utf8');
  const page = readFileSync(join(root, 'components/ZyrtecPage.tsx'), 'utf8');
  it('dog cap is 20 mg and dosing is once a day', () => {
    expect(CETIRIZINE_DOG.capMg).toBe(20);
    expect(CETIRIZINE_DOG.freq).toBe('once a day');
  });
  it('shows "ask your vet first" with every result and never says "safe"', () => {
    expect(calc).toMatch(/Ask your vet before giving any medicine/i);
    expect(/\bsafe\b/i.test(calc)).toBe(false);
  });
  it('carries the Zyrtec-D, xylitol, cat flat-dose and ASPCA warnings', () => {
    expect(page).toMatch(/Zyrtec-D/);
    expect(page).toMatch(/pseudoephedrine/i);
    expect(page).toMatch(/xylitol/i);
    expect(page).toMatch(/5 mg per cat/i);
    expect(page).toMatch(/888\) 426-4435/);
  });
});

describe('Zyrtec registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('zyrtec-dosage-calculator')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
