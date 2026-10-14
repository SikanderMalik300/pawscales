'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { GrowthChart, type ChartPoint } from '@/components/ui/GrowthChart';
import { CAT_WEIGHT, trackKitten, MIN_MONTH, MAX_MONTH, type Sex } from '@/lib/data/catWeight';
import { parseNum } from '@/lib/units';
import { fmt1 } from '@/lib/calc/round';

const POSITION_LABEL: Record<'below' | 'within' | 'above', string> = {
  below: 'below the typical range',
  within: 'within the typical range',
  above: 'above the typical range',
};

export function CatWeightCalculator() {
  const [sex, setSex] = useState<Sex>('F');
  const [age, setAge] = useState('6');
  const [weight, setWeight] = useState('');

  const ageNum = parseNum(age);
  const weightNum = parseNum(weight);
  const result = useMemo(
    () => (ageNum != null && weightNum != null ? trackKitten(sex, ageNum, weightNum) : null),
    [sex, ageNum, weightNum],
  );

  const chart: ChartPoint[] = CAT_WEIGHT.main[sex].map((r) => ({
    x: r.month, mid: r.median, low: r.p25, high: r.p75,
  }));

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Sex</p>
            <Segmented label="Sex" className="w-full"
              options={[{ value: 'F', label: 'Female' }, { value: 'M', label: 'Male' }]}
              value={sex} onChange={setSex} />
          </div>
          <Field id="age" label="Age" suffix="months" value={age} onChange={(e) => setAge(e.target.value)} />
          <Field id="weight" label="Current weight" suffix="lb" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <p className="text-[13px] text-muted">
            For kittens {MIN_MONTH}&ndash;{MAX_MONTH} months old. This compares weight
            only. Ask your vet to check body condition.
          </p>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Is my kitten on track">
            {!result ? (
              <p className="text-[16px] text-ink">Enter your kitten&rsquo;s age and weight to compare it with the typical range.</p>
            ) : result.kind === 'invalid' ? (
              <p className="text-[16px] text-ink">Enter an age in months and a weight in pounds.</p>
            ) : (
              <>
                <Overline>Your kitten is</Overline>
                <p className="text-[22px] font-medium leading-tight text-ink">{POSITION_LABEL[result.position]}</p>
                <p className="mt-1 text-[14px] text-muted">
                  Typical for a {sex === 'F' ? 'female' : 'male'} at this age: {fmt1(result.p25)}&ndash;{fmt1(result.p75)} lb (middle {fmt1(result.median)} lb).
                </p>
                <ResultDivider />
                <SecondaryRow label="25th-75th centile" value={`${fmt1(result.p25)}-${fmt1(result.p75)} lb`} />
                <div className="my-3">
                  <GrowthChart points={chart} yUnit="lb" xUnit="months"
                    userPoint={{ x: Math.max(MIN_MONTH, Math.min(ageNum ?? MIN_MONTH, MAX_MONTH)), y: weightNum ?? 0, label: 'your kitten' }} />
                </div>
                <p className="text-[13px] text-muted">
                  By definition, 1 in 4 healthy kittens weigh more than this range and
                  1 in 4 weigh less.
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  This compares weight only, not body condition. A vet&rsquo;s body
                  condition check matters more than the number on the scale.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
