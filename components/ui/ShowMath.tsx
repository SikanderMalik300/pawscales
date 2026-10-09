import { ChevronDown } from 'lucide-react';

/**
 * "Show the math" (design.md v2 7.3): native <details> with the formula and the
 * user's numbers, in a white box inside the sand result panel.
 */
export function ShowMath({ children }: { children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[14px] font-medium text-brand marker:hidden [&::-webkit-details-marker]:hidden">
        Show the math
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-2 rounded-[12px] border border-line bg-white p-4 text-[14px] leading-[1.6] tabular-nums text-ink">
        {children}
      </div>
    </details>
  );
}
