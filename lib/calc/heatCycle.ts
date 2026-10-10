// Dog heat (estrous) cycle predictor (A6.11). UTC date-only.
import { HEAT } from '@/lib/constants';
import { addDays, addMonths } from '@/lib/date';

export const DEFAULT_INTERVAL_MONTHS = HEAT.interestrousMonths.value; // 7

export interface HeatResult {
  proestrusStart: Date; // day 1
  proestrusEnd: Date; // day 9
  estrusStart: Date; // day 10 (fertile window begins)
  estrusEnd: Date; // day 18 (fertile window ends)
  nextHeat: Date; // + interval months
  nextEarliest: Date; // + 4 months
  nextLatest: Date; // + 13 months
}

export function predictHeat(lastHeatStart: Date, intervalMonths?: number): HeatResult {
  const p = HEAT.proestrusDays.value; // 9
  const e = HEAT.estrusDays.value; // 9
  const interval = intervalMonths ?? DEFAULT_INTERVAL_MONTHS;
  return {
    proestrusStart: lastHeatStart,
    proestrusEnd: addDays(lastHeatStart, p - 1),
    estrusStart: addDays(lastHeatStart, p),
    estrusEnd: addDays(lastHeatStart, p + e - 1),
    nextHeat: addMonths(lastHeatStart, interval),
    nextEarliest: addMonths(lastHeatStart, HEAT.intervalMinMonths.value),
    nextLatest: addMonths(lastHeatStart, HEAT.intervalMaxMonths.value),
  };
}
