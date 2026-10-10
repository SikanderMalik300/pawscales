'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { ShowMath } from '@/components/ui/ShowMath';
import { catFood } from '@/lib/calc/catFood';
import type { CatStage } from '@/lib/calc/energy';
import { parseNum, lbToKg } from '@/lib/units';

const STAGES: { value: CatStage; label: string }[] = [
  { value: 'neuteredAdult', label: 'Neutered adult' },
  { value: 'intactAdult', label: 'Intact adult' },
  { value: 'inactive', label: 'Inactive / indoor' },
  { value: 'weightLoss', label: 'Weight loss' },
  { value: 'growth', label: 'Kitten (growing)' },
];

export function CatFoodCalculator() {
  const [weight, setWeight] = useState('9.9');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');
  const [stage, setStage] = useState<CatStage>('neuteredAdult');
  const [pctWet, setPctWet] = useState<'100' | '50' | '0'>('100');
  const [kcalCan, setKcalCan] = useState('85');
  const [kcalCup, setKcalCup] = useState('400');

  const weightNum = parseNum(weight);
  const weightKg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const r = useMemo(
    () => catFood({
      weightKg, stage,
      kcalPerCan: parseNum(kcalCan) ?? NaN,
      kcalPerCup: parseNum(kcalCup) ?? NaN,
      pctWet: Number(pctWet),
    }),
    [weightKg, stage, kcalCan, kcalCup, pctWet],
  );

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field
            id="w" label="Cat's weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            }
          />
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Life stage</p>
            <select
              aria-label="Life stage" value={stage}
              onChange={(e) => setStage(e.target.value as CatStage)}
              className="h-12 w-full rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink"
            >
              {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Wet vs dry</p>
            <Segmented scroll label="Wet vs dry" className="w-full"
              options={[
                { value: '100', label: 'All wet' },
                { value: '50', label: 'Half and half' },
                { value: '0', label: 'All dry' },
              ]}
              value={pctWet} onChange={setPctWet} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="can" label="Wet" suffix="kcal/can" value={kcalCan} onChange={(e) => setKcalCan(e.target.value)} helper="Per can" />
            <Field id="cup" label="Dry" suffix="kcal/cup" value={kcalCup} onChange={(e) => setKcalCup(e.target.value)} helper="Per cup" />
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Daily cat food">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your cat's weight to see an estimate.</p>
            ) : (
              <>
                <Overline>Feed about</Overline>
                <ResultNumber value={r.mer} unit="kcal/day" />
                <p className="text-[16px] text-ink">
                  {pctWet !== '0' && <>≈ {r.cansPerDay} cans of wet food</>}
                  {pctWet === '50' && ' + '}
                  {pctWet !== '100' && <>≈ {r.cupsPerDay} cups of dry food</>} a day.
                </p>
                <ResultDivider />
                <SecondaryRow label="Resting energy (RER)" value={`${r.rer} kcal`} />
                <SecondaryRow label="From wet food" value={`${r.wetKcal} kcal`} />
                <SecondaryRow label="From dry food" value={`${r.dryKcal} kcal`} />
                <div className="mt-3">
                  <ShowMath>
                    RER = 70 × kg^0.75; MER = factor × RER. Cans = wet kcal ÷ kcal per can.
                    <br />{r.wetKcal} ÷ {kcalCan} = {r.cansPerDay} cans.
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
