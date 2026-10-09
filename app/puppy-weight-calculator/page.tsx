import type { Metadata } from 'next';
import Link from 'next/link';
import { bySlug, SITE } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { ratioAt, CATS, SIZE_LABELS, type Cat } from '@/lib/calc/puppyWeight';
import { Band } from '@/components/ui/Band';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { PuppyCalculator } from '@/components/tools/PuppyCalculator';
import { DataTable } from '@/components/ui/Table';
import { NoteBox } from '@/components/ui/NoteBox';
import { Faq } from '@/components/ui/Faq';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { JsonLd } from '@/components/JsonLd';
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
  datasetSchema,
} from '@/lib/schema';

const tool = bySlug('puppy-weight-calculator')!;
const photo = getPhoto('puppy-weight-calculator')!;
const url = `${SITE.url}/${tool.slug}/`;
const UPDATED = 'October 10, 2026';

export const metadata: Metadata = {
  title: tool.title,
  description: tool.metaDescription,
  alternates: { canonical: url },
  openGraph: {
    title: tool.title,
    description: tool.metaDescription,
    url,
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

const REF_WEEKS = [12, 16, 20, 24, 32, 40, 52, 78];
const INTERP = new Set([32, 40, 78]);
const pct = (c: Cat, w: number) => `${Math.round(ratioAt(c, w) * 100)}%`;

const FAQ = [
  {
    q: 'How accurate is a puppy weight calculator?',
    a: 'It gives a range, not a promise. The estimate comes from growth data on more than 60,000 healthy dogs, and most puppies land inside the range shown. Accuracy improves with age: a 6-month-old is easier to project than an 8-week-old. Pick the right size band, or let us choose one, for the closest estimate.',
  },
  {
    q: 'At what age is a puppy half its adult weight?',
    a: 'Small and toy breeds reach about half their adult weight near 16 weeks; our data shows about 51% for toy breeds at 16 weeks. Larger breeds get there a little later, closer to 18 to 20 weeks. By 24 weeks most dogs are roughly two-thirds grown, and growth keeps slowing until about 2 years.',
  },
  {
    q: 'When do puppies stop growing?',
    a: 'Small dogs are nearly full-grown by about 12 months. Medium and large breeds keep filling out until 15 to 18 months, and giant breeds grow past 2 years. In this data, dogs reach about 93% of their 2-year weight by 52 weeks, then add the last few percent slowly after that.',
  },
  {
    q: 'Does the 16-week rule (double the weight) work?',
    a: 'The old rule doubles a puppy’s 16-week weight to guess the adult. It is close for small breeds, which are about 51% of adult weight at 16 weeks, so doubling roughly works. For large breeds it undershoots: they are only about 44% of adult weight at 16 weeks, so their real adult weight is more than double.',
  },
  {
    q: 'Do paws predict adult size?',
    a: 'Big paws are a loose hint, not a measurement. They can suggest a puppy still has growing to do, but breed and the parents’ sizes matter far more. For a real estimate, use current weight and age, or ask the breeder what the mother and father weigh as adults.',
  },
  {
    q: 'Does neutering change adult size?',
    a: 'Spaying or neutering can slightly change adult size, because sex hormones affect when the growth plates close. The effect is small. These curves come from dogs that were still intact at each visit, so they describe un-neutered growth. A dog neutered early may finish a touch taller or heavier than the estimate.',
  },
  {
    q: 'What if my puppy is a mix?',
    a: 'Mixed-breed puppies usually follow the curve for their adult size, even though this data is purebred. If you know the likely adult weight, pick that size band. If not, choose Not sure and we match the band whose own estimate is consistent. Very mixed litters vary more, so treat the range as wider.',
  },
];

const SOURCES = [
  {
    name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts for monitoring bodyweight in dogs of different sizes. PLoS ONE 2017;12(9):e0182064.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/',
  },
  {
    name: 'Open growth data (CC BY 4.0), Liverpool Data Catalogue #377.',
    url: 'https://datacat.liverpool.ac.uk/377/',
  },
  {
    name: 'American Kennel Club breed weight standards (typical adult weight by breed).',
    url: 'https://www.akc.org/dog-breeds/',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: 'Dog calculators', url: `${SITE.url}/dog-calculators/` },
        { name: 'Puppy Weight Calculator', url },
      ])} />
      <JsonLd data={webApplicationSchema({ name: tool.h1, url, description: tool.metaDescription })} />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd data={datasetSchema()} />

      {/* Hub-color band */}
      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs
          items={[
            { name: 'PawScales', href: '/' },
            { name: 'Dog calculators', href: '/dog-calculators/' },
            { name: 'Puppy Weight Calculator' },
          ]}
        />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Puppy Weight Calculator</h1>
            <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">
              Most puppies reach about 51% of their adult weight by 16 weeks if
              they are small breeds, and about 44% if they are large. Enter your
              puppy’s age and weight and we project their adult weight from
              growth data on more than 60,000 healthy dogs seen at US vet clinics.
            </p>
            <p className="mt-3 text-[13px] text-muted">
              By {SITE.author} · Updated {UPDATED} ·{' '}
              <a href="#sources" className="link">Sources</a>
            </p>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
              <Picture photo={photo} crop="ld" sizes="(min-width: 960px) 33vw, 100vw" priority />
            </div>
            <p className="mt-1 text-[12px] text-muted">
              Photo: {photo.photographer} / {photo.source}
            </p>
          </div>
        </div>
      </Band>

      {/* Calculator card overlapping the band */}
      <div className="container-page -mt-14">
        <PuppyCalculator />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet’s health.
        </p>
      </div>

      {/* Article */}
      <div className="container-page mt-10 max-w-reading">
        <section>
          <h2 className="text-[22px] sm:text-[26px]">How to use it</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] text-ink">
            <li>Enter your puppy’s age in weeks, or switch the toggle to months.</li>
            <li>Enter the current weight, switching between pounds and kilograms if you need to.</li>
            <li>Pick the expected adult size if you know it, or leave it on Not sure.</li>
            <li>Read the estimated adult weight, the likely range, and where your puppy sits on the growth curve.</li>
          </ol>
        </section>

        {/* Mobile photo after how-to (never above the tool on mobile) */}
        <div className="mt-8 md:hidden">
          <div className="aspect-[16/9] overflow-hidden rounded-[16px]">
            <Picture photo={photo} crop="ld" sizes="100vw" />
          </div>
          <p className="mt-1 text-[12px] text-muted">
            Photo: {photo.photographer} / {photo.source}
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-[22px] sm:text-[26px]">The formula, with two examples</h2>
          <p className="mt-3 text-[16px] text-ink">
            We use growth curves from Salt and colleagues (2017), built on dogs
            seen at US vet clinics. For each size band we know what share of adult
            (2-year) weight a dog has reached at a given age, so your puppy’s
            adult weight = current weight ÷ that share. Adult weight here means the
            typical weight of healthy-weight dogs at 2 years; breed averages that
            include older, heavier dogs run higher.
          </p>
          <div className="mt-4 space-y-3 text-[16px] text-ink">
            <p>
              <span className="font-semibold">Example 1.</span> A 16-week-old puppy
              weighs 20 lb and you are not sure how big she will get. We check each
              size band and keep the one whose own estimate lands inside its weight
              range. Here that is the Large band (dogs that grow to 15–30 kg),
              giving about 45.3 lb, with most similar puppies ending up between 39.7
              and 51.9 lb.
            </p>
            <p>
              <span className="font-semibold">Example 2.</span> A 24-week-old
              medium-breed puppy weighs 9 kg. At 24 weeks, medium breeds are about
              69% of their adult weight, so the estimate is 9 ÷ 0.69, or about 13.0
              kg (28.7 lb). Most puppies like him end up between 11.3 and 15.5 kg.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-[22px] sm:text-[26px]">What this calculator doesn’t cover</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-ink">
            <li>Mixed breeds. The data is purebred, but mixes of a similar size usually follow the same curve.</li>
            <li>Dogs over 88 lb adult weight. Giant breeds keep growing past 2 years and are not in this data.</li>
            <li>Puppies under 12 weeks, where weight predicts adult size poorly.</li>
            <li>Puppies who are under- or overweight right now.</li>
            <li>Height or length. This estimates weight only.</li>
          </ul>
        </section>
      </div>

      {/* Tables full-width reading column */}
      <div className="container-page mt-10 max-w-reading space-y-8">
        <DataTable
          caption="% of adult weight by age (at 2 years)"
          columns={[
            { key: 'wk', header: 'Age (weeks)' },
            { key: 'I', header: 'Toy', numeric: true },
            { key: 'II', header: 'Small', numeric: true },
            { key: 'III', header: 'Medium', numeric: true },
            { key: 'IV', header: 'Large', numeric: true },
            { key: 'V', header: 'X-Large', numeric: true },
          ]}
          rows={REF_WEEKS.map((w) => ({
            cells: {
              wk: INTERP.has(w) ? `${w}*` : `${w}`,
              ...Object.fromEntries(CATS.map((c) => [c, pct(c, w)])),
            },
          }))}
          footnote="* Interpolated between observed ages. Toy=I, Small=II, Medium=III, Large=IV, X-Large=V by adult size band."
          source={
            <>
              Source:{' '}
              <a className="link" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/">
                Salt et al., PLoS ONE 2017
              </a>{' '}
              (Liverpool datacat #377, CC BY 4.0), normalized to 2-year weight.
            </>
          }
        />

        <BreedTable />
      </div>

      <div className="container-page mt-10 max-w-reading space-y-10">
        <section>
          <h2 className="text-[22px] sm:text-[26px]">Tips</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-ink">
            <li>Weigh your puppy by standing on a scale holding them, then subtract your own weight. A kitchen scale works for toy breeds.</li>
            <li>If you know the parents, your puppy usually lands between the mother’s and father’s adult weights.</li>
            <li>Re-check every few weeks. The estimate tightens as your puppy gets older.</li>
            <li>Don’t push food to grow a bigger dog. Growing too fast is linked to joint problems in large breeds; feed to a lean body condition.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[22px] sm:text-[26px]">Questions owners ask</h2>
          <div className="mt-3">
            <Faq items={FAQ} />
          </div>
        </section>

        <section>
          <h2 className="text-[22px] sm:text-[26px]">About the data</h2>
          <p className="mt-3 text-[16px] text-ink">
            The growth curves come from 199,355 vet visits by 60,951 purebred dogs
            that were a healthy weight as adults, from the open dataset behind Salt
            et al. (2017). We group dogs into five adult-size bands, measure what
            share of their 2-year weight they reached at each age, and smooth the
            result. Ages 32, 40 and 78 weeks are interpolated between observed
            points.
          </p>
        </section>

        <section>
          <h2 className="text-[22px] sm:text-[26px]">Related tools</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {tool.related.map((slug) => {
              const r = bySlug(slug);
              if (!r) return null;
              return (
                <PhotoTile
                  key={slug}
                  href={`/${slug}/`}
                  photoId={slug}
                  label={r.shortName}
                  description={r.oneLiner}
                />
              );
            })}
          </div>
        </section>

        <section id="sources">
          <h2 className="text-[22px] sm:text-[26px]">Sources</h2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a className="link" href={s.url}>{s.name}</a>{' '}
                <span className="text-[13px] text-muted">Accessed Oct 10, 2026.</span>
              </li>
            ))}
          </ul>
        </section>

        <AuthorBox updated={UPDATED} />

        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet’s health.
        </p>
      </div>
    </>
  );
}

// Breed table is filled from AKC-sourced data in lib/data/breedWeights.ts.
import { BREED_WEIGHTS } from '@/lib/data/breedWeights';

function BreedTable() {
  return (
    <DataTable
      caption="Typical adult weight by breed"
      columns={[
        { key: 'breed', header: 'Breed' },
        { key: 'range', header: 'Adult weight (lb)', numeric: true },
      ]}
      rows={BREED_WEIGHTS.map((b) => ({
        cells: {
          breed: (
            <a className="link" href={b.url}>
              {b.breed}
            </a>
          ),
          range: b.note ? `${b.range} (${b.note})` : b.range,
        },
      }))}
      source={
        <>
          Source: American Kennel Club breed standards. Weights are typical ranges
          across males and females; individual dogs vary.
        </>
      }
    />
  );
}
