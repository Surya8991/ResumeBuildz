import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Terms of Use - ResumeBuildz',
  description: 'Terms of use for ResumeBuildz, the free ATS-friendly resume builder.',
  alternates: { canonical: absoluteUrl('/terms') },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1 bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-sm text-gray-400 mb-10">Last updated: April 14, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance</h2>
              <p>By using ResumeBuildz you agree to these terms. If you do not agree, do not use the service.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Service</h2>
              <p>ResumeBuildz provides a free, browser-based resume builder. The service is provided as-is with no guarantees of uptime or fitness for any particular purpose.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. Your Data</h2>
              <p>Your resume content is stored locally in your browser. If you optionally sign in, we store basic account info (email, name, plan tier). We use Vercel Web Analytics (cookieless, no personal tracking). See our <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link> for full details.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. AI Features</h2>
              <p>AI features require your own Groq API key. Your key is stored in your browser only and used solely to call Groq&apos;s API directly. ResumeBuildz never receives or stores your API key.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Acceptable Use</h2>
              <p>You may use ResumeBuildz for personal and commercial resume building. You may not scrape, reverse-engineer, or resell this service without written permission from the author.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">6. Intellectual Property</h2>
              <p>ResumeBuildz is built and maintained by Surya L. The source code is available on GitHub under its stated license. Resume content you create belongs entirely to you.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
              <p>ResumeBuildz is not liable for any outcomes related to your job search, resume rejection, or data loss. Always keep a local backup of your resume.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">8. Changes</h2>
              <p>These terms may be updated at any time. Continued use of the service constitutes acceptance of updated terms.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
              <p>Questions? Reach out via the <Link href="/contact" className="text-blue-600 underline">contact page</Link> or email Suryaraj8147@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
