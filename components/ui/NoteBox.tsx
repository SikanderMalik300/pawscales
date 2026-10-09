import * as React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Note / warning boxes (design.md 7.4): surface-2 background, even 1px border
 * on all sides, radius 10. No colored side stripe. "See your vet if" uses the
 * danger-colored label with a plain bulleted list.
 */
export function NoteBox({
  label = 'Note',
  danger = false,
  icon = false,
  children,
  className,
}: {
  label?: string;
  danger?: boolean;
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = danger ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        'rounded-[10px] border border-border bg-surface-2 p-4',
        className,
      )}
      role={danger ? 'note' : undefined}
    >
      <p
        className={cn(
          'mb-1 flex items-center gap-1.5 text-[14px] font-semibold',
          danger ? 'text-danger' : 'text-ink',
        )}
      >
        {icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
        {label}
      </p>
      <div className="text-[16px] leading-[1.6] text-text [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </div>
  );
}
