'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { REGISTRY, HUBS } from '@/lib/registry';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/dog-calculators/', label: 'Dog tools' },
  { href: '/cat-calculators/', label: 'Cat tools' },
  { href: '/dog-size-charts/', label: 'Size charts' },
  { href: '/about/', label: 'About' },
];

const hubName = (slug: string) =>
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
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
      <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            prefetch={false}
            className="text-[14px] font-semibold text-text hover:text-brand"
          >
            {n.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search (press /)"
          className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-border-strong px-3 text-[14px] text-muted hover:bg-surface-2"
        >
          <Search size={16} strokeWidth={1.75} />
          Search
          <kbd className="rounded-[4px] border border-border px-1 text-[12px]">/</kbd>
        </button>
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[6px] text-ink"
        >
          <Search size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[6px] text-ink"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-surface md:hidden">
          <div className="container-page flex h-14 items-center justify-between border-b border-border">
            <span className="text-[14px] font-semibold text-muted">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[6px] text-ink"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3 text-[16px] font-semibold text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(20,24,22,0.35)] p-4 pt-[10vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Search tools"
            aria-modal="true"
            className="w-full max-w-[560px] overflow-hidden rounded-[10px] border border-border bg-surface shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] text-muted hover:bg-surface-2"
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
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2',
                      'hover:bg-surface-2',
                    )}
                  >
                    <span className="text-[16px] font-semibold text-ink">
                      {t.shortName}
                    </span>
                    <span className="text-[13px] text-muted">{hubName(t.category)}</span>
                  </Link>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-3 text-[14px] text-muted">No tools match.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
