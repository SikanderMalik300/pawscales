import type { ReactNode } from 'react';
import { SITE, HUBS, bySlug } from '@/lib/registry';
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
import { BreedGrowthCalculator } from '@/components/tools/BreedGrowthCalculator';
import { bandForSex, type Breed } from '@/lib/data/breeds';
import { expectedByAge, TOTAL_DOGS, type BreedRow } from '@/lib/calc/breedGrowth';

const UPDATED = 'October 12, 2026';
const sizeHub = HUBS.find((h) => h.slug === 'dog-size-charts')!;

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

function sexTable(breed: Breed, sex: 'male' | 'female') {
  const spec = breed[sex];
  const band = bandForSex(spec);
  const rows: BreedRow[] = expectedByAge(spec.lowLb, spec.highLb, band);
  const anyGiant = rows.some((r) => r.giant);
  return (
    <DataTable
      caption={`${sex === 'male' ? 'Male' : 'Female'} ${breed.name} weight by age (lb)`}
      columns={[
        { key: 'age', header: 'Age' },
        { key: 'low', header: 'Low', numeric: true },
        { key: 'typ', header: 'Typical', numeric: true },
        { key: 'high', header: 'High', numeric: true },
      ]}
      rows={rows.map((r) => ({
        cells: {
          age: `${r.months} mo${r.interpolated ? ' *' : ''}`,
          low: `${r.lowLb}`,
          typ: `${r.typicalLb}`,
          high: `${r.highLb}${r.giant ? ' †' : ''}`,
        },
      }))}
      footnote={
        <>
          Low / Typical / High = 25th percentile / median / 75th percentile of the
          growth data, scaled to the {sex} range ({spec.lowLb}–{spec.highLb} lb).
          * interpolated between observed ages.
          {anyGiant && ' † over 88 lb (40 kg): giant-size dogs keep filling out past 2 years, so treat these as a minimum.'}
        </>
      }
      source={
        <>
          Based on growth data from {TOTAL_DOGS.toLocaleString()} healthy dogs
          (<a className="link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/">Salt et al. 2017</a>)
          scaled to the <a className="link" href={breed.akcUrl}>AKC breed standard</a>.
        </>
      }
    />
  );
}

export interface BreedGrowthContent {
  breed: Breed;
  quickAnswer: ReactNode;
  method: ReactNode; // formula + 2 worked examples
  secondTable: ReactNode; // "Is my [breed] a healthy weight?"
  faq: FaqItem[];
  sources: { name: string; url: string }[];
  related: string[];
}

export function BreedGrowthPage(c: BreedGrowthContent) {
  const { breed } = c;
  const photo = getPhoto(breed.photoId)!;
  const url = `${SITE.url}/${breed.slug}/`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: sizeHub.h1, url: `${SITE.url}/${sizeHub.slug}/` },
        { name: `${breed.name} Weight Chart`, url },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'WebPage',
        name: `${breed.name} Weight Chart`, url,
        description: bySlug(breed.slug)?.metaDescription,
      }} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />
      <JsonLd data={datasetSchema()} />

      <Band color="dog-size-charts" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: sizeHub.h1, href: `/${sizeHub.slug}/` },
          { name: `${breed.name} Weight Chart` },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">{breed.name} Weight Chart</h1>
            <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">{c.quickAnswer}</p>
            <p className="mt-3 text-[13px] text-muted">
              By {SITE.author} · Updated {UPDATED} · <a href="#sources" className="link">Sources</a>
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
        <BreedGrowthCalculator breed={breed} />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet&rsquo;s health.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>Expected weight by age</H2>
          <p className="mt-2 text-[16px] text-ink">
            These tables scale the Salt et al. (2017) growth curves to the AKC
            {' '}{breed.name} standard, separately for males and females.
          </p>
        </section>
        {sexTable(breed, 'female')}
        {sexTable(breed, 'male')}
      </div>

      <div className="container-page mt-10 max-w-reading space-y-10">
        <section>
          <H2>The method, with two examples</H2>
          <div className="mt-3 space-y-3 text-[16px] text-ink">{c.method}</div>
        </section>

        <section>
          <H2>Is my {breed.name} a healthy weight?</H2>
          <div className="mt-3">{c.secondTable}</div>
        </section>

        <section>
          <H2>Questions owners ask</H2>
          <div className="mt-3"><Faq items={c.faq} /></div>
        </section>

        <section>
          <H2>About the data</H2>
          <p className="mt-3 text-[16px] text-ink">
            The curves come from {TOTAL_DOGS.toLocaleString()} purebred dogs that were
            a healthy weight as adults, from the open dataset behind Salt et al.
            (2017), scaled to the {breed.name}&rsquo;s AKC weight range. The generic
            tool behind it is the{' '}
            <a className="link" href="/puppy-weight-calculator/">puppy weight calculator</a>.
          </p>
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
                <span className="text-[13px] text-muted">Accessed Oct 12, 2026.</span>
              </li>
            ))}
          </ul>
        </section>

        <AuthorBox updated={UPDATED} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet&rsquo;s health.
        </p>
      </div>
    </>
  );
}
