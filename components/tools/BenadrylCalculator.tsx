'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { benadrylDose, BENADRYL, type Species } from '@/lib/calc/benadryl';
import { parseNum, lbToKg } from '@/lib/units';

const mg = (n: number) => `${Math.round(n)} mg`;
const tabs = (n: number) => `${n} ${n === 1 ? 'tablet' : 'tablets'}`;

export function BenadrylCalculator() {
  const [species, setSpecies] = useState<Species>('dog');
  const [weight, setWeight] = useState('25');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');

  const weightNum = parseNum(weight);
  const kg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const r = useMemo(() => benadrylDose(species, kg), [species, kg]);
  const cfg = BENADRYL[species];

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Pet</p>
            <Segmented label="Pet" className="w-full"
              options={[{ value: 'dog', label: 'Dog' }, { value: 'cat', label: 'Cat' }]}
              value={species} onChange={setSpecies} />
          </div>
          <Field id="w" label="Weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            } />
          <p className="text-[13px] text-muted">
            Uses plain diphenhydramine. Dog dose from the {BENADRYL.dog.source}; cat
            dose from the {BENADRYL.cat.source}.
          </p>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Benadryl dose">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your pet&rsquo;s weight for a dose range.</p>
            ) : (
              <>
                <p className="mb-2 rounded-[10px] bg-sand px-3 py-2 text-[14px] font-medium text-ink">
                  Ask your vet before giving any medicine, and confirm the amount for your pet.
                </p>
                {r.noTablet ? (
                  <>
                    <Overline>Dose for this weight</Overline>
                    <p className="text-[20px] font-medium leading-tight text-ink">
                      {mg(r.lowMg)}&ndash;{mg(r.highMg)} per dose
                    </p>
                    <p className="mt-2 text-[14px] text-ink">
                      {r.tooSmall
                        ? 'Too small for standard tablets. Ask your vet for the right product and amount.'
                        : 'A standard 25 mg tablet does not divide to this dose. Ask your vet for a liquid or the exact amount.'}
                    </p>
                  </>
                ) : (
                  <>
                    <Overline>Typical dose (start low)</Overline>
                    <ResultNumber value={String(r.lowTablets)} unit={`× 25 mg ${r.lowTablets === 1 ? 'tablet' : 'tablets'}`} />
                    <p className="text-[16px] text-ink">
                      About {mg(r.leadMg)} to start (~1 mg/lb), {cfg.freq}.
                    </p>
                    <ResultDivider />
                    <SecondaryRow label="Full range" value={`${mg(r.lowMg)}–${mg(r.highMg)} (${tabs(r.lowTablets!)}–${tabs(r.highTablets!)})`} />
                    <SecondaryRow label="Never exceed" value={`${mg(r.highMg)} (${cfg.maxMgKg} mg/kg) per dose`} />
                  </>
                )}
                <p className="mt-3 text-[13px] text-muted">
                  Only plain diphenhydramine. Never a product with a decongestant
                  (Benadryl-D, or any with pseudoephedrine or phenylephrine). For 12.5 mg
                  children&rsquo;s products, check the label for xylitol and other active
                  ingredients.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
