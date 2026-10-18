import { describe, it, expect } from 'vitest';
import { tabletDose, tabletDoseLb } from '@/lib/calc/tabletDose';
import { DRAMAMINE, DRAMAMINE_CHART_LB } from '@/lib/calc/dramamine';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { minMgKg, maxMgKg, defaultTabletMg } = DRAMAMINE;
const weights = DRAMAMINE_CHART_LB.concat([5, 8, 12, 25, 50, 70, 120]);
const dose = (lb: number, mg = defaultTabletMg) => tabletDoseLb(minMgKg, maxMgKg, lb, mg)!;

describe('Dramamine (dimenhydrinate) dose, 50 mg tablet', () => {
  it('never exceeds the source maximum (8 mg/kg)', () => {
    for (const lb of weights) {
      const d = dose(lb);
      if (d.noTablet) continue;
      expect(d.highTabletMg! / (lb * LB_TO_KG), `${lb}lb high`).toBeLessThanOrEqual(maxMgKg + 1e-9);
    }
  });

  it('the lowest tablet always reaches at least the minimum (4 mg/kg)', () => {
    for (const lb of weights) {
      const d = dose(lb);
      if (d.noTablet) continue;
      expect(d.lowTabletMg! / (lb * LB_TO_KG), `${lb}lb low`).toBeGreaterThanOrEqual(minMgKg - 1e-9);
    }
  });

  it('10 lb dog is half of a 50 mg tablet', () => {
    const d = dose(10);
    expect(d.noTablet).toBe(false);
    expect(d.lowTablets).toBe(0.5);
    expect(d.highTablets).toBe(0.5);
  });

  it('50 lb dog is 2 to 3.5 tablets', () => {
    const d = dose(50);
    expect(d.noTablet).toBe(false);
    expect(d.lowTablets).toBe(2);
    expect(d.highTablets).toBe(3.5);
  });

  it('the 25 mg chewable also works (10 lb is one chewable)', () => {
    const d = dose(10, 25);
    expect(d.noTablet).toBe(false);
    expect(d.lowTablets).toBe(1);
    expect(d.highTablets).toBe(1);
  });

  it('the shown high end (and never-exceed) is never over weight x max; low rounds up', () => {
    for (const lb of weights) {
      const d = dose(lb);
      const kg = lb * LB_TO_KG;
      expect(d.highMgShown, `${lb}lb high shown`).toBeLessThanOrEqual(maxMgKg * kg + 1e-9);
      expect(d.lowMgShown, `${lb}lb low shown`).toBeGreaterThanOrEqual(minMgKg * kg - 1e-9);
      expect(Number.isInteger(d.lowMgShown) && Number.isInteger(d.highMgShown)).toBe(true);
    }
  });

  it('shows whole-mg ranges, low up and high down (10 lb 19-36, 50 lb 91-181)', () => {
    expect([dose(10).lowMgShown, dose(10).highMgShown]).toEqual([19, 36]);
    expect([dose(50).lowMgShown, dose(50).highMgShown]).toEqual([91, 181]);
  });

  it('offers a 50 mg tablet and a 25 mg chewable, defaulting to 50 mg', () => {
    expect(DRAMAMINE.tablets.map((t) => t.mg)).toEqual([50, 25]);
    expect(DRAMAMINE.defaultTabletMg).toBe(50);
    expect(DRAMAMINE.freq).toMatch(/6 to 8 hours/);
  });

  it('returns null for a non-positive weight', () => {
    expect(tabletDose(minMgKg, maxMgKg, 0, 50)).toBeNull();
  });
});

describe('Dramamine page is dogs-only and carries the safety layer', () => {
  const root = join(__dirname, '..');
  const page = readFileSync(join(root, 'components/DramaminePage.tsx'), 'utf8');
  const calc = readFileSync(join(root, 'components/tools/DogTabletCalculator.tsx'), 'utf8');
  const med = readFileSync(join(root, 'components/MedicationPage.tsx'), 'utf8');

  it('the calculator shows "ask your vet first" with every result', () => {
    expect(calc).toMatch(/Ask your vet before giving any medicine/i);
  });
  it('warns that Less Drowsy is meclizine, a different drug', () => {
    expect(page).toMatch(/meclizine/i);
    expect(page).toMatch(/Original/);
  });
  it('gives a cat note with no cat mg/kg', () => {
    expect(page).toMatch(/list a cat dose because our source/i);
    expect(page).toMatch(/ineffective for motion sickness in cats/i);
  });
  it('attributes the 1-hour travel timing to meclizine, not dimenhydrinate', () => {
    expect(page).toMatch(/meclizine/i);
    expect(page).toMatch(/ask your vet (how long|about)/i);
    expect(page).not.toMatch(/giving dimenhydrinate about an hour before/i);
  });
  it('carries the shared ASPCA box', () => {
    expect(page).toMatch(/ASPCA/);
    expect(med).toMatch(/888\) 426-4435/);
  });
  it('never calls the medicine "safe" unqualified', () => {
    expect(/\bsafe\b/i.test(page)).toBe(false);
  });
});

describe('Dramamine registry entry', () => {
  it('is registered in the dog-calculators hub with a compliant title and meta', () => {
    const e = bySlug('dramamine-dosage-calculator')!;
    expect(e).toBeTruthy();
    expect(e.category).toBe('dog-calculators');
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
