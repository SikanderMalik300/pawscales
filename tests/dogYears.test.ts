import { describe, it, expect } from 'vitest';
import {
  humanYearsBySize,
  dnaHumanYears,
  dnaHumanYearsExact,
  sizeFromLb,
} from '@/lib/calc/dogYears';
import { roundTo } from '@/lib/calc/round';

describe('dog years calculator', () => {
  // Example 1: 5-year-old, 40 lb (Medium)
  it('ex1 size from 40 lb is medium', () => expect(sizeFromLb(40)).toBe('medium'));
  it('ex1 5-year medium = 36 human years', () => expect(humanYearsBySize(5, 'medium')).toBe(36));
  it('ex1 DNA formula ~57 (16*ln5+31=56.75)', () => {
    expect(roundTo(dnaHumanYearsExact(5), 2)).toBe(56.75);
    expect(dnaHumanYears(5)).toBe(57);
  });

  // Example 2: 10-year-old, 75 lb (Large)
  it('ex2 size from 75 lb is large', () => expect(sizeFromLb(75)).toBe('large'));
  it('ex2 10-year large = 66 human years', () => expect(humanYearsBySize(10, 'large')).toBe(66));
  it('ex2 DNA formula ~68 (16*ln10+31=67.84)', () => {
    expect(roundTo(dnaHumanYearsExact(10), 2)).toBe(67.84);
    expect(dnaHumanYears(10)).toBe(68);
  });

  it('size boundaries', () => {
    expect(sizeFromLb(20)).toBe('small');
    expect(sizeFromLb(21)).toBe('medium');
    expect(sizeFromLb(50)).toBe('medium');
    expect(sizeFromLb(51)).toBe('large');
    expect(sizeFromLb(100)).toBe('large');
    expect(sizeFromLb(101)).toBe('giant');
  });

  it('age 1 is 15 for non-giant and 12 for giant', () => {
    expect(humanYearsBySize(1, 'small')).toBe(15);
    expect(humanYearsBySize(1, 'giant')).toBe(12);
  });

  it('interpolates between whole years (5.5 medium between 36 and 42 = 39)', () => {
    expect(humanYearsBySize(5.5, 'medium')).toBe(39);
  });

  it('under 1 year interpolates from 0', () => {
    expect(humanYearsBySize(0.5, 'medium')).toBe(8); // round(15*0.5)
    expect(humanYearsBySize(0, 'small')).toBe(0);
  });

  it('beyond 16 extends by the 15->16 step', () => {
    expect(humanYearsBySize(17, 'giant')).toBe(128); // 121 + (121-114)
  });

  it('DNA formula is null below 1 year', () => {
    expect(dnaHumanYears(0.5)).toBeNull();
  });
});
