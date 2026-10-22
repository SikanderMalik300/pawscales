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
import { breadcrumbSchema, faqSchema, datasetSchema, webPageSchema } from '@/lib/schema';
import { fmt1 } from '@/lib/calc/round';
import {
  feedingChart, CHART_ADULTS_LB, CHART_AGES, CHART_KCAL_PER_CUP, CHART_HANDOFF,
} from '@/lib/calc/puppyFeeding';

const SLUG = 'puppy-feeding-chart';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const LARGE = new Set([60, 80]); // large-breed columns

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

// Meals per day by age (AAHA 2019 Canine Life Stage Guidelines; AKC).
const MEALS = [
  { age: '6 to 12 weeks', meals: '4 meals a day' },
  { age: '3 to 6 months', meals: '3 meals a day' },
  { age: '6 to 12 months', meals: '2 meals a day' },
  { age: 'Adult', meals: '2 meals a day' },
];

export interface PuppyFeedingContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function PuppyFeedingPage(c: PuppyFeedingContent) {
  const entry = bySlug(SLUG)!;
  const photo = getPhoto(SLUG)!;
  const url = `${SITE.url}/${SLUG}/`;
  const updated = fmtDate(entry.lastUpdated);
  const chart = feedingChart();
  const byAdult = Object.fromEntries(chart.map((r) => [r.adultLb, r]));
  const handoffPct = Math.round(CHART_HANDOFF * 100);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: dogHub.h1, url: `${SITE.url}/${dogHub.slug}/` },
        { name: 'Puppy Feeding Chart', url },
      ])} />
      <JsonLd data={webPageSchema({ name: 'Puppy Feeding Chart', url, description: entry.metaDescription, published: entry.published, lastUpdated: entry.lastUpdated })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />
      <JsonLd data={datasetSchema()} />

      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: dogHub.h1, href: `/${dogHub.slug}/` },
          { name: 'Puppy Feeding Chart' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Puppy Feeding Chart</h1>
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
        <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
          <p className="text-[16px] text-ink">
            Want the exact amount for your puppy and your bag of food? The{' '}
            <a className="link" href="/dog-food-calculator/">dog food calculator</a>{' '}
            uses your puppy&rsquo;s current weight, its expected adult weight and the
            food&rsquo;s calories per cup. This chart is the typical case.
          </p>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your puppy&rsquo;s diet.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>How much to feed a puppy by age</H2>
          <p className="mt-2 text-[16px] text-ink">
            Energy need depends on how big the puppy will get, so the chart is by
            expected adult weight. The main number is calories a day (kcal); cups are
            at an example food density of {CHART_KCAL_PER_CUP} kcal per cup, so check
            your bag and use the calculator for an exact figure. Once a puppy reaches
            about {handoffPct}% of its adult weight (around the end of the first year,
            later for large and giant breeds), feed it as an adult.
          </p>
        </section>

        <DataTable
          caption="Calories per day by age and adult size"
          tableCaption="Puppy calories per day by age and expected adult weight"
          columns={[
            { key: 'age', header: 'Puppy age' },
            ...CHART_ADULTS_LB.map((lb) => ({
              key: `a${lb}`,
              header: `${lb} lb adult${LARGE.has(lb) ? ' †' : ''}`,
              numeric: true,
            })),
          ]}
          rows={CHART_AGES.map((months) => ({
            cells: {
              age: `${months} mo`,
              ...Object.fromEntries(CHART_ADULTS_LB.map((lb) => {
                const cell = byAdult[lb].cells.find((x) => x.months === months)!;
                return [
                  `a${lb}`,
                  cell.handoff
                    ? <span className="text-muted">adult*</span>
                    : <span>{cell.kcal}<span className="block text-[12px] text-muted">{fmt1(cell.cups!)} cups</span></span>,
                ];
              })),
            },
          }))}
          footnote={
            <>
              kcal a day, with cups at {CHART_KCAL_PER_CUP} kcal/cup. *From about{' '}
              {handoffPct}% of adult weight (usually after the first year) feed as an
              adult; the{' '}
              <a className="link" href="/dog-food-calculator/">dog food calculator</a>{' '}
              covers that. † large-breed puppies: see the note below.
            </>
          }
          source={
            <>
              RER = 70 × kg<sup>0.75</sup> × a growth factor that tapers from 3× to 2×
              as the puppy nears adult weight (
              <a className="link" href="https://www.petnutritionalliance.org/">Pet Nutrition Alliance</a>,
              WSAVA/AAHA). Weight-for-age from{' '}
              <a className="link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/">Salt et al. 2017</a>.
            </>
          }
        />
        <p className="text-[14px] text-ink">
          Food needs peak around 4 to 6 months, while puppies grow fastest, then ease
          off as growth slows.
        </p>
        <p className="text-[14px] text-ink">
          Toy and small breeds usually reach adult size by 9 to 12 months; ask your vet
          when to switch to adult food and amounts.
        </p>

        <NoteBox label="Large-breed puppies († 60 and 80 lb columns)">
          Large and giant breeds grow for longer and are prone to joint problems if
          they grow too fast. Feed a food formulated for large-breed puppies, measure
          meals rather than free-feeding, and keep them lean. Let your vet check body
          condition at visits. Growing slow and steady is safer than growing fast. See
          the{' '}
          <a className="link" href="https://wsava.org/global-guidelines/global-nutrition-guidelines/">
            WSAVA nutrition guidelines
          </a>.
        </NoteBox>

        <section>
          <H2>Meals per day by age</H2>
          <p className="mt-2 text-[16px] text-ink">
            Split the daily amount across several meals. Young puppies do best with
            small, frequent meals; toy breeds may need an extra meal to avoid low blood
            sugar.
          </p>
          <div className="mt-4">
            <DataTable
              caption="How many meals a day"
              tableCaption="Puppy meals per day by age"
              columns={[
                { key: 'age', header: 'Age' },
                { key: 'meals', header: 'Meals' },
              ]}
              rows={MEALS.map((m) => ({ cells: { age: m.age, meals: m.meals } }))}
              source={
                <>
                  <a className="link" href="https://www.aaha.org/resources/2019-aaha-canine-life-stage-guidelines/">AAHA 2019 Canine Life Stage Guidelines</a>;{' '}
                  <a className="link" href="https://www.akc.org/expert-advice/nutrition/how-often-should-dogs-eat/">AKC</a>.
                </>
              }
            />
          </div>
        </section>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-10">
        <section>
          <H2>How the chart is worked out</H2>
          <p className="mt-3 text-[16px] text-ink">
            We take the puppy&rsquo;s resting energy (RER = 70 × body weight in kg to
            the power 0.75) and multiply by a growth factor: 3× while a puppy is under
            half its adult weight, 2.5× from half to 80%, and 2× from 80% to full size,
            after which adult maintenance (about 1.6× for a neutered dog) applies. The
            puppy&rsquo;s weight at each age comes from growth data on 60,951 dogs
            (Salt et al. 2017), scaled to the expected adult weight. The{' '}
            <a className="link" href="/dog-food-calculator/">dog food calculator</a>{' '}
            uses the same method for an exact, per-dog number.
          </p>
        </section>

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
            <li>
              <a className="link" href="https://www.petnutritionalliance.org/">Pet Nutrition Alliance, Calculating Calories</a>{' '}
              (RER = 70 × kg<sup>0.75</sup>; growth 2&ndash;3× RER; adult 1.6&ndash;1.8× RER).
            </li>
            <li>
              <a className="link" href="https://www.aaha.org/resources/2019-aaha-canine-life-stage-guidelines/">2019 AAHA Canine Life Stage Guidelines</a>{' '}
              and <a className="link" href="https://wsava.org/global-guidelines/global-nutrition-guidelines/">WSAVA Global Nutrition Guidelines</a> (growth feeding, meal frequency, large-breed care).
            </li>
            <li>
              <a className="link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/">Salt C, Morris PJ, German AJ, et al. Growth standard charts. PLoS ONE 2017;12(9):e0182064.</a>{' '}
              (weight-for-age).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 15, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your puppy&rsquo;s diet.
        </p>
      </div>
    </>
  );
}
