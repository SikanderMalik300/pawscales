import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { DoodlePage } from '@/components/DoodlePage';
import { CAVAPOO } from '@/lib/data/doodles';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('cavapoo-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <DoodlePage
      breed={CAVAPOO}
      quickAnswer={
        <>A Cavapoo&rsquo;s size comes almost entirely from its Poodle parent. A
        Cavalier King Charles Spaniel is 13&ndash;18 lb (AKC); crossed with a Toy
        Poodle you get a Toy Cavapoo (about 7&ndash;13 lb), and with a Miniature
        Poodle a Miniature Cavapoo (about 12&ndash;25 lb). There is no Cavapoo breed
        standard, so the best guide is the parents &mdash; enter their weights to
        estimate.</>
      }
      method={
        <>
          <p>
            Because there is no Cavapoo breed standard, we start from the parents. A
            rough rule is that a puppy lands between the lighter parent and the average
            of both. The two labels &mdash; Toy and Miniature &mdash; are commonly used
            breeder categories set by the Poodle parent, not an official standard. To
            show weight by age, we scale the Salt et al. (2017) median growth curve to
            each category&rsquo;s representative weight, capped at the adult weight.
          </p>
          <p>
            <strong>Example 1.</strong> A Toy Poodle mother of 6 lb and a Cavalier
            father of 16 lb point to roughly 6&ndash;11 lb as adults (from the lighter
            parent up to the average of both), a Toy Cavapoo.
          </p>
          <p>
            <strong>Example 2.</strong> A Miniature puppy at 16 weeks weighing 8 lb is
            about 53% of its adult weight, projecting to about 15 lb, inside the
            12&ndash;25 lb Miniature range.
          </p>
        </>
      }
      comparison={
        <>
          <h2 className="text-[22px] sm:text-[26px]">The parents set the size</h2>
          <p className="mt-2 text-[16px] text-ink">
            A Cavapoo sits between its two parent breeds, and the Poodle side decides
            whether it is a Toy or a Miniature. The Poodle standard is set by height,
            not weight, so the Poodle weights below are typical figures.
          </p>
          <div className="mt-4">
            <DataTable
              caption="Cavapoo parent breeds (AKC)"
              tableCaption="Cavapoo parent breeds and their AKC standards"
              columns={[
                { key: 'breed', header: 'Parent breed' },
                { key: 'height', header: 'Height', numeric: true },
                { key: 'weight', header: 'Weight', numeric: true },
              ]}
              rows={[
                { cells: { breed: 'Cavalier King Charles Spaniel', height: '12–13 in', weight: '13–18 lb' } },
                { cells: { breed: 'Toy Poodle', height: 'up to 10 in', weight: '~4–6 lb (typical)' } },
                { cells: { breed: 'Miniature Poodle', height: 'over 10–15 in', weight: '~10–15 lb (typical)' } },
              ]}
              footnote="The AKC Poodle standard is set by height at the shoulder; the Poodle weights are typical figures, not part of the standard."
              source={
                <>
                  Sources: <a className="link" href="https://www.akc.org/dog-breeds/cavalier-king-charles-spaniel/">AKC Cavalier King Charles Spaniel</a>,{' '}
                  <a className="link" href="https://www.akc.org/dog-breeds/poodle-toy/">AKC Toy Poodle</a>,{' '}
                  <a className="link" href="https://www.akc.org/dog-breeds/poodle-miniature/">AKC Miniature Poodle</a>.
                </>
              }
            />
          </div>
          <p className="mt-3 text-[16px] text-ink">
            Toy and Miniature are the common breeder categories; there is no Cavapoo
            breed association or size standard, and individual dogs vary. For a mixed
            breed the parents are a better guide than any chart.
          </p>
        </>
      }
      faq={[
        { q: 'What are the Cavapoo sizes?', a: 'There is no official Cavapoo standard, but breeders commonly use two sizes based on the Poodle parent: Toy Cavapoo (Toy Poodle cross), about 9 to 12 inches and 7 to 13 pounds, and Miniature Cavapoo (Miniature Poodle cross), about 12 to 16 inches and 12 to 25 pounds. The overall range across all Cavapoos is roughly 9 to 22 pounds.' },
        { q: 'How big will my Cavapoo get?', a: 'The best guide is the parents, especially the Poodle. A rough rule is that a puppy lands between the lighter parent and the average of both. A Cavalier is 13 to 18 pounds, so a Toy Poodle cross stays small (7 to 13 pounds) and a Miniature Poodle cross is larger (12 to 25 pounds). Ask the breeder which Poodle size is behind the litter.' },
        { q: 'What is the difference between a Toy and Mini Cavapoo?', a: 'It is the Poodle parent. A Toy Cavapoo comes from a Toy Poodle and stays around 7 to 13 pounds; a Miniature Cavapoo comes from a Miniature Poodle and reaches about 12 to 25 pounds. There is no breed body that defines these, so the labels are breeder shorthand, and a dog can land between the two.' },
        { q: 'When is a Cavapoo full grown?', a: 'Most Cavapoos reach their adult height by about 10 to 12 months and fill out a little more into the second year. Smaller Toy Cavapoos finish a touch earlier than Miniatures. Because they are small dogs, most of the growing is done by the end of the first year.' },
        { q: 'How accurate is this size chart?', a: 'Treat it as a guide, not a standard: there is no Cavapoo breed association, so the categories are breeder consensus and the parent-breed figures come from the AKC. The weight-by-age figures scale growth data from more than 60,000 dogs to each category. Because the Cavapoo is a cross, individual dogs vary, so weigh your puppy and go by the parents.' },
      ]}
      sources={[
        { name: 'Wikipedia, Cavapoo (overall size range; no established breed standard).', url: 'https://en.wikipedia.org/wiki/Cavapoo' },
        { name: 'American Kennel Club, Cavalier King Charles Spaniel breed standard (12–13 in, 13–18 lb).', url: 'https://www.akc.org/dog-breeds/cavalier-king-charles-spaniel/' },
        { name: 'American Kennel Club, Toy Poodle (height up to 10 in).', url: 'https://www.akc.org/dog-breeds/poodle-toy/' },
        { name: 'American Kennel Club, Miniature Poodle (height over 10 to 15 in).', url: 'https://www.akc.org/dog-breeds/poodle-miniature/' },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts for monitoring bodyweight in dogs. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
      ]}
      related={['goldendoodle-size-chart', 'bernedoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart']}
    />
  );
}
