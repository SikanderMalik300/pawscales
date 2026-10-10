// Every number shown on the site, with a source (pawscales-build-spec.md A0 #7).
// Verified against the cited source on 2026-10-10. /how-we-calculate/ reads this.

export interface Sourced<T> {
  value: T;
  source: string;
  url: string;
  accessed: string;
  note?: string;
}

const S = <T,>(value: T, source: string, url: string, note?: string): Sourced<T> => ({
  value,
  source,
  url,
  accessed: '2026-10-10',
  note,
});

const CORNELL =
  'https://www.vet.cornell.edu/departments/riney-canine-health-center/canine-health-information/normal-whelping-process';
const MERCK =
  'https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs';
const PNA = 'https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf';

// ---- Dog pregnancy (A6.2) ----
export const PREGNANCY = {
  gestationFromBreeding: S(63, 'Cornell Riney Canine Health Center, Normal whelping process', CORNELL, '63 +/- 7 days from the first breeding'),
  breedingRangeDays: S(7, 'Cornell Riney Canine Health Center', CORNELL),
  gestationFromOvulation: S(63, 'Cornell Riney Canine Health Center', CORNELL, 'Cornell states 63 +/- 1-2 days from a known ovulation date; we use +/- 2'),
  ovulationRangeDays: S(2, 'Cornell Riney Canine Health Center', CORNELL),
  tempDropF: S(99, 'Cornell Riney Canine Health Center', CORNELL, 'rectal temperature drops below 99F within 24 hours of whelping'),
  normalTempLowF: S(100, 'Cornell Riney Canine Health Center', CORNELL),
  normalTempHighF: S(102.5, 'Cornell Riney Canine Health Center', CORNELL),
  merckRange: S('62 to 64 days', 'Merck Veterinary Manual (owner), Management of reproduction in dogs', MERCK),
  xrayAfterDay: S(55, 'Merck Veterinary Manual (owner)', MERCK, 'X-rays after day 55 are best for counting puppies'),
  // Derived from the 63-day due date: prepare ~1 week before; monitor temperature ~6 days before.
  whelpBoxDay: S(55, 'Derived from the 63-day due date (about a week before)', CORNELL),
  tempTwiceDailyDay: S(57, 'Derived from the 63-day due date (about 6 days before)', CORNELL),
};

// ---- Dog heat cycle (A6.11) ----
export const HEAT = {
  interestrousMonths: S(7, 'Merck Veterinary Manual (owner)', MERCK, 'average interval 7 months; some large breeds 9-12'),
  intervalMinMonths: S(4, 'Merck Veterinary Manual (owner)', MERCK),
  intervalMaxMonths: S(13, 'Merck Veterinary Manual (owner)', MERCK),
  proestrusDays: S(9, 'Merck Veterinary Manual (owner)', MERCK, 'about 9 days, range 2 days to 3 weeks'),
  estrusDays: S(9, 'Merck Veterinary Manual (owner)', MERCK, 'about 9 days, range 3 days to 3 weeks'),
  diestrusMonths: S(2, 'Merck Veterinary Manual (owner)', MERCK, 'about 2 months in non-pregnant dogs'),
};

// ---- Energy requirement, shared by food calculators (A6.9, A6.10, A6.12) ----
export const ENERGY = {
  rerCoefficient: S(70, 'Pet Nutrition Alliance, Calculating Calories', PNA, 'RER = 70 x (body weight kg)^0.75'),
  rerExponent: S(0.75, 'Pet Nutrition Alliance', PNA),
  varyPct: S(50, 'Pet Nutrition Alliance', PNA, 'individual animals can vary by as much as 50% from predicted'),
  treatsPct: S(10, 'WSAVA / AAHA guidance', 'https://wsava.org/global-guidelines/global-nutrition-guidelines/', 'treats should be no more than 10% of daily calories'),
};

export const DOG_MER = {
  neuteredAdult: S(1.6, 'Pet Nutrition Alliance', PNA),
  intactAdult: S(1.8, 'Pet Nutrition Alliance', PNA),
  inactive: S(1.3, 'Pet Nutrition Alliance', PNA, 'PNA lists 1.2-1.4 for overweight-prone/inactive; we use 1.3'),
  weightLoss: S(1.0, 'Pet Nutrition Alliance', PNA),
  growthUnder4mo: S(3.0, 'Pet Nutrition Alliance', PNA, 'PNA growth 2-3x RER, higher when young (under ~4 months)'),
  growth4moToAdult: S(2.0, 'Pet Nutrition Alliance', PNA, 'PNA growth 2-3x RER, decreasing from ~4 months'),
};

export const CAT_MER = {
  neuteredAdult: S(1.2, 'Pet Nutrition Alliance', PNA),
  intactAdult: S(1.4, 'Pet Nutrition Alliance', PNA),
  inactive: S(1.0, 'Pet Nutrition Alliance', PNA),
  weightLoss: S(0.8, 'Pet Nutrition Alliance', PNA, 'PNA lists 0.8-1.0 for weight loss; we use 0.8'),
  growth: S(2.5, 'Pet Nutrition Alliance', PNA, 'PNA growth 2-3x RER; we use 2.5'),
};

// ---- Dog years (A6.3) ----
export const DOG_YEARS = {
  // Size-based human-age chart (AVMA-style). Rows = dog age 1..16; cols by size.
  // Small <=20 lb, Medium 21-50, Large 51-100, Giant >100.
  chart: {
    small: [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
    medium: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87],
    large: [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99],
    giant: [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121],
  },
  chartSource: S('AVMA dog age chart (size-based)', 'https://www.avma.org/resources-tools/pet-owners/petcare/selecting-pet-dog', 'commonly published size-based human-age chart'),
  // Epigenetic (DNA) formula, valid for dogs >= 1 year.
  dnaFormula: S('16 * ln(age) + 31', 'Wang T, et al. Cell Systems 2020;11(2):176-185. DOI 10.1016/j.cels.2020.06.006', 'https://doi.org/10.1016/j.cels.2020.06.006', 'derived from DNA methylation in Labrador Retrievers'),
};

// ---- Cat years (A6.4), International Cat Care ----
const ICC = 'https://icatcare.org/advice/how-to-tell-your-cats-age-in-human-years/';
export const CAT_YEARS = {
  // {catMonths: humanYears} anchor points
  anchors: [
    [1, 1], [3, 4], [6, 10], [12, 15], [18, 21], [24, 24],
  ] as [number, number][],
  perYearAfter2: S(4, 'International Cat Care', ICC, 'each year after age 2 is about 4 human years'),
  source: S('International Cat Care, cat age in human years', 'International Cat Care', ICC),
};

// ---- Kitten age (A6.5), Alley Cat Allies "Determining Kitten Age" ----
export const KITTEN_SOURCE = S(
  'Alley Cat Allies, Determining a Kitten’s Age',
  'Alley Cat Allies',
  'https://www.alleycat.org/resources/how-to-determine-a-kittens-age/',
);
