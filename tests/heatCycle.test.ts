import { describe, it, expect } from 'vitest';
import { predictHeat, DEFAULT_INTERVAL_MONTHS } from '@/lib/calc/heatCycle';
import { parseISO, toISO } from '@/lib/date';

const iso = (s: string) => parseISO(s)!;

describe('dog heat cycle calculator', () => {
  it('default interval is 7 months', () => expect(DEFAULT_INTERVAL_MONTHS).toBe(7));

  // Example 1: heat started 2026-10-01
  const ex1 = predictHeat(iso('2026-10-01'));
  it('ex1 proestrus window day 1-9', () => {
    expect(toISO(ex1.proestrusStart)).toBe('2026-10-01');
    expect(toISO(ex1.proestrusEnd)).toBe('2026-10-09');
  });
  it('ex1 estrus / fertile window day 10-18', () => {
    expect(toISO(ex1.estrusStart)).toBe('2026-10-10');
    expect(toISO(ex1.estrusEnd)).toBe('2026-10-18');
  });
  it('ex1 next heat about 2027-05-01', () => expect(toISO(ex1.nextHeat)).toBe('2027-05-01'));
  it('ex1 next-heat range 4-13 months', () => {
    expect(toISO(ex1.nextEarliest)).toBe('2027-02-01');
    expect(toISO(ex1.nextLatest)).toBe('2027-11-01');
  });

  // Example 2: started 2027-01-31, usual interval 6 months
  it('ex2 next heat 2027-07-31', () => {
    expect(toISO(predictHeat(iso('2027-01-31'), 6).nextHeat)).toBe('2027-07-31');
  });
  it('ex2 month-end clamp: 2027-08-31 + 6 months = 2028-02-29', () => {
    expect(toISO(predictHeat(iso('2027-08-31'), 6).nextHeat)).toBe('2028-02-29');
  });

  it('proestrus lasts 9 days and estrus lasts 9 days', () => {
    const r = predictHeat(iso('2026-01-01'));
    const pDays = (r.proestrusEnd.getTime() - r.proestrusStart.getTime()) / 86400000 + 1;
    const eDays = (r.estrusEnd.getTime() - r.estrusStart.getTime()) / 86400000 + 1;
    expect(pDays).toBe(9);
    expect(eDays).toBe(9);
  });

  it('a custom interval moves the next-heat date', () => {
    expect(toISO(predictHeat(iso('2026-03-01'), 5).nextHeat)).toBe('2026-08-01');
    expect(toISO(predictHeat(iso('2026-03-01'), 9).nextHeat)).toBe('2026-12-01');
  });

  it('leap-day interval math stays valid', () => {
    expect(toISO(predictHeat(iso('2027-12-29'), 2).nextHeat)).toBe('2028-02-29');
  });
});
