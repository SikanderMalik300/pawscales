import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { byCategory, HUBS, bySlug } from '@/lib/registry';
import { getPhoto } from '@/lib/data/photos';
import { Picture } from '@/components/ui/Picture';
import { PhotoTile } from '@/components/ui/PhotoTile';
import { HeroSearch } from '@/components/HeroSearch';

const hero = getPhoto('hero')!;

const HERO_PILLS = ['puppy-weight-calculator', 'dog-years-calculator', 'dog-pregnancy-calculator'];

const POPULAR: { fact: string; strong: string; href: string }[] = [
  { fact: 'Dogs are pregnant about', strong: '63 days', href: '/dog-pregnancy-calculator/' },
  { fact: 'A small-breed puppy is about half its adult weight by', strong: '16 weeks', href: '/puppy-weight-calculator/' },
  { fact: 'A cat’s first year is about', strong: '15 human years', href: '/cat-years-calculator/' },
  { fact: 'For a crate, measure nose to tail base and add', strong: '2–4 inches', href: '/dog-crate-size-chart/' },
];

function HubSection({ slug, band }: { slug: Parameters<typeof byCategory>[0]; band?: 'sky' | 'butter' }) {
  const hub = HUBS.find((h) => h.slug === slug)!;
  const tools = byCategory(slug);
  const bandClass = band === 'sky' ? 'bg-sky' : band === 'butter' ? 'bg-butter' : '';
  return (
    <section className={bandClass ? `band ${bandClass} py-12` : 'py-12'}>
      <div className="container-page">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-[22px] sm:text-[26px]">{hub.shortName}</h2>
          <Link
            href={`/${slug}/`}
            prefetch={false}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-ink hover:underline"
          >
            View all
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
          {tools.map((t) => (
            <PhotoTile
              key={t.slug}
              href={`/${t.slug}/`}
              photoId={t.slug}
              label={t.shortName}
              description={t.oneLiner}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero: photo on top on mobile, split lime block + photo on desktop */}
      <section className="band">
        <div className="md:grid md:grid-cols-2">
          <div className="order-2 bg-lime px-4 py-10 sm:px-8 md:order-1 md:px-10 md:py-16 lg:px-16">
            <div className="mx-auto max-w-[560px] md:ml-auto md:mr-0">
              <h1 className="text-[30px] leading-[1.12] sm:text-[40px]">
                Free dog and cat calculators, built on real data
              </h1>
              <p className="mt-3 max-w-prose text-[16px] text-ink sm:text-[18px]">
                Predict a puppy’s adult weight from growth data on 60,000+ dogs,
                find a due date, or work out how much to feed. Every number has a
                source.
              </p>
              <div className="mt-5">
                <HeroSearch />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {HERO_PILLS.map((slug) => {
                  const t = bySlug(slug)!;
                  return (
                    <Link
                      key={slug}
                      href={`/${slug}/`}
                      prefetch={false}
                      className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[14px] font-medium text-ink hover:bg-sand"
                    >
                      {t.shortName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="h-[220px] w-full sm:h-[300px] md:h-full">
              <Picture
                photo={hero}
                crop="hero"
                priority
                sizes="(min-width: 960px) 50vw, 100vw"
                rounded="rounded-none"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
      <p className="container-page pt-2 text-[12px] text-muted">
        Photo: {hero.photographer} / {hero.source}
      </p>

      <HubSection slug="dog-calculators" />
      <HubSection slug="cat-calculators" band="sky" />
      <HubSection slug="dog-size-charts" band="butter" />

      {/* Popular answers */}
      <section className="band bg-sand py-12">
        <div className="container-page">
          <h2 className="mb-5 text-[22px] sm:text-[26px]">Popular answers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                prefetch={false}
                className="rounded-[16px] border border-line bg-white p-4 hover:border-field"
              >
                <p className="text-[16px] text-ink">
                  {p.fact} <span className="font-semibold">{p.strong}</span>.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who's behind */}
      <section className="py-12">
        <div className="container-page max-w-reading">
          <h2 className="text-[22px] sm:text-[26px]">Who’s behind PawScales</h2>
          <p className="mt-2 text-[16px] text-ink">
            PawScales is built by Sikander Malik from published veterinary research
            and open data. Each tool shows its formula and sources, and he reviews
            every page before it goes live.
          </p>
          <p className="mt-2 text-[14px]">
            <Link href="/authors/sikander-malik/" prefetch={false} className="link">
              About Sikander
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
