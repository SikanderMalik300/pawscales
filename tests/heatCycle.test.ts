import { describe, it, expect } from 'vitest';
import { predictHeat, SIZE_BANDS, sizeInfo } from '@/lib/calc/heatCycle';
import { parseISO, toISO } from '@/lib/date';

const iso = (s: string) => parseISO(s)!;

describe('dog heat cycle calculator', () => {
  const r = predictHeat(iso('2026-09-15'), 'medium');

  it('has the four stages in order, each a date range', () => {
    expect(r.stages.map((s) => s.name)).toEqual(['Proestrus', 'Estrus', 'Diestrus', 'Anestrus']);
    for (const s of r.stages) expect(s.end.getTime()).toBeGreaterThan(s.start.getTime());
  });

  it('proestrus ~9 days then estrus ~9 days, from the last heat start', () => {
    const [pro, est] = r.stages;
    expect(toISO(pro.start)).toBe('2026-09-15');
    expect(toISO(pro.end)).toBe('2026-09-24');
    expect(toISO(est.start)).toBe('2026-09-24');
    expect(toISO(est.end)).toBe('2026-10-03');
  });

  it('diestrus ~2 months, and anestrus runs to the next heat', () => {
    const [, , di, an] = r.stages;
    expect(toISO(di.end)).toBe('2026-12-03');
    expect(toISO(an.end)).toBe(toISO(r.nextHeat));
  });

  it('medium next heat is ~7 months out, window 4 to 13 months', () => {
    expect(toISO(r.nextHeat)).toBe('2027-04-15');
    expect(toISO(r.nextEarliest)).toBe('2027-01-15');
    expect(toISO(r.nextLatest)).toBe('2027-10-15');
  });

  it('giant runs a 9 to 12 month window, most likely ~10', () => {
    const g = predictHeat(iso('2026-09-15'), 'giant');
    expect(toISO(g.nextHeat)).toBe('2027-07-15');
    expect(toISO(g.nextEarliest)).toBe('2027-06-15');
    expect(toISO(g.nextLatest)).toBe('2027-09-15');
  });

  it('size bands carry the AKC first-heat text and Merck interval notes', () => {
    expect(SIZE_BANDS.map((s) => s.value)).toEqual(['small', 'medium', 'large', 'giant']);
    expect(sizeInfo('small').firstHeat).toMatch(/6 to 7 months/);
    expect(sizeInfo('large').firstHeat).toMatch(/12 to 16/);
    expect(sizeInfo('giant').intervalNote).toMatch(/9 to 12/);
  });

  it('month-end interval math stays valid', () => {
    expect(toISO(predictHeat(iso('2026-08-31'), 'medium').nextHeat)).toBe('2027-03-31');
  });
});
