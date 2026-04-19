import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { absoluteUrl } from '@/lib/siteConfig';
import { jsonLd } from '@/lib/articleSchema';
import { ExternalLink, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Surya L — Author & Builder of ResumeBuildz',
  description: 'Full-stack engineer and builder of ResumeBuildz. Writes about resumes, ATS, job search strategy, and privacy-first tooling for candidates.',
  alternates: { canonical: absoluteUrl('/author/surya-l') },
  openGraph: {
    title: 'Surya L — Author & Builder of ResumeBuildz',
    description: 'Full-stack engineer writing about resumes, ATS, and job search strategy.',
    url: absoluteUrl('/author/surya-l'),
    type: 'profile',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Surya L',
  url: absoluteUrl('/author/surya-l'),
  sameAs: [
    'https://github.com/Surya8991',
    'https://linkedin.com/in/surya-l',
  ],
  jobTitle: 'Full-Stack Engineer',
  description: 'Builder of ResumeBuildz. Writes about resumes, ATS, and job-search tooling.',
  knowsAbout: [
    'Applicant Tracking Systems',
    'Resume Writing',
    'Technical Hiring',
    'Indian Job Market',
    'Next.js',
    'Supabase',
    'TypeScript',
  ],
};

export default function AuthorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personSchema) }} />
      <div className="min-h-screen flex flex-col bg-white">
        <SiteNavbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-start gap-5 mb-10">
            <div className="shrink-0 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl flex items-center justify-center">
              SL
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Surya L</h1>
              <p className="text-lg text-gray-600">Full-stack engineer. Builder of ResumeBuildz.</p>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <a href="https://github.com/Surya8991" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900">
                  <ExternalLink className="h-4 w-4" /> GitHub
                </a>
                <a href="https://linkedin.com/in/surya-l" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900">
                  <ExternalLink className="h-4 w-4" /> LinkedIn
                </a>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900">
                  <Mail className="h-4 w-4" /> Contact
                </Link>
              </div>
            </div>
          </div>

          <section className="prose prose-gray max-w-none text-gray-800 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">What I write about</h2>
            <p>
              I write long-form guides on the parts of the resume / job-search stack that matter in 2026: applicant tracking systems, keyword-matching rules, resume formatting, and how recruiters actually decide in the 6-second first scan. My posts try to replace vague advice (&quot;use strong verbs&quot;) with specific, verifiable rules (&quot;every bullet opens with a verb and closes with a measurable outcome; aim for 60% of bullets to contain a number&quot;).
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Why I built ResumeBuildz</h2>
            <p>
              I got frustrated applying through resume builders that paywalled the download, stored my data on servers I could not audit, or shipped templates that failed ATS parsing. ResumeBuildz is the tool I wished existed: genuinely free to export, resume data kept in the browser by default, all 20 templates tested against Workday / Greenhouse / Lever / iCIMS / Taleo. It is open source on GitHub, built with Next.js 16 + Supabase + TypeScript.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Expertise areas</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>ATS parsing mechanics and per-system tuning</li>
              <li>Resume content frameworks (XYZ bullet formula, 4-part summary)</li>
              <li>Indian hiring pipelines: TCS NQT, Infosys InfyTQ, Wipro Elite NTH, Naukri</li>
              <li>Full-stack engineering with Next.js, Supabase, TypeScript</li>
              <li>Privacy-first product design (localStorage-first, opt-in sync)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Editorial standards</h2>
            <p>
              Every post is hand-written. No auto-generated filler. Numbers are either sourced from named studies (Ladders eye-tracking, Jobscan, ResumeLab, Oxford Saïd) or taken from first-party product data. When I change my position on something (for example, recommending hybrid resumes over functional for career changers), I update the post in place and bump the <code>dateModified</code> field.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Corrections + feedback</h2>
            <p>
              If you spot an error, outdated statistic, or weak argument, please tell me. The best way is <Link href="/contact" className="text-indigo-600 hover:underline">the contact page</Link> or the &quot;Suggest an edit&quot; link on any blog post. I reply to every email that is not clearly a pitch.
            </p>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
