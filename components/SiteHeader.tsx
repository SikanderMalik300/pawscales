import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { HeaderNav } from '@/components/HeaderNav';

/**
 * Global header (design.md 6.1): 56px tall, white, 1px bottom border. Logo left,
 * nav + search right. Sticky on desktop, not on mobile. The interactive bits
 * (menu sheet, search dialog) live in the client HeaderNav.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface md:sticky md:top-0 md:z-40">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link href="/" aria-label="PawScales home" className="shrink-0">
          <Logo />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
