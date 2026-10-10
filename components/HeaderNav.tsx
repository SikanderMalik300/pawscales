'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { REGISTRY, HUBS, type Category } from '@/lib/registry';
import { Logo } from '@/components/Logo';

const HUB_LINKS: { href: string; label: string; cat: Category }[] = [
  { href: '/dog-calculators/', label: 'Dog tools', cat: 'dog-calculators' },
  { href: '/cat-calculators/', label: 'Cat tools', cat: 'cat-calculators' },
  { href: '/dog-size-charts/', label: 'Size charts', cat: 'dog-size-charts' },
];

const hubColor: Record<Category, string> = {
  'dog-calculators': 'bg-sage',
  'cat-calculators': 'bg-sky',
  'dog-size-charts': 'bg-butter',
};

const hubName = (slug: Category) =>
  HUBS.find((h) => h.slug === slug)?.shortName ?? slug;

export function HeaderNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen) {
        const el = document.activeElement?.tagName;
        if (el !== 'INPUT' && el !== 'TEXTAREA') {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    const openSearch = () => setSearchOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pawscales:search', openSearch);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pawscales:search', openSearch);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const results = q.trim()
    ? REGISTRY.filter((t) =>
        (t.title + ' ' + t.shortName + ' ' + t.oneLiner)
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
      )
    : REGISTRY;

  return (
    <>
      {/* Desktop bar: hub links left, logo center, About + search right */}
      <div className="hidden w-full grid-cols-3 items-center md:grid">
        <nav className="flex items-center gap-6" aria-label="Primary">
          {HUB_LINKS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              prefetch={false}
              className="text-[14px] font-medium text-ink hover:underline"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-center">
          <Link href="/" aria-label="PawScales home">
            <Logo className="h-7" />
          </Link>
        </div>
        <div className="flex items-center justify-end gap-5">
          <Link
            href="/about/"
            prefetch={false}
            className="text-[14px] font-medium text-ink hover:underline"
          >
            About
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search (press /)"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:bg-sand"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Mobile controls (logo is in SiteHeader) */}
      <div className="flex items-center gap-1 md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <Search size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="container-page flex h-14 items-center justify-between border-b border-line">
            <Logo className="h-6" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {HUB_LINKS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 border-b border-line py-3 text-[16px] font-medium text-ink"
              >
                <span className={`h-4 w-4 rounded-full ${hubColor[n.cat]}`} aria-hidden="true" />
                {n.label}
              </Link>
            ))}
            <Link
              href="/about/"
              prefetch={false}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[16px] font-medium text-ink"
            >
              About
            </Link>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(17,19,18,0.35)] p-4 pt-[10vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Search tools"
            aria-modal="true"
            className="w-full max-w-[560px] overflow-hidden rounded-lg border border-line bg-white shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <Search size={18} strokeWidth={1.75} className="text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search calculators and charts"
                aria-label="Search calculators and charts"
                className="h-12 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-sand"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-1">
              {results.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}/`}
                    prefetch={false}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sand"
                  >
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${hubColor[t.category]}`}
                      aria-hidden="true"
                    />
                    <span className="text-[16px] font-medium text-ink">
                      {t.shortName}
                    </span>
                    <span className="ml-auto text-[13px] text-muted">
                      {hubName(t.category)}
                    </span>
                  </Link>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-3 text-[14px] text-muted">No tools match.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
