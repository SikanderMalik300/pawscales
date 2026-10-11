'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { GrowthChart, type ChartPoint } from '@/components/ui/GrowthChart';
import { predictPuppyWeight } from '@/lib/calc/puppyWeight';
import { bandForSex, type Breed } from '@/lib/data/breeds';
import { expectedByAge, positionForAge, MONTH_WEEKS } from '@/lib/calc/breedGrowth';
import { parseNum, lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

const fmt = (n: number) => roundTo(n, 1).toString();
const WEEKS_PER_MONTH = MONTH_WEEKS;

export function BreedGrowthCalculator({ breed }: { breed: Breed }) {
  const [sex, setSex] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState('16');
  const [ageUnit, setAgeUnit] = useState<'weeks' | 'months'>('weeks');
  const [weight, setWeight] = useState('25');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');

  const spec = breed[sex];
  const band = bandForSex(spec);

  const ageNum = parseNum(age);
  const weightNum = parseNum(weight);
  const ageWeeks = ageNum == null ? NaN : ageUnit === 'months' ? ageNum * WEEKS_PER_MONTH : ageNum;
  const weightKg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;

  const result = useMemo(
    () => predictPuppyWeight({ ageWeeks, weightKg, size: band }),
    [ageWeeks, weightKg, band],
  );
  const rows = useMemo(() => expectedByAge(spec.lowLb, spec.highLb, band), [spec.lowLb, spec.highLb, band]);
  const toW = (kg: number) => (wUnit === 'lb' ? kgToLb(kg) : kg);

  const chart: ChartPoint[] =
    result.kind === 'ok'
      ? result.curveKg.map((c) => ({
          x: c.weeks, mid: roundTo(toW(c.mid), 1), low: roundTo(toW(c.low), 1), high: roundTo(toW(c.high), 1),
        }))
      : [];

  const pos = result.kind === 'ok' && weightNum != null
    ? positionForAge(rows, ageWeeks, wUnit === 'lb' ? weightNum : kgToLb(weightNum))
    : null;

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Sex</p>
            <Segmented label="Sex" className="w-full"
              options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
              value={sex} onChange={setSex} />
          </div>
          <Field id="age" label="Age" suffix={ageUnit} value={age} onChange={(e) => setAge(e.target.value)}
            labelRight={<Segmented compact label="Age unit"
              options={[{ value: 'weeks', label: 'weeks' }, { value: 'months', label: 'months' }]}
              value={ageUnit} onChange={setAgeUnit} />} />
          <Field id="weight" label="Current weight (optional)" suffix={wUnit} value={weight} onChange={(e) => setWeight(e.target.value)}
            labelRight={<Segmented compact label="Weight unit"
              options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
              value={wUnit} onChange={setWUnit} />} />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Predicted adult weight">
            {result.kind !== 'ok' ? (
              <p className="text-[16px] text-ink">
                {result.kind === 'too-young'
                  ? 'Too young to predict reliably. Try again at 12 weeks.'
                  : 'Enter an age and current weight to project the adult weight.'}
              </p>
            ) : (
              <>
                <Overline>Projected adult weight</Overline>
                <ResultNumber value={fmt(toW(result.adultKg))} unit={wUnit} />
                <p className="text-[16px] text-ink">
                  Most {sex} {breed.name}s like yours: {fmt(toW(result.lowKg))}–{fmt(toW(result.highKg))} {wUnit}.
                </p>
                {result.giant && (
                  <p className="mt-2 text-[14px] text-ink">
                    Giant-size dogs keep growing past 2 years and aren&rsquo;t fully covered by this data. Treat this as a minimum.
                  </p>
                )}
                <ResultDivider />
                <SecondaryRow label="% of adult weight now" value={`${Math.round(result.pctNow)}%`} />
                {pos && (
                  <SecondaryRow
                    label="For this age, your puppy is"
                    value={pos === 'inside' ? 'in the typical range' : pos === 'below' ? 'below typical' : 'above typical'}
                  />
                )}
                <div className="my-3">
                  <GrowthChart points={chart}
                    userPoint={{ x: Math.round(ageWeeks), y: roundTo(toW(weightKg), 1), label: 'your puppy' }}
                    yUnit={wUnit} />
                </div>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
