// Shared weight-based tablet dosing for the OTC dog medication calculators
// (Dramamine, Pepcid). Same two-way rounding as Benadryl/Zyrtec: the low end
// rounds UP to the nearest half tablet (so it reaches at least the minimum
// mg/kg) and the high end rounds DOWN (so it never exceeds the maximum). If no
// half tablet fits the window, the result is mg-only with a message.
import { LB_TO_KG } from '@/lib/units';
import { roundTo, mgCeil, mgFloor } from '@/lib/calc/round';

export interface TabletDoseResult {
  kg: number;
  lowMg: number; // minMgKg x kg
  highMg: number; // maxMgKg x kg (the maximum per dose)
  lowMgShown: number; // whole mg, rounded UP (>= minMgKg x kg)
  highMgShown: number; // whole mg, rounded DOWN (<= maxMgKg x kg)
  noTablet: boolean; // no half tablet fits inside [lowMg, highMg]
  tooSmall: boolean; // even one half tablet exceeds the maximum
  lowTabletMg?: number;
  highTabletMg?: number;
  lowTablets?: number; // in whole tablets (0.5 steps)
  highTablets?: number;
}

/** Dose for a given mg/kg window, body weight (kg) and tablet strength (mg). */
export function tabletDose(minMgKg: number, maxMgKg: number, kg: number, tabletMg: number): TabletDoseResult | null {
  if (!(kg > 0) || !(tabletMg > 0)) return null;
  const half = tabletMg / 2;
  const lowMg = minMgKg * kg;
  const highMg = maxMgKg * kg;

  const lowTabletMg = Math.ceil(lowMg / half) * half; // round up to >= min
  const highTabletMg = Math.floor(highMg / half) * half; // round down to <= max
  const tooSmall = highMg < half; // even a half tablet is over the maximum
  const noTablet = tooSmall || lowTabletMg > highTabletMg || lowTabletMg > highMg;

  return {
    kg,
    lowMg: roundTo(lowMg, 1),
    highMg: roundTo(highMg, 1),
    lowMgShown: mgCeil(lowMg),
    highMgShown: mgFloor(highMg),
    noTablet,
    tooSmall,
    ...(noTablet
      ? {}
      : {
          lowTabletMg,
          highTabletMg,
          lowTablets: lowTabletMg / tabletMg,
          highTablets: highTabletMg / tabletMg,
        }),
  };
}

export const tabletDoseLb = (minMgKg: number, maxMgKg: number, lb: number, tabletMg: number) =>
  tabletDose(minMgKg, maxMgKg, lb * LB_TO_KG, tabletMg);
