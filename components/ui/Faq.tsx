import { Plus, Minus } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

/**
 * FAQ list (design.md 7.5): each question a native <details> row, 1px top border
 * (and bottom on the last) as a complete list divider, plus/minus on the right,
 * all answer text in the DOM. The FAQ JSON-LD text must match this visible text.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-b border-border">
      {items.map((item, i) => (
        <details key={i} className="group border-t border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16px] font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <Plus
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
              className="shrink-0 text-muted group-open:hidden"
            />
            <Minus
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
              className="hidden shrink-0 text-muted group-open:block"
            />
          </summary>
          <div className="pb-3 text-[16px] leading-[1.6] text-text">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
