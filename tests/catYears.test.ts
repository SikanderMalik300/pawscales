import { describe, it, expect } from 'vitest';
import { catHumanYears, catHumanYearsFromYears } from '@/lib/calc/catYears';

describe('cat years calculator', () => {
  // Example 1: 7-year-old cat -> 44
  it('ex1 7 years = 44 human years', () => expect(catHumanYearsFromYears(7)).toBe(44));
  // Example 2: 6-month-old kitten -> 10
  it('ex2 6 months = 10 human years', () => expect(catHumanYears(6)).toBe(10));

  it('month anchors', () => {
    expect(catHumanYears(1)).toBe(1);
    expect(catHumanYears(3)).toBe(4);
    expect(catHumanYears(6)).toBe(10);
    expect(catHumanYears(12)).toBe(15);
    expect(catHumanYears(18)).toBe(21);
    expect(catHumanYears(24)).toBe(24);
  });

  it('year anchors after age 2 (+4 per year)', () => {
    expect(catHumanYearsFromYears(3)).toBe(28);
    expect(catHumanYearsFromYears(5)).toBe(36);
    expect(catHumanYearsFromYears(10)).toBe(56);
    expect(catHumanYearsFromYears(15)).toBe(76);
    expect(catHumanYearsFromYears(20)).toBe(96);
  });

  it('interpolates between month anchors (9 months ~ 13)', () => {
    expect(catHumanYears(9)).toBe(13); // between 10 (6mo) and 15 (12mo)
  });

  it('interpolates between 18 and 24 months', () => {
    expect(catHumanYears(21)).toBe(23); // between 21 and 24 -> 22.5 -> 23
  });

  it('zero and negative map to 0', () => {
    expect(catHumanYears(0)).toBe(0);
    expect(catHumanYears(-5)).toBe(0);
  });

  it('a very old cat stays finite', () => {
    expect(catHumanYearsFromYears(25)).toBe(116);
  });

  it('1 year equals 15 and 2 years equals 24', () => {
    expect(catHumanYearsFromYears(1)).toBe(15);
    expect(catHumanYearsFromYears(2)).toBe(24);
  });

  it('years helper matches months (4 years = 48 months)', () => {
    expect(catHumanYearsFromYears(4)).toBe(catHumanYears(48));
    expect(catHumanYearsFromYears(4)).toBe(32);
  });
});
