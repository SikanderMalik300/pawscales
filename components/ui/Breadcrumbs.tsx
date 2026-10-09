import Link from 'next/link';

export interface Crumb {
  name: string;
  href?: string;
}

/** Breadcrumbs (design.md 7.8): 13px muted, "/" separator, current not a link. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] leading-[1.45] text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  prefetch={false}
                  className="underline decoration-1 underline-offset-2 hover:text-ink"
                >
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-text">
                  {c.name}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-border-strong">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
