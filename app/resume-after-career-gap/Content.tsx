'use client';

import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, HelpCircle, BookOpen, Mail } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

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
  { cat: 'Freelance work', examples: 'Upwork, Fiverr, Toptal, Contra. Even 3 small paid gigs count as current experience' },
  { cat: 'Volunteer projects', examples: 'Local non-profits, open source contributions, GitHub issues, Wikipedia edits' },
  { cat: 'Side projects', examples: 'Build a blog, a small SaaS, a YouTube channel, a newsletter, a domain-specific tool' },
  { cat: 'Part-time consulting', examples: 'Your old network is your best consulting pipeline. Offer 10 hours/week to a former employer or adjacent company' },
];

const FAQS = [
  { q: 'How long is "too long" for a career gap?', a: 'There is no hard limit, but after 2 years the conversation shifts: for gaps under 2 years, a one-line explanation suffices. For gaps 2 to 5 years, you need evidence of upskilling during the gap. For gaps over 5 years, target returnship programs, freelance-to-full-time paths, or adjacent-but-lower roles as a re-entry point.' },
  { q: 'Should I list a "Career Break" entry on my timeline?', a: 'Yes if the gap is 6+ months. Treat it as a regular entry with start and end dates. Example: "Career Break | Mar 2023 to Present | Full-time caregiver for immediate family. Completed Google Data Analytics certificate during this period."' },
  { q: 'Do I need to mention the gap in my cover letter?', a: 'Yes, in one sentence. Recruiters appreciate transparency. "After a [reason] break, I am returning to work with renewed focus on [target role]." Do not dwell; move on to your value proposition in the next sentence.' },
  { q: 'Will ATS systems reject me for a gap?', a: 'No. Modern ATS parse dates but do not reject based on gaps. The rejection happens at the human screening stage when a recruiter sees an unexplained gap. Name it explicitly and the rejection risk drops significantly.' },
  { q: 'Should I remove old jobs to hide the gap?', a: 'No. Lying or omitting is worse than the gap itself. Background checks will catch discrepancies. List the dates honestly and frame the gap positively.' },
  { q: 'Is a "functional" resume better for career gaps?', a: 'No. Pure functional resumes (skills-only, no timeline) are seen as hiding something and hurt you. Use a hybrid format: skills at the top, then a chronological timeline that includes the career break as an explicit entry.' },
];

const EXPLANATION_EMAIL = {
  subject: 'Re: [Role] application. Brief career break context',
  body: `Hi [Recruiter Name],\n\nThanks for considering my application for the [Role] position. I wanted to proactively share one thing that might come up in screening.\n\nBetween [start date] and [end date] I took a planned career break for [reason. e.g., "full-time childcare during the early years," "a health matter that has since resolved," "caregiving for a family member"]. During that time I stayed current in [domain] by completing [specific certification, course, freelance project, or volunteer work] and I am fully ready to return to a full-time role.\n\nI would love the opportunity to discuss how my [N] years of experience in [specific domain] maps to what your team is building. Happy to share more context on a call.\n\nThanks,\n[Your name]`,
};

const CASE_STUDY_GAP = {
  title: 'Case study: Meera returned after a 3-year gap',
  story: `Meera had 8 years of marketing experience at two SaaS companies before taking a 3-year career break to care for her young children. When she started applying again in early 2025, her first 20 applications got zero responses. Every cover letter apologised for the gap.\n\nShe switched strategies. She rewrote her summary to lead with accomplishments ("Grew a B2B SaaS demand-gen engine from $400k to $6.2M ARR") and added one factual line at the end: "Returning to work after a 3-year family care break. Completed HubSpot Inbound Marketing certification and 2 freelance projects during this period."\n\nShe also applied to Goldman Sachs returnship program as a backup. The returnship did not materialise. She got 4 interviews from her first 25 tailored applications after the rewrite, and accepted a senior marketing role at a healthtech startup.\n\nThe turning point was reframing the gap from "apologise and explain" to "stated once, then moved on to value."`,
};

const RULES = [
  'Be honest, brief, and unapologetic. One factual line is enough. Never bury the gap, never over-explain it.',
  'Use a "Career Break" entry on the resume timeline. Treat it like any other entry with start and end dates.',
  'Show what you did during the gap: courses, freelance, side projects, volunteering, open source, certifications.',
  'Update your most recent skills near the top so recruiters see currency, not staleness.',
  'In the cover letter, address the gap once in one sentence, then move forward. Never apologise.',
  'For long gaps (2+ years), add a one-line "Returnship interest" note in your summary if applying to formal returnship programs.',
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'reasons', label: '6 ways to phrase a career gap' },
  { id: 'rules', label: '6 rules for resumes with gaps' },
  { id: 'returnships', label: 'Returnship programs' },
  { id: 'upskilling', label: '6 ways to fill the gap with evidence' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'email', label: 'Email template' },
  { id: 'case-study', label: 'Case study' },
];

const RELATED = [
  { title: 'Resume After a Layoff', slug: 'resume-after-layoff', excerpt: 'A 5-step guide for 2026 with 3 email templates and a 60-day planner.', read: 12 },
  { title: 'Resume for Career Change: The 5-Step Pivot Guide', slug: 'resume-for-career-change', excerpt: 'Transferable-skills rewriting, hybrid format, and 6 common pivot examples.', read: 11 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes.', read: 9 },
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
];

export default function ResumeAfterCareerGapPage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="Career Transitions"
        breadcrumbCurrent="Resume after career gap"
        title="How to Write a Resume After a Career Gap"
        subtitle="A career gap is not a deal-breaker. 62% of professionals have a non-linear career path (LinkedIn, 2024). Here is how to address it honestly and still get interviews."
        dateModified="2026-04-15"
        readingTime={10}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>The biggest mistake is hiding the gap. Modern ATS systems calculate tenure from start and end dates automatically, and any unexplained year triggers a manual review flag. The candidates who get interviews are the ones who name the gap, normalise it in one line, and immediately pivot to current skills.</p>
        </section>

        <section id="reasons" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6 ways to phrase a career gap</h2>
          <p className="text-gray-600 mb-5">Pick the one that matches your situation. Use it as a one-line entry on the resume timeline, exactly as written.</p>
          <div className="space-y-3">
            {REASONS.map((r) => (
              <div key={r.reason} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-1">{r.reason}</p>
                <p className="text-gray-800 italic">{r.wording}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rules" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">6 rules for resumes with gaps</h2>
          <ol className="space-y-3">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">{rule}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="returnships" className="mt-10 scroll-mt-6 bg-amber-50 rounded-lg p-5 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Returnship programs are real and growing</h3>
              <p className="text-sm text-amber-900 leading-relaxed">Companies like Goldman Sachs, IBM, Amazon, Accenture, and TCS now run formal &quot;returnship&quot; programs targeting professionals returning after 2+ year breaks. These programs offer paid 12 to 26 week contracts that often convert to full-time roles. Mentioning interest in returnships explicitly in your summary can route your resume directly into these tracks.</p>
            </div>
          </div>
        </section>

        <section id="upskilling" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">6 ways to fill your gap with real evidence</h2>
          </div>
          <p className="text-gray-600 mb-5">Recruiters do not reject gaps. They reject unexplained gaps. Every item below produces a concrete line you can add to your resume to show you stayed current and intentional.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {UPSKILLING_IDEAS.map((u) => (
              <div key={u.cat} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="font-semibold text-gray-900 mb-1">{u.cat}</p>
                <p className="text-sm text-gray-700">{u.examples}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Career gap resume FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm">
                  <span>{faq.q}</span>
                  <span className="text-indigo-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="email" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Email template. Explaining the gap to a recruiter</h2>
          </div>
          <p className="text-gray-600 mb-5">Use this as a proactive email after you apply, or as a response if a recruiter asks about the gap on screening. One neutral paragraph, no apology.</p>
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Subject</div>
            <div className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-200">{EXPLANATION_EMAIL.subject}</div>
            <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Body</div>
            <pre className="px-4 py-4 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{EXPLANATION_EMAIL.body}</pre>
          </div>
        </section>

        <section id="case-study" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{CASE_STUDY_GAP.title}</h2>
          </div>
          <div className="text-sm text-gray-800">
            {CASE_STUDY_GAP.story.split('\n\n').map((p, i) => (<p key={i} className="mb-3 leading-relaxed">{p}</p>))}
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Composite story based on public returnship and re-entry accounts from 2024 to 2025.</p>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Build a confident return-to-work resume</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates. ATS-clean and gap-friendly.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">Start My Resume <ArrowRight className="h-4 w-4" /></button>
        </section>
      </BlogPostLayout>
    </>
  );
}
