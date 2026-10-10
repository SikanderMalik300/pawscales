import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';
import { DataTable } from '@/components/ui/Table';
import { PREGNANCY, HEAT, ENERGY, DOG_MER, CAT_MER, DOG_YEARS, CAT_YEARS } from '@/lib/constants';
import type { Sourced } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'How We Calculate — PawScales',
  description: 'Every constant PawScales uses, with its value, source and the date we checked it.',
  alternates: { canonical: 'https://pawscales.com/how-we-calculate/' },
};

type Row = { label: string; value: string; s: Sourced<unknown> };

const rows: Row[] = [
  { label: 'Dog gestation from first breeding', value: `${PREGNANCY.gestationFromBreeding.value} days ±${PREGNANCY.breedingRangeDays.value}`, s: PREGNANCY.gestationFromBreeding },
  { label: 'Dog gestation from ovulation', value: `${PREGNANCY.gestationFromOvulation.value} days ±${PREGNANCY.ovulationRangeDays.value}`, s: PREGNANCY.gestationFromOvulation },
  { label: 'Pre-labor temperature drop', value: `below ${PREGNANCY.tempDropF.value}°F (normal ${PREGNANCY.normalTempLowF.value}–${PREGNANCY.normalTempHighF.value}°F)`, s: PREGNANCY.tempDropF },
  { label: 'X-ray to count puppies', value: `after day ${PREGNANCY.xrayAfterDay.value}`, s: PREGNANCY.xrayAfterDay },
  { label: 'Heat interval (interestrous)', value: `${HEAT.interestrousMonths.value} months (${HEAT.intervalMinMonths.value}–${HEAT.intervalMaxMonths.value})`, s: HEAT.interestrousMonths },
  { label: 'Proestrus / estrus length', value: `about ${HEAT.proestrusDays.value} days each`, s: HEAT.proestrusDays },
  { label: 'Resting energy requirement', value: `RER = ${ENERGY.rerCoefficient.value} × kg^${ENERGY.rerExponent.value}`, s: ENERGY.rerCoefficient },
  { label: 'Dog MER: neutered / intact adult', value: `${DOG_MER.neuteredAdult.value} / ${DOG_MER.intactAdult.value} × RER`, s: DOG_MER.neuteredAdult },
  { label: 'Dog MER: growth (<4mo / ≥4mo)', value: `${DOG_MER.growthUnder4mo.value} / ${DOG_MER.growth4moToAdult.value} × RER`, s: DOG_MER.growthUnder4mo },
  { label: 'Cat MER: neutered / intact adult', value: `${CAT_MER.neuteredAdult.value} / ${CAT_MER.intactAdult.value} × RER`, s: CAT_MER.neuteredAdult },
  { label: 'Treats budget', value: `${ENERGY.treatsPct.value}% of daily calories`, s: ENERGY.treatsPct },
  { label: 'Individual variation', value: `up to ${ENERGY.varyPct.value}%`, s: ENERGY.varyPct },
  { label: 'Dog age (DNA formula)', value: String(DOG_YEARS.dnaFormula.value), s: DOG_YEARS.dnaFormula },
  { label: 'Dog age (size chart)', value: 'AVMA size-based chart, ages 1–16', s: DOG_YEARS.chartSource },
  { label: 'Cat age after 2 years', value: `+${CAT_YEARS.perYearAfter2.value} human years per cat year`, s: CAT_YEARS.perYearAfter2 },
];

export default function Page() {
  return (
    <TextPage title="How we calculate" updated="October 10, 2026">
      <p>
        Every number on PawScales comes from a named source. Below is each constant,
        its value, and the source we took it from with the date we checked it. The
        puppy growth table has its own method, described at the end.
      </p>
      <DataTable
        columns={[
          { key: 'label', header: 'Constant' },
          { key: 'value', header: 'Value' },
          { key: 'source', header: 'Source' },
        ]}
        rows={rows.map((r) => ({
          cells: {
            label: r.label,
            value: r.value,
            source: <a className="link" href={r.s.url}>{r.s.source}</a>,
          },
        }))}
        footnote="All sources checked October 10, 2026."
      />
      <h2>Puppy growth table</h2>
      <p>
        The puppy weight calculator uses growth data on 60,951 dogs (199,355 vet
        visits) from Salt et al. (2017), via the open Liverpool Data Catalogue
        (CC BY 4.0). We keep dogs that were a healthy weight as adults, group them
        into five adult-size bands, measure what share of their 2-year weight they
        reached at each age, smooth the curve, and normalize it so 100% is the
        2-year weight. Full detail is on the{' '}
        <Link className="link" href="/puppy-weight-calculator/">puppy weight calculator</Link>.
      </p>
    </TextPage>
  );
}
