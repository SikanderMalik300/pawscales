import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Table style (design.md v2 7.6): even 1px --line border all four sides, radius
 * 16, overflow hidden, horizontal scroll inside the wrapper on small screens.
 * Header --sand 13/600; rows 15px, min 44px, 1px dividers full width, no zebra,
 * no vertical lines. User's row = --lime across the row + "Your dog" pill in the
 * first cell. Caption above (H3), source below. Interpolated values get a *.
 */

export interface Column {
  key: string;
  header: string;
  numeric?: boolean;
}

export interface Row {
  cells: Record<string, React.ReactNode>;
  highlight?: boolean;
  tag?: string;
}

export function DataTable({
  caption,
  tableCaption,
  columns,
  rows,
  source,
  footnote,
  className,
}: {
  caption?: React.ReactNode;
  tableCaption?: string; // real <caption> element (screen readers / SEO)
  columns: Column[];
  rows: Row[];
  source?: React.ReactNode;
  footnote?: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn('m-0', className)}>
      {caption && (
        <figcaption className="mb-2 text-[18px] font-semibold text-ink">
          {caption}
        </figcaption>
      )}
      <div className="overflow-hidden rounded-[16px] border border-line">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {tableCaption && <caption className="sr-only">{tableCaption}</caption>}
            <thead>
              <tr className="bg-sand">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={cn(
                      'px-3 py-2.5 text-[13px] font-semibold text-ink',
                      c.numeric ? 'text-right tabular-nums' : 'text-left',
                    )}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className={cn('border-t border-line', r.highlight && 'bg-lime')}
                >
                  {columns.map((c, ci) => (
                    <td
                      key={c.key}
                      className={cn(
                        'h-11 px-3 py-2 text-[15px] text-ink',
                        c.numeric ? 'text-right tabular-nums' : 'text-left',
                      )}
                    >
                      {ci === 0 && r.tag && (
                        <span className="mr-2 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink">
                          {r.tag}
                        </span>
                      )}
                      {r.cells[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {footnote && (
        <figcaption className="mt-2 text-[13px] text-muted">{footnote}</figcaption>
      )}
      {source && (
        <figcaption className="mt-1 text-[13px] text-muted">{source}</figcaption>
      )}
    </figure>
  );
}
