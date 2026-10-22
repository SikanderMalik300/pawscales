import type { ReactNode } from 'react';
import { bySlug, SITE, HUBS } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { Band } from '@/components/ui/Band';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Picture } from '@/components/ui/Picture';
import { Faq, type FaqItem } from '@/components/ui/Faq';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { NoteBox } from '@/components/ui/NoteBox';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { JsonLd } from '@/components/JsonLd';
import { AddToYourSite } from '@/components/AddToYourSite';
import { isEmbedTool } from '@/lib/embeds';
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from '@/lib/schema';

const UPDATED = 'October 10, 2026';
const hubName = (slug: string) => HUBS.find((h) => h.slug === slug)!;

export interface ToolPageContent {
  slug: string;
  quickAnswer: ReactNode;
  calculator: ReactNode;
  howTo: ReactNode[];
  formula: ReactNode;
  notCovered?: string[];
  tables?: ReactNode;
  tips: ReactNode[];
  faq: FaqItem[];
  sources: { name: string; url: string }[];
  seeVet?: ReactNode; // health-adjacent "see your vet if" list
  aboutData?: ReactNode;
  extraSchema?: object[];
  updated?: string; // override the default "Updated" date when a tool changes
}

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-[22px] sm:text-[26px]">
      {children}
    </h2>
  );
}

export function ToolPage(c: ToolPageContent) {
  const tool = bySlug(c.slug)!;
  const photo = getPhoto(c.slug)!;
  const hub = hubName(tool.category);
  const url = `${SITE.url}/${tool.slug}/`;
  const updated = c.updated ?? UPDATED;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'PawScales', url: SITE.url + '/' },
        { name: hub.h1, url: `${SITE.url}/${hub.slug}/` },
        { name: tool.h1, url },
      ])} />
      <JsonLd data={webApplicationSchema({ name: tool.h1, url, description: tool.metaDescription, published: tool.published, lastUpdated: tool.lastUpdated })} />
      <JsonLd data={faqSchema(c.faq.map((f) => ({ q: f.q, a: faqText(f.a) })))} />
      {c.extraSchema?.map((s, i) => <JsonLd key={i} data={s} />)}

      <Band color={tool.category} className="pb-20 pt-5">
        <Breadcrumbs
          items={[
            { name: 'PawScales', href: '/' },
            { name: hub.h1, href: `/${hub.slug}/` },
            { name: tool.h1 },
          ]}
        />
        <div className="mt-3 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            <h1 className="text-[30px] sm:text-[40px]">{tool.h1}</h1>
            <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">{c.quickAnswer}</p>
            <p className="mt-3 text-[13px] text-muted">
              By {SITE.author} · Updated {updated} ·{' '}
              <a href="#sources" className="link">Sources</a>
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
        {c.calculator}
        <p className="mt-2 text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet’s health.
        </p>
      </div>

      <div className="container-page mt-10 max-w-reading">
        <section>
          <H2>How to use it</H2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[16px] text-ink">
            {c.howTo.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>

        <div className="mt-8 md:hidden">
          <div className="aspect-[16/9] overflow-hidden rounded-[16px]">
            <Picture photo={photo} crop="ld" sizes="100vw" />
          </div>
          <p className="mt-1 text-[12px] text-muted">Photo: {photo.photographer} / {photo.source}</p>
        </div>

        <section className="mt-10">
          <H2>The formula, with two examples</H2>
          <div className="mt-3 space-y-3 text-[16px] text-ink">{c.formula}</div>
        </section>

        <section className="mt-10">
          <H2>What this calculator doesn’t cover</H2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-ink">
            {(c.notCovered ?? tool.notCovered).map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </section>

        {c.seeVet && (
          <section className="mt-8">
            <NoteBox label="See your vet if" danger>{c.seeVet}</NoteBox>
          </section>
        )}
      </div>

      {c.tables && (
        <div className="container-page mt-10 max-w-reading space-y-8">{c.tables}</div>
      )}

      <div className="container-page mt-10 max-w-reading space-y-10">
        <section>
          <H2>Tips</H2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-ink">
            {c.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>

        {tool.fromOwner && (
          <NoteBox label="From Sikander">{tool.fromOwner}</NoteBox>
        )}

        <section>
          <H2>Questions owners ask</H2>
          <div className="mt-3"><Faq items={c.faq} /></div>
        </section>

        {c.aboutData && (
          <section>
            <H2>About the data</H2>
            <div className="mt-3 text-[16px] text-ink">{c.aboutData}</div>
          </section>
        )}

        {isEmbedTool(tool.slug) && <AddToYourSite slug={tool.slug} />}

        <section>
          <H2>Related tools</H2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            {tool.related.map((slug) => {
              const r = bySlug(slug);
              if (!r) return null;
              return (
                <PhotoTile key={slug} href={`/${slug}/`} photoId={slug} label={r.shortName} description={r.oneLiner} />
              );
            })}
          </div>
        </section>

        <section id="sources">
          <H2>Sources</H2>
          <ul className="mt-3 space-y-2 text-[16px] text-ink">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a className="link" href={s.url}>{s.name}</a>{' '}
                <span className="text-[13px] text-muted">Accessed Oct 10, 2026.</span>
              </li>
            ))}
          </ul>
        </section>

        <AuthorBox updated={updated} />

        <p className="text-[13px] text-muted">
          Estimates only, not veterinary advice. Ask your vet about your pet’s health.
        </p>
      </div>
    </>
  );
}

// Extract plain text from an FAQ answer node for JSON-LD (answers are plain strings here).
function faqText(a: ReactNode): string {
  return typeof a === 'string' ? a : '';
}

export { toolMetadata } from '@/lib/seo';
