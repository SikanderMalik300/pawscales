'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { tabletDose } from '@/lib/calc/tabletDose';
import { parseNum, lbToKg } from '@/lib/units';

const mgTxt = (n: number) => `${n} mg`;
// Dose window: low already rounded up, high rounded down; collapse if equal.
const mgWindow = (lo: number, hi: number) => (lo === hi ? mgTxt(hi) : `${mgTxt(lo)}–${mgTxt(hi)}`);
const tmg = (n: number) => `${n} mg`; // exact tablet amount (keeps the .5)
const perKg = (mgAmt: number, kg: number) => Math.round((mgAmt / kg) * 10) / 10;
const nounFor = (label: string) => (/chewable/i.test(label) ? 'chewable' : 'tablet');
const plural = (n: number, noun: string) => `${noun}${n === 1 ? '' : 's'}`;

export interface TabletOption { mg: number; label: string }

export function DogTabletCalculator({
  minMgKg, maxMgKg, freq, tablets, defaultTabletMg, sourceNote, warning,
}: {
  minMgKg: number;
  maxMgKg: number;
  freq: string;
  tablets: readonly TabletOption[];
  defaultTabletMg: number;
  sourceNote: ReactNode;
  warning: ReactNode;
}) {
  const [weight, setWeight] = useState('20');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');
  const [tabletMg, setTabletMg] = useState(defaultTabletMg);

  const weightNum = parseNum(weight);
  const kg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const r = useMemo(() => tabletDose(minMgKg, maxMgKg, kg, tabletMg), [minMgKg, maxMgKg, kg, tabletMg]);
  const noun = nounFor(tablets.find((t) => t.mg === tabletMg)?.label ?? 'tablet');
  const tabletRange = (lo: number, hi: number) => (lo === hi ? `${lo} ${plural(lo, noun)}` : `${lo}–${hi} ${plural(hi, noun)}`);

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
          {tablets.length > 1 && (
            <div>
              <p className="mb-1.5 text-[14px] font-medium text-ink">Tablet strength</p>
              <Segmented label="Tablet strength" className="w-full"
                options={tablets.map((t) => ({ value: String(t.mg), label: t.label }))}
                value={String(tabletMg)} onChange={(v) => setTabletMg(Number(v))} />
            </div>
          )}
          <p className="text-[13px] text-muted">{sourceNote}</p>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Dose result">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your dog&rsquo;s weight for a dose range.</p>
            ) : (
              <>
                <p className="mb-2 rounded-[10px] bg-sand px-3 py-2 text-[14px] font-medium text-ink">
                  Ask your vet before giving any medicine, and confirm the amount for your dog.
                </p>
                {r.noTablet ? (
                  <>
                    <Overline>Dose for this weight</Overline>
                    <p className="text-[20px] font-medium leading-tight text-ink">{mgWindow(r.lowMgShown, r.highMgShown)} per dose</p>
                    <p className="mt-2 text-[14px] text-ink">
                      {r.tooSmall
                        ? `Too small for a ${tabletMg} mg ${noun}. Ask your vet for a liquid or a compounded dose.`
                        : `A ${tabletMg} mg ${noun} does not divide to this dose. Ask your vet for a liquid or the exact amount.`}
                    </p>
                  </>
                ) : (
                  <>
                    <Overline>Typical dose (start low)</Overline>
                    <ResultNumber value={String(r.lowTablets)} unit={`× ${tabletMg} mg ${plural(r.lowTablets!, noun)}`} />
                    <p className="text-[16px] text-ink">
                      = {tmg(r.lowTabletMg!)} (about {perKg(r.lowTabletMg!, r.kg)} mg/kg), {freq}.
                    </p>
                    <ResultDivider />
                    <SecondaryRow label="Full range" value={`${mgWindow(r.lowMgShown, r.highMgShown)} (${tabletRange(r.lowTablets!, r.highTablets!)})`} />
                    <SecondaryRow label="Never exceed" value={`${mgTxt(r.highMgShown)} (${maxMgKg} mg/kg) per dose`} />
                  </>
                )}
                <div className="mt-3 text-[13px] text-muted">{warning}</div>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
