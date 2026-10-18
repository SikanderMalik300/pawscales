import type { ReactNode } from 'react';
import { SITE, HUBS, bySlug, relatedGrowthPages } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { Band } from '@/components/ui/Band';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { DataTable } from '@/components/ui/Table';
import { Faq, type FaqItem } from '@/components/ui/Faq';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, datasetSchema } from '@/lib/schema';
import { DoodleSizeCalculator } from '@/components/tools/DoodleSizeCalculator';
import { doodleTypicalByAge, type DoodleBreed } from '@/lib/data/doodles';
import { TOTAL_DOGS } from '@/lib/calc/breedGrowth';
import { fmt1 } from '@/lib/calc/round';

const sizeHub = HUBS.find((h) => h.slug === 'dog-size-charts')!;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const colHeader = (s: { size: string; bound: string }) =>
  s.bound === 'up to' ? `${s.size} (up to)` : s.bound === 'at least' ? `${s.size} (min)` : s.size;

function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-[22px] sm:text-[26px]">{children}</h2>;
}

export interface DoodlePageContent {
  breed: DoodleBreed;
  quickAnswer: ReactNode;
  method: ReactNode; // worked examples
  faq: FaqItem[];
  sources: { name: string; url: string }[];
  related: string[];
  comparison?: ReactNode; // optional extra comparison table (Bernedoodle)
  extra?: ReactNode; // optional extra section after the comparison (e.g. growth notes)
}

export function DoodlePage(c: DoodlePageContent) {
  const { breed } = c;
  const photo = getPhoto(breed.photoId)!;
  const url = `${SITE.url}/${breed.slug}/`;
  const entry = bySlug(breed.slug);
  const updated = fmtDate(entry?.lastUpdated);
  const ageRows = doodleTypicalByAge(breed);
  const anyEst = ageRows.some((r) => r.kind === 'estimated');
  const anyInterp = ageRows.some((r) => r.kind === 'interpolated');
  const mark = (k: string) => (k === 'interpolated' ? ' *' : k === 'estimated' ? ' ‡' : '');

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: sizeHub.h1, url: `${SITE.url}/${sizeHub.slug}/` },
        { name: `${breed.name} Size Chart`, url },
      ])} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: `${breed.name} Size Chart`, url, description: entry?.metaDescription }} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />
      <JsonLd data={datasetSchema()} />

      <Band color="dog-size-charts" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: sizeHub.h1, href: `/${sizeHub.slug}/` },
          { name: `${breed.name} Size Chart` },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">{breed.name} Size Chart</h1>
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
        <DoodleSizeCalculator breed={breed} />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet&rsquo;s health.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>{breed.name} sizes</H2>
          <p className="mt-2 text-[16px] text-ink">{breed.sourceNote}</p>
        </section>
        <DataTable
          caption={`${breed.name} size categories`}
          columns={[
            { key: 'size', header: 'Size' },
            { key: 'height', header: 'Height at the withers' },
            { key: 'weight', header: 'Adult weight', numeric: true },
          ]}
          rows={breed.sizes.map((s) => ({ cells: { size: s.size, height: s.heightLabel, weight: s.weightLabel } }))}
          source={<>Source: <a className="link" href={breed.sourceUrl}>{breed.sourceName}</a>.</>}
        />

        <DataTable
          caption="Expected weight by age (lb)"
          columns={[
            { key: 'age', header: 'Age' },
            ...breed.sizes.map((s) => ({ key: s.size, header: colHeader(s), numeric: true })),
          ]}
          rows={ageRows.map((r) => ({
            cells: {
              age: `${r.months} mo${mark(r.kind)}`,
              ...Object.fromEntries(breed.sizes.map((s) => [s.size, fmt1(r.bySize[s.size])])),
            },
          }))}
          footnote={
            <>
              Each column is that size&rsquo;s representative adult weight (the GANA
              bound) scaled by the median growth curve. &ldquo;Up to&rdquo; and
              &ldquo;min&rdquo; mark GANA&rsquo;s open-ended Petite and Standard ranges.
              {anyInterp && ' * interpolated between observed ages.'}
              {anyEst && ' ‡ estimated beyond the last observed age.'}
            </>
          }
          source={
            <>
              Growth curve from {TOTAL_DOGS.toLocaleString()} healthy dogs
              (<a className="link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/">Salt et al. 2017</a>),
              scaled to the GANA size bounds.
            </>
          }
        />
        <p className="text-[13px] text-muted">
          Growth data starts at 12 weeks, so younger ages are not shown.
        </p>
        {breed.giantNote && (
          <p className="text-[14px] text-ink">{breed.giantNote}</p>
        )}

        <DataTable
          caption={`Crate size by ${breed.name} size`}
          columns={[
            { key: 'size', header: 'Size' },
            { key: 'crate', header: 'Typical crate', numeric: true },
          ]}
          rows={breed.sizes.map((s) => ({
            cells: { size: s.size, crate: `${s.crateIn} in` },
          }))}
          footnote={
            <>
              Crate length from our{' '}
              <a className="link" href="/dog-crate-size-chart/">dog crate size chart</a>,
              by weight.
            </>
          }
        />
        <p className="text-[14px] text-ink">
          For a harness, measure chest girth. See the{' '}
          <a className="link" href="/dog-harness-size-chart/">harness size chart</a>.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-10">
        {c.comparison && <section>{c.comparison}</section>}

        {c.extra && <section>{c.extra}</section>}

        <section>
          <H2>The method, with two examples</H2>
          <div className="mt-3 space-y-3 text-[16px] text-ink">{c.method}</div>
        </section>

        <section>
          <H2>Questions owners ask</H2>
          <div className="mt-3"><Faq items={c.faq} /></div>
        </section>

        <section>
          <H2>About the data</H2>
          <p className="mt-3 text-[16px] text-ink">
            Sizes are the {breed.sourceName} categories. The weight-by-age figures
            scale the Salt et al. (2017) growth data ({TOTAL_DOGS.toLocaleString()}{' '}
            healthy dogs) to those size bounds. Mixes vary more than purebreds, so for
            your own puppy the{' '}
            <a className="link" href="/puppy-weight-calculator/">puppy weight calculator</a>{' '}
            (enter the current weight) gives a tighter estimate.
          </p>
        </section>

        <section>
          <H2>Related size charts</H2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
            {relatedGrowthPages(breed.slug).map((r) => (
              <li key={r.slug}>
                <a className="link" href={`/${r.slug}/`}>{r.shortName}</a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <H2>Related tools</H2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {c.related.map((slug) => {
              const r = bySlug(slug);
              if (!r) return null;
              return <PhotoTile key={slug} href={`/${slug}/`} photoId={slug} label={r.shortName} description={r.oneLiner} />;
            })}
          </div>
        </section>

        <section id="sources">
          <H2>Sources</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a className="link" href={s.url}>{s.name}</a>{' '}
                <span className="text-[13px] text-muted">Accessed Oct 14, 2026.</span>
              </li>
            ))}
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet&rsquo;s health.
        </p>
      </div>
    </>
  );
}
