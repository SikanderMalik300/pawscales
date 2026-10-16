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
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import {
  dogOngoingTable, catPainTable, DOG_ONGOING, CAT_PAIN, CAT_PREVISIT, type RefRow,
} from '@/lib/calc/gabapentin';

const SLUG = 'gabapentin-for-dogs-and-cats';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const REVIEWED = 'Reviewed against the Merck Veterinary Manual gabapentin tables, October 2026.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

function refTable(
  caption: string, tableCaption: string, rows: RefRow[], freq: string,
  source: ReactNode, extraFootnote?: ReactNode,
) {
  return (
    <DataTable
      caption={caption}
      tableCaption={tableCaption}
      columns={[
        { key: 'w', header: 'Weight' },
        { key: 'range', header: 'Typical range per dose', numeric: true },
      ]}
      rows={rows.map((r) => ({ cells: { w: `${r.lb} lb`, range: `${r.lowMg}–${r.highMg} mg` } }))}
      footnote={
        <>
          Approximate, rounded to 5 mg, {freq}. Your vet sets the exact dose.{' '}
          {extraFootnote}
        </>
      }
      source={source}
    />
  );
}

const merckDog = (
  <>Source: <a className="link" href="https://www.merckvetmanual.com/multimedia/table/common-drugs-used-to-treat-behavior-problems-in-dogs">Merck Veterinary Manual</a> (gabapentin 5&ndash;30 mg/kg PO q8h).</>
);
const merckCat = (
  <>Source: <a className="link" href="https://www.merckvetmanual.com/multimedia/table/selected-analgesics-for-use-in-cats">Merck Veterinary Manual</a> (gabapentin 3&ndash;10 mg/kg PO q8&ndash;12h).</>
);

export interface GabapentinContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function GabapentinPage(c: GabapentinContent) {
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
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: entry.h1, url, description: entry.metaDescription }} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: typeof f.a === 'string' ? f.a : '' })))} />

      <Band color="dog-calculators" className="pb-20 pt-5">
        <Breadcrumbs items={[
          { name: 'PawScales', href: '/' },
          { name: dogHub.h1, href: `/${dogHub.slug}/` },
          { name: 'Gabapentin Dosage Chart' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Gabapentin Dosage Chart for Dogs and Cats</h1>
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
          <p className="text-[18px] font-semibold text-ink">
            Follow your vet&rsquo;s prescription. Never start, stop or change a dose
            without your vet.
          </p>
          <p className="mt-2 text-[16px] text-ink">
            Gabapentin is a prescription medicine, so this page is a reference only, not
            a dose to give. The tables show the typical prescribed range by weight; your
            vet calculates the exact amount for your pet.
          </p>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Reference only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="Never give a dog the human liquid form">
          The human <strong>liquid (oral solution)</strong> of gabapentin can contain{' '}
          <strong>xylitol</strong>, which is toxic to dogs and can cause liver failure.
          Give capsules or tablets, or a vet-compounded xylitol-free liquid. Always
          check the label.
        </NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>Gabapentin dose for dogs</H2>
          <p className="mt-2 text-[16px] text-ink">
            For ongoing use (chronic or nerve pain, and as an add-on for seizures), the
            Merck Veterinary Manual lists <strong>5 to 30 mg/kg, {DOG_ONGOING.freq}</strong>.
            That is a wide range because the right amount depends on the dog and the
            condition.
          </p>
        </section>

        {refTable(
          'Dog gabapentin range by weight',
          'Dog gabapentin typical range by weight',
          dogOngoingTable(),
          DOG_ONGOING.freq,
          merckDog,
          <>Vets usually start at the lower end and adjust.</>,
        )}

        <p className="text-[16px] text-ink">
          For one-off use before a stressful event (a vet visit, fireworks, travel),
          Merck lists a higher dose range (<strong>20 to 50 mg/kg</strong>, about 90
          minutes before). Your vet calculates this for your dog; we don&rsquo;t show a
          per-weight number because it is a short-term, situation-specific dose.
        </p>

        <section>
          <H2>Gabapentin dose for cats</H2>
          <p className="mt-2 text-[16px] text-ink">
            For pain, the Merck Veterinary Manual lists <strong>3 to 10 mg/kg,
            {' '}{CAT_PAIN.freq}</strong> for cats.
          </p>
        </section>

        {refTable(
          'Cat gabapentin range by weight (pain)',
          'Cat gabapentin typical range by weight',
          catPainTable(),
          CAT_PAIN.freq,
          merckCat,
        )}

        <NoteBox label="Gabapentin for cats before a vet visit">
          For a calmer vet visit, cats are often given a single dose of{' '}
          <strong>{CAT_PREVISIT.lowMg} to {CAT_PREVISIT.highMg} mg per cat</strong>,
          once, about <strong>90 minutes before</strong> the appointment (van Haaften
          et al., 2017). This is a flat per-cat dose, not by weight. Older cats and cats
          with kidney disease are often given less, so your vet decides.
        </NoteBox>

        <section>
          <H2>Warnings</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li><strong>Do not stop suddenly</strong> after long-term use. Your vet tapers it; an abrupt stop can cause rebound pain or, if used for seizures, breakthrough seizures.</li>
            <li><strong>Sedation and wobbliness</strong> (ataxia) are common and dose-related. Keep your pet off stairs and furniture until it wears off.</li>
            <li><strong>Kidney disease:</strong> gabapentin is cleared by the kidneys, so dogs and older cats with kidney disease usually need a lower dose.</li>
            <li><strong>Prescription only</strong>, and a controlled substance in some US states. Only use gabapentin your vet prescribed for your pet, and don&rsquo;t combine it with other sedatives unless your vet says so.</li>
          </ul>
        </section>

        <NoteBox label="If you think your pet had too much">
          Call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a consultation fee may apply), or go to your nearest
          emergency vet. Signs of too much include heavy sedation, severe wobbliness, or
          collapse.
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
            <li>
              <a className="link" href="https://www.merckvetmanual.com/multimedia/table/common-drugs-used-to-treat-behavior-problems-in-dogs">Merck Veterinary Manual, Common Drugs Used to Treat Behavior Problems in Dogs</a>{' '}
              (gabapentin 5&ndash;30 mg/kg PO q8h; 20&ndash;50 mg/kg before a stressor).
            </li>
            <li>
              <a className="link" href="https://www.merckvetmanual.com/multimedia/table/selected-analgesics-for-use-in-cats">Merck Veterinary Manual, Selected Analgesics for Use in Cats</a>{' '}
              (gabapentin 3&ndash;10 mg/kg PO q8&ndash;12h).
            </li>
            <li>
              van Haaften KA, et al. Effects of a single preappointment dose of gabapentin on signs of stress in cats during transportation and veterinary examination. <em>J Am Vet Med Assoc.</em> 2017;251(10):1175&ndash;1181 (via{' '}
              <a className="link" href="https://todaysveterinarypractice.com/pharmacology/feline-friendly-previsit-pharmaceuticals/">Today&rsquo;s Veterinary Practice</a>).
            </li>
            <li>
              <a className="link" href="https://www.merckvetmanual.com/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals">Merck Veterinary Manual, Toxicoses From Human Analgesics</a>{' '}
              (xylitol in liquid gabapentin).
            </li>
            <li>
              <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
              (888-426-4435).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 17, 2026.</li>
          </ul>
        </section>

        <AuthorBox updated={updated} />
        <p className="text-[13px] text-muted">
          Reference only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>
    </>
  );
}
