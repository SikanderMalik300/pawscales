'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow,
} from '@/components/ui/ResultPanel';
import { sizeCollar } from '@/lib/calc/collar';
import { parseNum } from '@/lib/units';

export function CollarCalculator() {
  const [neck, setNeck] = useState('14');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const n = parseNum(neck);
  const neckIn = n == null ? NaN : unit === 'cm' ? n / 2.54 : n;
  const r = useMemo(() => sizeCollar(neckIn), [neckIn]);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field id="neck" label="Neck measurement" suffix={unit} value={neck}
            onChange={(e) => setNeck(e.target.value)}
            labelRight={
              <Segmented compact label="Unit"
                options={[{ value: 'in', label: 'in' }, { value: 'cm', label: 'cm' }]}
                value={unit} onChange={setUnit} />
            }
            helper="Where the collar sits, with two fingers under the tape." />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Collar size">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your dog's neck measurement.</p>
            ) : (
              <>
                <Overline>Collar length</Overline>
                <ResultNumber value={unit === 'cm' ? r.collarCm : r.collarIn} unit={unit} />
                <p className="text-[16px] text-ink">That's the neck plus 2 inches (the two-finger rule).</p>
                <div className="mt-2">
                  <SecondaryRow label="Generic size" value={r.genericSize ?? 'Out of standard range'} />
                  <SecondaryRow label="Also equals" value={unit === 'cm' ? `${r.collarIn} in` : `${r.collarCm} cm`} />
                </div>
                <p className="mt-2 text-[14px] text-muted">Sizes vary by brand. Check the brand's own chart before buying.</p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
