import { describe, it, expect } from 'vitest';
import { predictPregnancy, GESTATION } from '@/lib/calc/pregnancy';
import { parseISO, toISO, addDays } from '@/lib/date';

const iso = (s: string) => parseISO(s)!;

describe('dog pregnancy calculator', () => {
  it('constant gestation is 63 days', () => {
    expect(GESTATION).toBe(63);
  });

  // Example 1: bred 2026-11-01 -> due 2027-01-03, range 2026-12-27 to 2027-01-10
  const ex1 = predictPregnancy(iso('2026-11-01'), false);
  it('example 1 due date', () => expect(toISO(ex1.due)).toBe('2027-01-03'));
  it('example 1 earliest', () => expect(toISO(ex1.earliest)).toBe('2026-12-27'));
  it('example 1 latest', () => expect(toISO(ex1.latest)).toBe('2027-01-10'));

  // Example 2: bred 2027-03-15 -> due 2027-05-17, range 2027-05-10 to 2027-05-24
  const ex2 = predictPregnancy(iso('2027-03-15'), false);
  it('example 2 due date', () => expect(toISO(ex2.due)).toBe('2027-05-17'));
  it('example 2 range', () => {
    expect(toISO(ex2.earliest)).toBe('2027-05-10');
    expect(toISO(ex2.latest)).toBe('2027-05-24');
  });

  // Leap year: bred 2028-01-15 -> due 2028-03-18
  it('leap year due date', () => {
    expect(toISO(predictPregnancy(iso('2028-01-15'), false).due)).toBe('2028-03-18');
  });

  it('ovulation-confirmed narrows the range to +/-2 days', () => {
    const r = predictPregnancy(iso('2026-11-01'), true);
    expect(r.rangeDays).toBe(2);
    expect(toISO(r.earliest)).toBe('2027-01-01');
    expect(toISO(r.latest)).toBe('2027-01-05');
  });

  it('whelping box ready at least 5 days before the due date (AKC)', () => {
    const r = predictPregnancy(iso('2026-11-01'), false);
    // due 2027-01-03 minus 5 days = 2026-12-29
    expect(toISO(r.whelpBox)).toBe('2026-12-29');
    expect(toISO(r.whelpBox)).toBe(toISO(addDays(r.due, -5)));
  });

  it('today inside pregnancy gives day, week and days to go', () => {
    const r = predictPregnancy(iso('2026-11-01'), false, iso('2026-11-15'));
    expect(r.dayOfPregnancy).toBe(14);
    expect(r.week).toBe(3);
    expect(r.daysToGo).toBe(49);
  });

  it('today before breeding leaves progress null (no negative days)', () => {
    const r = predictPregnancy(iso('2026-11-01'), false, iso('2026-10-20'));
    expect(r.dayOfPregnancy).toBeNull();
    expect(r.daysToGo).toBeNull();
  });

  it('invalid date string is rejected by the parser', () => {
    expect(parseISO('2026-13-01')).toBeNull();
    expect(parseISO('2026-02-30')).toBeNull();
    expect(parseISO('not-a-date')).toBeNull();
  });
});
