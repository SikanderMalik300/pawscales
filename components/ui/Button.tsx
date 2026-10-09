import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'brand' | 'secondary' | 'onband';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  // Primary: ink bg, white text (design.md v2 7.1)
  primary: 'bg-ink text-white hover:bg-[#2A2E2C] h-11 px-[22px] text-[15px]',
  // Brand: single main action (e.g. Copy result)
  brand: 'bg-brand text-white hover:bg-brand-hover h-11 px-[22px] text-[15px]',
  // Secondary: white, 1px ink border
  secondary:
    'bg-white text-ink border border-ink hover:bg-sand h-11 px-[22px] text-[15px]',
  // On a colored band: white bg, ink text
  onband: 'bg-white text-ink hover:bg-sand h-11 px-[22px] text-[15px]',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

/** Small icon+label action button (Copy / Share / Print), 36px, secondary. */
export const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        base,
        'h-9 border border-ink bg-white px-4 text-[14px] text-ink hover:bg-sand',
        className,
      )}
      {...props}
    />
  ),
);
ActionButton.displayName = 'ActionButton';
