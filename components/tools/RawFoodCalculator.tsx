'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { ShowMath } from '@/components/ui/ShowMath';
import { rawFood } from '@/lib/calc/rawFood';
import type { DogStage } from '@/lib/calc/energy';
import { parseNum, lbToKg } from '@/lib/units';

const STAGES: { value: DogStage; label: string }[] = [
  { value: 'neuteredAdult', label: 'Neutered adult' },
  { value: 'intactAdult', label: 'Intact adult' },
  { value: 'inactive', label: 'Inactive / prone to weight gain' },
  { value: 'weightLoss', label: 'Weight loss' },
  { value: 'growthUnder4mo', label: 'Puppy under 4 months' },
  { value: 'growth4moToAdult', label: 'Puppy 4 months to adult' },
];

export function RawFoodCalculator() {
  const [weight, setWeight] = useState('44.1');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');
  const [stage, setStage] = useState<DogStage>('neuteredAdult');
  const [kcal, setKcal] = useState('1400');

  const weightNum = parseNum(weight);
  const kcalNum = parseNum(kcal);
  const weightKg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const r = useMemo(
    () => rawFood({ weightKg, stage, kcalPerKgFood: kcalNum ?? NaN }),
    [weightKg, stage, kcalNum],
  );

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field
            id="w" label="Dog's weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            }
          />
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Life stage / activity</p>
            <select
              aria-label="Life stage or activity" value={stage}
              onChange={(e) => setStage(e.target.value as DogStage)}
              className="h-12 w-full rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink"
            >
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <Field
            id="kcal" label="Food energy" suffix="kcal/kg" value={kcal}
            onChange={(e) => setKcal(e.target.value)}
            helper="From the label. Typical raw is about 1,400 kcal/kg (635 kcal/lb). Check yours."
          />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Daily raw food">
            {!r ? (
              <p className="text-[16px] text-ink">Enter a weight and the food's calories per kg.</p>
            ) : (
              <>
                <Overline>Feed about</Overline>
                <ResultNumber value={r.gramsPerDay} unit="g/day" />
                <p className="text-[16px] text-ink">
                  That's {r.ozPerDay} oz a day, about {r.pctBodyWeight}% of body weight.
                </p>
                <ResultDivider />
                <SecondaryRow label="Daily energy (MER)" value={`${r.mer} kcal`} />
                <SecondaryRow label="As % of body weight" value={`${r.pctBodyWeight}%`} />
                <SecondaryRow label="In ounces" value={`${r.ozPerDay} oz`} />
                <div className="mt-3">
                  <ShowMath>
                    grams/day = daily kcal ÷ (kcal per kg of food) × 1000.
                    <br />{r.mer} ÷ {kcalNum} × 1000 = {r.gramsPerDay} g.
                  </ShowMath>
                </div>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
