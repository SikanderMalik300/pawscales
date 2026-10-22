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
import { BenadrylCalculator } from '@/components/tools/BenadrylCalculator';
import { doseForLb, BENADRYL, DOG_CHART_LB, CAT_CHART_LB, type Species } from '@/lib/calc/benadryl';

const SLUG = 'benadryl-dosage-calculator';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const REVIEWED = 'Reviewed against the Merck Veterinary Manual antihistamine table and the AAHA 2023 allergic skin disease guidelines, October 2026.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const mgWindow = (lo: number, hi: number) => (lo === hi ? `${hi} mg` : `${lo} mg–${hi} mg`);
const tabletWord = (n: number) => (n <= 1 ? 'tablet' : 'tablets');
const tabletRange = (lo: number, hi: number) =>
  lo === hi ? `${lo} ${tabletWord(lo)}` : `${lo}–${hi}`;

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

function chart(species: Species) {
  const weights = species === 'dog' ? DOG_CHART_LB : CAT_CHART_LB;
  const cfg = BENADRYL[species];
  return (
    <DataTable
      caption={`${species === 'dog' ? 'Dog' : 'Cat'} Benadryl doses by weight`}
      tableCaption={`${species === 'dog' ? 'Dog' : 'Cat'} diphenhydramine dose by weight`}
      columns={[
        { key: 'w', header: 'Weight' },
        { key: 'dose', header: 'Dose per dose', numeric: true },
        { key: 'tabs', header: '25 mg tablets', numeric: true },
      ]}
      rows={weights.map((lb) => {
        const d = doseForLb(species, lb)!;
        return {
          cells: {
            w: `${lb} lb`,
            dose: mgWindow(d.lowMgShown, d.highMgShown),
            tabs: d.noTablet ? 'ask your vet' : tabletRange(d.lowTablets!, d.highTablets!),
          },
        };
      })}
      footnote={
        <>
          {cfg.minMgKg}&ndash;{cfg.maxMgKg} mg/kg, {cfg.freq}. Tablet counts are in half
          steps and never exceed {cfg.maxMgKg} mg/kg. Where no half tablet fits, ask
          your vet for a liquid or the exact amount.
        </>
      }
      source={
        species === 'dog'
          ? <>Source: <a className="link" href="https://www.merckvetmanual.com/multimedia/table/antihistamine-dosages-for-integumentary-disease-in-animals">Merck Veterinary Manual</a> (diphenhydramine 2&ndash;4 mg/kg, q8&ndash;12h).</>
          : <>Source: <a className="link" href="https://www.aaha.org/resources/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/table-8-oral-antihistamine-doses-for-cats/">AAHA 2023 guidelines, Table 8</a> (diphenhydramine 2&ndash;3 mg/kg, q12h).</>
      }
    />
  );
}

export interface BenadrylContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function BenadrylPage(c: BenadrylContent) {
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
      <JsonLd data={webPageSchema({ name: entry.h1, url, description: entry.metaDescription, published: entry.published, lastUpdated: entry.lastUpdated, reviewed: true })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />

      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: dogHub.h1, href: `/${dogHub.slug}/` },
          { name: 'Benadryl Dosage Calculator' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Benadryl Dosage Calculator for Dogs and Cats</h1>
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
        <BenadrylCalculator />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="If you think your pet had too much">
          Call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a consultation fee may apply), or go to your nearest
          emergency vet right away. Do this if you are not sure how much your pet had,
          or if you see any overdose signs below.
        </NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>How much Benadryl can I give?</H2>
          <p className="mt-2 text-[16px] text-ink">
            Benadryl is a brand of diphenhydramine, an antihistamine. The published
            dose is <strong>2 to 4 mg/kg for dogs</strong>, {BENADRYL.dog.freq} (Merck
            Veterinary Manual), and <strong>2 to 3 mg/kg for cats</strong>,{' '}
            {BENADRYL.cat.freq} (AAHA 2023 guidelines). That works out to roughly 1 mg
            per pound. The calculator leads with that lower, cautious amount and shows
            the full range. Always confirm the amount with your vet first, especially
            for cats and small dogs.
          </p>
        </section>

        {chart('dog')}
        {chart('cat')}

        <NoteBox label="Check the box: plain diphenhydramine only">
          Use a product whose only active ingredient is diphenhydramine. Never give a
          combination product with a decongestant, such as Benadryl-D or anything
          listing pseudoephedrine or phenylephrine; those can be dangerous for pets.
          Avoid liquids and children&rsquo;s formulas that contain xylitol, which is
          toxic to dogs, unless your vet confirms the product. Read the active
          ingredient panel every time.
        </NoteBox>

        <section>
          <H2>Who should not take it</H2>
          <p className="mt-2 text-[16px] text-ink">
            Talk to your vet before giving diphenhydramine if your pet:
          </p>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li>is pregnant or nursing;</li>
            <li>has glaucoma, heart disease or high blood pressure;</li>
            <li>has an overactive thyroid;</li>
            <li>has a seizure disorder;</li>
            <li>has an enlarged prostate or trouble urinating;</li>
            <li>is already on another sedative or an antidepressant.</li>
          </ul>
          <p className="mt-3 text-[14px] text-muted">
            From the diphenhydramine precautions in the Merck Veterinary Manual and
            Plumb&rsquo;s Veterinary Drug Handbook.
          </p>
        </section>

        <section>
          <H2>Overdose signs</H2>
          <p className="mt-2 text-[16px] text-ink">
            Too much diphenhydramine can cause:
          </p>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li>agitation, restlessness or hyperexcitability;</li>
            <li>a fast heartbeat and dilated pupils;</li>
            <li>tremors or seizures;</li>
            <li>heavy drowsiness, dry mouth, or trouble urinating.</li>
          </ul>
          <p className="mt-3 text-[16px] text-ink">
            If you see any of these, or gave more than the amounts above, call your vet
            or the ASPCA Animal Poison Control Center at (888) 426-4435 right away.
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
              <a className="link" href="https://www.merckvetmanual.com/multimedia/table/antihistamine-dosages-for-integumentary-disease-in-animals">Merck Veterinary Manual, Antihistamine Dosages for Integumentary Disease in Animals</a>{' '}
              (diphenhydramine 2&ndash;4 mg/kg, IM/PO/SC, q8&ndash;12h).
            </li>
            <li>
              <a className="link" href="https://www.aaha.org/resources/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/table-8-oral-antihistamine-doses-for-cats/">AAHA 2023 Management of Allergic Skin Diseases, Table 8</a>{' '}
              (cats, diphenhydramine 2&ndash;3 mg/kg, q12h).
            </li>
            <li>
              <a className="link" href="https://www.merckvetmanual.com/toxicology/toxicoses-from-human-cold-and-allergy-medications/toxicoses-in-animals-from-human-cold-and-allergy-medications">Merck Veterinary Manual, Toxicoses From Human Cold and Allergy Medications</a>{' '}
              (decongestant danger).
            </li>
            <li>
              <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
              (888-426-4435).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 15, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>
    </>
  );
}
