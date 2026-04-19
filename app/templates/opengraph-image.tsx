import { ogImage } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = '20 ATS-Tested Resume Templates | ResumeBuildz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return ogImage({
    badge: 'TEMPLATES',
    title: '20 resume templates. Every one passes 12 ATS checks.',
    subtitle: 'Tested against Workday, Greenhouse, Lever, iCIMS. Chronological and hybrid formats.',
  });
}
