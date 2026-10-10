import { describe, it, expect } from 'vitest';
import { estimateKittenAge, type KittenResult } from '@/lib/calc/kittenAge';

const base = {
  eyesOpen: false, earsUp: false, incisors: false,
  canines: false, premolars: false, walking: false,
};
const ok = (r: KittenResult) => {
  if (r.kind !== 'ok') throw new Error('expected ok');
  return r;
};

describe('kitten age estimator', () => {
  // Example 1: 24 oz, eyes open, ears up, incisors + canines -> about 5 to 6 weeks
  it('ex1 is about 5 to 6 weeks', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 24, eyesOpen: true, earsUp: true, incisors: true, canines: true }));
    expect(r.lowWeeks).toBe(5);
    expect(r.highWeeks).toBe(6);
  });

  // Example 2: 8 oz, eyes just opening, no teeth -> about 1 to 1.5 weeks
  it('ex2 is about 1 to 1.5 weeks', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 8, eyesOpen: true }));
    expect(r.lowWeeks).toBe(1);
    expect(r.highWeeks).toBe(1.5);
  });

  it('no weight and no signs needs input', () => {
    expect(estimateKittenAge({ ...base }).kind).toBe('need-input');
  });

  it('1 lb (16 oz) is about 4 weeks', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 16 }));
    expect(r.lowWeeks).toBe(4);
    expect(r.highWeeks).toBe(4);
  });

  it('weight drives the estimate when provided', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 28 }));
    // 4 + 12/6 = 6 to 4 + 12/4 = 7
    expect(r.lowWeeks).toBe(6);
    expect(r.highWeeks).toBe(7);
    expect(r.drivers.some((d) => d.includes('weight'))).toBe(true);
  });

  it('premolars without weight imply at least 5 weeks', () => {
    const r = ok(estimateKittenAge({ ...base, premolars: true }));
    expect(r.lowWeeks).toBeGreaterThanOrEqual(5);
  });

  it('eyes open only (no weight) is about 1 to 2.5 weeks', () => {
    const r = ok(estimateKittenAge({ ...base, eyesOpen: true }));
    expect(r.lowWeeks).toBe(1);
    expect(r.highWeeks).toBe(2.5);
  });

  it('a present sign raises the lower bound above the weight estimate', () => {
    // small weight but canines present -> at least 3 weeks
    const r = ok(estimateKittenAge({ ...base, weightOz: 10, canines: true }));
    expect(r.lowWeeks).toBeGreaterThanOrEqual(3);
  });

  it('drivers list which signs were used', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 20, eyesOpen: true }));
    expect(r.drivers).toContain('eyes open');
  });

  it('never returns NaN', () => {
    const r = ok(estimateKittenAge({ ...base, weightOz: 4 }));
    expect(Number.isFinite(r.lowWeeks)).toBe(true);
    expect(Number.isFinite(r.highWeeks)).toBe(true);
  });
});
