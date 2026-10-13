import { describe, it, expect } from 'vitest';
import { GOLDENDOODLE, sizeBand, parentsRange, doodleTypicalByAge } from '@/lib/data/doodles';
import { bandForKg } from '@/lib/calc/breedGrowth';
import { predictPuppyWeight } from '@/lib/calc/puppyWeight';
import { lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

describe('Goldendoodle GANA categories', () => {
  it('has the four official GANA sizes in order', () => {
    expect(GOLDENDOODLE.sizes.map((s) => s.size)).toEqual(['Petite', 'Miniature', 'Medium', 'Standard']);
  });
  it('sizes carry the GANA weight and height wording', () => {
    const [petite, mini, medium, standard] = GOLDENDOODLE.sizes;
    expect(petite.weightLabel).toBe('Up to 25 lb');
    expect(petite.heightLabel).toBe('Under 14 in');
    expect(mini.weightLabel).toBe('26–35 lb');
    expect(medium.weightLabel).toBe('36–50 lb');
    expect(standard.weightLabel).toBe('51 lb and up');
    expect(standard.heightLabel).toBe('Over 21 in');
  });
  it('is sourced to GANA', () => {
    expect(GOLDENDOODLE.sourceUrl).toMatch(/goldendoodleassociation\.com/);
    expect(GOLDENDOODLE.sourceName).toMatch(/GANA/);
  });
  it('open-ended sizes are flagged, bounded sizes carry low and high', () => {
    const [petite, mini, medium, standard] = GOLDENDOODLE.sizes;
    expect(petite.bound).toBe('up to');
    expect(petite.lowLb).toBeNull();
    expect(standard.bound).toBe('at least');
    expect(standard.highLb).toBeNull();
    expect(mini.lowLb).toBe(26);
    expect(mini.highLb).toBe(35);
    expect(medium.lowLb).toBe(36);
    expect(medium.highLb).toBe(50);
  });
});

describe('Goldendoodle size bands', () => {
  it('maps each representative weight to a Salt band', () => {
    const [petite, mini, medium, standard] = GOLDENDOODLE.sizes;
    expect(sizeBand(petite)).toBe(bandForKg(lbToKg(25)));   // III
    expect(sizeBand(mini)).toBe(bandForKg(lbToKg(30.5)));   // III
    expect(sizeBand(medium)).toBe(bandForKg(lbToKg(43)));   // IV
    expect(sizeBand(standard)).toBe(bandForKg(lbToKg(51))); // IV (51 lb min bound)
  });
});

describe('parents\' weight rule', () => {
  it('Ex2: 15 lb mother and 65 lb father -> 15 to 40 lb', () => {
    expect(parentsRange(15, 65)).toEqual({ lowLb: 15, highLb: 40 });
  });
  it('is symmetric in the parents', () => {
    expect(parentsRange(65, 15)).toEqual(parentsRange(15, 65));
  });
});

describe('Goldendoodle worked example 1', () => {
  it('Medium, 20 wk, 22 lb -> ~38.8 lb, inside 36-50', () => {
    const r = predictPuppyWeight({ ageWeeks: 20, weightKg: lbToKg(22), size: sizeBand(GOLDENDOODLE.sizes[2]) });
    if (r.kind !== 'ok') throw new Error('expected ok');
    expect(roundTo(kgToLb(r.adultKg), 1)).toBe(38.8);
    expect(kgToLb(r.adultKg)).toBeGreaterThanOrEqual(36);
    expect(kgToLb(r.adultKg)).toBeLessThanOrEqual(50);
  });
});

describe('Goldendoodle weight-by-age table', () => {
  const rows = doodleTypicalByAge(GOLDENDOODLE);
  it('starts at 3 months and never dips below 12 weeks', () => {
    expect(rows[0].months).toBe(3);
    expect(rows.every((r) => r.weeks >= 12)).toBe(true);
  });
  it('has a column for every size', () => {
    for (const r of rows) {
      expect(Object.keys(r.bySize).sort()).toEqual(GOLDENDOODLE.sizes.map((s) => s.size).sort());
    }
  });
  it('the adult row equals each size\'s representative weight', () => {
    const last = rows[rows.length - 1];
    expect(last.months).toBe(24);
    expect(last.bySize['Medium']).toBe(43);
    expect(last.bySize['Standard']).toBe(51);
  });
});
