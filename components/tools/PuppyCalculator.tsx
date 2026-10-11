'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import { ActionButton } from '@/components/ui/Button';
import {
  ResultPanel,
  Overline,
  ResultNumber,
  SecondaryRow,
  ResultDivider,
} from '@/components/ui/ResultPanel';
import { GrowthChart, type ChartPoint } from '@/components/ui/GrowthChart';
import { ShowMath } from '@/components/ui/ShowMath';
import { breedPages } from '@/lib/registry';
import {
  predictPuppyWeight,
  SIZE_LABELS,
  bandLabelKg,
  GIANT_LB,
  type SizeChoice,
} from '@/lib/calc/puppyWeight';
import { parseNum, lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

type WUnit = 'lb' | 'kg';
type AUnit = 'weeks' | 'months';
const WEEKS_PER_MONTH = 365.25 / 12 / 7;

const SIZE_OPTIONS: { value: SizeChoice; label: string }[] = [
  { value: 'ns', label: 'Not sure' },
  { value: 'I', label: SIZE_LABELS.I },
  { value: 'II', label: SIZE_LABELS.II },
  { value: 'III', label: SIZE_LABELS.III },
  { value: 'IV', label: SIZE_LABELS.IV },
  { value: 'V', label: SIZE_LABELS.V },
];

const fmt = (n: number) => roundTo(n, 1).toString();

export function PuppyCalculator() {
  // Default example 1: 16 weeks, 20 lb, Not sure
  const [age, setAge] = useState('16');
  const [ageUnit, setAgeUnit] = useState<AUnit>('weeks');
  const [weight, setWeight] = useState('20');
  const [wUnit, setWUnit] = useState<WUnit>('lb');
  const [size, setSize] = useState<SizeChoice>('ns');
  const [copied, setCopied] = useState(false);

  // Read inputs from the URL hash on mount (share links)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const p = new URLSearchParams(window.location.hash.slice(1));
    if (p.get('a')) setAge(p.get('a')!);
    if (p.get('au') === 'months' || p.get('au') === 'weeks') setAgeUnit(p.get('au') as AUnit);
    if (p.get('w')) setWeight(p.get('w')!);
    if (p.get('wu') === 'kg' || p.get('wu') === 'lb') setWUnit(p.get('wu') as WUnit);
    const s = p.get('s');
    if (s && ['ns', 'I', 'II', 'III', 'IV', 'V'].includes(s)) setSize(s as SizeChoice);
  }, []);

  const ageNum = parseNum(age);
  const weightNum = parseNum(weight);
  const ageWeeks = ageNum == null ? NaN : ageUnit === 'months' ? ageNum * WEEKS_PER_MONTH : ageNum;
  const weightKg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;

  const result = useMemo(
    () => predictPuppyWeight({ ageWeeks, weightKg, size }),
    [ageWeeks, weightKg, size],
  );

  const toW = (kg: number) => (wUnit === 'lb' ? kgToLb(kg) : kg);

  const hash = useMemo(() => {
    const p = new URLSearchParams({ a: age, au: ageUnit, w: weight, wu: wUnit, s: size });
    return '#' + p.toString();
  }, [age, ageUnit, weight, wUnit, size]);

  // keep the URL hash in sync for sharing (no history spam)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', hash);
    }
  }, [hash]);

  const onCopy = async () => {
    if (result.kind !== 'ok') return;
    const text = `My puppy's estimated adult weight: ${fmt(toW(result.adultKg))} ${wUnit} (range ${fmt(toW(result.lowKg))}-${fmt(toW(result.highKg))} ${wUnit}). Via pawscales.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; ignore */
    }
  };
  const onShare = async () => {
    const url = (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '') + hash;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const chart: ChartPoint[] =
    result.kind === 'ok'
      ? result.curveKg.map((c) => ({
          x: c.weeks,
          mid: roundTo(toW(c.mid), 1),
          low: roundTo(toW(c.low), 1),
          high: roundTo(toW(c.high), 1),
        }))
      : [];

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        {/* Inputs */}
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <Field
            id="age"
            label="Puppy's age"
            suffix={ageUnit}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            labelRight={
              <Segmented
                compact
                label="Age unit"
                options={[
                  { value: 'weeks', label: 'weeks' },
                  { value: 'months', label: 'months' },
                ]}
                value={ageUnit}
                onChange={setAgeUnit}
              />
            }
          />
          <Field
            id="weight"
            label="Current weight"
            suffix={wUnit}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented
                compact
                label="Weight unit"
                options={[
                  { value: 'lb', label: 'lb' },
                  { value: 'kg', label: 'kg' },
                ]}
                value={wUnit}
                onChange={setWUnit}
              />
            }
          />
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Expected adult size</p>
            <Segmented
              scroll
              label="Expected adult size"
              options={SIZE_OPTIONS}
              value={size}
              onChange={setSize}
              className="w-full"
            />
            <p className="mt-1.5 text-[13px] text-muted">
              Not sure? We'll pick the size band that best fits your puppy.
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Estimated adult weight">
            {result.kind === 'invalid' && (
              <p className="text-[16px] text-ink">
                Enter your puppy's age and current weight to see an estimate.
              </p>
            )}
            {result.kind === 'too-young' && (
              <p className="text-[16px] text-ink">
                Too young to predict reliably. Try again at 12 weeks.
              </p>
            )}
            {result.kind === 'ok' && (
              <>
                <Overline>Estimated adult weight</Overline>
                <ResultNumber value={fmt(toW(result.adultKg))} unit={wUnit} />
                <p className="text-[16px] text-ink">
                  Most puppies like yours end up between{' '}
                  <span className="font-medium tabular-nums">
                    {fmt(toW(result.lowKg))}
                  </span>{' '}
                  and{' '}
                  <span className="font-medium tabular-nums">
                    {fmt(toW(result.highKg))} {wUnit}
                  </span>
                  .
                </p>
                {result.giant && (
                  <p className="mt-2 text-[14px] text-ink">
                    Giant breeds keep growing past 2 years and aren't covered by this
                    data. Treat this as a minimum.
                  </p>
                )}
                <ResultDivider />
                <SecondaryRow
                  label="Now at % of adult weight"
                  value={`${Math.round(result.pctNow)}%`}
                />
                <SecondaryRow label="Based on dogs that grow to" value={bandLabelKg(result.cat)} />
                {size === 'ns' && (result.cat === 'IV' || result.cat === 'V') && breedPages().length > 0 && (
                  <p className="mt-1 text-[14px] text-ink">
                    See breed-specific charts:{' '}
                    {breedPages().map((b, i) => (
                      <span key={b.slug}>
                        {i > 0 && ', '}
                        <a className="link" href={`/${b.slug}/`}>{b.shortName.replace(' weight chart', '')}</a>
                      </span>
                    ))}
                    .
                  </p>
                )}
                <div className="my-3">
                  <GrowthChart
                    points={chart}
                    userPoint={{
                      x: Math.round(ageWeeks),
                      y: roundTo(toW(weightKg), 1),
                      label: 'your puppy',
                    }}
                    yUnit={wUnit}
                  />
                  <p className="mt-1 text-[13px] text-muted">
                    Median growth curve for dogs of {bandLabelKg(result.cat)}, scaled to
                    the estimate. Your puppy is the dot.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={onCopy}>
                      {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.75} />}
                      {copied ? 'Copied' : 'Copy'}
                    </ActionButton>
                    <ActionButton onClick={onShare}>
                      <Share2 size={16} strokeWidth={1.75} />
                      Share
                    </ActionButton>
                    <ActionButton onClick={() => typeof window !== 'undefined' && window.print()}>
                      <Printer size={16} strokeWidth={1.75} />
                      Print
                    </ActionButton>
                  </div>
                  <ShowMath>
                    adult weight = current weight ÷ % of adult weight at this age
                    <br />
                    {fmt(toW(result.adultKg))} {wUnit} = {fmt(toW(weightKg))} {wUnit} ÷{' '}
                    {roundTo(result.pctNow / 100, 3)}
                  </ShowMath>
                </div>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
