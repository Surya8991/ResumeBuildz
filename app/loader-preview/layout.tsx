import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loader Preview Gallery (internal) - ResumeBuildz',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
