'use client';

import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, Calendar, TrendingUp, HelpCircle, Mail, BookOpen } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const DOS = [
  'Treat the layoff as a business event, not a personal failure. The resume is not the place to explain it; the cover letter is.',
  'Use the company public layoff announcement date as the end date. "Mar 2024 to Sep 2025 (laid off as part of company-wide reorg)" is fine, optional, and removes ambiguity.',
  'Lead with your most recent measurable wins. Hiring managers respond to evidence, not narrative.',
  'Keep titles, dates, and tenures honest. Background checks now flag inflated dates within seconds.',
  'Update your LinkedIn the same day you update your resume. Recruiters cross-check both.',
  'List any severance-period upskilling: courses, certifications, freelance gigs, open source contributions.',
];

const DONTS = [
  'Do not use the word "fired," "let go," or "released." Use "position eliminated," "company restructure," or simply leave it out.',
  'Do not include negative language about the former employer. Even subtle bitterness leaks through and recruiters notice.',
  'Do not leave a gap explanation in the bullet points. Bullets are for accomplishments. Move context to your summary or cover letter.',
  'Do not apologise. The resume is a sales document; the apology in your tone will lose interviews.',
  'Do not hide the gap with creative date formatting. Modern ATS parses dates strictly and "Present" with no end date triggers manual review.',
];

const STATS = [
  { n: '20M', label: 'US workers experience involuntary separation each year (BLS, 2024)' },
  { n: '4 mo', label: 'median time to new role for laid-off tech workers (Revelio Labs, 2024)' },
  { n: '61%', label: 'of hiring managers view layoffs as "not a performance issue" (LinkedIn poll, 2024)' },
  { n: '38%', label: 'of laid-off workers end up in a higher-paying role within 12 months (BLS, 2023)' },
];

const TIMELINE = [
  { phase: 'Week 1: Breathe, file, inventory', actions: ['File for unemployment benefits the day after separation. Most US states require prompt filing.', 'Review severance carefully. Do NOT sign anything that waives future claims without reading twice.', 'Collect work samples, references, and a list of achievements from your past 18 months while memory is fresh.', 'Do not touch the resume yet. Rest.'] },
  { phase: 'Week 2: Rewrite your resume and LinkedIn', actions: ['Work through the 5-step framework below. Give yourself 4-6 hours, not 30 minutes.', 'Run the finished resume through an ATS checker.', 'Update LinkedIn on the same day. Recruiters cross-check.', 'Send 3-5 "looking for opportunities" messages to your closest network contacts.'] },
  { phase: 'Weeks 3-4: Apply at 15 companies/week', actions: ['Target 15 well-fit roles per week, not 100 spray-and-pray.', 'Tailor the top of your resume for each role (summary + top 3 bullets).', 'Send a short follow-up email to recruiters 5 days after applying.', 'Track every application in a spreadsheet.'] },
  { phase: 'Month 2: Iterate based on signal', actions: ['If you have 3+ interviews, your resume is working. Focus on interview prep.', 'If you have 0-1 interviews after 40 applications, your resume needs rework. Start with the summary and top bullets.', 'Expand your search by 1 level (e.g., senior to staff) and 1 adjacent function.', 'Take 1-2 informational interviews per week.'] },
];

const RETURNSHIP_COMPANIES = [
  { name: 'Goldman Sachs Returnship', desc: '20-week paid program for professionals returning after 2+ years.' },
  { name: 'Amazon Returnship', desc: '16-week paid program across corporate functions.' },
  { name: 'IBM Tech Re-Entry', desc: 'Technical returnship for engineers after a 2+ year gap.' },
  { name: 'Accenture Career Reboot', desc: '12-week program with full-time conversion path.' },
  { name: 'JP Morgan ReEntry', desc: '15-week program across 100+ roles in tech, finance, ops.' },
  { name: 'Tata Second Careers (India)', desc: 'TCS-backed program for women returning after a break.' },
];

const FAQS = [
  { q: 'Should I put "Laid Off" on my resume?', a: 'No. The resume is a sales document, not an incident report. You can optionally add "(Company-wide reorg, Sep 2024)" next to the end date if you want to preempt the question, but most recruiters already know. 2024 and 2025 tech layoffs have been heavily publicised. Address the layoff once in your cover letter in one neutral sentence, then move on.' },
  { q: 'How do I explain a layoff in interviews?', a: 'One sentence, neutral tone, no detail: "My team was part of a company-wide reorganisation in [month]. I am now focused on finding a [role] where I can [specific contribution]." Do not apologise, do not speculate on why you were chosen, do not share internal gossip about the company.' },
  { q: 'Is it worth mentioning severance or notice period?', a: 'Only if the recruiter directly asks. Never put it on the resume. Never volunteer it in your first call. If asked, be factual: "I am on a 2-month paid notice period and my last working day is [date]."' },
  { q: 'Should I take a lower-paying role to bridge the gap?', a: 'Depends on runway. If you have 6+ months of savings, hold out for a role at your previous level. If you have under 3 months, a bridge role is often smarter. Gaps past 6 months become harder to explain. An honest temporary role is better than a stretched gap.' },
  { q: 'What if I was laid off from a high-profile company like Google, Meta, or TCS?', a: 'Use it as a signal, not a liability. Being part of a publicly-reported layoff wave at a top company is now widely understood. Recruiters at competing companies actively source from these layoffs. Make sure your LinkedIn says "Open to work" and list the former employer prominently.' },
];

const EMAIL_TEMPLATES = [
  { title: 'Networking outreach. To a former colleague', subject: 'Catching up + looking for my next role', body: `Hi [Name],\n\nHope you are doing well. It has been a while since we last connected. I wanted to reach out because I was part of the recent reorganisation at [Company] and I am now actively looking for my next [role] role.\n\nI remembered how much I enjoyed working with you on [specific project] and thought you might know people in your network who are hiring. If you have 15 minutes in the next week or two, I would love to catch up and hear what you are working on.\n\nI have attached my updated resume for context. No pressure at all. Happy to connect when it works for you.\n\nThanks,\n[Your name]` },
  { title: 'Referral ask. To a weak-tie contact', subject: 'Quick favor? Referral at [Target Company]', body: `Hi [Name],\n\nWe connected a while back through [context. conference, LinkedIn, mutual friend]. I hope you are doing well at [Their Company].\n\nI am writing because I saw that [Target Company] is hiring for a [Role] and I believe I would be a strong fit. My experience at [Company] included [specific relevant outcome]. Since I know you work there, I wanted to ask: would you be open to referring me internally?\n\nI have attached my resume and the job posting. Happy to send anything else that helps. Totally understand if you do not feel comfortable referring someone you have not worked with directly.\n\nThanks for considering,\n[Your name]` },
  { title: 'Follow-up after applying. To a hiring manager', subject: 'Follow-up: [Role] application from [Your Name]', body: `Hi [Name],\n\nI applied last week for the [Role] position on your team and wanted to follow up briefly. The role stood out to me because [one specific thing about the team or the role].\n\nIn my previous role at [Company], I [one quantified achievement that maps to the JD]. I would welcome the chance to discuss how that experience could translate to what your team is building.\n\nI have reattached my resume for convenience. Thanks for your time.\n\nBest,\n[Your name]` },
];

const CASE_STUDY = {
  title: 'Case study: Priya, laid off from a tech firm in July 2024',
  story: `Priya was a mid-level product manager at a fast-growing SaaS company when she was laid off as part of a 15% company-wide reduction in July 2024. She spent the first week processing the shock, then applied the framework on this page. By week two she had a fully rewritten one-page resume leading with a quantified outcome: "Grew weekly active users from 41k to 87k in 12 months." She updated LinkedIn with a simple "Open to work. Product management roles" banner and started applying to 15 roles per week.\n\nIn month two, she added three volunteer product reviews for a local non-profit to show continued momentum. She also signed up for Goldman Sachs returnship program as a backup path, though she ultimately did not need it. By the end of month three she had 6 interviews and 2 offers. She accepted a role at a larger company at a 14% higher base salary than her previous job.\n\nThe difference-maker was not luck. It was a quantified, forward-looking resume (not apologetic), an updated LinkedIn on day one, and a disciplined 15-applications-per-week rhythm rather than spray-and-pray.`,
};

const STEPS = [
  { title: 'Step 1: Take 48 hours, then start', body: 'Layoffs trigger a real grief response. Most people who try to job hunt within 24 hours produce weak resumes. Take two days, talk to one trusted person, then come back to the document with a clear head.' },
  { title: 'Step 2: Build a "wins log" first', body: 'Before touching the resume, open a blank document and brain-dump every project, metric, recognition, and outcome from the last 18 months. You will use 30% of it but the act of writing it down rebuilds confidence and surfaces buried wins.' },
  { title: 'Step 3: Pick a forward-looking summary', body: 'Your professional summary should describe what you do and what you want next, not what just happened. Example: "Senior product manager with 8 years scaling B2B SaaS from seed to Series C. Now seeking a 0-to-1 product role at an early-stage startup."' },
  { title: 'Step 4: Quantify the last 12 months hard', body: 'Recruiters read recent experience first. The last 12 months should be your strongest, most quantified bullets. Earlier years can compress.' },
  { title: 'Step 5: Run the resume through an ATS check', body: 'Layoffs from large companies trigger automated re-applications. Every resume goes through an ATS. Use our free ATS checker before you apply anywhere.' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'stats', label: 'The numbers on post-layoff job search' },
  { id: 'framework', label: '5-step recovery framework' },
  { id: 'dos-donts', label: 'Do\'s and don\'ts' },
  { id: 'timeline', label: 'Your first 60 days' },
  { id: 'returnships', label: 'Returnship programs' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'emails', label: 'Email templates' },
  { id: 'case-study', label: 'Case study' },
];

const RELATED = [
  { title: 'Resume After a Career Gap', slug: 'resume-after-career-gap', excerpt: 'Real wording for childcare, health, caregiving, sabbatical. Gap-friendly templates.', read: 10 },
  { title: 'Resume for Career Change: 5-Step Pivot Guide', slug: 'resume-for-career-change', excerpt: 'Transferable-skills rewriting, hybrid format, 6 pivot examples.', read: 11 },
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes.', read: 9 },
];

export default function ResumeAfterLayoffPage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="Career Transitions"
        breadcrumbCurrent="Resume after a layoff"
        title="Resume After a Layoff: A 5-Step Guide for 2026"
        subtitle="250,000+ tech workers were laid off in 2024 and another 100,000+ in early 2025. Here is exactly how to write a resume that gets interviews, with no apologetic tone and no awkward gaps."
        dateModified="2026-04-15"
        readingTime={12}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>A layoff is not a performance issue. 61% of hiring managers agree. But your resume has to reflect that confidence. This guide walks you through the 5-step recovery framework, the exact wording to use and avoid, a 60-day plan, returnship programs that hire at scale, and 3 email templates for reactivating your network.</p>
        </section>

        <section id="stats" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">The numbers on post-layoff job search</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.n} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="text-2xl font-bold text-indigo-600">{s.n}</p>
                <p className="text-xs text-gray-700 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="framework" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">The 5-step recovery framework</h2>
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div key={step.title} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dos-donts" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Do&apos;s and don&apos;ts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-5">
              <h3 className="font-semibold text-green-800 mb-3">Do</h3>
              <ul className="space-y-2">
                {DOS.map((d) => (<li key={d} className="flex items-start gap-2 text-sm text-gray-800"><CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{d}</li>))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-5">
              <h3 className="font-semibold text-red-700 mb-3">Don&apos;t</h3>
              <ul className="space-y-2">
                {DONTS.map((d) => (<li key={d} className="flex items-start gap-2 text-sm text-gray-800"><span className="text-red-600 mt-0.5 shrink-0">×</span>{d}</li>))}
              </ul>
            </div>
          </div>
        </section>

        <section id="timeline" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your first 60 days</h2>
          </div>
          <p className="text-gray-600 mb-5">An honest week-by-week plan based on what actually works for laid-off professionals.</p>
          <div className="space-y-3">
            {TIMELINE.map((t) => (
              <div key={t.phase} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">{t.phase}</h3>
                <ul className="space-y-1.5">
                  {t.actions.map((a) => (<li key={a} className="flex items-start gap-2 text-sm text-gray-800"><CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />{a}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="returnships" className="mt-10 scroll-mt-6 bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-1">Formal returnship and post-layoff hiring programs</h2>
              <p className="text-sm text-amber-900">Large companies now run paid programs that hire at scale from layoff waves. Apply to these as a backup track even if you are applying for regular roles.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {RETURNSHIP_COMPANIES.map((r) => (
              <div key={r.name} className="bg-white rounded-md p-3 border border-amber-200">
                <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Post-layoff FAQ</h2>
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

        <section id="emails" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Email templates for your first week</h2>
          </div>
          <p className="text-gray-600 mb-5">Copy these as-is, personalise the bracketed fields, then send 5 to 10 per week. The returns compound.</p>
          <div className="space-y-3">
            {EMAIL_TEMPLATES.map((e) => (
              <details key={e.title} className="group bg-gray-50 rounded-lg border border-gray-200 open:shadow-sm">
                <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-900 text-sm flex items-center justify-between">
                  <span>{e.title}</span>
                  <span className="text-indigo-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <div className="border-t border-gray-200">
                  <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Subject</div>
                  <div className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-200">{e.subject}</div>
                  <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Body</div>
                  <pre className="px-4 py-4 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{e.body}</pre>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="case-study" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{CASE_STUDY.title}</h2>
          </div>
          <div className="text-sm text-gray-800">
            {CASE_STUDY.story.split('\n\n').map((p, i) => (<p key={i} className="mb-3 leading-relaxed">{p}</p>))}
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Composite story based on public accounts of 2024-2025 tech layoffs.</p>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Rebuild your resume in 30 minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates. ATS-clean and forward-looking.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">Start My Resume <ArrowRight className="h-4 w-4" /></button>
        </section>
      </BlogPostLayout>
    </>
  );
}
