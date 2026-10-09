'use client';

import { cn } from '@/lib/cn';

export interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  /** Small 28px pill pair for the unit switch on the label row. */
  compact?: boolean;
  /** Option groups: horizontally scrollable on mobile, never wrapping. */
  scroll?: boolean;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  compact = false,
  scroll = false,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-line bg-sand p-1',
        compact ? 'h-7' : 'h-10',
        scroll && 'no-scrollbar max-w-full overflow-x-auto',
        className,
      )}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              'seg-btn shrink-0 whitespace-nowrap rounded-full font-medium',
              compact ? 'h-6 px-2.5 text-[12px]' : 'h-8 px-3.5 text-[14px]',
              selected
                ? 'bg-white text-ink shadow-[0_1px_2px_rgba(17,19,18,.08)]'
                : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
