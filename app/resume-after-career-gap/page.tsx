'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2, AlertCircle, Sparkles, HelpCircle, BookOpen, Users, Mail } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TOC from '@/components/TOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleMeta from '@/components/ArticleMeta';
import ReadingProgress from '@/components/ReadingProgress';
import { useLoginGateway } from '@/components/LoginGateway';
import { articleSchema, faqPageSchema, breadcrumbSchema, combineSchemas, jsonLd } from '@/lib/articleSchema';

const REASONS = [
  { reason: 'Childcare / parental leave', wording: '"Career break to focus on raising young children. Stayed current via online certifications and freelance projects."' },
  { reason: 'Health or recovery', wording: '"Took an extended health break in 2024 and have since fully recovered. Returning to full-time work."' },
  { reason: 'Family caregiving', wording: '"Provided full-time care for an immediate family member through 2024. Resuming career in 2025."' },
  { reason: 'Travel or relocation', wording: '"Relocated to [city] in mid-2024. Took a planned career break to settle and study."' },
  { reason: 'Continued education', wording: '"Full-time MBA / MS / certification program. Graduated [date]."' },
  { reason: 'Sabbatical / personal break', wording: '"Took an intentional 14-month sabbatical to upskill in [domain] and complete [project]."' },
];

const UPSKILLING_IDEAS = [
  { cat: 'Free courses', examples: 'Coursera audit, edX, YouTube university channels, NPTEL (India), freeCodeCamp, MIT OpenCourseWare' },
  { cat: 'Certifications', examples: 'Google Career Certificates, AWS Cloud Practitioner, Microsoft Fundamentals, PMI-CAPM, HubSpot Academy' },
  { cat: 'Freelance work', examples: 'Upwork, Fiverr, Toptal, Contra — even 3 small paid gigs count as current experience' },
  { cat: 'Volunteer projects', examples: 'Local non-profits, open source contributions, GitHub issues, Wikipedia edits' },
  { cat: 'Side projects', examples: 'Build a blog, a small SaaS, a YouTube channel, a newsletter, a domain-specific tool' },
  { cat: 'Part-time consulting', examples: 'Your old network is your best consulting pipeline — offer 10 hours/week to a former employer or adjacent company' },
];

const FAQS = [
  {
    q: 'How long is "too long" for a career gap?',
    a: 'There is no hard limit, but after 2 years the conversation shifts: for gaps under 2 years, a one-line explanation suffices. For gaps 2-5 years, you need evidence of upskilling during the gap. For gaps over 5 years, target returnship programs, freelance-to-full-time paths, or adjacent-but-lower roles as a re-entry point.',
  },
  {
    q: 'Should I list a "Career Break" entry on my timeline?',
    a: 'Yes if the gap is 6+ months. Treat it as a regular entry with start and end dates. Example: "Career Break | Mar 2023 - Present | Full-time caregiver for immediate family. Completed Google Data Analytics certificate during this period."',
  },
  {
    q: 'Do I need to mention the gap in my cover letter?',
    a: 'Yes, in one sentence. Recruiters appreciate transparency. "After a [reason] break, I\'m returning to work with renewed focus on [target role]." Do not dwell; move on to your value proposition in the next sentence.',
  },
  {
    q: 'Will ATS systems reject me for a gap?',
    a: 'No. Modern ATS parse dates but do not reject based on gaps. The rejection happens at the human screening stage when a recruiter sees an unexplained gap. Name it explicitly and the rejection risk drops significantly.',
  },
  {
    q: 'Should I remove old jobs to hide the gap?',
    a: 'No. Lying or omitting is worse than the gap itself. Background checks will catch discrepancies. List the dates honestly and frame the gap positively.',
  },
  {
    q: 'Is a "functional" resume better for career gaps?',
    a: 'No. Pure functional resumes (skills-only, no timeline) are seen as hiding something and hurt you. Use a hybrid format: skills at the top, then a chronological timeline that includes the career break as an explicit entry.',
  },
];

const EXPLANATION_EMAIL = {
  subject: 'Re: [Role] application — brief career break context',
  body: `Hi [Recruiter Name],\n\nThanks for considering my application for the [Role] position. I wanted to proactively share one thing that might come up in screening.\n\nBetween [start date] and [end date] I took a planned career break for [reason — e.g., "full-time childcare during the early years," "a health matter that has since resolved," "caregiving for a family member"]. During that time I stayed current in [domain] by completing [specific certification, course, freelance project, or volunteer work] and I am fully ready to return to a full-time role.\n\nI'd love the opportunity to discuss how my [N] years of experience in [specific domain] maps to what your team is building. Happy to share more context on a call.\n\nThanks,\n[Your name]`,
};

const CASE_STUDY_GAP = {
  title: 'Case study: Meera returned after a 3-year gap',
  story: `Meera had 8 years of marketing experience at two SaaS companies before taking a 3-year career break to care for her young children. When she started applying again in early 2025, her first 20 applications got zero responses — every cover letter apologized for the gap.\n\nShe switched strategies. She rewrote her summary to lead with accomplishments ("Grew a B2B SaaS demand-gen engine from $400k to $6.2M ARR") and added one factual line at the end: "Returning to work after a 3-year family care break. Completed HubSpot Inbound Marketing certification and 2 freelance projects during this period."\n\nShe also applied to Goldman Sachs\' returnship program as a backup. The returnship didn\'t materialize — she got 4 interviews from her first 25 tailored applications after the rewrite, and accepted a senior marketing role at a healthtech startup.\n\nThe turning point was reframing the gap from "apologize and explain" to "stated once, then moved on to value."`,
};

const RULES = [
  'Be honest, brief, and unapologetic. One factual line is enough — never bury the gap, never over-explain it.',
  'Use a "Career Break" entry on the resume timeline. Treat it like any other entry with start and end dates.',
  'Show what you did during the gap: courses, freelance, side projects, volunteering, open source, certifications.',
  'Update your most recent skills near the top so recruiters see currency, not staleness.',
  'In the cover letter, address the gap once in one sentence, then move forward. Never apologize.',
  'For long gaps (2+ years), add a one-line "Returnship interest" note in your summary if applying to formal returnship programs.',
];

export default function ResumeAfterCareerGapPage() {
  const { openGateway } = useLoginGateway();

  useEffect(() => {
    document.title = 'Resume After Career Gap 2026 - How to Explain & Win | ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'How to write a resume after a career gap of any length. Real wording for childcare, health, caregiving, sabbatical. ATS-friendly templates. Updated 2026.'
      );
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        'content',
        'How to write a resume after a career gap. Real wording, ATS-friendly templates, returnship tips.'
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Resume After Career Gap 2026 - How to Explain & Win | ResumeForge');
  }, []);

  const schema = combineSchemas(
    articleSchema({
      headline: 'How to Write a Resume After a Career Gap',
      description: 'How to write a resume after a career gap of any length. Real wording, upskilling ideas, email template, case study, and FAQ.',
      slug: 'resume-after-career-gap',
      datePublished: '2026-04-14',
      dateModified: '2026-04-15',
    }),
    faqPageSchema(FAQS),
    breadcrumbSchema([
      { label: 'Resources', slug: 'resume-for' },
      { label: 'Resume after career gap' },
    ])
  );

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <ReadingProgress />
      <SiteNavbar />

      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: 'Resume after career gap' }]} className="justify-center flex mb-4" />
          <span className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <Clock className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" /> Career Gap Recovery
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            How to Write a Resume After a Career Gap
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            A career gap is not a deal-breaker. According to LinkedIn&apos;s 2024 Workforce Confidence Index, 62% of professionals have had a non-linear career path. Here is how to address the gap honestly and still get interviews.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-white py-14">
        <TOC />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ArticleMeta publishedDate="2026-04-14" updatedDate="2026-04-15" readingTime={10} reviewed />
          <section>
            <p className="text-gray-700 leading-relaxed text-lg">
              The biggest mistake is hiding the gap. Modern ATS systems calculate tenure from start and end dates automatically, and any unexplained year triggers a manual review flag. The candidates who get interviews are the ones who name the gap, normalize it in one line, and immediately pivot to current skills.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">6 ways to phrase a career gap</h2>
            <p className="text-gray-600 mb-6">Pick the one that matches your situation. Use it as a one-line entry on the resume timeline, exactly as written.</p>
            <div className="space-y-4">
              {REASONS.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-1">{r.reason}</p>
                  <p className="text-gray-800 italic">{r.wording}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">6 rules for resumes with gaps</h2>
            <ol className="space-y-4">
              {RULES.map((rule, i) => (
                <li key={i} className="flex gap-3 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Returnship programs are real and growing</h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Companies like Goldman Sachs, IBM, Amazon, Accenture, and TCS now run formal "returnship" programs targeting professionals returning after 2+ year breaks. These programs offer paid 12 to 26 week contracts that often convert to full-time roles. Mentioning interest in returnships explicitly in your summary can route your resume directly into these tracks.
                </p>
              </div>
            </div>
          </section>

          {/* Upskilling during gap */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">6 ways to fill your gap with real evidence</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Recruiters do not reject gaps — they reject unexplained gaps. Every item below produces a concrete line you can add to your resume to show you stayed current and intentional.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {UPSKILLING_IDEAS.map((u, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <p className="font-semibold text-gray-900 mb-1">{u.cat}</p>
                  <p className="text-sm text-gray-600">{u.examples}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Career gap resume FAQ</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 p-5 open:shadow-sm">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm">
                    <span>{faq.q}</span>
                    <span className="text-blue-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Email Template */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Email template — explaining the gap to a recruiter</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Use this as a proactive email after you apply, or as a response if a recruiter asks about the gap on screening. One neutral paragraph, no apology.
            </p>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 text-gray-300 px-5 py-2.5 text-xs font-mono">Subject</div>
              <div className="px-5 py-3 text-sm text-gray-900 font-medium border-b border-gray-200">{EXPLANATION_EMAIL.subject}</div>
              <div className="bg-gray-900 text-gray-300 px-5 py-2.5 text-xs font-mono">Body</div>
              <pre className="px-5 py-4 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{EXPLANATION_EMAIL.body}</pre>
            </div>
          </section>

          {/* Case Study */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{CASE_STUDY_GAP.title}</h2>
            </div>
            <div className="text-sm text-gray-700">
              {CASE_STUDY_GAP.story.split('\n\n').map((p, i) => (
                <p key={i} className="mb-3 leading-relaxed">{p}</p>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">Composite story based on public returnship and re-entry accounts from 2024-2025.</p>
          </section>

          <section className="text-center py-8">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Build a confident return-to-work resume</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Free to start. 20 templates. ATS-clean and gap-friendly.
            </p>
            <button
              onClick={() => openGateway('/builder')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              Start My Resume <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Related guides</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <Link href="/resume-after-layoff" className="text-blue-600 hover:underline">→ Resume after a layoff</Link>
              <Link href="/resume-for-career-change" className="text-blue-600 hover:underline">→ Resume for career change</Link>
              <Link href="/resume-tips" className="text-blue-600 hover:underline">→ Resume tips that work</Link>
              <Link href="/ats-guide" className="text-blue-600 hover:underline">→ Complete ATS guide</Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
