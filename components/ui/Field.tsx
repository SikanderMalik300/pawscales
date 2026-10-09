'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Labelled input with a unit suffix inside the field (design.md 7.2).
 * Field height 44px, 16px font (prevents iOS zoom), brand focus halo, danger
 * error state with the message linked via aria-describedby.
 */
export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  suffix?: string;
  helper?: string;
  error?: string;
}

export function Field({
  id,
  label,
  suffix,
  helper,
  error,
  className,
  ...props
}: FieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[14px] font-semibold leading-[1.4] text-ink">
        {label}
      </label>
      <div
        className={cn(
          'flex items-center rounded-[6px] border bg-surface',
          'h-11 px-3 focus-within:border-brand',
          error ? 'border-danger' : 'border-border-strong',
          'focus-within:shadow-[0_0_0_3px_var(--brand-tint)]',
          className,
        )}
      >
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(helperId, errorId) || undefined}
          className="w-full bg-transparent text-[16px] text-ink outline-none tabular-nums placeholder:text-muted"
          {...props}
        />
        {suffix && (
          <span className="ml-2 shrink-0 text-[14px] text-muted">{suffix}</span>
        )}
      </div>
      {helper && !error && (
        <p id={helperId} className="text-[13px] leading-[1.45] text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] leading-[1.45] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
