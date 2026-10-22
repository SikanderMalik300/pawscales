import type { ReactNode } from 'react';
import { SITE, HUBS, bySlug } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { Band } from '@/components/ui/Band';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { DataTable } from '@/components/ui/Table';
import { NoteBox } from '@/components/ui/NoteBox';
import { Faq, type FaqItem } from '@/components/ui/Faq';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema';
import { DogTabletCalculator, type TabletOption } from '@/components/tools/DogTabletCalculator';
import { tabletDoseLb } from '@/lib/calc/tabletDose';

const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const mgWindow = (lo: number, hi: number) => (lo === hi ? `${hi} mg` : `${lo} mg–${hi} mg`);
const nounFor = (label: string) => (/chewable/i.test(label) ? 'chewable' : 'tablet');

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

export interface MedCalcConfig {
  minMgKg: number;
  maxMgKg: number;
  freq: string;
  tablets: readonly TabletOption[];
  defaultTabletMg: number;
  sourceNote: ReactNode;
  warning: ReactNode;
}

export interface MedicationContent {
  slug: string;
  drugName: string; // clean label for captions, e.g. "Dramamine"
  quickAnswer: ReactNode;
  reviewed: string;
  calc: MedCalcConfig;
  chartWeights: number[];
  chartSource: ReactNode;
  doseIntro: ReactNode;
  productWarning: { label: string; body: ReactNode };
  catNote: { label: string; body: ReactNode };
  whoShouldnt: ReactNode;
  overdose: ReactNode;
  faq: FaqItem[];
  sources: ReactNode[]; // <li> contents
}

export function MedicationPage(c: MedicationContent) {
  const entry = bySlug(c.slug)!;
  const photo = getPhoto(c.slug)!;
  const url = `${SITE.url}/${c.slug}/`;
  const updated = fmtDate(entry.lastUpdated);
  const tMg = c.calc.defaultTabletMg;
  const noun = nounFor(c.calc.tablets.find((t) => t.mg === tMg)?.label ?? 'tablet');

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: dogHub.h1, url: `${SITE.url}/${dogHub.slug}/` },
        { name: entry.h1, url },
      ])} />
      <JsonLd data={webPageSchema({ name: entry.h1, url, description: entry.metaDescription, published: entry.published, lastUpdated: entry.lastUpdated, reviewed: true })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />

      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: dogHub.h1, href: `/${dogHub.slug}/` },
          { name: entry.shortName },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">{entry.h1}</h1>
            <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">{c.quickAnswer}</p>
            <p className="mt-3 text-[13px] text-muted">
              By {SITE.author} · Updated {updated} · <a href="#sources" className="link">Sources</a>
            </p>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
              <Picture photo={photo} crop="ld" sizes="(min-width: 960px) 33vw, 100vw" eager />
            </div>
            <p className="mt-1 text-[12px] text-muted">Photo: {photo.photographer} / {photo.source}</p>
          </div>
        </div>
      </Band>

      <div className="container-page -mt-14">
        <DogTabletCalculator
          minMgKg={c.calc.minMgKg} maxMgKg={c.calc.maxMgKg} freq={c.calc.freq}
          tablets={c.calc.tablets} defaultTabletMg={c.calc.defaultTabletMg}
          sourceNote={c.calc.sourceNote} warning={c.calc.warning} />
        <p className="mt-2 text-[13px] text-muted">
          An estimate, not veterinary advice. {c.reviewed}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label={c.productWarning.label} danger>{c.productWarning.body}</NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>{c.doseIntro}</section>

        <DataTable
          caption={`${c.drugName} dose by weight`}
          tableCaption={`${c.drugName} dose for dogs by weight`}
          columns={[
            { key: 'w', header: 'Weight' },
            { key: 'dose', header: 'Dose per dose', numeric: true },
            { key: 'tabs', header: `${tMg} mg ${noun}s`, numeric: true },
          ]}
          rows={c.chartWeights.map((lb) => {
            const d = tabletDoseLb(c.calc.minMgKg, c.calc.maxMgKg, lb, tMg)!;
            const tabs = d.noTablet
              ? 'ask your vet'
              : d.lowTablets === d.highTablets ? `${d.lowTablets}` : `${d.lowTablets}–${d.highTablets}`;
            return { cells: { w: `${lb} lb`, dose: mgWindow(d.lowMgShown, d.highMgShown), tabs } };
          })}
          footnote={
            <>
              {c.calc.minMgKg}&ndash;{c.calc.maxMgKg} mg/kg, {c.calc.freq}. Tablet counts
              are in half steps and never exceed {c.calc.maxMgKg} mg/kg. Where no half
              {' '}{noun} fits, ask your vet for a liquid or a compounded dose.
            </>
          }
          source={c.chartSource}
        />

        <NoteBox label={c.catNote.label}>{c.catNote.body}</NoteBox>

        <section>
          <H2>Who should not take it</H2>
          {c.whoShouldnt}
        </section>

        <section>
          <H2>Overdose signs</H2>
          {c.overdose}
        </section>

        <NoteBox label="If you think your dog had too much">
          Call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a consultation fee may apply), or go to your nearest
          emergency vet.
        </NoteBox>

        <section>
          <H2>Questions owners ask</H2>
          <div className="mt-3"><Faq items={c.faq} /></div>
        </section>

        <section>
          <H2>Related tools</H2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {entry.related.map((slug) => {
              const r = bySlug(slug);
              if (!r) return null;
              return <PhotoTile key={slug} href={`/${slug}/`} photoId={slug} label={r.shortName} description={r.oneLiner} />;
            })}
          </div>
        </section>

        <section id="sources">
          <H2>Sources</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            {c.sources.map((s, i) => <li key={i}>{s}</li>)}
            <li className="text-[13px] text-muted">Accessed Oct 19, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          An estimate, not veterinary advice. {c.reviewed}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>
    </>
  );
}
