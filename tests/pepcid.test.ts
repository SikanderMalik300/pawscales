import { describe, it, expect } from 'vitest';
import { tabletDose, tabletDoseLb } from '@/lib/calc/tabletDose';
import { PEPCID, PEPCID_CHART_LB } from '@/lib/calc/pepcid';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { minMgKg, maxMgKg, defaultTabletMg } = PEPCID;
const weights = PEPCID_CHART_LB.concat([8, 11, 25, 35, 70, 120]);
const dose = (lb: number, mg = defaultTabletMg) => tabletDoseLb(minMgKg, maxMgKg, lb, mg)!;

describe('Pepcid (famotidine) dose, 10 mg tablet', () => {
  it('never exceeds the source maximum (1 mg/kg)', () => {
    for (const lb of weights) {
      const d = dose(lb);
      if (d.noTablet) continue;
      expect(d.highTabletMg! / (lb * LB_TO_KG), `${lb}lb high`).toBeLessThanOrEqual(maxMgKg + 1e-9);
    }
  });

  it('the lowest tablet always reaches at least the minimum (0.5 mg/kg)', () => {
    for (const lb of weights) {
      const d = dose(lb);
      if (d.noTablet) continue;
      expect(d.lowTabletMg! / (lb * LB_TO_KG), `${lb}lb low`).toBeGreaterThanOrEqual(minMgKg - 1e-9);
    }
  });

  it('tablets move in half steps only (no quarters)', () => {
    for (const lb of weights) {
      const d = dose(lb);
      if (d.noTablet) continue;
      expect(Number.isInteger(d.lowTablets! * 2), `${lb}lb low halves`).toBe(true);
      expect(Number.isInteger(d.highTablets! * 2), `${lb}lb high halves`).toBe(true);
    }
  });

  it('10 lb dog shows the no-tablet message (too small for a half tablet)', () => {
    const d = dose(10);
    expect(d.noTablet).toBe(true);
    expect(d.tooSmall).toBe(true);
  });

  it('the no-tablet cutoff is about 11 lb (11 too small, 12 fits a half)', () => {
    expect(dose(11).noTablet, '11lb').toBe(true);
    const twelve = dose(12);
    expect(twelve.noTablet, '12lb').toBe(false);
    expect(twelve.lowTablets).toBe(0.5);
    expect(twelve.highTablets).toBe(0.5);
  });

  it('50 lb dog is 1.5 to 2 tablets', () => {
    const d = dose(50);
    expect(d.noTablet).toBe(false);
    expect(d.lowTablets).toBe(1.5);
    expect(d.highTablets).toBe(2);
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

  it('shows whole-mg ranges, low up and high down (10 lb 3-4, 50 lb 12-22)', () => {
    expect([dose(10).lowMgShown, dose(10).highMgShown]).toEqual([3, 4]);
    expect([dose(50).lowMgShown, dose(50).highMgShown]).toEqual([12, 22]);
  });

  it('offers 10 mg and 20 mg tablets, once a day, defaulting to 10 mg', () => {
    expect(PEPCID.tablets.map((t) => t.mg)).toEqual([10, 20]);
    expect(PEPCID.defaultTabletMg).toBe(10);
    expect(PEPCID.freq).toMatch(/24 hours/);
  });

  it('returns null for a non-positive weight', () => {
    expect(tabletDose(minMgKg, maxMgKg, 0, 10)).toBeNull();
  });
});

describe('Pepcid page is dogs-only and carries the safety layer', () => {
  const root = join(__dirname, '..');
  const page = readFileSync(join(root, 'components/PepcidPage.tsx'), 'utf8');
  const med = readFileSync(join(root, 'components/MedicationPage.tsx'), 'utf8');

  it('warns to use plain famotidine, not Pepcid Complete', () => {
    expect(page).toMatch(/plain famotidine/i);
    expect(page).toMatch(/Pepcid Complete/);
    expect(page).toMatch(/calcium carbonate/i);
  });
  it('tells owners when black stool or not eating needs a vet, and never says it "treats"', () => {
    expect(page).toMatch(/black or tarry stool/i);
    expect(page).toMatch(/will not eat/i);
    expect(/\btreats\b/i.test(page)).toBe(false);
  });
  it('gives a cat note with no cat number', () => {
    expect(page).toMatch(/list a cat dose because our source/i);
  });
  it('carries the ASPCA line (shared box) and points to it from the page', () => {
    expect(page).toMatch(/ASPCA/);
    expect(med).toMatch(/888\) 426-4435/);
  });
  it('never calls the medicine "safe" unqualified', () => {
    expect(/\bsafe\b/i.test(page)).toBe(false);
  });
});

describe('Pepcid registry entry', () => {
  it('is registered in the dog-calculators hub with a compliant title and meta', () => {
    const e = bySlug('pepcid-dosage-calculator')!;
    expect(e).toBeTruthy();
    expect(e.category).toBe('dog-calculators');
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
