// Benadryl (diphenhydramine) dosing for dogs and cats (pawscales-dosage-
// calculators-plan.md). Doses are sourced, never invented:
//   Dogs: 2-4 mg/kg PO, every 8-12 h (Merck Veterinary Manual antihistamine
//         table). Cap 4 mg/kg.
//   Cats: 2-3 mg/kg PO, every 12 h (AAHA 2023 Management of Allergic Skin
//         Diseases, Table 8; ref Muller & Kirk's Small Animal Dermatology).
//         Cap 3 mg/kg.
// Tablets are standard 25 mg, used in half-tablet (12.5 mg) steps. The low end
// rounds UP (so it reaches at least the minimum) and the high end rounds DOWN
// (so it never exceeds the maximum). If no half tablet fits the window, the
// result is mg-only with a "too small for tablets" message.
import { LB_TO_KG } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

export type Species = 'dog' | 'cat';

export const BENADRYL: Record<Species, {
  minMgKg: number; maxMgKg: number; freq: string; source: string;
}> = {
  dog: {
    minMgKg: 2, maxMgKg: 4,
    freq: 'every 8 to 12 hours, no more than 3 times in 24 hours',
    source: 'Merck Veterinary Manual',
  },
  cat: {
    minMgKg: 2, maxMgKg: 3,
    freq: 'every 12 hours',
    source: 'AAHA 2023 guidelines (Table 8)',
  },
};

export const TABLET_MG = 25; // standard OTC Benadryl tablet
export const HALF_MG = TABLET_MG / 2; // 12.5 mg half tablet / children's chewable

export interface BenadrylDose {
  species: Species;
  kg: number;
  lowMg: number; // minMgKg x kg
  highMg: number; // maxMgKg x kg (the maximum per dose)
  leadMg: number; // the ~1 mg/lb (2 mg/kg) headline dose
  freq: string;
  noTablet: boolean; // no half tablet fits inside [lowMg, highMg]
  tooSmall: boolean; // even one half tablet (12.5 mg) exceeds the maximum
  lowTabletMg?: number;
  highTabletMg?: number;
  lowTablets?: number; // in 25 mg tablets (0.5 steps)
  highTablets?: number;
}

/** Dose for a given species and body weight (kg). Returns null for bad input. */
export function benadrylDose(species: Species, kg: number): BenadrylDose | null {
  if (!(kg > 0)) return null;
  const c = BENADRYL[species];
  const lowMg = c.minMgKg * kg;
  const highMg = c.maxMgKg * kg;
  const leadMg = c.minMgKg * kg; // lead with ~2 mg/kg (about 1 mg/lb)

  // half-tablet (12.5 mg) steps: low rounds up to >= min, high rounds down to <= max
  const lowTabletMg = Math.ceil(lowMg / HALF_MG) * HALF_MG;
  const highTabletMg = Math.floor(highMg / HALF_MG) * HALF_MG;
  const tooSmall = highMg < HALF_MG; // even a half tablet is over the maximum
  const noTablet = tooSmall || lowTabletMg > highTabletMg || lowTabletMg > highMg;

  return {
    species,
    kg,
    lowMg: roundTo(lowMg, 1),
    highMg: roundTo(highMg, 1),
    leadMg: roundTo(leadMg, 1),
    freq: c.freq,
    noTablet,
    tooSmall,
    ...(noTablet
      ? {}
      : {
          lowTabletMg,
          highTabletMg,
          lowTablets: lowTabletMg / TABLET_MG,
          highTablets: highTabletMg / TABLET_MG,
        }),
  };
}

export const doseForLb = (species: Species, lb: number): BenadrylDose | null =>
  benadrylDose(species, lb * LB_TO_KG);

// Weights for the by-weight reference chart on the page.
export const DOG_CHART_LB = [10, 15, 20, 30, 40, 50, 60, 80, 100];
export const CAT_CHART_LB = [6, 8, 10, 12, 15];
