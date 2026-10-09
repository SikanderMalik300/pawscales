import { cn } from '@/lib/cn';
import type { Category } from '@/lib/registry';

const HUB_BG: Record<Category, string> = {
  'dog-calculators': 'bg-sage',
  'cat-calculators': 'bg-sky',
  'dog-size-charts': 'bg-butter',
};

/** Full-bleed color band; content stays inside the container (design.md v2 5). */
export function Band({
  color,
  className,
  children,
}: {
  color: Category | 'sand' | 'lime';
  className?: string;
  children: React.ReactNode;
}) {
  const bg =
    color === 'sand' ? 'bg-sand' : color === 'lime' ? 'bg-lime' : HUB_BG[color];
  return (
    <div className={cn('band', bg, className)}>
      <div className="container-page">{children}</div>
    </div>
  );
}
