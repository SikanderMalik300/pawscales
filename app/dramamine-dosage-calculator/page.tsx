import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { DramaminePage } from '@/components/DramaminePage';

const tool = bySlug('dramamine-dosage-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return <DramaminePage />;
}
