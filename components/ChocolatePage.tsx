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
import { ChocolateCalculator } from '@/components/tools/ChocolateCalculator';
import { CHOC_TYPES, THRESHOLDS } from '@/lib/calc/chocolate';

const SLUG = 'dog-chocolate-toxicity-calculator';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const REVIEWED = 'Reviewed against the Merck Veterinary Manual chocolate toxicosis data and USDA FoodData Central, October 2026.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

export interface ChocolateContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function ChocolatePage(c: ChocolateContent) {
  const entry = bySlug(SLUG)!;
  const photo = getPhoto(SLUG)!;
  const url = `${SITE.url}/${SLUG}/`;
  const updated = fmtDate(entry.lastUpdated);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: dogHub.h1, url: `${SITE.url}/${dogHub.slug}/` },
        { name: entry.h1, url },
      ])} />
      <JsonLd data={webPageSchema({ name: entry.h1, url, description: entry.metaDescription, lastUpdated: entry.lastUpdated, reviewed: true })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />

      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: dogHub.h1, href: `/${dogHub.slug}/` },
          { name: 'Chocolate Toxicity Calculator' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Dog Chocolate Toxicity Calculator</h1>
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
        <ChocolateCalculator />
        <p className="mt-2 text-[13px] text-muted">
          An estimate, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="When in doubt, call">
          If you are not sure what your dog ate or how much, or your dog is unwell,
          call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a fee may apply), or your nearest emergency vet.
          It is always better to call early.
        </NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>How much chocolate is toxic to a dog?</H2>
          <p className="mt-2 text-[16px] text-ink">
            It depends on the <strong>type of chocolate</strong> (how much theobromine
            and caffeine it holds), the <strong>amount eaten</strong>, and your{' '}
            <strong>dog&rsquo;s weight</strong>. Vets use the dose in milligrams of
            theobromine plus caffeine per kilogram of body weight. Based on the Merck
            Veterinary Manual and the ASPCA: mild signs (vomiting, diarrhoea, thirst)
            appear around <strong>{THRESHOLDS.upset} mg/kg</strong>, heart effects
            around <strong>{THRESHOLDS.cardiac} to 50 mg/kg</strong>, and seizures at{' '}
            <strong>{THRESHOLDS.seizure} mg/kg</strong> and above. The calculator does
            this maths for you and shows which band you are in.
          </p>
        </section>

        <DataTable
          caption="Theobromine plus caffeine by chocolate type"
          tableCaption="Methylxanthine content by chocolate type"
          columns={[
            { key: 'type', header: 'Type' },
            { key: 'oz', header: 'Per ounce', numeric: true },
            { key: 'g', header: 'Per gram', numeric: true },
          ]}
          rows={CHOC_TYPES.map((t) => ({
            cells: { type: t.label, oz: `${t.mgPerOz} mg`, g: `${t.mgPerG} mg` },
          }))}
          footnote="Darker chocolate and cocoa powder hold far more than milk chocolate, so a small amount matters more. White chocolate has very little, but is high in fat and sugar."
          source={
            <>
              Content from the{' '}
              <a className="link" href="https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals">Merck Veterinary Manual</a>{' '}
              (high end of each range); very dark (70%+) from{' '}
              <a className="link" href="https://fdc.nal.usda.gov/">USDA FoodData Central</a>.
            </>
          }
        />

        <section>
          <H2>What to do if your dog ate chocolate</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li><strong>Act early.</strong> If it was eaten in the last 1 to 2 hours, call now. Your vet may be able to make your dog vomit before the chocolate is absorbed.</li>
            <li><strong>Don&rsquo;t make your dog vomit at home</strong> unless a vet tells you to. The wrong method can do more harm.</li>
            <li><strong>Check the label.</strong> If the product also has <strong>xylitol</strong> (sugar-free), <strong>raisins</strong> or <strong>macadamia nuts</strong>, call your vet or the ASPCA whatever the chocolate result says. Those are dangerous on their own.</li>
            <li><strong>Save the wrapper</strong> so you and your vet know the type and amount.</li>
            <li><strong>Watch for signs:</strong> restlessness, a racing heart, vomiting, diarrhoea, tremors or seizures. Call your vet or the ASPCA Animal Poison Control Center at (888) 426-4435.</li>
          </ul>
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
              <a className="link" href="https://www.merckvetmanual.com/toxicology/food-hazards/chocolate-toxicosis-in-animals">Merck Veterinary Manual, Chocolate Toxicosis in Animals</a>{' '}
              (methylxanthine content by type; toxic doses 20 / 40&ndash;50 / 60 mg/kg; LD50 100&ndash;200 mg/kg).
            </li>
            <li>
              <a className="link" href="https://fdc.nal.usda.gov/">USDA FoodData Central</a>, dark chocolate 70&ndash;85% cacao (theobromine 802 mg and caffeine 80 mg per 100 g).
            </li>
            <li>
              <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
              (888-426-4435).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 17, 2026. Cats are far less likely to eat chocolate, but the same per-kg thresholds apply; call your vet.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          An estimate, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>
    </>
  );
}
