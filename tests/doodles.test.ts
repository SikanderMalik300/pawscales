import { describe, it, expect } from 'vitest';
import { GOLDENDOODLE, BERNEDOODLE, CAVAPOO, LABRADOODLE, sizeBand, parentsRange, doodleTypicalByAge, sizeForHeightIn } from '@/lib/data/doodles';
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
  it('no column value exceeds its size representative weight (capped at 1.0)', () => {
    for (const doodle of [GOLDENDOODLE, BERNEDOODLE]) {
      for (const r of doodleTypicalByAge(doodle)) {
        for (const s of doodle.sizes) {
          expect(r.bySize[s.size], `${doodle.name} ${s.size} ${r.months}mo`).toBeLessThanOrEqual(s.repLb);
        }
      }
    }
  });
  it('Goldendoodle Petite at 24 months is not above GANA\'s 25 lb', () => {
    const last = rows[rows.length - 1];
    expect(last.bySize['Petite']).toBeLessThanOrEqual(25);
  });
});

describe('Bernedoodle (SwissRidge) categories', () => {
  it('has the four SwissRidge sizes in order', () => {
    expect(BERNEDOODLE.sizes.map((s) => s.size)).toEqual(['Tiny', 'Miniature', 'Medium', 'Standard']);
  });
  it('carries the SwissRidge height and weight wording', () => {
    const [tiny, mini, medium, standard] = BERNEDOODLE.sizes;
    expect(tiny.weightLabel).toBe('10–25 lb');
    expect(tiny.heightLabel).toBe('10–13 in');
    expect(mini.weightLabel).toBe('26–45 lb');
    expect(medium.weightLabel).toBe('46–65 lb');
    expect(standard.weightLabel).toBe('66 lb and up');
    expect(standard.heightLabel).toBe('22–29 in');
  });
  it('is sourced to SwissRidge with a giant note for the open-ended Standard', () => {
    expect(BERNEDOODLE.sourceUrl).toMatch(/swissridgekennels\.com/);
    expect(BERNEDOODLE.sizes[3].bound).toBe('at least');
    expect(BERNEDOODLE.sizes[3].highLb).toBeNull();
    expect(BERNEDOODLE.giantNote).toMatch(/giant/i);
  });
  it('maps Tiny to a small band, larger sizes to bigger bands', () => {
    const bands = BERNEDOODLE.sizes.map((s) => sizeBand(s));
    expect(bands[0]).toBe('II'); // Tiny ~17.5 lb
    expect(bands[1]).toBe('IV'); // Mini ~35.5 lb
    expect(bands[2]).toBe('IV'); // Medium ~55.5 lb
  });
  it('table starts at 3 months and is not identical to Goldendoodle', () => {
    const bern = doodleTypicalByAge(BERNEDOODLE);
    expect(bern[0].months).toBe(3);
    const gold = doodleTypicalByAge(GOLDENDOODLE);
    // Medium columns differ (Bernedoodle rep 55.5 vs Goldendoodle rep 43)
    expect(bern[bern.length - 1].bySize['Medium']).not.toBe(gold[gold.length - 1].bySize['Medium']);
  });
});

describe('Cavapoo (breeder categories, no standard)', () => {
  it('has Toy and Miniature categories with the stated wording', () => {
    expect(CAVAPOO.sizes.map((s) => s.size)).toEqual(['Toy', 'Miniature']);
    const [toy, mini] = CAVAPOO.sizes;
    expect(toy.weightLabel).toBe('About 7–13 lb');
    expect(toy.heightLabel).toBe('About 9–12 in');
    expect(mini.weightLabel).toBe('About 12–25 lb');
    expect(mini.heightLabel).toBe('About 12–16 in');
  });
  it('states there is no breed standard and defaults to the parents estimator', () => {
    expect(CAVAPOO.sourceNote).toMatch(/no Cavapoo breed association or size standard/i);
    expect(CAVAPOO.parentsFirst).toBe(true);
  });
  it('maps Toy to a small band and Mini a step up', () => {
    const [toy, mini] = CAVAPOO.sizes;
    expect(sizeBand(toy)).toBe('I');  // rep 10 lb
    expect(sizeBand(mini)).toBe('II'); // rep 18.5 lb
  });
  it('parents rule: Toy Poodle 6 x Cavalier 16 -> 6 to 11 lb', () => {
    expect(parentsRange(6, 16)).toEqual({ lowLb: 6, highLb: 11 });
  });
  it('table starts at 3 months and no cell exceeds its representative weight', () => {
    const rows = doodleTypicalByAge(CAVAPOO);
    expect(rows[0].months).toBe(3);
    for (const r of rows) {
      for (const s of CAVAPOO.sizes) expect(r.bySize[s.size]).toBeLessThanOrEqual(s.repLb);
    }
  });
});

describe('Labradoodle (ALAA height-based sizes)', () => {
  it('has the three ALAA sizes in order with the stated wording', () => {
    expect(LABRADOODLE.sizes.map((s) => s.size)).toEqual(['Miniature', 'Medium', 'Standard']);
    const [mini, medium, standard] = LABRADOODLE.sizes;
    expect(mini.weightLabel).toBe('15–30 lb');
    expect(mini.heightLabel).toBe('14–16 in');
    expect(medium.weightLabel).toBe('30–50 lb');
    expect(standard.weightLabel).toBe('50–65 lb');
    expect(standard.heightLabel).toBe('21–24 in');
  });
  it('is sourced to the ALAA, is height-first, and states weights are an estimate', () => {
    expect(LABRADOODLE.sourceUrl).toMatch(/alaa-labradoodles\.com/);
    expect(LABRADOODLE.sourceName).toMatch(/ALAA/);
    expect(LABRADOODLE.heightFirst).toBe(true);
    expect(LABRADOODLE.sourceNote).toMatch(/PawScales estimate|height, not weight/i);
  });
  it('the weights cover the 15 to 65 lb band with no gaps', () => {
    const [mini, medium, standard] = LABRADOODLE.sizes;
    expect([mini.lowLb, mini.highLb]).toEqual([15, 30]);
    expect([medium.lowLb, medium.highLb]).toEqual([30, 50]); // meets Mini at 30
    expect([standard.lowLb, standard.highLb]).toEqual([50, 65]); // meets Medium at 50
  });
  it('maps each size to a Salt band (Mini III, Medium and Standard IV)', () => {
    const [mini, medium, standard] = LABRADOODLE.sizes;
    expect(sizeBand(mini)).toBe('III');
    expect(sizeBand(medium)).toBe('IV');
    expect(sizeBand(standard)).toBe('IV');
  });
  it('classifies a shoulder height into the right ALAA size', () => {
    expect(sizeForHeightIn(LABRADOODLE, 10)?.size).toBe('Miniature'); // below the band -> smallest
    expect(sizeForHeightIn(LABRADOODLE, 15)?.size).toBe('Miniature');
    expect(sizeForHeightIn(LABRADOODLE, 17)?.size).toBe('Medium'); // 17 is the Medium floor
    expect(sizeForHeightIn(LABRADOODLE, 19)?.size).toBe('Medium');
    expect(sizeForHeightIn(LABRADOODLE, 21)?.size).toBe('Standard'); // 21 is the Standard floor
    expect(sizeForHeightIn(LABRADOODLE, 26)?.size).toBe('Standard'); // above -> largest
    expect(sizeForHeightIn(LABRADOODLE, 0)).toBeNull();
  });
  it('table starts at 3 months, no cell exceeds its representative weight, and is not a Goldendoodle copy', () => {
    const rows = doodleTypicalByAge(LABRADOODLE);
    expect(rows[0].months).toBe(3);
    for (const r of rows) {
      for (const s of LABRADOODLE.sizes) expect(r.bySize[s.size]).toBeLessThanOrEqual(s.repLb);
    }
    const gold = doodleTypicalByAge(GOLDENDOODLE);
    expect(rows[rows.length - 1].bySize['Medium']).not.toBe(gold[gold.length - 1].bySize['Medium']);
  });
  it('carries an F1 first-cross column in the weight-by-age table', () => {
    expect(LABRADOODLE.extraCurves?.[0]).toMatchObject({ name: 'F1', repLb: 61.5 });
    const rows = doodleTypicalByAge(LABRADOODLE);
    expect(rows[0].bySize['F1']).toBe(20.7); // 3 months
    expect(rows[rows.length - 1].bySize['F1']).toBe(61.5); // 24 months, the adult rep
    for (const r of rows) expect(r.bySize['F1']).toBeLessThanOrEqual(61.5);
  });
  it('other doodles have no extra curves (F1 column is Labradoodle-only)', () => {
    expect(GOLDENDOODLE.extraCurves).toBeUndefined();
    expect(doodleTypicalByAge(GOLDENDOODLE)[0].bySize['F1']).toBeUndefined();
  });
});

describe('doodle size-finder modes', () => {
  it('only the Labradoodle is height-first; Cavapoo stays parents-first', () => {
    expect(LABRADOODLE.heightFirst).toBe(true);
    expect(GOLDENDOODLE.heightFirst).toBeUndefined();
    expect(CAVAPOO.parentsFirst).toBe(true);
  });
  it('height classification is a no-op for a breed with no height bands', () => {
    expect(sizeForHeightIn(GOLDENDOODLE, 18)).toBeNull();
  });
});
