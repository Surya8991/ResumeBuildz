import { ogImage } from '@/lib/ogImage';

export const runtime = 'edge';
export const alt = 'Pricing - Free Forever, Pro When You Are Serious | ResumeBuildz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return ogImage({
    badge: 'PRICING',
    title: 'Free forever. Pro when you are serious.',
    subtitle: 'Job hunts are episodic. Pay for the months you are searching, or once for life.',
  });
}
