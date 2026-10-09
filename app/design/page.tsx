'use client';

import { useMemo, useState } from 'react';
import { Copy, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
import growth from '@/data/growth-ratios.json';

const TOKENS: { name: string; var: string }[] = [
  { name: 'bg', var: '--bg' },
  { name: 'surface', var: '--surface' },
  { name: 'surface-2', var: '--surface-2' },
  { name: 'ink', var: '--ink' },
  { name: 'text', var: '--text' },
  { name: 'muted', var: '--muted' },
  { name: 'border', var: '--border' },
  { name: 'border-strong', var: '--border-strong' },
  { name: 'brand', var: '--brand' },
  { name: 'brand-hover', var: '--brand-hover' },
  { name: 'brand-tint', var: '--brand-tint' },
  { name: 'accent', var: '--accent' },
  { name: 'accent-ink', var: '--accent-ink' },
  { name: 'danger', var: '--danger' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="mb-4 text-[22px] font-semibold sm:text-[26px]">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignPage() {
  const [weight, setWeight] = useState('20');
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');
  const [copied, setCopied] = useState(false);

  // Build a demo growth curve from band I normalized points, scaled to adult 48 lb.
  const chartPoints: ChartPoint[] = useMemo(() => {
    const adult = 48;
    return (growth.categories.I.points as any[]).map((p) => ({
      x: p.weeks,
      mid: +(p.normMedianSmoothed * adult).toFixed(1),
      low: +(p.normP25 * adult).toFixed(1),
      high: +(p.normP75 * adult).toFixed(1),
    }));
  }, []);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: 'PawScales', href: '/' }, { name: 'Design system' }]} />
      <h1 className="mt-3 text-[28px] font-semibold sm:text-[36px]">
        PawScales design system
      </h1>
      <p className="mt-2 max-w-prose text-[17px] text-text">
        Internal showcase of tokens and components. Not indexed, not in the nav or
        sitemap. Used to review the whole system in one place.
      </p>

      <Section title="Color tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {TOKENS.map((t) => (
            <div key={t.name} className="rounded-[10px] border border-border p-2">
              <div
                className="h-12 w-full rounded-[6px] border border-border"
                style={{ backgroundColor: `var(${t.var})` }}
              />
              <p className="mt-1 text-[13px] font-semibold text-ink">{t.name}</p>
              <p className="text-[12px] text-muted">{t.var}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-[36px] font-semibold leading-[1.15]">
            H1 Newsreader 36
          </p>
          <p className="font-heading text-[26px] font-semibold leading-[1.25]">
            H2 Newsreader 26
          </p>
          <p className="text-[18px] font-semibold leading-[1.35]">H3 Public Sans 18</p>
          <p className="text-[17px] leading-[1.55]">Lead / quick answer 17</p>
          <p className="text-[16px] leading-[1.6]">Body 16 with tabular 1234567890</p>
          <p className="text-[14px] font-semibold">UI label 14</p>
          <p className="text-[13px] text-muted">Small / caption 13</p>
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">
            Overline 12
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="text">Text button</Button>
          <Button variant="secondary" onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}>
            <Copy size={16} strokeWidth={1.75} />
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="secondary">
            <Share2 size={16} strokeWidth={1.75} />
            Share
          </Button>
          <Button variant="secondary">
            <Printer size={16} strokeWidth={1.75} />
            Print
          </Button>
        </div>
      </Section>

      <Section title="Calculator card (inputs + result)">
        <div className="rounded-[10px] border border-border bg-surface p-4 shadow-card sm:p-6">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="flex flex-col gap-4 md:col-span-5">
              <Field id="d-age" label="Age" suffix="weeks" defaultValue="16" inputMode="decimal" />
              <div className="flex items-end gap-3">
                <Field
                  id="d-weight"
                  label="Current weight"
                  suffix={unit}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  inputMode="decimal"
                  className="flex-1"
                />
                <Segmented
                  label="Weight unit"
                  pill
                  options={[
                    { value: 'lb', label: 'lb' },
                    { value: 'kg', label: 'kg' },
                  ]}
                  value={unit}
                  onChange={setUnit}
                />
              </div>
              <div>
                <p className="mb-1 text-[14px] font-semibold text-ink">Expected adult size</p>
                <Segmented
                  label="Expected adult size"
                  options={[
                    { value: 'ns', label: 'Not sure' },
                    { value: 'toy', label: 'Toy' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                  ]}
                  value="ns"
                  onChange={() => {}}
                />
              </div>
              <Field id="d-err" label="Field with error" suffix="lb" defaultValue="-5" error="Enter a weight above 0." />
            </div>
            <div className="md:col-span-7">
              <ResultPanel ariaLabel="Estimated adult weight">
                <Overline>Estimated adult weight</Overline>
                <ResultNumber value="48" unit="lb" />
                <p className="text-[16px] text-text">Most puppies like yours: 44–53 lb</p>
                <ResultDivider />
                <SecondaryRow label="Now at % of adult weight" value="41%" />
                <SecondaryRow label="Based on dogs of" value="15–30 kg" />
                <div className="my-3">
                  <GrowthChart
                    points={chartPoints}
                    userPoint={{ x: 16, y: 20, label: 'your puppy' }}
                    yUnit="lb"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <Button variant="secondary"><Copy size={16} strokeWidth={1.75} />Copy</Button>
                    <Button variant="secondary"><Share2 size={16} strokeWidth={1.75} />Share</Button>
                    <Button variant="secondary"><Printer size={16} strokeWidth={1.75} />Print</Button>
                  </div>
                  <ShowMath>
                    adult = weight ÷ normalized ratio at age<br />
                    48 lb = 20 lb ÷ 0.41
                  </ShowMath>
                </div>
              </ResultPanel>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet’s health.
        </p>
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
            { cells: { wk: '24', i: '70%', iii: '69%', v: '66%' } },
            { cells: { wk: '52', i: '93%', iii: '92%', v: '93%' } },
          ]}
          source={
            <>
              Source: Salt et al., PLoS ONE 2017 (Liverpool datacat #377, CC BY 4.0).
            </>
          }
        />
      </Section>

      <Section title="Note boxes">
        <div className="grid gap-4 md:grid-cols-2">
          <NoteBox label="Note" icon>
            Individual dogs vary by up to 50%. Adjust by body condition and ask your
            vet.
          </NoteBox>
          <NoteBox label="See your vet if" danger icon>
            <ul>
              <li>More than 30–60 minutes of strong straining with no puppy.</li>
              <li>Green or bloody discharge before the first puppy.</li>
              <li>No labor 24 hours after the temperature drop.</li>
            </ul>
          </NoteBox>
        </div>
      </Section>

      <Section title="FAQ">
        <Faq
          items={[
            {
              q: 'How accurate is a puppy weight calculator?',
              a: 'It gives a range, not a guarantee. Most puppies land within a few pounds of the estimate, but individual dogs vary.',
            },
            {
              q: 'At what age is a puppy half its adult weight?',
              a: 'Small breeds reach about half their adult weight near 16 weeks; large breeds a little later.',
            },
          ]}
        />
      </Section>

      <Section title="Author box">
        <AuthorBox updated="October 10, 2026" />
      </Section>
    </div>
  );
}
