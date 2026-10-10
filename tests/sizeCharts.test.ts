import { describe, it, expect } from 'vitest';
import { recommendCrate } from '@/lib/calc/crate';
import { sizeCollar, COLLAR_ADD_IN } from '@/lib/calc/collar';
import { matchHarness } from '@/lib/data/harnessSizes';

describe('dog crate size', () => {
  // Example 1: length 28 in, height 22 in -> 36-inch crate
  const e1 = recommendCrate(28, 22)!;
  it('ex1 recommends a 36-inch crate', () => expect(e1.crate.length).toBe(36));
  it('ex1 ideal length is 32 and min is 30', () => {
    expect(e1.idealLength).toBe(32);
    expect(e1.minLength).toBe(30);
  });
  // Example 2: length 17 in, height 14 in -> 22-inch crate
  const e2 = recommendCrate(17, 14)!;
  it('ex2 recommends a 22-inch crate', () => expect(e2.crate.length).toBe(22));
  it('ex2 ideal length is 21', () => expect(e2.idealLength).toBe(21));

  it('min = length + 2, ideal = length + 4', () => {
    const r = recommendCrate(20, 18)!;
    expect(r.minLength).toBe(22);
    expect(r.idealLength).toBe(24);
  });
  it('a tall dog steps up when height does not fit', () => {
    const r = recommendCrate(30, 32)!; // ideal 34; needs height >= 34 -> only 54 fits
    expect(r.crate.length).toBe(54);
  });
  it('a toy dog gets the smallest crate', () => {
    expect(recommendCrate(10, 8)!.crate.length).toBe(18);
  });
  it('very large dog caps at 54 inches', () => {
    expect(recommendCrate(60, 40)!.crate.length).toBe(54);
  });
  it('zero length returns null (no NaN)', () => {
    expect(recommendCrate(0, 10)).toBeNull();
  });
  it('ignores height when not given', () => {
    expect(recommendCrate(28, 0)!.crate.length).toBe(36);
  });
});

describe('dog collar size', () => {
  it('add is 2 inches (two-finger rule)', () => expect(COLLAR_ADD_IN).toBe(2));
  // Example 1: neck 14 in -> collar 16 in
  it('ex1 neck 14 in -> collar 16 in', () => expect(sizeCollar(14)!.collarIn).toBe(16));
  // Example 2: neck 30 cm (11.81 in) -> 35 cm
  it('ex2 neck 30 cm -> collar 35 cm', () => {
    const r = sizeCollar(30 / 2.54)!;
    expect(r.collarCm).toBe(35);
  });
  it('maps to a generic size band', () => {
    expect(sizeCollar(16)!.genericSize).toBe('M'); // 16 in -> M (14-20)
    expect(sizeCollar(9)!.genericSize).toBe('XS'); // 9 -> XS (8-12)
  });
  it('a big neck lands in XL', () => expect(sizeCollar(28)!.genericSize).toBe('XL'));
  it('collar length in cm rounds correctly', () => {
    expect(sizeCollar(14)!.collarCm).toBe(41); // 16 in * 2.54 = 40.6 -> 41
  });
  it('zero or negative neck returns null', () => {
    expect(sizeCollar(0)).toBeNull();
    expect(sizeCollar(-5)).toBeNull();
  });
  it('a 20 in neck collar is 22 in', () => expect(sizeCollar(20)!.collarIn).toBe(22));
  it('out-of-range neck still gives a collar length', () => {
    const r = sizeCollar(40)!;
    expect(r.collarIn).toBe(42);
    expect(r.genericSize).toBeNull();
  });
  it('a small 9 in neck maps to XS and a 12 in collar', () => {
    const r = sizeCollar(9)!;
    expect(r.genericSize).toBe('XS');
    expect(r.collarIn).toBe(11);
  });
  it('collar length in cm equals the inch length times 2.54', () => {
    const r = sizeCollar(16)!;
    expect(r.collarCm).toBe(Math.round(r.collarIn * 2.54));
  });
});

describe('dog harness size', () => {
  // Example 1: girth 22 in -> a size per brand
  const e1 = matchHarness(22);
  it('ex1 returns a size for all three brands', () => {
    expect(e1).toHaveLength(3);
    expect(e1.every((m) => m.size !== null)).toBe(true);
  });
  it('ex1 Ruffwear is XS at 22 in', () => {
    expect(e1.find((m) => m.brand === 'Ruffwear')!.size).toBe('XS');
  });
  it('ex1 Rabbitgoo is S at 22 in', () => {
    expect(e1.find((m) => m.brand === 'Rabbitgoo')!.size).toBe('S');
  });
  it('ex1 Kurgo is S at 22 in', () => {
    expect(e1.find((m) => m.brand === 'Kurgo')!.size).toBe('S');
  });
  // Example 2: girth 30 in
  const e2 = matchHarness(30);
  it('ex2 Ruffwear is M at 30 in', () => {
    expect(e2.find((m) => m.brand === 'Ruffwear')!.size).toBe('M');
  });
  it('ex2 Rabbitgoo is L at 30 in', () => {
    expect(e2.find((m) => m.brand === 'Rabbitgoo')!.size).toBe('L');
  });
  it('ex2 Kurgo is L at 30 in', () => {
    expect(e2.find((m) => m.brand === 'Kurgo')!.size).toBe('L');
  });
  it('flags "between sizes" near a boundary', () => {
    // 22 in is the Ruffwear XS/S boundary
    expect(matchHarness(22).find((m) => m.brand === 'Ruffwear')!.between).toBe(true);
  });
  it('a huge girth returns null for brands that do not cover it', () => {
    const big = matchHarness(60);
    expect(big.every((m) => m.size === null)).toBe(true);
  });
  it('a tiny girth is below every brand range', () => {
    expect(matchHarness(5).every((m) => m.size === null)).toBe(true);
  });
});
