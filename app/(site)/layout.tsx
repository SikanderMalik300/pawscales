import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { Analytics } from '@/components/Analytics';

// Chrome for the main site. Embed pages (app/embed/*) sit outside this group and
// so render without the header, footer, analytics or cookie banner.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[6px] focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <Analytics />
    </>
  );
}
