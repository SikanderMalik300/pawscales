import Link from 'next/link';
import { byCategory, HUBS } from '@/lib/registry';

export default function Home() {
  return (
    <div className="container-page py-8">
      <h1 className="text-[28px] sm:text-[36px] font-semibold">
        Free dog and cat calculators, built on real data
      </h1>
      <p className="mt-3 max-w-prose text-[17px] text-text">
        Calculators and charts for dog and cat owners, built from published
        veterinary research and open data. Every number has a source.
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {HUBS.map((hub) => (
          <section key={hub.slug}>
            <h2 className="text-[22px] font-semibold">{hub.shortName}</h2>
            <ul className="mt-2 flex flex-col">
              {byCategory(hub.slug).map((t) => (
                <li key={t.slug} className="border-t border-border">
                  <Link
                    href={`/${t.slug}/`}
                    prefetch={false}
                    className="flex flex-col py-2 hover:text-brand"
                  >
                    <span className="text-[16px] font-semibold text-ink">
                      {t.shortName}
                    </span>
                    <span className="text-[14px] text-muted">{t.oneLiner}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
