import { ogImage } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'Resume Guides by Role - 10+ ATS-Friendly Guides | ResumeBuildz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return ogImage({
    badge: 'ROLE GUIDES',
    title: 'Resume guides for 10+ roles.',
    subtitle: 'ATS keywords, real bullet examples, common mistakes, India salary benchmarks per role.',
  });
}
