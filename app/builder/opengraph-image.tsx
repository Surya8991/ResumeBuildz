import { ogImage } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'Free Resume Builder with Live ATS Score | ResumeBuildz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return ogImage({
    badge: 'BUILDER',
    title: 'Free Resume Builder with Live ATS Score',
    subtitle: '20 ATS-tested templates, AI bullet rewrites, PDF and DOCX export. No sign-up needed.',
  });
}
