'use client';

import { Search } from 'lucide-react';

/** Hero search field: opens the header's search dialog via a window event. */
export function HeroSearch() {
  const open = () => window.dispatchEvent(new Event('pawscales:search'));
  return (
    <button
      type="button"
      onClick={open}
      className="flex h-12 w-full items-center gap-2 rounded-full border border-line bg-white px-4 text-left text-[16px] text-muted hover:border-field"
    >
      <Search size={18} strokeWidth={1.75} />
      Search calculators and charts
    </button>
  );
}
