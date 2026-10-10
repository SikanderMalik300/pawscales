import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

/** Plain text page (design.md v2 6.5): white, 720px column, H1 40/500, body. */
export function TextPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page max-w-reading py-8">
      <Breadcrumbs items={[{ name: 'PawScales', href: '/' }, { name: title }]} />
      <h1 className="mt-3 text-[30px] sm:text-[40px]">{title}</h1>
      {updated && <p className="mt-2 text-[13px] text-muted">Last updated: {updated}</p>}
      <div className="prose-text mt-6 space-y-4 text-[16px] leading-[1.6] text-ink [&_h2]:mt-8 [&_h2]:text-[22px] [&_h2]:font-medium [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5">
        {children}
      </div>
    </div>
  );
}
