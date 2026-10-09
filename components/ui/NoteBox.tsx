import * as React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Note boxes (design.md v2 7.5): white card, 1px --line border all sides, radius
 * 16, padding 20. Label line 14/600 with a 16px icon. No colored background
 * fills, no side stripes. "See your vet if" uses the danger-colored label.
 */
export function NoteBox({
  label = 'Note',
  danger = false,
  icon = true,
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
      className={cn('rounded-[16px] border border-line bg-white p-5', className)}
      role={danger ? 'note' : undefined}
    >
      <p
        className={cn(
          'mb-1.5 flex items-center gap-1.5 text-[14px] font-semibold',
          danger ? 'text-danger' : 'text-ink',
        )}
      >
        {icon && <Icon size={16} strokeWidth={1.75} aria-hidden="true" />}
        {label}
      </p>
      <div className="text-[16px] leading-[1.6] text-ink [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </div>
  );
}
