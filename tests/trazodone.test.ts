import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  dogTable, refRow, roundUp5, roundDown5, DOG, DOG_WEIGHTS_LB, DOG_DAILY_MAX_MGKG, CAT_FLAT,
} from '@/lib/calc/trazodone';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

describe('trazodone reference values stay inside the published range', () => {
  it('low >= min x kg, high <= max x kg, both multiples of 5', () => {
    for (const r of dogTable()) {
      const kg = r.lb * LB_TO_KG;
      expect(r.lowMg, `${r.lb}lb low >= min`).toBeGreaterThanOrEqual(DOG.minMgKg * kg - 1e-9);
      expect(r.highMg, `${r.lb}lb high <= max`).toBeLessThanOrEqual(DOG.maxMgKg * kg + 1e-9);
      expect(r.lowMg).toBe(roundUp5(DOG.minMgKg * kg));
      expect(r.highMg).toBe(roundDown5(DOG.maxMgKg * kg));
      expect(r.lowMg % 5).toBe(0);
      expect(r.highMg % 5).toBe(0);
    }
  });
  it('matches the six approved dog rows', () => {
    expect(dogTable().map((r) => [r.lb, r.lowMg, r.highMg])).toEqual([
      [10, 10, 30],
      [20, 20, 65],
      [40, 40, 135],
      [60, 55, 200],
      [80, 75, 270],
      [100, 95, 340],
    ]);
  });
  it('rows are a low-high range, never a single value', () => {
    for (const r of dogTable()) expect(r.highMg).toBeGreaterThan(r.lowMg);
  });
  it('uses the agreed weights, daily max and flat cat dose', () => {
    expect(DOG_WEIGHTS_LB).toEqual([10, 20, 40, 60, 80, 100]);
    expect(DOG_DAILY_MAX_MGKG).toBe(19.5);
    expect(CAT_FLAT).toEqual({ lowMg: 50, highMg: 100 });
  });
});

describe('trazodone page is reference-only (prescription rule 4)', () => {
  const root = join(__dirname, '..');
  const page = readFileSync(join(root, 'components/TrazodonePage.tsx'), 'utf8');
  const route = readFileSync(join(root, 'app/(site)/trazodone-for-dogs-and-cats/page.tsx'), 'utf8');

  it('carries the "follow your vet\'s prescription" headline', () => {
    expect(page).toMatch(/Follow your vet/i);
    expect(page).toMatch(/Never start, stop or change a dose/i);
  });
  it('has all the required warnings', () => {
    expect(page).toMatch(/serotonin syndrome/i);
    expect(page).toMatch(/fluoxetine/i);
    expect(page).toMatch(/tramadol/i);
    expect(page).toMatch(/selegiline/i);
    expect(page).toMatch(/priapism/i);
    expect(page).toMatch(/do not stop suddenly/i);
    expect(page).toMatch(/liver, kidney or heart/i);
    expect(page).toMatch(/888\) 426-4435/);
  });
  it('does not render a dose calculator or a tablet/capsule count', () => {
    expect(page).not.toMatch(/use client/);
    expect(route).not.toMatch(/use client/);
    expect(page).not.toMatch(/\b\d[\d.]*\s*(?:tablets?|capsules?)\b/i);
  });
  it('never claims the medicine is "safe" unqualified', () => {
    expect(/\bsafe\b/i.test(page)).toBe(false);
    expect(/\bsafe\b/i.test(route)).toBe(false);
  });
});

describe('trazodone registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('trazodone-for-dogs-and-cats')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
  });
});
