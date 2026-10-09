'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Labelled input (design.md v2 7.2). Field height 48px, 16px text, radius 12,
 * 1px --field border, white. Unit suffix sits inside the field. The lb/kg switch
 * (passed as `labelRight`) goes on the SAME row as the label, right-aligned.
 * Focus: 2px brand border + 4px halo. Error: danger border + message below.
 */
export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  suffix?: string;
  helper?: string;
  error?: string;
  labelRight?: React.ReactNode;
}

export function Field({
  id,
  label,
  suffix,
  helper,
  error,
  labelRight,
  className,
  ...props
}: FieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex min-h-[28px] items-center justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-medium leading-[1.4] text-ink">
          {label}
        </label>
        {labelRight}
      </div>
      <div
        className={cn(
          'flex h-12 items-center rounded-[12px] border bg-white px-[14px]',
          error
            ? 'border-danger focus-within:border-danger'
            : 'border-field focus-within:border-brand',
          'focus-within:shadow-[0_0_0_4px_rgba(31,92,69,0.15)]',
          className,
        )}
      >
        <input
          id={id}
          inputMode="decimal"
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(helperId, errorId) || undefined}
          className="w-full min-w-0 bg-transparent text-[16px] text-ink outline-none tabular-nums placeholder:text-muted"
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
