import { describe, it, expect } from 'vitest';
import { ceilCount, roundTo } from '@/lib/calc/round';

describe('round helpers', () => {
  it('ceilCount rounds up to whole counts', () => {
    expect(ceilCount(2.0001)).toBe(3);
    expect(ceilCount(2.79)).toBe(3);
    expect(ceilCount(3)).toBe(3);
  });

  it('ceilCount trims float noise before ceiling', () => {
    // 3 * 0.1 === 0.30000000000000004 -> should be 1 cup-ish, not 2
    expect(ceilCount(0.1 + 0.2)).toBe(1);
    expect(ceilCount(3.0000000001)).toBe(3);
  });

  it('roundTo rounds half up to d places', () => {
    expect(roundTo(2.785, 2)).toBe(2.79);
    expect(roundTo(662.0, 0)).toBe(662);
    expect(roundTo(3.16227, 2)).toBe(3.16);
  });
});
