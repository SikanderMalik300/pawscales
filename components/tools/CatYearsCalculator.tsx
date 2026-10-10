'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow,
} from '@/components/ui/ResultPanel';
import { catHumanYears } from '@/lib/calc/catYears';
import { parseNum } from '@/lib/units';

const felineStage = (months: number): string => {
  if (months < 12) return 'Kitten';
  if (months < 72) return 'Young adult';
  if (months < 120) return 'Mature adult';
  return 'Senior';
};

export function CatYearsCalculator() {
  const [age, setAge] = useState('7');
  const [unit, setUnit] = useState<'years' | 'months'>('years');

  const ageNum = parseNum(age);
  const months = ageNum == null ? NaN : unit === 'years' ? ageNum * 12 : ageNum;
  const r = useMemo(() => {
    if (!Number.isFinite(months) || months <= 0) return null;
    return { human: catHumanYears(months), stage: felineStage(months) };
  }, [months]);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field
            id="age" label="Cat's age" suffix={unit} value={age}
            onChange={(e) => setAge(e.target.value)}
            labelRight={
              <Segmented compact label="Age unit"
                options={[{ value: 'years', label: 'years' }, { value: 'months', label: 'months' }]}
                value={unit} onChange={setUnit} />
            }
          />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Cat age in human years">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your cat's age.</p>
            ) : (
              <>
                <Overline>About</Overline>
                <ResultNumber value={r.human} unit="human years" />
                <p className="text-[16px] text-ink">
                  The first year is about 15 human years, the second adds 9 more,
                  then about 4 a year after that.
                </p>
                <div className="mt-2">
                  <SecondaryRow label="Life stage" value={r.stage} />
                </div>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
