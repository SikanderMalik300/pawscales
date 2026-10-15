// Zyrtec (cetirizine) dosing for dogs (pawscales-dosage-calculators-plan.md).
// Dogs: 1-2 mg/kg PO once a day (AAHA 2023 Table 3), or 10-20 mg per dog
// (Merck Veterinary Manual). We lead with ~1 mg/kg and cap the result at 20 mg
// per dose (Merck's flat upper figure), so the tool never suggests a huge amount
// for a big dog. Tablets are standard 10 mg, used in 5 mg (half-tablet) steps:
// the low end rounds UP to reach at least 1 mg/kg, the high end rounds DOWN to at
// most min(2 mg/kg, 20 mg).
//
// Cats are a FLAT dose, not by weight: 5-10 mg per cat once a day (AAHA 2023
// Table 8; Merck). Shown on the page as a note, not a calculator.
import { LB_TO_KG } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

export const CETIRIZINE_DOG = {
  minMgKg: 1,
  maxMgKg: 2,
  capMg: 20, // Merck flat upper figure; never exceed per dose
  tabletMg: 10,
  halfMg: 5,
  freq: 'once a day',
} as const;

export const CETIRIZINE_CAT = {
  lowMg: 5,
  highMg: 10,
  freq: 'once a day',
} as const;

export interface DogDose {
  kg: number;
  lowMg: number; // raw low (1 mg/kg), or 20 for a large dog
  highMg: number; // min(2 mg/kg, 20)
  largeDog: boolean; // 1 mg/kg >= 20 mg (from about 20 kg / 44 lb): flat 20 mg
  tooSmall: boolean; // no 5 mg step fits at or under 2 mg/kg (under ~2.5 kg)
  noTablet: boolean;
  lowTabletMg?: number;
  highTabletMg?: number;
  lowTablets?: number; // in 10 mg tablets (0.5 steps)
  highTablets?: number;
}

export function cetirizineDog(kg: number): DogDose | null {
  if (!(kg > 0)) return null;
  const c = CETIRIZINE_DOG;
  const rawLow = c.minMgKg * kg;
  const cappedHigh = Math.min(c.maxMgKg * kg, c.capMg);

  // Large dog: even the low end (1 mg/kg) is at or above the 20 mg cap.
  if (rawLow >= c.capMg) {
    const t = c.capMg / c.tabletMg; // 2 tablets
    return {
      kg, lowMg: c.capMg, highMg: c.capMg, largeDog: true, tooSmall: false, noTablet: false,
      lowTabletMg: c.capMg, highTabletMg: c.capMg, lowTablets: t, highTablets: t,
    };
  }

  const tooSmall = cappedHigh < c.halfMg; // 2 mg/kg below one half tablet -> under ~2.5 kg
  const lowTabletMg = Math.ceil(rawLow / c.halfMg) * c.halfMg;
  const highTabletMg = Math.floor(cappedHigh / c.halfMg) * c.halfMg;
  const noTablet = tooSmall || lowTabletMg > highTabletMg || lowTabletMg > cappedHigh;

  return {
    kg,
    lowMg: roundTo(rawLow, 1),
    highMg: roundTo(cappedHigh, 1),
    largeDog: false,
    tooSmall,
    noTablet,
    ...(noTablet
      ? {}
      : {
          lowTabletMg,
          highTabletMg,
          lowTablets: lowTabletMg / c.tabletMg,
          highTablets: highTabletMg / c.tabletMg,
        }),
  };
}

export const dogDoseForLb = (lb: number): DogDose | null => cetirizineDog(lb * LB_TO_KG);

export const DOG_CHART_LB = [10, 15, 20, 30, 44, 60, 80, 100];
