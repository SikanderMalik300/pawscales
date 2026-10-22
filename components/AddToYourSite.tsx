import { embedTool, embedSnippet } from '@/lib/embeds';
import { EmbedSnippet } from '@/components/EmbedSnippet';

/** "Add this calculator to your site" box, shown below an embeddable tool. */
export function AddToYourSite({ slug }: { slug: string }) {
  const t = embedTool(slug);
  if (!t) return null;
  return (
    <section>
      <h2 className="text-[22px] sm:text-[26px]">Add this calculator to your site</h2>
      <p className="mt-2 text-[16px] text-ink">Free to use on your website, no sign-up.</p>
      <div className="mt-3">
        <EmbedSnippet code={embedSnippet(t)} />
      </div>
      <p className="mt-2 text-[13px] text-muted">
        <a className="link" href={`/embed/${t.slug}/`} target="_blank" rel="noopener">
          Preview the embed
        </a>
        . Credits link back to PawScales.
      </p>
    </section>
  );
}
