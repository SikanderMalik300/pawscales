import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { HeaderNav } from '@/components/HeaderNav';

/**
 * Header (design.md v2 6.1): 64px desktop / 56px mobile, white, 1px line bottom
 * border, sticky on desktop. Desktop: hub links left, logo centered, About +
 * search right. Mobile: logo left, search + menu right (handled in HeaderNav).
 */
export function SiteHeader() {
  return (
    <header className="border-b border-line bg-white md:sticky md:top-0 md:z-40">
      <div className="container-page flex h-14 items-center justify-between gap-4 md:h-16">
        {/* Mobile logo (left). Desktop logo is centered inside HeaderNav. */}
        <Link href="/" aria-label="PawScales home" className="shrink-0 md:hidden">
          <Logo />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
