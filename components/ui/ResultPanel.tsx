import * as React from 'react';
import { cn } from '@/lib/cn';

/** Result panel pieces (design.md v2 7.3): sand bg, radius 12, padding 24. */

export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.04em] text-muted">
      {children}
    </p>
  );
}

export function ResultNumber({
  value,
  unit,
  className,
}: {
  value: React.ReactNode;
  unit?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'result-number font-medium leading-[1.05] text-ink tabular-nums',
        'text-[36px] sm:text-[44px]',
        className,
      )}
    >
      {value}
      {unit && <span className="ml-1.5 text-[22px] font-medium text-muted">{unit}</span>}
    </p>
  );
}

export function SecondaryRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1 text-[16px]">
      <span className="text-muted">{label}</span>
      <span className="font-medium tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function ResultDivider() {
  return <hr className="my-3 border-0 border-t border-line" />;
}

export function ResultPanel({
  children,
  className,
  ariaLabel = 'Result',
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn('rounded-[12px] bg-sand p-6', className)}
    >
      {children}
    </div>
  );
}
