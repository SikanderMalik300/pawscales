import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { DoodlePage } from '@/components/DoodlePage';
import { LABRADOODLE } from '@/lib/data/doodles';
import { DataTable } from '@/components/ui/Table';
import { NoteBox } from '@/components/ui/NoteBox';

const tool = bySlug('labradoodle-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

const AKC_LAB = 'https://www.akc.org/dog-breeds/labrador-retriever/';
const AKC_STD = 'https://www.akc.org/dog-breeds/poodle-standard/';
const AKC_MIN = 'https://www.akc.org/dog-breeds/poodle-miniature/';

export default function Page() {
  return (
    <DoodlePage
      breed={LABRADOODLE}
      quickAnswer={
        <>A Labradoodle is a Labrador Retriever crossed with a Poodle, and its size
        comes mostly from the Poodle side. The Australian Labradoodle Association of
        America sets three sizes by height at the shoulder: Miniature (14&ndash;16 in),
        Medium (17&ndash;20 in) and Standard (21&ndash;24 in), across an overall
        15&ndash;65 lb. Enter a height, or the parents&rsquo; weights, to estimate.</>
      }
      method={
        <>
          <p>
            The three sizes are the ALAA categories, measured by height at the shoulder.
            The association does not attach a weight to each size, only an overall 15 to
            65 lb, so we estimate a weight band inside that range and scale the Salt et
            al. (2017) median growth curve to each size&rsquo;s representative weight,
            capped at the adult weight. Because the Poodle parent sets most of the size,
            go by the parents and weigh your own puppy.
          </p>
          <p>
            <strong>Example 1.</strong> A Medium puppy at 6 months weighing 29 lb is
            about 72% of its adult weight, projecting to roughly 40 lb, inside the 30 to
            50 lb Medium band.
          </p>
          <p>
            <strong>Example 2.</strong> A Standard puppy at 4 months weighing 28 lb
            projects to about 57 lb, inside the 50 to 65 lb Standard band.
          </p>
        </>
      }
      comparison={
        <>
          <h2 className="text-[22px] sm:text-[26px]">Labradoodle vs its parents</h2>
          <p className="mt-2 text-[16px] text-ink">
            A Labradoodle sits between a Labrador Retriever and a Poodle, and which Poodle
            is used decides the size. The Poodle standard is set by height, so the Poodle
            weights below are typical AKC figures.
          </p>
          <div className="mt-4">
            <DataTable
              caption="Labradoodle parent breeds (AKC)"
              tableCaption="Labradoodle parent breeds and their AKC figures"
              columns={[
                { key: 'breed', header: 'Parent breed' },
                { key: 'height', header: 'Height', numeric: true },
                { key: 'weight', header: 'Weight', numeric: true },
              ]}
              rows={[
                { cells: { breed: 'Labrador Retriever', height: '21.5–24.5 in', weight: '55–80 lb' } },
                { cells: { breed: 'Standard Poodle', height: 'over 15 in', weight: '40–70 lb' } },
                { cells: { breed: 'Miniature Poodle', height: '10–15 in', weight: '~10–15 lb (typical)' } },
              ]}
              footnote="AKC figures. The Labrador and Standard Poodle weights span females to males; the Miniature Poodle weight is a typical figure, as the AKC Poodle standard is set by height."
              source={
                <>
                  Sources: <a className="link" href={AKC_LAB}>AKC Labrador Retriever</a>,{' '}
                  <a className="link" href={AKC_STD}>AKC Standard Poodle</a>,{' '}
                  <a className="link" href={AKC_MIN}>AKC Miniature Poodle</a>.
                </>
              }
            />
          </div>
          <div className="mt-4">
            <NoteBox label="First-generation (F1) Labradoodles run bigger">
              An <strong>F1 Labradoodle (Labrador × Standard Poodle)</strong> lands about{' '}
              <strong>48 to 75 lb</strong>, roughly midway between the parents: a Labrador
              is 55 to 80 lb and a Standard Poodle 40 to 70 lb, so halfway is about 48 to
              75 lb. First-cross dogs often run <strong>bigger than the ALAA Standard
              range</strong>, because the Labrador side is large and pulls the average up.
            </NoteBox>
          </div>
          <p className="mt-3 text-[16px] text-ink">
            Note on the Miniature: a Miniature Labradoodle is usually a{' '}
            <strong>multi-generation</strong> dog (a Labradoodle bred back to a Poodle, or
            two Labradoodles), not a single Labrador by Miniature Poodle cross, which would
            pair a 55 to 80 lb dog with a 10 to 15 lb one. Treat Miniature as a multigen
            size, not a first cross.
          </p>
        </>
      }
      extra={
        <>
          <h2 className="text-[22px] sm:text-[26px]">Growth notes</h2>
          <p className="mt-2 text-[16px] text-ink">What makes one Labradoodle litter bigger or smaller:</p>
          <ul className="mt-3 space-y-2 text-[16px] text-ink [&_li]:list-disc">
            <li className="ml-5">
              <strong>The Poodle parent drives the size.</strong> A Standard Poodle gives a
              Medium or Standard Labradoodle; the smaller sizes come from a Miniature Poodle
              several generations back. The Labrador side is fairly steady at 55 to 80 lb.
            </li>
            <li className="ml-5">
              <strong>First-generation (F1) dogs vary the most.</strong> An F1 is half
              Labrador and half Poodle, so littermates can land anywhere between the two.
              Multi-generation Australian Labradoodles (F1b, F2 and beyond) are a little
              more predictable in size and coat, but still are not fixed.
            </li>
            <li className="ml-5">
              <strong>ALAA sets height, not weight.</strong> We estimate a weight for each
              height class, so a dog can sit a little outside the band. We do not repeat any
              breeder&rsquo;s weight promises; the parent figures are AKC and the growth
              curve is published data.
            </li>
          </ul>
        </>
      }
      faq={[
        { q: 'What are the Labradoodle sizes?', a: 'The Australian Labradoodle Association of America (ALAA) sets three sizes by height at the shoulder: Miniature (14 to 16 inches), Medium (17 to 20 inches) and Standard (21 to 24 inches), with an overall range of 15 to 65 pounds. The standard is by height, so the weight for each size is an estimate inside that overall band.' },
        { q: 'When is a Labradoodle full grown?', a: 'By our growth curve, most Labradoodles reach about 90% of their adult weight by 10 months and around 95% by 15 months. A Miniature is close to full size by about a year; Medium and Standard dogs keep filling out, mostly in the chest, into the second year (roughly 18 to 24 months for a Standard). Height finishes before the body fills out.' },
        { q: 'How big will my Labradoodle get?', a: 'The best guide is the Poodle parent and the puppy itself. For a sharper number, weigh your puppy and use our puppy weight calculator, which projects adult weight from age and current weight: a Medium pup at 6 months weighing 29 pounds is about 72% of its adult weight, projecting to roughly 40 pounds. A first-generation (Labrador by Standard Poodle) dog is about 48 to 75 pounds, often at the larger end.' },
        { q: 'What is the difference between an Australian Labradoodle and a Labradoodle?', a: 'The Australian Labradoodle is a multi-generation dog with a breed association (the ALAA) and the three defined sizes; it also has other breeds in its background, not just Labrador and Poodle. A plain "Labradoodle" is often a first cross (F1) of a Labrador and a Poodle, with no breed standard, so it varies more in size and coat.' },
        { q: 'How accurate is this size chart?', a: 'The size categories come from the ALAA and are defined by height, so the per-size weights are our estimate inside the ALAA overall 15 to 65 pounds, and the parent-breed figures are from the AKC. The weight-by-age figures scale growth data from more than 60,000 dogs to each size. Because the Labradoodle is a cross, individual dogs vary, so weigh your own puppy and go by the parents.' },
      ]}
      sources={[
        { name: 'Australian Labradoodle Association of America (ALAA), Breed Standard (three sizes by height at the wither; overall 15 to 65 lb).', url: 'https://alaa-labradoodles.com/for-breeders/breed-standard/' },
        { name: 'American Kennel Club, Labrador Retriever breed standard (21.5 to 24.5 in; 55 to 80 lb).', url: AKC_LAB },
        { name: 'American Kennel Club, Poodle (Standard) breed standard (over 15 in; about 40 to 70 lb).', url: AKC_STD },
        { name: 'American Kennel Club, Poodle (Miniature) breed standard (10 to 15 in).', url: AKC_MIN },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts for monitoring bodyweight in dogs. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
      ]}
      related={['goldendoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart', 'dog-food-calculator']}
    />
  );
}
