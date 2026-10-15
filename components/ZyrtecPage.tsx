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
import { ZyrtecCalculator } from '@/components/tools/ZyrtecCalculator';
import { dogDoseForLb, DOG_CHART_LB, CETIRIZINE_CAT } from '@/lib/calc/zyrtec';

const SLUG = 'zyrtec-dosage-calculator';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const REVIEWED = 'Reviewed against the Merck Veterinary Manual antihistamine table and the AAHA 2023 allergic skin disease guidelines, October 2026.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const mg = (n: number) => `${Math.round(n)} mg`;
const tabletWord = (n: number) => (n <= 1 ? 'tablet' : 'tablets');
const tabletRange = (lo: number, hi: number) => (lo === hi ? `${lo} ${tabletWord(lo)}` : `${lo}–${hi}`);

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

export interface ZyrtecContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function ZyrtecPage(c: ZyrtecContent) {
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
          { name: 'Zyrtec Dosage Calculator' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Zyrtec Dosage Calculator for Dogs</h1>
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
        <ZyrtecCalculator />
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="Zyrtec for cats (a flat dose, not by weight)">
          Cats: <strong>5 mg per cat (half a 10 mg tablet) once a day</strong>. Vets may
          use up to 10 mg per cat. This is a per-cat dose, not by weight (AAHA 2023,
          Table 8; Merck Veterinary Manual). Be cautious in cats with kidney disease,
          which is common in older cats, and ask your vet first.
        </NoteBox>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="If you think your pet had too much">
          Call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a consultation fee may apply), or go to your nearest
          emergency vet. A plain cetirizine overdose is usually mild, but a
          <strong> Zyrtec-D</strong> overdose (pseudoephedrine) is an emergency.
        </NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>How much Zyrtec can I give my dog?</H2>
          <p className="mt-2 text-[16px] text-ink">
            Zyrtec is a brand of cetirizine, an antihistamine. The published dose for
            dogs is <strong>1 to 2 mg/kg once a day</strong> (AAHA 2023 guidelines), or
            <strong> 10 to 20 mg per dog</strong> (Merck Veterinary Manual), which is
            roughly 1 mg per pound. The calculator leads with that lower amount and caps
            the result at 20 mg per dose, so a big dog is not given a very large amount.
            Always confirm with your vet first.
          </p>
        </section>

        <DataTable
          caption="Dog Zyrtec doses by weight"
          tableCaption="Dog cetirizine dose by weight"
          columns={[
            { key: 'w', header: 'Weight' },
            { key: 'dose', header: 'Dose once a day', numeric: true },
            { key: 'tabs', header: '10 mg tablets', numeric: true },
          ]}
          rows={DOG_CHART_LB.map((lb) => {
            const d = dogDoseForLb(lb)!;
            return {
              cells: {
                w: `${lb} lb`,
                dose: d.noTablet
                  ? `${mg(d.lowMg)}–${mg(d.highMg)}`
                  : d.lowTabletMg === d.highTabletMg
                    ? mg(d.lowTabletMg!)
                    : `${mg(d.lowTabletMg!)}–${mg(d.highTabletMg!)}`,
                tabs: d.noTablet ? 'ask your vet' : tabletRange(d.lowTablets!, d.highTablets!),
              },
            };
          })}
          footnote={
            <>
              1&ndash;2 mg/kg once a day, capped at 20 mg per dose. From about 44 lb
              (20 kg) up, the dose holds at 20 mg (2 tablets); your vet may adjust it.
            </>
          }
          source={
            <>
              Sources: <a className="link" href="https://www.merckvetmanual.com/multimedia/table/antihistamine-dosages-for-integumentary-disease-in-animals">Merck Veterinary Manual</a>{' '}
              (1 mg/kg or 10&ndash;20 mg/dog) and{' '}
              <a className="link" href="https://www.aaha.org/resources/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/table-3-oral-antihistamine-doses-for-dogs/">AAHA 2023, Table 3</a> (1&ndash;2 mg/kg q24h).
            </>
          }
        />

        <NoteBox label="Check the box: plain cetirizine only">
          Use a product whose only active ingredient is cetirizine. Never give a
          combination product with a decongestant, such as Zyrtec-D or anything listing
          pseudoephedrine or phenylephrine; those can be dangerous for pets. Check
          liquids and children&rsquo;s formulas for xylitol, which is toxic to dogs.
          Read the active ingredient panel every time.
        </NoteBox>

        <section>
          <H2>Who should not take it</H2>
          <p className="mt-2 text-[16px] text-ink">
            Talk to your vet before giving cetirizine if your pet:
          </p>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li>has kidney or liver disease (cetirizine is cleared by the kidneys);</li>
            <li>is pregnant or nursing;</li>
            <li>is a cat with kidney disease, which is common in older cats;</li>
            <li>is already on other medicines, until your vet checks for interactions.</li>
          </ul>
          <p className="mt-3 text-[14px] text-muted">
            From the cetirizine precautions in the Merck Veterinary Manual and
            Plumb&rsquo;s Veterinary Drug Handbook.
          </p>
        </section>

        <section>
          <H2>Overdose signs</H2>
          <p className="mt-2 text-[16px] text-ink">
            Too much plain cetirizine is usually mild, but watch for:
          </p>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li>heavy drowsiness, or the opposite, restlessness;</li>
            <li>drooling or an upset stomach;</li>
            <li>with a Zyrtec-D product, a racing heart, agitation and tremors, which is an emergency.</li>
          </ul>
          <p className="mt-3 text-[16px] text-ink">
            If you see these, or gave a Zyrtec-D product, call your vet or the ASPCA
            Animal Poison Control Center at (888) 426-4435 right away.
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
              (cetirizine, dogs 1 mg/kg or 10&ndash;20 mg/dog; cats 1 mg/kg or 5 mg/cat).
            </li>
            <li>
              <a className="link" href="https://www.aaha.org/resources/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/table-3-oral-antihistamine-doses-for-dogs/">AAHA 2023 Management of Allergic Skin Diseases, Table 3</a>{' '}
              (dogs, cetirizine 1&ndash;2 mg/kg q24h).
            </li>
            <li>
              <a className="link" href="https://www.aaha.org/resources/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/table-8-oral-antihistamine-doses-for-cats/">AAHA 2023, Table 8</a>{' '}
              (cats, cetirizine 5&ndash;10 mg/cat q24h).
            </li>
            <li>
              <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
              (888-426-4435).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 16, 2026.</li>
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
