import * as React from 'react';
import { cn } from '@/lib/cn';

/** Result panel pieces (design.md 7.3). */

export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.06em] text-muted">
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
        'result-number font-semibold leading-[1.1] text-ink tabular-nums',
        'text-[34px] sm:text-[40px]',
        className,
      )}
    >
      {value}
      {unit && <span className="ml-1 text-[20px] font-semibold text-muted">{unit}</span>}
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
      <span className="text-text">{label}</span>
      <span className="font-semibold tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function ResultDivider() {
  return <hr className="my-3 border-0 border-t border-border" />;
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
      className={cn('flex flex-col', className)}
    >
      {children}
    </div>
  );
}
