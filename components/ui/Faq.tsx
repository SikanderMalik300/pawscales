import { Plus, Minus } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

/**
 * FAQ (design.md v2 7.8): <details> rows, 1px --line dividers top and bottom of
 * the group, question 17/500, plus/minus icon right. All answers in the DOM.
 * The FAQ JSON-LD text must match this visible text.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-b border-line">
      {items.map((item, i) => (
        <details key={i} className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[17px] font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
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
          <div className="pb-4 text-[16px] leading-[1.6] text-ink">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
