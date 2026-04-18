'use client';

import { useEffect } from 'react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

const sections = [
  {
    title: 'Resume Data',
    content: "Your resume content (personal info, experience, education, skills, etc.) is stored in your browser's localStorage on your own device. It never leaves your browser unless you explicitly use the AI feature (see Third-Party Services below) or sign in (see Account Data). You can clear this data anytime through your browser settings or by clicking Reset in the builder.",
  },
  {
    title: 'Account Data (Optional)',
    content: "Sign-in is optional. If you create an account via Supabase auth (Google or email/password), we store: your email address, full name (if provided via Google), avatar URL (if provided via Google), and your Pro plan tier. We do NOT store your resume content on our servers. Your resume always lives in your browser.",
  },
  {
    title: 'Analytics',
    content: "We use Vercel Web Analytics, a privacy-friendly analytics service that does NOT use cookies and does NOT track individual users across sites. It records aggregate page views, top referrers, country, and device type. It does not collect personal information, IP addresses, or session recordings. This helps us understand which features are popular without compromising your privacy.",
  },
  {
    title: 'Cookies',
    content: "ResumeBuildz uses minimal cookies. Authentication cookies are set when you sign in (managed by Supabase) so we can recognize your session. We do NOT use tracking cookies, advertising cookies, or third-party marketing cookies. The only first-party cookies are session cookies for auth.",
  },
  {
    title: 'Third-Party Services',
    content: 'ResumeBuildz offers an optional AI-powered feature that uses the Groq API. This feature requires your own free API key from console.groq.com. When you use this feature, your resume data is sent directly from your browser to Groq\'s servers. It never passes through our servers. We do not have access to your API key or the data you send to Groq. Please review Groq\'s privacy policy for information about how they handle your data.',
  },
  {
    title: 'Waitlist Emails',
    content: "If you join our Pro launch waitlist via the pricing page, your email is currently stored in your browser's localStorage only (not on our servers yet). When the Pro plan launches, we will migrate to a proper email service (such as Resend or Supabase). At that point, you will be notified once and your email will be removed if you do not respond.",
  },
  {
    title: 'Data Security',
    content: 'Your resume content lives in your browser and is never transmitted to our servers. Account data (email, name) is stored by Supabase, which provides industry-standard security including encryption at rest and in transit, regular backups, and SOC 2 compliance. We follow security best practices including HSTS, CSP headers, and OAuth redirect whitelisting.',
  },
  {
    title: 'GDPR & Your Rights',
    content: 'You have the right to export your data (Profile dropdown → Export My Data) and the right to delete your account (Profile dropdown → Delete Account). Account deletion permanently removes your profile from our database and clears your local resume data. EU users can exercise these rights at any time without contacting support.',
  },
  {
    title: "Children's Privacy",
    content: "ResumeBuildz is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.",
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date. We encourage you to review this page periodically. Significant changes will be announced via the changelog page.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about this privacy policy or ResumeBuildz\'s data practices, please contact us at Suryaraj8147@gmail.com.',
  },
];

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy - ResumeBuildz';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeBuildz privacy policy. We don\'t collect data, use cookies, or track users. All resume data stays in your browser.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeBuildz privacy policy. We don\'t collect data, use cookies, or track users. All resume data stays in your browser.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Privacy Policy - ResumeBuildz');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">Privacy Policy</h1>
          <p className="text-xl text-gray-300 animate-fade-in-up delay-100">Last updated: April 14, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* TL;DR */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 animate-fade-in-up">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-700 mb-2">The short version</h2>
            <p className="text-gray-800 leading-relaxed">
              Your resume stays in your browser. It never touches our servers. Sign-in is optional and only stores your email and plan tier. Analytics are cookieless. AI calls (if you use them) go directly from your browser to Groq with your own key. Below is the long version.
            </p>
          </div>

          {sections.map((section, i) => (
            <div key={section.title} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
