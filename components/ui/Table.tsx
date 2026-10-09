import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * The table style (design.md 7.6, MUST): even 1px border on all four sides,
 * radius 10, horizontal scroll on small screens, surface-2 header, 1px row
 * dividers full width, no zebra, highlighted row = accent at 35% with a tag in
 * the first cell. No one-sided borders, no vertical lines.
 */

export interface Column {
  key: string;
  header: string;
  /** right-align numeric columns */
  numeric?: boolean;
}

export interface Row {
  cells: Record<string, React.ReactNode>;
  highlight?: boolean;
  /** text shown in the first cell when highlighted, e.g. "Your dog" */
  tag?: string;
}

export function DataTable({
  caption,
  columns,
  rows,
  source,
  textHeavy = false,
  stickyHeader = false,
  className,
}: {
  caption?: React.ReactNode;
  columns: Column[];
  rows: Row[];
  source?: React.ReactNode;
  textHeavy?: boolean;
  stickyHeader?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn('m-0', className)}>
      {caption && (
        <figcaption className="mb-2 text-[14px] font-semibold text-ink">
          {caption}
        </figcaption>
      )}
      <div className="overflow-hidden rounded-[10px] border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-2">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={cn(
                      'px-3 py-2 text-[13px] font-semibold text-ink',
                      c.numeric ? 'text-right tabular-nums' : 'text-left',
                      stickyHeader && 'sticky top-0 bg-surface-2',
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
                  className={cn(
                    'border-t border-border hover:bg-bg',
                    r.highlight && 'bg-[#F2C46B59] hover:bg-[#F2C46B59]',
                  )}
                >
                  {columns.map((c, ci) => (
                    <td
                      key={c.key}
                      className={cn(
                        'px-3',
                        textHeavy ? 'text-[16px]' : 'text-[14px]',
                        'min-h-[40px] py-2 text-text',
                        c.numeric ? 'text-right tabular-nums' : 'text-left',
                      )}
                    >
                      {ci === 0 && r.tag && (
                        <span className="mr-2 text-[12px] font-semibold text-accent-ink">
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
      {source && (
        <figcaption className="mt-2 text-[13px] text-muted">{source}</figcaption>
      )}
    </figure>
  );
}
