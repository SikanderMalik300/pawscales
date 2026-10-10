'use client';

import { useState } from 'react';
import { Copy, Share2, Printer, ArrowRight } from 'lucide-react';
import { Button, ActionButton } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel,
  Overline,
  ResultNumber,
  SecondaryRow,
  ResultDivider,
} from '@/components/ui/ResultPanel';
import { DataTable } from '@/components/ui/Table';
import { NoteBox } from '@/components/ui/NoteBox';
import { Faq } from '@/components/ui/Faq';
import { GrowthChart, type ChartPoint } from '@/components/ui/GrowthChart';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShowMath } from '@/components/ui/ShowMath';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { Logo } from '@/components/Logo';
import growth from '@/data/growth-ratios.json';

const TOKENS = [
  'bg', 'ink', 'muted', 'line', 'field', 'sand', 'brand', 'brand-hover',
  'sage', 'sky', 'butter', 'lime', 'accent', 'danger',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="mb-4 text-[22px] sm:text-[26px]">{title}</h2>
      {children}
    </section>
  );
}

// demo growth curve (band IV, normalized), scaled to the Ex1 estimate 45.3 lb
const chartPoints: ChartPoint[] = (growth.categories.IV.points as any[]).map((p) => ({
  x: p.weeks,
  mid: +(p.normMedianSmoothed * 45.3).toFixed(1),
  low: +(p.normP25 * 45.3).toFixed(1),
  high: +(p.normP75 * 45.3).toFixed(1),
}));

export default function DesignPage() {
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');
  const [size, setSize] = useState('ns');

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: 'PawScales', href: '/' }, { name: 'Design system' }]} />
      <h1 className="mt-3 text-[30px] sm:text-[40px]">PawScales design system (v2)</h1>
      <p className="mt-2 max-w-prose text-[18px] text-ink">
        Internal showcase of tokens and components. Not indexed, not in the nav or
        sitemap.
      </p>

      <Section title="Logo">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            <div>
              <Logo className="h-7" />
              <p className="mt-2 text-[13px] text-muted">Header, light background (28px)</p>
            </div>
            <div className="rounded-[16px] bg-ink p-5">
              <Logo className="h-7" white />
              <p className="mt-2 text-[13px]" style={{ color: '#BFE0CC' }}>On dark background</p>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-8">
            <div className="text-center">
              <img src="/pawscales-mark.svg" alt="PawScales mark" width={64} height={64} className="h-16 w-16" />
              <p className="mt-2 text-[13px] text-muted">Mark 64px</p>
            </div>
            <div className="text-center">
              <img src="/apple-touch-icon.png" alt="App icon" width={48} height={48} className="h-12 w-12 rounded-[10px]" />
              <p className="mt-2 text-[13px] text-muted">App icon</p>
            </div>
            <div className="text-center">
              <img src="/favicon.svg" alt="Favicon" width={32} height={32} className="h-8 w-8" />
              <p className="mt-2 text-[13px] text-muted">Favicon 32px</p>
            </div>
            <div className="text-center">
              <img src="/favicon-16.png" alt="Favicon 16" width={16} height={16} className="h-4 w-4" />
              <p className="mt-2 text-[13px] text-muted">Favicon 16px</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {TOKENS.map((t) => (
            <div key={t} className="rounded-[16px] border border-line p-2">
              <div
                className="h-12 w-full rounded-[12px] border border-line"
                style={{ backgroundColor: `var(--${t})` }}
              />
              <p className="mt-1 text-[13px] font-medium text-ink">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography (Figtree)">
        <div className="flex flex-col gap-2">
          <p className="text-[40px] font-medium leading-[1.12]">H1 Figtree 40 / 500</p>
          <p className="text-[26px] font-medium leading-[1.25]">H2 Figtree 26 / 500</p>
          <p className="text-[18px] font-semibold">H3 Figtree 18 / 600</p>
          <p className="text-[18px]">Lead / quick answer 18 / 400</p>
          <p className="text-[16px]">Body 16 with tabular figures 1234567890</p>
          <p className="text-[14px] font-medium">UI label 14 / 500</p>
          <p className="text-[13px] text-muted">Small / caption 13</p>
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">Overline 12</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="secondary">Secondary</Button>
          <ActionButton><Copy size={16} strokeWidth={1.75} />Copy</ActionButton>
          <ActionButton><Share2 size={16} strokeWidth={1.75} />Share</ActionButton>
          <ActionButton><Printer size={16} strokeWidth={1.75} />Print</ActionButton>
        </div>
        <div className="mt-3 inline-flex rounded-[16px] bg-sage p-4">
          <Button variant="onband">On a color band</Button>
        </div>
      </Section>

      <Section title="Photo tiles">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          <PhotoTile href="/puppy-weight-calculator/" photoId="puppy-weight-calculator" label="Puppy weight calculator" description="Predict adult weight by age." />
          <PhotoTile href="/dog-years-calculator/" photoId="dog-years-calculator" label="Dog years calculator" description="Dog age in human years." />
          <PhotoTile href="/cat-years-calculator/" photoId="cat-years-calculator" label="Cat years calculator" description="Cat age in human years." />
          <PhotoTile href="/dog-crate-size-chart/" photoId="dog-crate-size-chart" label="Dog crate size chart" description="Find the right crate size." />
        </div>
      </Section>

      <Section title="Home hero (mini)">
        <div className="overflow-hidden rounded-[16px] border border-line md:grid md:grid-cols-2">
          <div className="bg-lime p-6">
            <h3 className="text-[26px] font-medium leading-[1.12]">Free dog and cat calculators, built on real data</h3>
            <p className="mt-2 text-[16px] text-ink">Every number has a source.</p>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[14px] font-medium">Puppy weight</span>
              <span className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[14px] font-medium">Dog years</span>
            </div>
          </div>
          <div className="aspect-[3/2] md:aspect-auto">
            <PhotoTile href="/" photoId="hero" label="" />
          </div>
        </div>
      </Section>

      <Section title="Calculator card (inputs + result)">
        <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
              <Field
                id="d-age"
                label="Puppy's age"
                suffix="weeks"
                defaultValue="16"
                labelRight={
                  <Segmented compact label="Age unit" options={[{ value: 'weeks', label: 'weeks' }, { value: 'months', label: 'months' }]} value="weeks" onChange={() => {}} />
                }
              />
              <Field
                id="d-weight"
                label="Current weight"
                suffix={unit}
                defaultValue="20"
                labelRight={
                  <Segmented compact label="Weight unit" options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} value={unit} onChange={setUnit} />
                }
              />
              <div>
                <p className="mb-1.5 text-[14px] font-medium text-ink">Expected adult size (scrolls on mobile)</p>
                <Segmented
                  scroll
                  label="Expected adult size"
                  className="w-full"
                  options={[
                    { value: 'ns', label: 'Not sure' },
                    { value: 'I', label: 'Toy' },
                    { value: 'II', label: 'Small' },
                    { value: 'III', label: 'Medium' },
                    { value: 'IV', label: 'Large' },
                    { value: 'V', label: 'X-Large' },
                  ]}
                  value={size}
                  onChange={setSize}
                />
              </div>
              <Field id="d-err" label="Field with error" suffix="lb" defaultValue="-5" error="Enter a weight above 0." />
            </div>
            <div className="min-w-0 md:col-span-7">
              <ResultPanel ariaLabel="Estimated adult weight">
                <Overline>Estimated adult weight</Overline>
                <ResultNumber value="45.3" unit="lb" />
                <p className="text-[16px] text-ink">Most puppies like yours end up between 39.7 and 51.9 lb.</p>
                <ResultDivider />
                <SecondaryRow label="Now at % of adult weight" value="44%" />
                <SecondaryRow label="Based on dogs that grow to" value="15–30 kg" />
                <div className="my-3">
                  <GrowthChart points={chartPoints} userPoint={{ x: 16, y: 20, label: 'your puppy' }} yUnit="lb" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <ActionButton><Copy size={16} strokeWidth={1.75} />Copy</ActionButton>
                    <ActionButton><Share2 size={16} strokeWidth={1.75} />Share</ActionButton>
                    <ActionButton><Printer size={16} strokeWidth={1.75} />Print</ActionButton>
                  </div>
                  <ShowMath>45.3 lb = 20 lb ÷ 0.44</ShowMath>
                </div>
              </ResultPanel>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Tool page bands (one per hub color)">
        <div className="space-y-3">
          {[
            ['Dog tools', 'bg-sage'],
            ['Cat tools', 'bg-sky'],
            ['Size charts', 'bg-butter'],
          ].map(([label, bg]) => (
            <div key={label} className={`rounded-[16px] ${bg} p-5`}>
              <p className="text-[13px] text-muted">Breadcrumbs / {label}</p>
              <p className="text-[26px] font-medium">{label} band</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tables">
        <DataTable
          caption="% of adult weight by age (at 2 years)"
          columns={[
            { key: 'wk', header: 'Age (weeks)' },
            { key: 'i', header: 'Toy', numeric: true },
            { key: 'iii', header: 'Medium', numeric: true },
            { key: 'v', header: 'X-Large', numeric: true },
          ]}
          rows={[
            { cells: { wk: '12', i: '39%', iii: '34%', v: '30%' } },
            { cells: { wk: '16', i: '51%', iii: '46%', v: '43%' }, highlight: true, tag: 'Your dog' },
            { cells: { wk: '32*', i: '84%', iii: '83%', v: '84%' } },
            { cells: { wk: '52', i: '93%', iii: '92%', v: '93%' } },
          ]}
          footnote="* Interpolated between observed ages."
          source={<>Source: Salt et al., PLoS ONE 2017 (Liverpool datacat #377, CC BY 4.0).</>}
        />
      </Section>

      <Section title="Note boxes">
        <div className="grid gap-4 md:grid-cols-2">
          <NoteBox label="Note">Individual dogs vary by up to 50%. Adjust by body condition and ask your vet.</NoteBox>
          <NoteBox label="See your vet if" danger>
            <ul>
              <li>More than 30–60 minutes of strong straining with no puppy.</li>
              <li>Green or bloody discharge before the first puppy.</li>
            </ul>
          </NoteBox>
        </div>
      </Section>

      <Section title="FAQ">
        <Faq
          items={[
            { q: 'How accurate is a puppy weight calculator?', a: 'It gives a range, not a promise. Most puppies land inside the range shown.' },
            { q: 'At what age is a puppy half its adult weight?', a: 'Small breeds reach about half their adult weight near 16 weeks.' },
          ]}
        />
      </Section>

      <Section title="Author box">
        <AuthorBox updated="October 10, 2026" />
      </Section>
    </div>
  );
}
