import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmbedSnippet } from '@/components/EmbedSnippet';
import { EMBED_TOOLS, embedSnippet } from '@/lib/embeds';
import { SITE, bySlug } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Free Calculators for Your Website | PawScales',
  description:
    'Add a free PawScales calculator to your site with one line of code: dog years, puppy weight, cat years, dog pregnancy and kitten age. Each links back to PawScales.',
  alternates: { canonical: `${SITE.url}/embed/` },
};

export default function EmbedIndex() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page max-w-reading py-10">
        <Breadcrumbs items={[{ name: 'PawScales', href: '/' }, { name: 'Embed' }]} />
        <h1 className="mt-3 text-[30px] sm:text-[40px]">Free calculators for your site</h1>
        <p className="mt-3 text-[16px] text-ink sm:text-[18px]">
          Put a PawScales calculator on your own website, free and with no sign-up. Copy
          the code for any of the five below. Each embed shows a short credit that links
          back to the full tool here, which is all we ask in return. The calculators run
          in the visitor&rsquo;s browser, with no analytics or third-party scripts.
        </p>
        <div className="mt-8 space-y-10">
          {EMBED_TOOLS.map((t) => {
            const e = bySlug(t.slug);
            return (
              <section key={t.slug}>
                <h2 className="text-[22px] sm:text-[26px]">{e?.h1 ?? t.title}</h2>
                {e?.oneLiner && <p className="mt-1 text-[16px] text-muted">{e.oneLiner}</p>}
                <div className="mt-3">
                  <EmbedSnippet code={embedSnippet(t)} />
                </div>
                <p className="mt-2 text-[13px] text-muted">
                  <a className="link" href={`/embed/${t.slug}/`} target="_blank" rel="noopener">
                    Preview the embed
                  </a>
                  {' · '}
                  <a className="link" href={`/${t.slug}/`}>Open the full tool</a>
                </p>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
