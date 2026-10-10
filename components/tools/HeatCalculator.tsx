'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { predictHeat } from '@/lib/calc/heatCycle';
import { parseISO, fmtLong } from '@/lib/date';
import { parseNum } from '@/lib/units';

export function HeatCalculator() {
  const [date, setDate] = useState('2026-10-01');
  const [interval, setInterval] = useState('');

  const start = parseISO(date);
  const intervalNum = parseNum(interval);
  const months = intervalNum != null && intervalNum >= 4 && intervalNum <= 13 ? intervalNum : undefined;
  const r = useMemo(() => (start ? predictHeat(start, months) : null), [date, months]);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="heat" className="text-[14px] font-medium text-ink">First day of her last heat</label>
            <input id="heat" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink" />
            <p className="text-[13px] text-muted">The day bleeding started.</p>
          </div>
          <Field id="int" label="Her usual interval (optional)" suffix="months" value={interval}
            onChange={(e) => setInterval(e.target.value)} helper="Between 4 and 13. Leave blank to use the 7-month average." />
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Next heat">
            {!r ? (
              <p className="text-[16px] text-ink">Enter the first day of her last heat.</p>
            ) : (
              <>
                <Overline>Next heat, most likely around</Overline>
                <ResultNumber value={fmtLong(r.nextHeat)} />
                <p className="text-[16px] text-ink">
                  Could be anywhere from {fmtLong(r.nextEarliest)} to {fmtLong(r.nextLatest)}.
                </p>
                <ResultDivider />
                <SecondaryRow label="Proestrus (swelling, bleeding)" value={`${fmtLong(r.proestrusStart)} – ${fmtLong(r.proestrusEnd)}`} />
                <SecondaryRow label="Most fertile window" value={`${fmtLong(r.estrusStart)} – ${fmtLong(r.estrusEnd)}`} />
                <p className="mt-2 text-[14px] text-muted">
                  These are averages. Ovulation timing varies, and only a progesterone test confirms the fertile days.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
