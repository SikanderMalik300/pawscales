'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { cetirizineDog, CETIRIZINE_DOG } from '@/lib/calc/zyrtec';
import { parseNum, lbToKg } from '@/lib/units';

const mg = (n: number) => `${Math.round(n)} mg`; // raw dose window (rounded)
const tmg = (n: number) => `${n} mg`; // exact tablet amount (keeps the .5)
const tabletWord = (n: number) => (n <= 1 ? 'tablet' : 'tablets');
const tabletRange = (lo: number, hi: number) =>
  lo === hi ? `${lo} ${tabletWord(lo)}` : `${lo}–${hi} tablets`;
const perKg = (mgAmt: number, kg: number) => Math.round((mgAmt / kg) * 10) / 10;

export function ZyrtecCalculator() {
  const [weight, setWeight] = useState('25');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');

  const weightNum = parseNum(weight);
  const kg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const r = useMemo(() => cetirizineDog(kg), [kg]);
  const freq = CETIRIZINE_DOG.freq;

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field id="w" label="Dog's weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            } />
          <p className="text-[13px] text-muted">
            Plain cetirizine (Zyrtec) for dogs, from the Merck Veterinary Manual and the
            AAHA 2023 guidelines. Cats use a flat dose; see the note below.
          </p>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Zyrtec dose">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your dog&rsquo;s weight for a dose.</p>
            ) : (
              <>
                <p className="mb-2 rounded-[10px] bg-sand px-3 py-2 text-[14px] font-medium text-ink">
                  Ask your vet before giving any medicine, and confirm the amount for your dog.
                </p>
                {r.noTablet ? (
                  <>
                    <Overline>Dose for this weight</Overline>
                    <p className="text-[20px] font-medium leading-tight text-ink">
                      {mg(r.lowMg)}&ndash;{mg(r.highMg)} once a day
                    </p>
                    <p className="mt-2 text-[14px] text-ink">
                      Too small for standard tablets. Ask your vet for the right product and amount.
                    </p>
                  </>
                ) : r.largeDog ? (
                  <>
                    <Overline>Typical dose</Overline>
                    <ResultNumber value={String(r.lowTablets)} unit={`× 10 mg ${tabletWord(r.lowTablets!)}`} />
                    <p className="text-[16px] text-ink">= {tmg(r.lowTabletMg!)} {freq}.</p>
                    <p className="mt-2 text-[14px] text-ink">
                      Merck lists 10&ndash;20 mg per dog for larger dogs. Your vet may
                      adjust this for your dog.
                    </p>
                  </>
                ) : (
                  <>
                    <Overline>Typical dose (start low)</Overline>
                    <ResultNumber value={String(r.lowTablets)} unit={`× 10 mg ${tabletWord(r.lowTablets!)}`} />
                    <p className="text-[16px] text-ink">
                      = {tmg(r.lowTabletMg!)} (about {perKg(r.lowTabletMg!, r.kg)} mg/kg), {freq}.
                    </p>
                    <ResultDivider />
                    <SecondaryRow label="Full range" value={`${mg(r.lowMg)}–${mg(r.highMg)} (${tabletRange(r.lowTablets!, r.highTablets!)})`} />
                    <SecondaryRow label="Never exceed" value={`20 mg (2 mg/kg) per dose`} />
                  </>
                )}
                <p className="mt-3 text-[13px] text-muted">
                  Only plain cetirizine. Never Zyrtec-D or any product with a
                  decongestant (pseudoephedrine or phenylephrine). Check liquids and
                  children&rsquo;s formulas for xylitol and other active ingredients.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
