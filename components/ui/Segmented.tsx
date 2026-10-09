'use client';

import { cn } from '@/lib/cn';

export interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  /** Pill style for the 2-segment unit toggle (design.md 7.2). */
  pill?: boolean;
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  pill = false,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex flex-wrap gap-1 border border-border-strong bg-surface p-1',
        pill ? 'rounded-full' : 'rounded-[6px]',
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
              'seg-btn px-3 text-[14px] font-semibold',
              pill ? 'h-8 rounded-full' : 'h-9 rounded-[4px]',
              'min-h-[36px]',
              selected ? 'bg-brand-tint text-brand' : 'text-text hover:bg-surface-2',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
