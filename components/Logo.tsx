import { cn } from '@/lib/cn';

/**
 * PawScales logo (brand/LOGO-README.md): a white paw holding a scale dial on a
 * spruce-green square, plus the "PawScales" wordmark (text outlined in the SVG).
 * `white` swaps to the light version for dark backgrounds. Height is set by the
 * caller (28px header desktop, 24px mobile); width follows the 280×64 aspect.
 */
export function Logo({
  className,
  white = false,
}: {
  className?: string;
  white?: boolean;
}) {
  return (
    <img
      src={white ? '/pawscales-logo-white.svg' : '/pawscales-logo.svg'}
      alt="PawScales"
      width={280}
      height={64}
      className={cn('block w-auto', className)}
    />
  );
}
