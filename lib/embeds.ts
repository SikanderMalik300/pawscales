// Embeddable calculators (pawscales-day13). Each of these tools has a chrome-free
// /embed/<slug>/ page that other sites can iframe, with a credit link back to the
// full tool page (the earned backlink). The credit <p> in the snippet sits OUTSIDE
// the iframe so search engines count it.
import { SITE } from '@/lib/registry';

export interface EmbedTool {
  slug: string; // main tool slug (also the embed path)
  title: string; // used in the iframe title and the credit text
  height: number; // fixed iframe height in px for the snippet
}

export const EMBED_TOOLS: EmbedTool[] = [
  { slug: 'dog-years-calculator', title: 'Dog years calculator', height: 520 },
  { slug: 'puppy-weight-calculator', title: 'Puppy weight calculator', height: 660 },
  { slug: 'cat-years-calculator', title: 'Cat years calculator', height: 500 },
  { slug: 'dog-pregnancy-calculator', title: 'Dog pregnancy calculator', height: 560 },
  { slug: 'kitten-age-chart', title: 'Kitten age chart', height: 560 },
];

export const isEmbedTool = (slug: string): boolean => EMBED_TOOLS.some((t) => t.slug === slug);
export const embedTool = (slug: string): EmbedTool | undefined => EMBED_TOOLS.find((t) => t.slug === slug);

/** The copy-paste snippet: the iframe plus the credit <p> whose link points to the
 *  full tool page (not the embed page). Plain anchor text, no keyword stuffing. */
export function embedSnippet(t: EmbedTool): string {
  const src = `${SITE.url}/embed/${t.slug}/`;
  const toolUrl = `${SITE.url}/${t.slug}/`;
  return (
    `<iframe src="${src}" width="100%" height="${t.height}" style="border:0;max-width:640px" title="${t.title}" loading="lazy"></iframe>\n` +
    `<p style="font-size:13px">${t.title} by <a href="${toolUrl}">PawScales</a></p>`
  );
}
