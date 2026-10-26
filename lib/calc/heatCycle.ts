// Dog heat (estrous) cycle predictor (A6.11, rebuilt day-14). UTC date-only.
// Stage lengths and the interestrous interval are from the Merck Veterinary
// Manual (owner), Management of Reproduction in Dogs: proestrus about 9 days
// (2 days to 3 weeks), estrus about 9 days (3 days to 3 weeks), diestrus about
// 2 months (non-pregnant), anestrus 1 to 6 months; interval 4 to 13 months,
// average 7, with some large breeds (e.g. Great Danes) every 9 to 12 months.
// Age at first heat by size is from the AKC (Dr. Casal, "How Often Do Dogs Go
// Into Heat?"): small 6 to 7 months, medium 7 to 9, large 12 to 16, with some as
// early as 4 months and others not until over 2 years.
import { HEAT } from '@/lib/constants';
import { addDays, addMonths } from '@/lib/date';

export type SizeBand = 'small' | 'medium' | 'large' | 'giant';

export interface SizeInfo {
  value: SizeBand;
  label: string;
  firstHeat: string; // display text for puppy mode
  intervalMonths: number; // most likely next-heat interval
  nextWindow: [number, number]; // earliest, latest months for the next heat
  intervalNote: string; // shown under the next-heat window
}

export const SIZE_BANDS: SizeInfo[] = [
  { value: 'small', label: 'Toy or small', firstHeat: 'about 6 to 7 months (as early as 4)', intervalMonths: 7, nextWindow: [4, 13], intervalNote: '4 to 13 months is normal for dogs' },
  { value: 'medium', label: 'Medium', firstHeat: 'about 7 to 9 months', intervalMonths: 7, nextWindow: [4, 13], intervalNote: '4 to 13 months is normal for dogs' },
  { value: 'large', label: 'Large', firstHeat: 'about 12 to 16 months', intervalMonths: 7, nextWindow: [4, 13], intervalNote: 'about every 7 months, though some large breeds run 9 to 12' },
  { value: 'giant', label: 'Giant', firstHeat: 'about 12 to 24 months (some over 2 years)', intervalMonths: 10, nextWindow: [9, 12], intervalNote: '9 to 12 months' },
];

export const sizeInfo = (b: SizeBand): SizeInfo => SIZE_BANDS.find((s) => s.value === b) ?? SIZE_BANDS[1];

export interface Stage {
  name: string;
  note: string;
  start: Date;
  end: Date;
}

export interface HeatResult {
  stages: Stage[]; // proestrus, estrus, diestrus, anestrus (date ranges)
  nextHeat: Date; // most likely
  nextEarliest: Date;
  nextLatest: Date;
  size: SizeInfo;
}

/** Timeline of the current cycle from the first day of the last heat, plus a
 *  next-heat window based on the size band. Stages are shown as date ranges. */
export function predictHeat(lastHeatStart: Date, band: SizeBand): HeatResult {
  const p = HEAT.proestrusDays.value; // 9
  const e = HEAT.estrusDays.value; // 9
  const di = HEAT.diestrusMonths.value; // 2
  const size = sizeInfo(band);

  const proEnd = addDays(lastHeatStart, p);
  const estEnd = addDays(proEnd, e);
  const diEnd = addMonths(estEnd, di);
  const nextHeat = addMonths(lastHeatStart, size.intervalMonths);

  return {
    stages: [
      { name: 'Proestrus', note: 'Swelling and bleeding. Males are interested; she is not yet receptive.', start: lastHeatStart, end: proEnd },
      { name: 'Estrus', note: 'The fertile, receptive phase. Bleeding often lightens.', start: proEnd, end: estEnd },
      { name: 'Diestrus', note: 'The cycle winds down. She is no longer receptive.', start: estEnd, end: diEnd },
      { name: 'Anestrus', note: 'Reproductive rest until the next heat.', start: diEnd, end: nextHeat },
    ],
    nextHeat,
    nextEarliest: addMonths(lastHeatStart, size.nextWindow[0]),
    nextLatest: addMonths(lastHeatStart, size.nextWindow[1]),
    size,
  };
}
