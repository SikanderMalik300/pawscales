import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'text';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[6px] text-[15px] font-semibold ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover h-10 px-4 min-h-[44px] sm:min-h-0',
  secondary:
    'bg-surface text-ink border border-border-strong hover:bg-surface-2 h-10 px-4 min-h-[44px] sm:min-h-0',
  text: 'text-brand underline-offset-2 hover:underline px-1 h-auto',
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
