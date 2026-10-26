import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { EMBED_TOOLS, embedTool } from '@/lib/embeds';
import { SITE } from '@/lib/registry';
import { DogYearsCalculator } from '@/components/tools/DogYearsCalculator';
import { PuppyCalculator } from '@/components/tools/PuppyCalculator';
import { CatYearsCalculator } from '@/components/tools/CatYearsCalculator';
import { PregnancyCalculator } from '@/components/tools/PregnancyCalculator';
import { KittenCalculator } from '@/components/tools/KittenCalculator';
import { HeatCalculator } from '@/components/tools/HeatCalculator';

// Fixed set (static export): only these embed pages exist.
export const dynamicParams = false;

const CALC: Record<string, ComponentType> = {
  'dog-years-calculator': DogYearsCalculator,
  'puppy-weight-calculator': PuppyCalculator,
  'cat-years-calculator': CatYearsCalculator,
  'dog-pregnancy-calculator': PregnancyCalculator,
  'kitten-age-chart': KittenCalculator,
  'dog-heat-cycle-calculator': HeatCalculator,
};

export function generateStaticParams() {
  return EMBED_TOOLS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = embedTool(params.slug);
  return {
    title: t ? `${t.title} (embeddable)` : 'Embed',
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE.url}/${params.slug}/` },
  };
}

export default function EmbedPage({ params }: { params: { slug: string } }) {
  const t = embedTool(params.slug);
  const Calc = CALC[params.slug];
  if (!t || !Calc) notFound();
  const toolUrl = `${SITE.url}/${t.slug}/`;

  return (
    <div className="min-w-[300px] bg-white p-3 sm:p-4">
      <Calc />
      <p className="mt-2 text-[12px] text-muted">Estimates only, not veterinary advice.</p>
      <p className="mt-3 border-t border-line pt-2 text-[12px] text-muted">
        Calculator by{' '}
        <a className="font-medium text-brand hover:underline" href={toolUrl} target="_blank" rel="noopener">
          PawScales
        </a>
      </p>
    </div>
  );
}
