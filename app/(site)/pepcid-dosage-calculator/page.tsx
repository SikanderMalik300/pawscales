import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { PepcidPage } from '@/components/PepcidPage';

const tool = bySlug('pepcid-dosage-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return <PepcidPage />;
}
