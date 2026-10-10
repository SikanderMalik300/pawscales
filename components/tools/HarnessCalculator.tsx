'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { ResultPanel, Overline } from '@/components/ui/ResultPanel';
import { matchHarness } from '@/lib/data/harnessSizes';
import { parseNum } from '@/lib/units';

export function HarnessCalculator() {
  const [girth, setGirth] = useState('22');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const g = parseNum(girth);
  const girthIn = g == null ? NaN : unit === 'cm' ? g / 2.54 : g;
  const matches = useMemo(() => (Number.isFinite(girthIn) ? matchHarness(girthIn) : null), [girthIn]);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field id="girth" label="Chest girth" suffix={unit} value={girth}
            onChange={(e) => setGirth(e.target.value)}
            labelRight={
              <Segmented compact label="Unit"
                options={[{ value: 'in', label: 'in' }, { value: 'cm', label: 'cm' }]}
                value={unit} onChange={setUnit} />
            }
            helper="Widest point of the chest, just behind the front legs." />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Harness sizes by brand">
            {!matches ? (
              <p className="text-[16px] text-ink">Enter your dog's chest girth.</p>
            ) : (
              <>
                <Overline>Your size by brand</Overline>
                <div className="mt-2 overflow-hidden rounded-[12px] border border-line">
                  {matches.map((m) => (
                    <div key={m.brand} className="flex items-center justify-between gap-3 border-b border-line p-3 last:border-b-0">
                      <div>
                        <a href={m.url} className="link text-[16px] font-medium">{m.brand}</a>
                        <span className="text-[13px] text-muted"> · {m.model}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[16px] font-semibold text-ink">{m.size ?? 'No fit'}</span>
                        {m.between && <span className="ml-2 rounded-full bg-lime px-2 py-0.5 text-[12px] font-semibold text-ink">between sizes</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[14px] text-muted">
                  "No fit" means this girth is outside that brand's range. Always check the brand's own chart.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
