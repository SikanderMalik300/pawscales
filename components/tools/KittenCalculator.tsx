'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber,
} from '@/components/ui/ResultPanel';
import { estimateKittenAge, gToOzInput } from '@/lib/calc/kittenAge';
import { parseNum } from '@/lib/units';

const SIGNS: { key: 'eyesOpen' | 'earsUp' | 'incisors' | 'canines' | 'premolars' | 'walking'; label: string }[] = [
  { key: 'eyesOpen', label: 'Eyes open' },
  { key: 'earsUp', label: 'Ears upright' },
  { key: 'incisors', label: 'Front teeth (incisors)' },
  { key: 'canines', label: 'Fangs (canines)' },
  { key: 'premolars', label: 'Back teeth (premolars)' },
  { key: 'walking', label: 'Walking steadily' },
];

export function KittenCalculator() {
  const [weight, setWeight] = useState('24');
  const [unit, setUnit] = useState<'oz' | 'g'>('oz');
  const [signs, setSigns] = useState<Record<string, boolean>>({
    eyesOpen: true, earsUp: true, incisors: true, canines: true, premolars: false, walking: false,
  });

  const w = parseNum(weight);
  const weightOz = w == null ? null : unit === 'g' ? gToOzInput(w) : w;

  const r = useMemo(
    () => estimateKittenAge({
      weightOz,
      eyesOpen: !!signs.eyesOpen, earsUp: !!signs.earsUp, incisors: !!signs.incisors,
      canines: !!signs.canines, premolars: !!signs.premolars, walking: !!signs.walking,
    }),
    [weightOz, signs],
  );

  const toggle = (k: string) => setSigns((s) => ({ ...s, [k]: !s[k] }));
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : `${n}`);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field
            id="w" label="Weight (optional)" suffix={unit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'oz', label: 'oz' }, { value: 'g', label: 'g' }]}
                value={unit} onChange={setUnit} />
            }
          />
          <fieldset>
            <legend className="mb-1.5 text-[14px] font-medium text-ink">What can you see?</legend>
            <div className="flex flex-col gap-2">
              {SIGNS.map((s) => (
                <label key={s.key} className="flex cursor-pointer items-center gap-2 text-[16px] text-ink">
                  <input
                    type="checkbox" checked={!!signs[s.key]} onChange={() => toggle(s.key)}
                    className="h-5 w-5 rounded-[4px] border border-field accent-brand"
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Estimated kitten age">
            {r.kind === 'need-input' ? (
              <p className="text-[16px] text-ink">Enter a weight or tick at least one sign.</p>
            ) : (
              <>
                <Overline>Estimated age</Overline>
                <ResultNumber value={`${fmt(r.lowWeeks)}–${fmt(r.highWeeks)}`} unit="weeks" />
                <p className="text-[16px] text-ink">
                  Based on: {r.drivers.join(', ')}.
                </p>
                <p className="mt-2 text-[14px] text-muted">
                  Weight alone isn’t reliable before 2–3 weeks. All baby teeth are in by about 8 weeks.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
