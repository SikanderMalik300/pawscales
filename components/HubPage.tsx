import type { Metadata } from 'next';
import { HUBS, byCategory, bySlug, breedPages, SITE, type Category } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { Band } from '@/components/ui/Band';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { DataTable } from '@/components/ui/Table';
import { Faq, type FaqItem } from '@/components/ui/Faq';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export function hubMetadata(slug: Category): Metadata {
  const hub = HUBS.find((h) => h.slug === slug)!;
  const url = `${SITE.url}/${slug}/`;
  return {
    title: hub.title,
    description: hub.intro.slice(0, 155),
    alternates: { canonical: url },
    openGraph: {
      title: hub.title, description: hub.intro.slice(0, 155), url, type: 'website',
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [`/og/${slug}.png`] },
  };
}

export function HubPage({
  slug,
  whichTool,
  faq,
}: {
  slug: Category;
  whichTool: { need: string; tool: string }[]; // tool = registry slug
  faq: FaqItem[];
}) {
  const hub = HUBS.find((h) => h.slug === slug)!;
  const tools = byCategory(slug);
  const breedCharts = breedPages().filter((p) => p.category === slug);
  const growthHeading = slug === 'dog-size-charts' ? 'Breed growth charts' : 'Growth charts';
  const photo = getPhoto(`hub-${slug === 'dog-calculators' ? 'dog' : slug === 'cat-calculators' ? 'cat' : 'size'}`);
  const url = `${SITE.url}/${slug}/`;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: hub.h1, url },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: hub.h1,
        url,
        description: hub.intro,
      }} />

      <Band color={slug} className="py-6">
        <Breadcrumbs items={[{ name: 'PawScales', href: '/' }, { name: hub.h1 }]} />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h1 className="text-[30px] sm:text-[40px]">{hub.h1}</h1>
            <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">{hub.intro}</p>
          </div>
          {photo && (
            <div className="md:col-span-5">
              <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
                <Picture photo={photo} crop="ld" sizes="(min-width: 960px) 40vw, 100vw" eager />
              </div>
            </div>
          )}
        </div>
      </Band>

      <div className="container-page py-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          {tools.map((t) => (
            <PhotoTile key={t.slug} href={`/${t.slug}/`} photoId={t.slug} label={t.shortName} description={t.oneLiner} />
          ))}
        </div>
        {breedCharts.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-[22px] sm:text-[26px]">{growthHeading}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
              {breedCharts.map((t) => (
                <PhotoTile key={t.slug} href={`/${t.slug}/`} photoId={t.slug} label={t.shortName} description={t.oneLiner} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container-page max-w-reading space-y-10 pb-4">
        <section>
          <h2 className="text-[22px] sm:text-[26px]">Which tool do I need?</h2>
          <div className="mt-3">
            <DataTable
              columns={[{ key: 'need', header: 'If you want to…' }, { key: 'tool', header: 'Use' }]}
              rows={whichTool.map((w) => {
                const t = bySlug(w.tool);
                return {
                  cells: {
                    need: w.need,
                    tool: <a className="link" href={`/${w.tool}/`}>{t?.shortName ?? w.tool}</a>,
                  },
                };
              })}
            />
          </div>
        </section>
        <section>
          <h2 className="text-[22px] sm:text-[26px]">Questions</h2>
          <div className="mt-3"><Faq items={faq} /></div>
        </section>
      </div>
    </>
  );
}
