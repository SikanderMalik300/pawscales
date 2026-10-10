'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { ShowMath } from '@/components/ui/ShowMath';
import {
  humanYearsBySize, dnaHumanYears, sizeFromLb, SIZE_LABEL, isBeyondChart,
  type DogSize,
} from '@/lib/calc/dogYears';
import { parseNum } from '@/lib/units';

const lifeStage = (age: number): string => {
  if (age < 0.75) return 'Puppy';
  if (age < 3) return 'Young adult';
  if (age < 7) return 'Mature adult';
  return 'Senior';
};

export function DogYearsCalculator() {
  const [age, setAge] = useState('5');
  const [weight, setWeight] = useState('40');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');

  const ageNum = parseNum(age);
  const weightNum = parseNum(weight);
  const weightLb = weightNum == null ? NaN : wUnit === 'kg' ? weightNum / 0.45359237 : weightNum;
  const size: DogSize | null = Number.isFinite(weightLb) ? sizeFromLb(weightLb) : null;

  const r = useMemo(() => {
    if (ageNum == null || ageNum <= 0 || !size) return null;
    return {
      human: humanYearsBySize(ageNum, size),
      dna: dnaHumanYears(ageNum),
      stage: lifeStage(ageNum),
      beyond: isBeyondChart(ageNum),
      size,
    };
  }, [ageNum, size]);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field id="age" label="Dog's age" suffix="years" value={age} onChange={(e) => setAge(e.target.value)} />
          <Field
            id="w" label="Dog's adult weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            }
            helper="Sets the size band: small, medium, large or giant."
          />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Dog age in human years">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your dog's age and weight.</p>
            ) : (
              <>
                <Overline>About</Overline>
                <ResultNumber value={r.human} unit="human years" />
                <p className="text-[16px] text-ink">
                  {r.dna != null
                    ? <>DNA-based estimate (from a study of Labrador Retrievers): about {r.dna} human years.</>
                    : <>The DNA formula is only meaningful from age 1.</>}
                </p>
                {r.beyond && <p className="mt-1 text-[14px] text-muted">Beyond the 16-year chart; extended at the same yearly step.</p>}
                <ResultDivider />
                <SecondaryRow label="Size band" value={SIZE_LABEL[r.size]} />
                <SecondaryRow label="Life stage" value={r.stage} />
                <div className="mt-3">
                  <ShowMath>
                    Size chart by age, with interpolation between years.
                    <br />DNA formula: human = 16 × ln(dog age) + 31.
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
