// Dog pregnancy / due-date math (A6.2). UTC date-only, no time zones.
import { PREGNANCY } from '@/lib/constants';
import { addDays, daysBetween } from '@/lib/date';

export const GESTATION = PREGNANCY.gestationFromBreeding.value; // 63

export interface PregnancyResult {
  due: Date;
  earliest: Date;
  latest: Date;
  whelpBox: Date; // prepare by
  tempWatch: Date; // start temperature twice daily
  rangeDays: number;
  dayOfPregnancy: number | null; // relative to today, if provided
  week: number | null;
  daysToGo: number | null;
}

export function predictPregnancy(
  breeding: Date,
  fromOvulation: boolean,
  today?: Date,
): PregnancyResult {
  const range = fromOvulation
    ? PREGNANCY.ovulationRangeDays.value
    : PREGNANCY.breedingRangeDays.value;
  const due = addDays(breeding, GESTATION);
  const earliest = addDays(due, -range);
  const latest = addDays(due, range);
  const whelpBox = addDays(breeding, PREGNANCY.whelpBoxDay.value);
  const tempWatch = addDays(breeding, PREGNANCY.tempTwiceDailyDay.value);

  let dayOfPregnancy: number | null = null;
  let week: number | null = null;
  let daysToGo: number | null = null;
  if (today) {
    const d = daysBetween(breeding, today);
    if (d >= 0 && d <= GESTATION + range) {
      dayOfPregnancy = d;
      week = Math.min(9, Math.floor(d / 7) + 1);
      daysToGo = daysBetween(today, due);
    }
  }

  return { due, earliest, latest, whelpBox, tempWatch, rangeDays: range, dayOfPregnancy, week, daysToGo };
}

// Week-by-week milestones (day ranges). Sources: Cornell whelping, Merck
// reproduction, VCA pregnancy timeline. Day numbers are from those pages.
export const TIMELINE: { week: number; days: string; milestone: string }[] = [
  { week: 1, days: 'Days 1–7', milestone: 'Breeding and fertilization. No outward signs yet.' },
  { week: 2, days: 'Days 8–14', milestone: 'Embryos travel to the uterus and implant.' },
  { week: 3, days: 'Days 15–21', milestone: 'Implantation completes. Some dogs show mild appetite changes.' },
  { week: 4, days: 'Days 22–28', milestone: 'Ultrasound can confirm pregnancy from about day 25; a relaxin blood test works from around day 28.' },
  { week: 5, days: 'Days 29–35', milestone: 'Abdominal palpation window (about days 28–35). Fetuses develop quickly.' },
  { week: 6, days: 'Days 36–42', milestone: 'Belly starts to show. Appetite and weight rise.' },
  { week: 7, days: 'Days 43–49', milestone: 'Fetal skeletons begin to show on X-ray after about day 45.' },
  { week: 8, days: 'Days 50–56', milestone: 'Prepare the whelping box. X-rays after day 55 are best for counting puppies.' },
  { week: 9, days: 'Days 57–63', milestone: 'Take temperature twice daily. A drop below 99°F signals whelping within about 24 hours.' },
];
