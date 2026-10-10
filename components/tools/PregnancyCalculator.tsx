'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { predictPregnancy, TIMELINE } from '@/lib/calc/pregnancy';
import { parseISO, fmtLong, toISO } from '@/lib/date';

export function PregnancyCalculator() {
  const [date, setDate] = useState('2026-11-01');
  const [fromOvulation, setFromOvulation] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(parseISO(new Date().toISOString().slice(0, 10)));
  }, []);

  const breeding = parseISO(date);
  const r = useMemo(
    () => (breeding ? predictPregnancy(breeding, fromOvulation, today ?? undefined) : null),
    [date, fromOvulation, today],
  );

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bred" className="text-[14px] font-medium text-ink">
              {fromOvulation ? 'Ovulation date' : 'Date of first breeding'}
            </label>
            <input
              id="bred" type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-[16px] text-ink">
            <input type="checkbox" checked={fromOvulation} onChange={(e) => setFromOvulation(e.target.checked)}
              className="mt-1 h-5 w-5 rounded-[4px] border border-field accent-brand" />
            Ovulation confirmed by a progesterone test (narrows the range)
          </label>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Due date">
            {!r ? (
              <p className="text-[16px] text-ink">Enter the breeding date.</p>
            ) : (
              <>
                <Overline>Due date</Overline>
                <ResultNumber value={fmtLong(r.due)} />
                <p className="text-[16px] text-ink">
                  Normal range {fmtLong(r.earliest)} to {fmtLong(r.latest)} ({r.rangeDays} days either side).
                </p>
                <ResultDivider />
                {r.dayOfPregnancy != null ? (
                  <>
                    <SecondaryRow label="Today" value={`Day ${r.dayOfPregnancy}, week ${r.week}`} />
                    <SecondaryRow label="Days to go" value={`${r.daysToGo}`} />
                  </>
                ) : (
                  <SecondaryRow label="Length" value="About 63 days" />
                )}
                <SecondaryRow label="Prepare the whelping box by" value={fmtLong(r.whelpBox)} />
                <SecondaryRow label="Start temperature twice daily from" value={fmtLong(r.tempWatch)} />
              </>
            )}
          </ResultPanel>
          {r && (
            <div className="mt-4 overflow-hidden rounded-[16px] border border-line">
              {TIMELINE.map((t) => {
                const isNow = r.week === t.week;
                return (
                  <div key={t.week} className={`flex gap-3 border-b border-line p-3 last:border-b-0 ${isNow ? 'bg-lime' : ''}`}>
                    <div className="w-20 shrink-0 text-[13px] font-semibold text-ink">
                      Week {t.week}
                      <div className="font-normal text-muted">{t.days}</div>
                    </div>
                    <p className="text-[15px] text-ink">{t.milestone}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
