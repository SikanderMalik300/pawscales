'use client';

import { useMemo, useState } from 'react';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { predictHeat, SIZE_BANDS, sizeInfo, type SizeBand } from '@/lib/calc/heatCycle';
import { parseISO, fmtLong } from '@/lib/date';

export function HeatCalculator() {
  const [band, setBand] = useState<SizeBand>('medium');
  const [hadHeat, setHadHeat] = useState<'yes' | 'no'>('yes');
  const [date, setDate] = useState('2026-09-15');

  const start = parseISO(date);
  const r = useMemo(
    () => (hadHeat === 'yes' && start ? predictHeat(start, band) : null),
    [hadHeat, date, band],
  );
  const size = sizeInfo(band);

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Her size</p>
            <select
              aria-label="Her size" value={band}
              onChange={(e) => setBand(e.target.value as SizeBand)}
              className="h-12 w-full rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink"
            >
              {SIZE_BANDS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Has she had a heat?</p>
            <Segmented label="Has she had a heat?" className="w-full"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'Not yet' }]}
              value={hadHeat} onChange={(v) => setHadHeat(v as 'yes' | 'no')} />
          </div>
          {hadHeat === 'yes' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="heat" className="text-[14px] font-medium text-ink">First day of her last heat</label>
              <input id="heat" type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="h-12 rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink" />
              <p className="text-[13px] text-muted">The day bleeding or swelling started.</p>
            </div>
          )}
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Heat cycle">
            {hadHeat === 'no' ? (
              <>
                <Overline>First heat for a {size.label.toLowerCase()} dog</Overline>
                <p className="text-[20px] font-medium leading-tight text-ink">Typically {size.firstHeat}.</p>
                <p className="mt-2 text-[14px] text-muted">
                  Come back once she has had her first heat for a dated timeline of the next one.
                </p>
              </>
            ) : !r ? (
              <p className="text-[16px] text-ink">Enter the first day of her last heat.</p>
            ) : (
              <>
                <Overline>Next heat, most likely around</Overline>
                <ResultNumber value={fmtLong(r.nextHeat)} />
                <p className="text-[16px] text-ink">
                  Expect it between {fmtLong(r.nextEarliest)} and {fmtLong(r.nextLatest)}. {r.size.intervalNote}.
                </p>
                <ResultDivider />
                <Overline>This cycle, stage by stage</Overline>
                {r.stages.map((s) => (
                  <SecondaryRow key={s.name} label={s.name} value={`${fmtLong(s.start)} – ${fmtLong(s.end)}`} />
                ))}
                <p className="mt-2 text-[14px] text-muted">
                  Dates use average stage lengths. Fertility can&rsquo;t be pinpointed from dates alone; vets time
                  breeding with progesterone tests.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
