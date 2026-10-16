import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  dogOngoingTable, catPainTable, refRow, round5,
  DOG_ONGOING, CAT_PAIN, DOG_WEIGHTS_LB, CAT_WEIGHTS_LB,
} from '@/lib/calc/gabapentin';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

describe('gabapentin reference values = mg/kg x kg (integrity)', () => {
  it('each dog row equals round5(mg/kg x weight in kg)', () => {
    for (const r of dogOngoingTable()) {
      const kg = r.lb * LB_TO_KG;
      expect(r.lowMg).toBe(round5(DOG_ONGOING.minMgKg * kg));
      expect(r.highMg).toBe(round5(DOG_ONGOING.maxMgKg * kg));
      // rounding never drifts more than 2.5 mg from the exact value
      expect(Math.abs(r.lowMg - DOG_ONGOING.minMgKg * kg)).toBeLessThanOrEqual(2.5);
      expect(Math.abs(r.highMg - DOG_ONGOING.maxMgKg * kg)).toBeLessThanOrEqual(2.5);
    }
  });
  it('each cat row equals round5(mg/kg x weight in kg)', () => {
    for (const r of catPainTable()) {
      const kg = r.lb * LB_TO_KG;
      expect(r.lowMg).toBe(round5(CAT_PAIN.minMgKg * kg));
      expect(r.highMg).toBe(round5(CAT_PAIN.maxMgKg * kg));
    }
  });
  it('the checked rows match the approved report (10 and 100 lb dog, 10 lb cat)', () => {
    expect(refRow(DOG_ONGOING, 10)).toMatchObject({ lowMg: 25, highMg: 135 });
    expect(refRow(DOG_ONGOING, 100)).toMatchObject({ lowMg: 225, highMg: 1360 });
    expect(refRow(CAT_PAIN, 10)).toMatchObject({ lowMg: 15, highMg: 45 });
  });
  it('rows are a low-high range, never a single value', () => {
    for (const r of [...dogOngoingTable(), ...catPainTable()]) {
      expect(r.highMg).toBeGreaterThan(r.lowMg);
    }
  });
  it('uses the weight sets from the report', () => {
    expect(DOG_WEIGHTS_LB).toEqual([10, 20, 40, 60, 80, 100]);
    expect(CAT_WEIGHTS_LB).toEqual([6, 8, 10, 12, 15]);
  });
});

describe('gabapentin page is reference-only (prescription rule 4)', () => {
  const root = join(__dirname, '..');
  const page = readFileSync(join(root, 'components/GabapentinPage.tsx'), 'utf8');
  const route = readFileSync(join(root, 'app/gabapentin-for-dogs-and-cats/page.tsx'), 'utf8');

  it('carries the "follow your vet\'s prescription" headline', () => {
    expect(page).toMatch(/Follow your vet/i);
    expect(page).toMatch(/Never start, stop or change a dose/i);
  });
  it('has the prominent xylitol warning and the ASPCA number', () => {
    expect(page).toMatch(/xylitol/i);
    expect(page).toMatch(/888\) 426-4435/);
    expect(page).toMatch(/do not stop suddenly/i);
  });
  it('does not render a dose calculator or a tablet/capsule count', () => {
    expect(page).not.toMatch(/use client/);
    expect(route).not.toMatch(/use client/);
    // no "give this much": no number next to tablet/capsule (forms are fine)
    expect(page).not.toMatch(/\b\d[\d.]*\s*(?:tablets?|capsules?)\b/i);
  });
  it('never claims the medicine is "safe" unqualified', () => {
    expect(/\bsafe\b/i.test(page)).toBe(false);
    expect(/\bsafe\b/i.test(route)).toBe(false);
  });
});

describe('gabapentin registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('gabapentin-for-dogs-and-cats')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
