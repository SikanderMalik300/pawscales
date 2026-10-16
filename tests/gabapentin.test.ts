import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  dogOngoingTable, catPainTable, refRow, roundUp5, roundDown5,
  DOG_ONGOING, CAT_PAIN, DOG_WEIGHTS_LB, CAT_WEIGHTS_LB,
} from '@/lib/calc/gabapentin';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

describe('gabapentin reference values = mg/kg x kg (integrity)', () => {
  it('every value stays inside the published range (low >= min x kg, high <= max x kg)', () => {
    for (const [table, range] of [[dogOngoingTable(), DOG_ONGOING], [catPainTable(), CAT_PAIN]] as const) {
      for (const r of table) {
        const kg = r.lb * LB_TO_KG;
        expect(r.lowMg, `${r.lb}lb low >= min`).toBeGreaterThanOrEqual(range.minMgKg * kg - 1e-9);
        expect(r.highMg, `${r.lb}lb high <= max`).toBeLessThanOrEqual(range.maxMgKg * kg + 1e-9);
        expect(r.lowMg).toBe(roundUp5(range.minMgKg * kg));
        expect(r.highMg).toBe(roundDown5(range.maxMgKg * kg));
        expect(r.lowMg % 5).toBe(0);
        expect(r.highMg % 5).toBe(0);
      }
    }
  });
  it('the checked rows match the approved examples', () => {
    expect(refRow(DOG_ONGOING, 10)).toMatchObject({ lowMg: 25, highMg: 135 });
    expect(refRow(DOG_ONGOING, 40).highMg).toBe(540); // not 545 (rounds down)
    expect(refRow(DOG_ONGOING, 100)).toMatchObject({ lowMg: 230, highMg: 1360 });
    expect(refRow(CAT_PAIN, 10)).toMatchObject({ lowMg: 15, highMg: 45 });
    expect(refRow(CAT_PAIN, 12).highMg).toBe(50); // not 55 (rounds down)
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
