'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { GrowthChart, type ChartPoint } from '@/components/ui/GrowthChart';
import { predictPuppyWeight } from '@/lib/calc/puppyWeight';
import { bandForKg, MONTH_WEEKS } from '@/lib/calc/breedGrowth';
import { sizeBand, parentsRange, type DoodleBreed } from '@/lib/data/doodles';
import { parseNum, lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

const f1 = (n: number) => roundTo(n, 1).toString();

export function DoodleSizeCalculator({ breed }: { breed: DoodleBreed }) {
  const [mode, setMode] = useState<'size' | 'parents'>(breed.parentsFirst ? 'parents' : 'size');
  const [sizeName, setSizeName] = useState(breed.sizes[2]?.size ?? breed.sizes[0].size);
  const [mother, setMother] = useState(String(breed.defaultParents?.motherLb ?? 15));
  const [father, setFather] = useState(String(breed.defaultParents?.fatherLb ?? 65));
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');

  const size = breed.sizes.find((s) => s.size === sizeName)!;
  const mNum = parseNum(mother);
  const fNum = parseNum(father);

  // expected adult range + band for the chosen path
  const { label, band, rangeNote } = useMemo(() => {
    if (mode === 'size') {
      return {
        label: `${size.size}: ${size.weightLabel}, ${size.heightLabel}`,
        band: sizeBand(size),
        rangeNote: `Typical crate: ${size.crateIn} in.`,
      };
    }
    if (mNum != null && fNum != null && mNum > 0 && fNum > 0) {
      const r = parentsRange(mNum, fNum);
      return {
        label: `Roughly ${r.lowLb}–${r.highLb} lb`,
        band: bandForKg(lbToKg((r.lowLb + r.highLb) / 2)),
        rangeNote: 'From the lighter parent to the average of both. Mixed breeds vary a lot, so treat this as a rough guide.',
      };
    }
    return { label: 'Enter both parents’ weights', band: null as ReturnType<typeof sizeBand> | null, rangeNote: '' };
  }, [mode, size, mNum, fNum]);

  const ageNum = parseNum(age);
  const weightNum = parseNum(weight);
  const ageWeeks = ageNum == null ? NaN : ageNum * MONTH_WEEKS; // age entered in months
  const weightKg = weightNum == null ? NaN : lbToKg(weightNum);

  const projection = useMemo(() => {
    if (!band || !(ageWeeks > 0) || !(weightKg > 0)) return null;
    return predictPuppyWeight({ ageWeeks, weightKg, size: band });
  }, [band, ageWeeks, weightKg]);

  const chart: ChartPoint[] =
    projection && projection.kind === 'ok'
      ? projection.curveKg.map((c) => ({
          x: c.weeks, mid: roundTo(kgToLb(c.mid), 1), low: roundTo(kgToLb(c.low), 1), high: roundTo(kgToLb(c.high), 1),
        }))
      : [];

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Segmented label="Estimate by" className="w-full"
            options={[{ value: 'size', label: 'By size' }, { value: 'parents', label: 'By parents' }]}
            value={mode} onChange={setMode} />
          {mode === 'size' ? (
            <div>
              <p className="mb-1.5 text-[14px] font-medium text-ink">Size</p>
              <select aria-label="Size" value={sizeName} onChange={(e) => setSizeName(e.target.value)}
                className="h-12 w-full rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink">
                {breed.sizes.map((s) => <option key={s.size} value={s.size}>{s.size}</option>)}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field id="mum" label="Mother" suffix="lb" value={mother} onChange={(e) => setMother(e.target.value)} />
              <Field id="dad" label="Father" suffix="lb" value={father} onChange={(e) => setFather(e.target.value)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field id="age" label="Puppy age (opt.)" suffix="mo" value={age} onChange={(e) => setAge(e.target.value)} />
            <Field id="wt" label="Weight (opt.)" suffix="lb" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Goldendoodle size estimate">
            <Overline>Expected adult size</Overline>
            <p className="text-[22px] font-medium leading-tight text-ink">{label}</p>
            {rangeNote && <p className="mt-1 text-[14px] text-muted">{rangeNote}</p>}
            {projection && projection.kind === 'ok' && (
              <>
                <ResultDivider />
                <Overline>Projected adult weight</Overline>
                <ResultNumber value={f1(kgToLb(projection.adultKg))} unit="lb" />
                <SecondaryRow label="% of adult weight now" value={`${Math.round(projection.pctNow)}%`} />
                <SecondaryRow label="Likely range" value={`${f1(kgToLb(projection.lowKg))}–${f1(kgToLb(projection.highKg))} lb`} />
                <div className="my-3">
                  <GrowthChart points={chart}
                    userPoint={{ x: Math.round(ageWeeks), y: roundTo(weightNum ?? 0, 1), label: 'your puppy' }} yUnit="lb" />
                </div>
              </>
            )}
            {projection && projection.kind === 'too-young' && (
              <p className="mt-3 text-[14px] text-ink">Too young to project from weight. Try again at 12 weeks.</p>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
