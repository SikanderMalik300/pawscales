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
import { dogTable, DOG, DOG_DAILY_MAX_MGKG, CAT_FLAT } from '@/lib/calc/trazodone';

const SLUG = 'trazodone-for-dogs-and-cats';
const dogHub = HUBS.find((h) => h.slug === 'dog-calculators')!;
const REVIEWED = 'Reviewed against the Merck Veterinary Manual trazodone table and the Stevens (2016) and Orlando (2016) cat studies, October 2026.';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="text-[22px] sm:text-[26px]">{children}</h2>;
}

export interface TrazodoneContent {
  quickAnswer: ReactNode;
  faq: FaqItem[];
}

export function TrazodonePage(c: TrazodoneContent) {
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
          { name: 'Trazodone Dosage Chart' },
        ]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">Trazodone Dosage Chart for Dogs and Cats</h1>
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
            Trazodone is a prescription medicine, so this page is a reference only, not
            a dose to give. The table shows the typical prescribed range by weight; your
            vet calculates the exact amount for your pet.
          </p>
        </div>
        <p className="mt-2 text-[13px] text-muted">
          Reference only, not veterinary advice. {REVIEWED}{' '}
          <a className="link" href="/disclaimer/">Medical disclaimer</a>.
        </p>
      </div>

      <div className="container-page mt-8 max-w-reading">
        <NoteBox label="Tell your vet every medicine your pet takes">
          Trazodone raises serotonin, so combining it with other serotonergic drugs can
          cause <strong>serotonin syndrome</strong>, which is dangerous. That includes{' '}
          <strong>fluoxetine, clomipramine, tramadol and selegiline</strong> (and other
          antidepressants or MAO inhibitors). Signs are agitation, tremors, a fast heart
          rate and fever. Always tell your vet about every medicine and supplement your
          pet is on.
        </NoteBox>
      </div>

      <div className="container-page mt-10 max-w-reading space-y-8">
        <section>
          <H2>Trazodone dose for dogs</H2>
          <p className="mt-2 text-[16px] text-ink">
            Trazodone is used for situational anxiety (vet visits, storms, travel, rest
            after surgery) and for ongoing anxiety. The Merck Veterinary Manual lists{' '}
            <strong>2 to 7.5 mg/kg, {DOG.freq}</strong>, as needed.
          </p>
        </section>

        <DataTable
          caption="Dog trazodone range by weight"
          tableCaption="Dog trazodone typical range by weight"
          columns={[
            { key: 'w', header: 'Weight' },
            { key: 'range', header: 'Typical range per dose', numeric: true },
          ]}
          rows={dogTable().map((r) => ({ cells: { w: `${r.lb} lb`, range: `${r.lowMg}–${r.highMg} mg` } }))}
          footnote={
            <>
              Approximate, rounded to 5 mg, {DOG.freq}. Do not exceed{' '}
              {DOG_DAILY_MAX_MGKG} mg/kg in any 24 hours (Merck); no fixed
              milligram-per-dog ceiling is published. Vets usually start at the lower
              end and adjust. Your vet sets the exact dose.
            </>
          }
          source={
            <>Source: <a className="link" href="https://www.merckvetmanual.com/multimedia/table/common-drugs-used-to-treat-behavior-problems-in-dogs">Merck Veterinary Manual</a> (trazodone 2&ndash;7.5 mg/kg PO q8&ndash;24h, up to 19.5 mg/kg/24h).</>
          }
        />

        <section>
          <H2>Trazodone dose for cats</H2>
          <p className="mt-2 text-[16px] text-ink">
            For cats, trazodone is mostly used as a one-off for a calmer vet visit or
            car trip.
          </p>
        </section>

        <NoteBox label="Trazodone for cats before a vet visit">
          A common approach is a single dose of{' '}
          <strong>{CAT_FLAT.lowMg} mg per cat</strong>, by mouth, about{' '}
          <strong>1 hour before</strong> you leave (Stevens et al., 2016), titrated up
          to <strong>{CAT_FLAT.highMg} mg</strong> if needed (Orlando et al., 2016).
          This is a flat per-cat dose, not by weight. Older cats and cats with liver,
          kidney or heart disease are often given less, so your vet decides.
        </NoteBox>

        <section>
          <H2>Warnings</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            <li><strong>Serotonin syndrome:</strong> do not combine with other serotonergic drugs (fluoxetine, clomipramine, tramadol, selegiline, other antidepressants) unless your vet directs it. Watch for agitation, tremors, a racing heart or fever.</li>
            <li><strong>Sedation and wobbliness</strong> (ataxia) are common. Keep your pet off stairs and furniture until it wears off.</li>
            <li><strong>Do not stop suddenly</strong> after long-term use. Your vet tapers it down.</li>
            <li><strong>Caution with liver, kidney or heart disease.</strong> Liver injury and a fast heart rate have been reported, so these pets often need a lower dose and monitoring.</li>
            <li><strong>Paradoxical reactions:</strong> occasionally trazodone causes the opposite effect (restlessness, agitation, increased anxiety). Call your vet if that happens.</li>
            <li><strong>Priapism:</strong> a persistent, painful erection has been reported in male dogs. It is a veterinary emergency, so seek care straight away.</li>
          </ul>
        </section>

        <NoteBox label="If you think your pet had too much">
          Call your vet or the <strong>ASPCA Animal Poison Control Center at
          (888) 426-4435</strong> (a consultation fee may apply), or go to your nearest
          emergency vet. Signs of too much include heavy sedation, severe wobbliness,
          vomiting, a racing heart, or collapse.
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
              (trazodone 2&ndash;7.5 mg/kg PO q8&ndash;24h; up to 19.5 mg/kg/24h; adverse effects).
            </li>
            <li>
              Stevens BJ, et al. Efficacy of a single dose of trazodone hydrochloride given to cats prior to veterinary visits. <em>J Am Vet Med Assoc.</em> 2016;249(2):202&ndash;207 (50 mg/cat, ~1 h before).
            </li>
            <li>
              Orlando JM, et al. Use of oral trazodone for sedation in cats: a pilot study. <em>J Feline Med Surg.</em> 2016 (50, 75 and 100 mg/cat).
            </li>
            <li>
              <a className="link" href="https://www.cliniciansbrief.com/article/trazodone-dogs-cats">Clinician&rsquo;s Brief, Trazodone in Dogs &amp; Cats</a>{' '}
              (no fixed mg-per-dog ceiling; cat 25 mg titrated to 100 mg).
            </li>
            <li>
              <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
              (888-426-4435).
            </li>
            <li className="text-[13px] text-muted">Accessed Oct 18, 2026.</li>
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
