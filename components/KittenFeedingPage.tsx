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
import { KittenFoodCalculator } from '@/components/tools/KittenFoodCalculator';
import { kittenChart, adultKcal, EXAMPLE_KCAL_PER_CUP } from '@/lib/calc/kittenFeeding';
import { CAT_WEIGHT } from '@/lib/data/catWeight';
import { LB_TO_KG } from '@/lib/units';

const SLUG = 'kitten-feeding-chart';
const catHub = HUBS.find((h) => h.slug === 'cat-calculators')!;
const CORNELL = 'https://www.vet.cornell.edu/departments/cornell-feline-health-center/health-information/feline-health-topics/how-often-should-you-feed-your-cat';
const MERCK_DER = 'https://www.merckvetmanual.com/multimedia/table/daily-maintenance-energy-requirements-for-dogs-and-cats';
const NRC = 'https://nap.nationalacademies.org/catalog/10668/nutrient-requirements-of-dogs-and-cats';
const DVM360 = 'https://www.dvm360.com/view/easy-nutritional-math-it-was-my-understanding-that-there-would-be-no-math';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

// Adult maintenance at the one-year hand-off, from the 12-month median weights.
const adultF = CAT_WEIGHT.main.F.find((r) => r.month === 12)!.median;
const adultM = CAT_WEIGHT.main.M.find((r) => r.month === 12)!.median;
const adultLow = adultKcal(adultF * LB_TO_KG, false);
const adultHigh = adultKcal(adultM * LB_TO_KG, false);

export interface KittenFeedingContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function KittenFeedingPage(c: KittenFeedingContent) {
  const entry = bySlug(SLUG)!;
  const photo = getPhoto(SLUG)!;
  const url = `${SITE.url}/${SLUG}/`;
  const updated = fmtDate(entry.lastUpdated);
  const chart = kittenChart();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: catHub.h1, url: `${SITE.url}/${catHub.slug}/` },
        { name: 'Kitten Feeding Chart', url },
      ])} />
      <JsonLd data={webPageSchema({ name: 'Kitten Feeding Chart', url, description: entry.metaDescription, lastUpdated: entry.lastUpdated })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />
      <JsonLd data={datasetSchema()} />

      <Band color="cat-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: catHub.h1, href: `/${catHub.slug}/` },
          { name: 'Kitten Feeding Chart' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Kitten Feeding Chart</h1>
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
        <KittenFoodCalculator />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. For an adult cat, or to split wet and
          dry in detail, use the{' '}
          <a className="link" href="/cat-food-calculator/">cat food calculator</a>. Ask
          your vet about your kitten&rsquo;s diet.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2 id="chart">Kitten feeding chart by age</H2>
          <p className="mt-2 text-[16px] text-ink">
            Calories a day for a growing kitten, by age and sex, with how many meals to
            split them into. The weight for each age is the median for a neutered
            Domestic Shorthair kitten; weigh your own kitten and adjust. The main number
            is calories (kcal); turn it into cups or cans with the calculator above and
            the figure on your food label.
          </p>
        </section>

        <DataTable
          caption="Calories a day and per meal, by age and sex"
          tableCaption="Kitten calories per day and per meal by age and sex"
          columns={[
            { key: 'age', header: 'Age' },
            { key: 'meals', header: 'Meals a day', numeric: true },
            { key: 'f', header: 'Female', numeric: true },
            { key: 'm', header: 'Male', numeric: true },
          ]}
          rows={chart.map((row) => {
            const cell = (sex: 'F' | 'M') => {
              const x = row.bySex[sex];
              return (
                <span>
                  {x.kcal} kcal{x.adult ? <sup>†</sup> : null}
                  <span className="block text-[12px] text-muted">
                    {fmt1(x.weightLb)} lb · {x.adult ? 'adult' : `${x.kcalPerMeal}/meal`}
                  </span>
                </span>
              );
            };
            return {
              cells: {
                age: `${row.month} mo`,
                meals: row.bySex.F.meals,
                f: cell('F'),
                m: cell('M'),
              },
            };
          })}
          footnote={
            <>
              kcal a day from the NRC 2006 growth curve, split into the meals shown; the
              sub-line is the median weight for that age and the calories per meal. The
              amount eases off, not up, as a kitten nears adult size.{' '}
              <sup>†</sup> within 5% of adult weight, so shown as adult maintenance.
            </>
          }
          source={
            <>
              Energy: the <a className="link" href={NRC}>NRC 2006</a> growth equation (ME =
              100 × BW<sup>0.67</sup> × 6.7 × (e<sup>−0.189p</sup> − 0.66), p = weight ÷
              adult weight), reproduced free in{' '}
              <a className="link" href={DVM360}>Packer, dvm360 (2021)</a>. Weight for age:{' '}
              <a className="link" href={CAT_WEIGHT.source.mainArticle}>Salt et al. 2023</a>{' '}
              (<a className="link" href={CAT_WEIGHT.source.mainDataset}>Liverpool DataCat 1459</a>, CC BY 3.0).
            </>
          }
        />

        <NoteBox label="Two notes from the Merck table">
          Any calorie figure is <strong>only a starting point</strong> and may need to be
          adjusted based on how your kitten responds, so weigh it and keep it in good body
          condition. Kittens can alternatively be fed <strong>free choice</strong> (food
          left out), which many do well on while growing.
        </NoteBox>

        <section>
          <H2>Meals a day by age</H2>
          <p className="mt-2 text-[16px] text-ink">
            The Cornell Feline Health Center advises that, until they are six months old,
            kittens usually do best fed <strong>three meals a day</strong>; between six
            months and one year, <strong>twice daily feeding</strong> is generally best.
            Kittens need more food per pound than adult cats to support their growth, so
            they are fed more often.
          </p>
          <div className="mt-4">
            <DataTable
              caption="How many meals a day"
              tableCaption="Kitten meals per day by age"
              columns={[
                { key: 'age', header: 'Age' },
                { key: 'meals', header: 'Meals' },
              ]}
              rows={[
                { cells: { age: 'Under 6 months', meals: '3 meals a day' } },
                { cells: { age: '6 to 12 months', meals: '2 meals a day' } },
                { cells: { age: 'Adult (1 year +)', meals: '1 to 2 meals a day' } },
              ]}
              source={
                <><a className="link" href={CORNELL}>Cornell Feline Health Center, How often should you feed your cat?</a></>
              }
            />
          </div>
        </section>

        <NoteBox label="Near adult size, switch to adult amounts">
          Once your kitten reaches about <strong>95% of its expected adult weight</strong>,
          or <strong>12 months</strong>, feed it as an adult cat: about <strong>1.2 ×
          RER</strong> for a neutered cat and <strong>1.4 × RER</strong> for an intact one
          (Merck). That is roughly {adultLow} to {adultHigh} kcal a day for a{' '}
          {fmt1(adultF)} to {fmt1(adultM)} lb cat, below the growing-kitten peak. Energy
          needs <strong>drop after spaying or neutering</strong>, so watch your cat&rsquo;s
          weight and cut back if needed. The{' '}
          <a className="link" href="/cat-food-calculator/">cat food calculator</a> does the
          adult numbers.
        </NoteBox>

        <section>
          <H2>How the chart is worked out</H2>
          <p className="mt-3 text-[16px] text-ink">
            We work out the day&rsquo;s calories with the <strong>NRC 2006 growth
            equation</strong>: ME = 100 × BW<sup>0.67</sup> × 6.7 × (e<sup>−0.189 × p</sup>{' '}
            − 0.66), where p is the kitten&rsquo;s weight divided by its expected adult
            weight (capped at 1). Unlike a flat multiple of resting energy, it eases toward
            adult needs as the kitten fills out, so a 10 to 11 month kitten is not overfed.{' '}
            <strong>Merck&rsquo;s simpler rule of thumb is 2.5 × RER</strong>, which we show
            as a cross-check, not the main number. The weight for each age is the median for
            a neutered Domestic Shorthair kitten from{' '}
            <a className="link" href={CAT_WEIGHT.source.mainArticle}>Salt et al. (2023)</a>,
            the same dataset behind our{' '}
            <a className="link" href="/cat-weight-chart/">cat weight chart</a>. Calories per
            meal are the day&rsquo;s calories divided by the meals from Cornell. For a
            number tuned to your food, the calculator divides the daily calories by the kcal
            per cup or per can on the label (for example, if your label says{' '}
            {EXAMPLE_KCAL_PER_CUP} kcal per cup). The equation is printed in NRC 2006 and
            reproduced free by <a className="link" href={DVM360}>Packer (dvm360, 2021)</a>.
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
              <a className="link" href={NRC}>National Research Council (2006), Nutrient Requirements of Dogs and Cats</a>{' '}
              (the kitten growth ME equation; RER = 70 × kg<sup>0.75</sup>). Reproduced free in{' '}
              <a className="link" href={DVM360}>Packer RA, &ldquo;Easy nutritional math,&rdquo; dvm360 (2021)</a>, under &ldquo;Robin&rsquo;s Fun Equations,&rdquo; where you can check the formula.
            </li>
            <li>
              <a className="link" href={MERCK_DER}>Merck Veterinary Manual, Daily Maintenance Energy Requirements for Dogs and Cats</a>{' '}
              (adult cats 1.2 × RER neutered, 1.4 × RER intact; the 2.5 × RER kitten rule of thumb used as a cross-check; free-choice and &ldquo;starting point only&rdquo; notes).
            </li>
            <li>
              <a className="link" href={CORNELL}>Cornell Feline Health Center, How often should you feed your cat?</a>{' '}
              (three meals a day until six months, twice daily from six months to one year).
            </li>
            <li>
              <a className="link" href={CAT_WEIGHT.source.mainArticle}>{CAT_WEIGHT.source.mainCitation}</a>{' '}
              (<a className="link" href={CAT_WEIGHT.source.mainDataset}>Liverpool DataCat 1459</a>, CC BY 3.0) for weight by age.
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 20, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your kitten&rsquo;s diet.
        </p>
      </div>
    </>
  );
}
