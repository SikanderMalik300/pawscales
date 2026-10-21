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
import { breadcrumbSchema, faqSchema, catDatasetSchema, webPageSchema } from '@/lib/schema';
import { CatWeightCalculator } from '@/components/tools/CatWeightCalculator';
import { CAT_WEIGHT, SEX_LABEL, type Sex, type CatRow } from '@/lib/data/catWeight';
import { fmt1 } from '@/lib/calc/round';

const SLUG = 'cat-weight-chart';
const catHub = HUBS.find((h) => h.slug === 'cat-calculators')!;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

function sexTable(sex: Sex) {
  const rows: CatRow[] = CAT_WEIGHT.main[sex];
  return (
    <DataTable
      caption={`${SEX_LABEL[sex]} cat weight by age (lb)`}
      tableCaption={`${sex === 'F' ? 'Female' : 'Male'} kittens (lb)`}
      columns={[
        { key: 'age', header: 'Age' },
        { key: 'low', header: 'Low (25th)', numeric: true },
        { key: 'med', header: 'Typical (median)', numeric: true },
        { key: 'high', header: 'High (75th)', numeric: true },
      ]}
      rows={rows.map((r) => ({
        cells: {
          age: r.month === 18 ? '18 mo' : `${r.month} mo`,
          low: fmt1(r.p25),
          med: fmt1(r.median),
          high: fmt1(r.p75),
        },
      }))}
      footnote={
        <>
          Low / Typical / High = 25th percentile / median / 75th percentile of
          bodyweight. Values are lightly smoothed so they never decrease with age;
          small month-to-month dips in the raw data come from sampling.
        </>
      }
      source={
        <>
          {CAT_WEIGHT.mainLabel}. Data:{' '}
          <a className="link" href={CAT_WEIGHT.source.mainDataset}>Liverpool DataCat 1459</a> (CC BY 3.0).
        </>
      }
    />
  );
}

export interface CatWeightContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function CatWeightPage(c: CatWeightContent) {
  const entry = bySlug(SLUG)!;
  const photo = getPhoto(SLUG)!;
  const url = `${SITE.url}/${SLUG}/`;
  const updated = fmtDate(entry.lastUpdated);
  const adultF = CAT_WEIGHT.adult.F;
  const adultM = CAT_WEIGHT.adult.M;
  const intact = CAT_WEIGHT.intactComparison;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: catHub.h1, url: `${SITE.url}/${catHub.slug}/` },
        { name: 'Cat Weight Chart', url },
      ])} />
      <JsonLd data={webPageSchema({ name: 'Cat Weight Chart', url, description: entry.metaDescription, lastUpdated: entry.lastUpdated })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />
      <JsonLd data={catDatasetSchema()} />

      <Band color="cat-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: catHub.h1, href: `/${catHub.slug}/` },
          { name: 'Cat Weight Chart' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Cat Weight Chart</h1>
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
        <CatWeightCalculator />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your cat&rsquo;s health.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>Kitten weight chart by month</H2>
          <p className="mt-2 text-[16px] text-ink">
            These tables show the weight of healthy domestic shorthair cats, by
            month, for females and males. They come from research on more than 8,000
            neutered cats in good body condition, measured at US vet clinics (Salt et
            al. 2023). Most kittens reach their adult weight between about 10 and 12
            months, then settle. To work out how much to feed at each of these ages, see
            our <a className="link" href="/kitten-feeding-chart/">kitten feeding chart</a>.
          </p>
        </section>
        {sexTable('F')}
        {sexTable('M')}

        <section>
          <H2 id="newborn">The first 8 weeks (0&ndash;2 months)</H2>
          <p className="mt-2 text-[16px] text-ink">
            The growth tables above start at 2 months, because the research data begins
            there. For the newborn stage, a rough guide from shelter and fostering
            sources is that a kitten weighs about 3.5 oz (100 g) at birth and gains
            roughly 100 g (about 3.5 oz) a week, reaching close to 1 lb per month of
            age for the first few months. Our{' '}
            <a className="link" href="/kitten-age-chart/">kitten age chart</a> covers
            this week-by-week with teeth, eyes and ears as well as weight.
          </p>
        </section>

        <section>
          <H2>Is my cat a healthy weight?</H2>
          <div className="mt-3">
            <NoteBox label="Body condition, not just the scale">
              Healthy weight is judged by body condition, not a single number. On the
              9-point body condition score, 5/9 is ideal: you can feel the ribs under a
              light layer of fat, there is a visible waist from above, and a slight
              tummy tuck from the side. The{' '}
              <a className="link" href="https://www.aaha.org/resources/2021-aaha-aafp-feline-life-stage-guidelines/">
                2021 AAHA/AAFP Feline Life Stage Guidelines
              </a>{' '}
              treat 6&ndash;7/9 as overweight and 8&ndash;9/9 as obese. See the{' '}
              <a className="link" href="https://wsava.org/wp-content/uploads/2020/08/Body-Condition-Score-cat-updated-August-2020.pdf">
                WSAVA body condition score chart
              </a>. A vet&rsquo;s body condition check matters more than the number on
              the scale.
            </NoteBox>
          </div>
          <p className="mt-4 text-[16px] text-ink">
            For context, by 18 months the cats in this study typically weighed about{' '}
            <strong>{fmt1(adultF.median)} lb ({fmt1(adultF.p25)}&ndash;{fmt1(adultF.p75)})</strong> for
            females and <strong>{fmt1(adultM.median)} lb ({fmt1(adultM.p25)}&ndash;{fmt1(adultM.p75)})</strong>{' '}
            for males. This is the typical weight for domestic shorthair cats in this
            study, not a healthy-weight target: a small cat can be lean at a lower
            weight and a large cat healthy above it. Pedigree breeds differ, so these
            figures are for domestic shorthairs.
          </p>
        </section>

        <section>
          <H2>Neutered vs intact</H2>
          <p className="mt-2 text-[16px] text-ink">
            The main tables are neutered cats, because most pet cats are neutered.
            Intact (not neutered) cats tend to be a little lighter at the same age.
            For comparison, here are the median weights of intact domestic shorthairs
            from the companion growth standard (Salt et al. 2022), shown only at ages
            where that dataset has enough cats.
          </p>
          <div className="mt-4">
            <DataTable
              caption="Intact domestic shorthair median weight (lb)"
              tableCaption="Intact cats, median weight (lb)"
              columns={[
                { key: 'age', header: 'Age' },
                { key: 'f', header: 'Female median', numeric: true },
                { key: 'm', header: 'Male median', numeric: true },
              ]}
              rows={intact.F.map((r, i) => ({
                cells: { age: `${r.month} mo`, f: fmt1(r.median), m: fmt1(intact.M[i].median) },
              }))}
              source={
                <>
                  Data:{' '}
                  <a className="link" href={CAT_WEIGHT.source.intactDataset}>Liverpool DataCat 1456</a> (CC BY 3.0),
                  intact DSH, optimal body condition.
                </>
              }
            />
          </div>
        </section>

        <section>
          <H2>Questions owners ask</H2>
          <div className="mt-3"><Faq items={c.faq} /></div>
        </section>

        <section>
          <H2>About the data</H2>
          <p className="mt-3 text-[16px] text-ink">
            The main tables use anonymised vet records from Banfield hospitals in the
            USA, for domestic shorthair cats that were neutered and stayed in good body
            condition (Salt et al. 2023). We grouped every visit by the nearest whole
            month and took the median and 25th&ndash;75th centile for each sex, then
            lightly smoothed each column so it never dips with age. Sample sizes are
            large up to 6 months (thousands of weights a month) and smaller from 7 to
            18 months (a few hundred a month). Weights can shift after neutering, and
            pedigree breeds fall outside this domestic-shorthair data, so use the chart
            as a guide alongside a body condition check.
          </p>
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
            <li>
              <a className="link" href={CAT_WEIGHT.source.mainArticle}>{CAT_WEIGHT.source.mainCitation}</a>{' '}
              Data: <a className="link" href={CAT_WEIGHT.source.mainDataset}>Liverpool DataCat 1459</a> (CC BY 3.0).
            </li>
            <li>
              <a className="link" href={CAT_WEIGHT.source.intactArticle}>{CAT_WEIGHT.source.intactCitation}</a>{' '}
              Data: <a className="link" href={CAT_WEIGHT.source.intactDataset}>Liverpool DataCat 1456</a> (CC BY 3.0).
            </li>
            <li>
              <a className="link" href="https://www.aaha.org/resources/2021-aaha-aafp-feline-life-stage-guidelines/">
                2021 AAHA/AAFP Feline Life Stage Guidelines (life stages; body condition targets).
              </a>
            </li>
            <li>
              <a className="link" href="https://wsava.org/wp-content/uploads/2020/08/Body-Condition-Score-cat-updated-August-2020.pdf">
                WSAVA Body Condition Score chart for cats (9-point).
              </a>
            </li>
            <li className="text-[13px] text-muted">Data accessed Oct 15, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your cat&rsquo;s health.
        </p>
      </div>
    </>
  );
}
