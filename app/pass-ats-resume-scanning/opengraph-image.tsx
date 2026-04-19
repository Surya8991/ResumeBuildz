import { ogImage } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'How to Pass ATS Resume Scanning 2026 | ResumeBuildz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return ogImage({
    badge: 'GUIDE',
    title: 'How to pass ATS resume scanning in 2026.',
    subtitle: '10 tactics, 7 ATS killers, PDF vs DOCX truth, top 5 systems explained.',
  });
}
