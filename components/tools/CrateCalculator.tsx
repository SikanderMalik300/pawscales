'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow,
} from '@/components/ui/ResultPanel';
import { recommendCrate } from '@/lib/calc/crate';
import { parseNum, inToCm } from '@/lib/units';

export function CrateCalculator() {
  const [len, setLen] = useState('28');
  const [hgt, setHgt] = useState('22');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const l = parseNum(len);
  const h = parseNum(hgt);
  const toIn = (x: number) => (unit === 'cm' ? x / 2.54 : x);
  const r = useMemo(
    () => (l != null ? recommendCrate(toIn(l), h != null ? toIn(h) : 0) : null),
    [l, h, unit],
  );

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field id="len" label="Length, nose to tail base" suffix={unit} value={len}
            onChange={(e) => setLen(e.target.value)} />
          <Field id="hgt" label="Height, floor to top of head" suffix={unit} value={hgt}
            onChange={(e) => setHgt(e.target.value)} helper="Use ear tips if the ears stand up." />
          <div className="flex gap-2 text-[14px]">
            {(['in', 'cm'] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`seg-btn h-9 rounded-full px-4 font-medium ${unit === u ? 'bg-brand text-white' : 'border border-line bg-white text-ink'}`}>
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Recommended crate">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your dog's length.</p>
            ) : (
              <>
                <Overline>Recommended crate</Overline>
                <ResultNumber value={r.crate.length} unit="inch" />
                <p className="text-[16px] text-ink">
                  Typical height {r.crate.height} in, for dogs {r.crate.weight}.
                </p>
                <div className="mt-2">
                  <SecondaryRow label="Smallest that fits (length + 2)" value={`${Math.round(r.minLength)} in`} />
                  <SecondaryRow label="Ideal length (length + 4)" value={`${Math.round(r.idealLength)} in`} />
                  {unit === 'in' && <SecondaryRow label="In centimeters" value={`${Math.round(inToCm(r.crate.length))} cm`} />}
                </div>
                <p className="mt-2 text-[14px] text-muted">
                  Big enough to stand, turn around and lie down, not so big it loses the den feel.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
