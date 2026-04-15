'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle, Heart, Target, Sparkles, Calendar, TrendingUp, HelpCircle, BarChart3, Mail, BookOpen } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TOC from '@/components/TOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleMeta from '@/components/ArticleMeta';
import ReadingProgress from '@/components/ReadingProgress';
import { useLoginGateway } from '@/components/LoginGateway';
import { articleSchema, faqPageSchema, howToSchema, breadcrumbSchema, combineSchemas, jsonLd } from '@/lib/articleSchema';

const DOS = [
  'Treat the layoff as a business event, not a personal failure. The resume is not the place to explain it; the cover letter is.',
  'Use the company\'s public layoff announcement date as the end date. "Mar 2024 — Sep 2025 (laid off as part of company-wide reorg)" is fine, optional, and removes ambiguity.',
  'Lead with your most recent measurable wins. Hiring managers respond to evidence, not narrative.',
  'Keep titles, dates, and tenures honest. Background checks now flag inflated dates within seconds.',
  'Update your LinkedIn the same day you update your resume. Recruiters cross-check both.',
  'List any severance-period upskilling: courses, certifications, freelance gigs, open source contributions.',
];

const DONTS = [
  'Don\'t use the word "fired," "let go," or "released." Use "position eliminated," "company restructure," or simply leave it out.',
  'Don\'t include negative language about the former employer. Even subtle bitterness leaks through and recruiters notice.',
  'Don\'t leave a gap explanation in the bullet points. Bullets are for accomplishments. Move context to your summary or cover letter.',
  'Don\'t apologise. The resume is a sales document; the apology in your tone will lose interviews.',
  'Don\'t hide the gap with creative date formatting. Modern ATS parses dates strictly and "Present" with no end date triggers manual review.',
];

const STATS = [
  { n: '20M', label: 'US workers experience involuntary separation each year (BLS, 2024)' },
  { n: '4 mo', label: 'median time to new role for laid-off tech workers (Revelio Labs, 2024)' },
  { n: '61%', label: 'of hiring managers view layoffs as "not a performance issue" (LinkedIn poll, 2024)' },
  { n: '38%', label: 'of laid-off workers end up in a higher-paying role within 12 months (BLS, 2023)' },
];

const TIMELINE = [
  {
    phase: 'Week 1: Breathe, file, inventory',
    actions: [
      'File for unemployment benefits the day after separation — most US states require prompt filing.',
      'Review severance carefully. Do NOT sign anything that waives future claims without reading twice.',
      'Collect work samples, references, and a list of achievements from your past 18 months while memory is fresh.',
      'Do not touch the resume yet. Rest.',
    ],
  },
  {
    phase: 'Week 2: Rewrite your resume and LinkedIn',
    actions: [
      'Work through the 5-step framework below. Give yourself 4-6 hours, not 30 minutes.',
      'Run the finished resume through an ATS checker.',
      'Update LinkedIn on the same day. Recruiters cross-check.',
      'Send 3-5 "looking for opportunities" messages to your closest network contacts.',
    ],
  },
  {
    phase: 'Weeks 3-4: Apply at 15 companies/week',
    actions: [
      'Target 15 well-fit roles per week, not 100 spray-and-pray.',
      'Tailor the top of your resume for each role (summary + top 3 bullets).',
      'Send a short follow-up email to recruiters 5 days after applying.',
      'Track every application in a spreadsheet.',
    ],
  },
  {
    phase: 'Month 2: Iterate based on signal',
    actions: [
      'If you have 3+ interviews, your resume is working — focus on interview prep.',
      'If you have 0-1 interviews after 40 applications, your resume needs rework — start with the summary and top bullets.',
      'Expand your search by 1 level (e.g., senior to staff) and 1 adjacent function.',
      'Take 1-2 informational interviews per week.',
    ],
  },
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
  {
    q: 'Should I put "Laid Off" on my resume?',
    a: 'No. The resume is a sales document, not an incident report. You can optionally add "(Company-wide reorg, Sep 2024)" next to the end date if you want to preempt the question, but most recruiters already know — 2024 and 2025 tech layoffs have been heavily publicized. Address the layoff once in your cover letter in one neutral sentence, then move on.',
  },
  {
    q: 'How do I explain a layoff in interviews?',
    a: 'One sentence, neutral tone, no detail: "My team was part of a company-wide reorganization in [month]. I\'m now focused on finding a [role] where I can [specific contribution]." Do not apologise, do not speculate on why you were chosen, do not share internal gossip about the company.',
  },
  {
    q: 'Is it worth mentioning severance or notice period?',
    a: 'Only if the recruiter directly asks. Never put it on the resume. Never volunteer it in your first call. If asked, be factual: "I\'m on a 2-month paid notice period and my last working day is [date]."',
  },
  {
    q: 'Should I take a lower-paying role to bridge the gap?',
    a: 'Depends on runway. If you have 6+ months of savings, hold out for a role at your previous level. If you have under 3 months, a bridge role is often smarter — gaps past 6 months become harder to explain. An honest temporary role is better than a stretched gap.',
  },
  {
    q: 'What if I was laid off from a high-profile company like Google, Meta, or TCS?',
    a: 'Use it as a signal, not a liability. Being part of a publicly-reported layoff wave at a top company is now widely understood. Recruiters at competing companies actively source from these layoffs. Make sure your LinkedIn says "Open to work" and list the former employer prominently.',
  },
];

const EMAIL_TEMPLATES = [
  {
    title: 'Networking outreach — to a former colleague',
    subject: 'Catching up + looking for my next role',
    body: `Hi [Name],\n\nHope you're doing well — it's been a while since we last connected. I wanted to reach out because I was part of the recent reorganization at [Company] and I'm now actively looking for my next [role] role.\n\nI remembered how much I enjoyed working with you on [specific project] and thought you might know people in your network who are hiring. If you have 15 minutes in the next week or two, I'd love to catch up and hear what you're working on.\n\nI've attached my updated resume for context. No pressure at all — happy to connect when it works for you.\n\nThanks,\n[Your name]`,
  },
  {
    title: 'Referral ask — to a weak-tie contact',
    subject: 'Quick favor? Referral at [Target Company]',
    body: `Hi [Name],\n\nWe connected a while back through [context — conference, LinkedIn, mutual friend]. I hope you're doing well at [Their Company].\n\nI'm writing because I saw that [Target Company] is hiring for a [Role] and I believe I'd be a strong fit — my experience at [Company] included [specific relevant outcome]. Since I know you work there, I wanted to ask: would you be open to referring me internally?\n\nI've attached my resume and the job posting. Happy to send anything else that helps. Totally understand if you don't feel comfortable referring someone you haven't worked with directly.\n\nThanks for considering,\n[Your name]`,
  },
  {
    title: 'Follow-up after applying — to a hiring manager',
    subject: 'Follow-up: [Role] application from [Your Name]',
    body: `Hi [Name],\n\nI applied last week for the [Role] position on your team and wanted to follow up briefly. The role stood out to me because [one specific thing about the team or the role].\n\nIn my previous role at [Company], I [one quantified achievement that maps to the JD]. I'd welcome the chance to discuss how that experience could translate to what your team is building.\n\nI've reattached my resume for convenience. Thanks for your time.\n\nBest,\n[Your name]`,
  },
];

const CASE_STUDY = {
  title: 'Case study: Priya, laid off from a tech firm in July 2024',
  story: `Priya was a mid-level product manager at a fast-growing SaaS company when she was laid off as part of a 15% company-wide reduction in July 2024. She spent the first week processing the shock, then applied the framework on this page. By week two she had a fully rewritten one-page resume leading with a quantified outcome: "Grew weekly active users from 41k to 87k in 12 months." She updated LinkedIn with a simple "Open to work — product management roles" banner and started applying to 15 roles per week.\n\nIn month two, she added three volunteer product reviews for a local non-profit to show continued momentum. She also signed up for Goldman Sachs\' returnship program as a backup path, though she ultimately didn't need it. By the end of month three she had 6 interviews and 2 offers. She accepted a role at a larger company at a 14% higher base salary than her previous job.\n\nThe difference-maker wasn't luck — it was a quantified, forward-looking resume (not apologetic), an updated LinkedIn on day one, and a disciplined 15-applications-per-week rhythm rather than spray-and-pray.`,
};

const STEPS = [
  {
    title: 'Step 1: Take 48 hours, then start',
    body: 'Layoffs trigger a real grief response. Most people who try to job hunt within 24 hours produce weak resumes. Take two days, talk to one trusted person, then come back to the document with a clear head.',
  },
  {
    title: 'Step 2: Build a "wins log" first',
    body: 'Before touching the resume, open a blank document and brain-dump every project, metric, recognition, and outcome from the last 18 months. You will use 30% of it but the act of writing it down rebuilds confidence and surfaces buried wins.',
  },
  {
    title: 'Step 3: Pick a forward-looking summary',
    body: 'Your professional summary should describe what you do and what you want next, not what just happened. Example: "Senior product manager with 8 years scaling B2B SaaS from seed to Series C. Now seeking a 0-to-1 product role at an early-stage startup."',
  },
  {
    title: 'Step 4: Quantify the last 12 months hard',
    body: 'Recruiters read recent experience first. The last 12 months should be your strongest, most quantified bullets. Earlier years can compress.',
  },
  {
    title: 'Step 5: Run the resume through an ATS check',
    body: 'Layoffs from large companies trigger automated re-applications. Every resume goes through an ATS. Use our free ATS checker before you apply anywhere.',
  },
];

export default function ResumeAfterLayoffPage() {
  const { openGateway } = useLoginGateway();

  useEffect(() => {
    document.title = 'Resume After Layoff 2026 - 5-Step Guide & Templates | ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'How to write a resume after a layoff. 5-step recovery framework, what to say (and what not to say), real bullet examples, and ATS-friendly templates. Updated for 2026.'
      );
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute(
        'content',
        'How to write a resume after a layoff. 5-step recovery framework, what to say, what not to say, real bullet examples, ATS-friendly templates.'
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Resume After Layoff 2026 - 5-Step Guide & Templates | ResumeForge');
  }, []);

  const schema = combineSchemas(
    articleSchema({
      headline: 'Resume After a Layoff: A 5-Step Guide for 2026',
      description: 'How to write a resume after a layoff. 5-step recovery framework, timeline, returnship programs, FAQ, and email templates.',
      slug: 'resume-after-layoff',
      datePublished: '2026-04-14',
      dateModified: '2026-04-15',
    }),
    howToSchema({
      name: 'How to write a resume after a layoff',
      description: '5-step framework for rewriting your resume after involuntary separation.',
      totalTime: 'PT2H',
      steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
    }),
    faqPageSchema(FAQS),
    breadcrumbSchema([
      { label: 'Resources', slug: 'resume-for' },
      { label: 'Resume after a layoff' },
    ])
  );

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <ReadingProgress />
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs
            items={[{ label: 'Resume after a layoff' }]}
            className="justify-center flex mb-4"
          />
          <span className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <Heart className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" /> Career Recovery
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Resume After a Layoff: A 5-Step Guide for 2026
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            More than 250,000 tech workers were laid off in 2024 and another 100,000+ in early 2025. Here is exactly how to write a resume that gets interviews after a layoff, with no apologetic tone and no awkward gaps.
          </p>
        </div>
      </section>

      {/* Intro */}
      <main className="flex-1 bg-white py-14">
        <TOC />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ArticleMeta
            publishedDate="2026-04-14"
            updatedDate="2026-04-15"
            readingTime={12}
            reviewed
          />
          <section>
            <p className="text-gray-700 leading-relaxed text-lg">
              A layoff is not a performance issue. According to the US Bureau of Labor Statistics, roughly 20 million workers experience involuntary separation each year, and the majority find new roles within 4 months. The candidates who land fastest share three traits: a quantified, forward-looking resume; a calm, factual cover letter; and an updated LinkedIn that matches both.
            </p>
          </section>

          {/* Stats */}
          <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">The numbers on post-layoff job searches</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{s.n}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">The 5-Step Recovery Framework</h2>
            <div className="space-y-5">
              {STEPS.map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Do/Don't */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-green-800 mb-4">
                <CheckCircle2 className="h-5 w-5" /> Do
              </h3>
              <ul className="space-y-3">
                {DOS.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-red-800 mb-4">
                <AlertCircle className="h-5 w-5" /> Don&apos;t
              </h3>
              <ul className="space-y-3">
                {DONTS.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-red-600 mt-0.5">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Example bullets */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Example bullets that work after a layoff</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Notice how each one leads with action and ends with a number. None of them mention the layoff itself.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="font-semibold text-gray-900">Software Engineer:</span> Reduced API latency by 62% (from 480ms p95 to 180ms p95) by introducing read replicas and an in-memory cache layer, saving the team an estimated $14k/month in infra costs.
              </li>
              <li className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="font-semibold text-gray-900">Product Manager:</span> Shipped 9 features over 12 months that lifted weekly active users from 41k to 87k (+112%) and grew paid conversion 1.4% to 3.1%.
              </li>
              <li className="bg-white rounded-lg p-3 border border-gray-100">
                <span className="font-semibold text-gray-900">Marketing Manager:</span> Built and ran a 6-channel demand generation engine that delivered 4,200 SQLs and $1.8M in pipeline at a blended CAC of $430.
              </li>
            </ul>
          </section>

          {/* Timeline */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your first 60 days after a layoff</h2>
            </div>
            <p className="text-gray-600 mb-6">
              A structured timeline beats panic. Here is the action list most high-performers follow.
            </p>
            <div className="space-y-4">
              {TIMELINE.map((phase, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">{i + 1}</span>
                    {phase.phase}
                  </h3>
                  <ul className="space-y-2 ml-8">
                    {phase.actions.map((a, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Returnship / post-layoff programs */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Formal returnship and post-layoff hiring programs</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Several large employers run dedicated programs for professionals returning to work, including those returning after a layoff. These programs often bypass standard ATS and give you a direct path to an interview.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {RETURNSHIP_COMPANIES.map((c, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Frequently asked questions</h2>
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

          {/* Email Templates */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Email templates for your first week</h2>
            </div>
            <p className="text-gray-600 mb-6">
              The fastest way to land interviews after a layoff is targeted outreach. These three templates are structured to get responses, not just attention. Copy, personalize the bracketed fields, and send 3-5 per week.
            </p>
            <div className="space-y-4">
              {EMAIL_TEMPLATES.map((t, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden open:shadow-sm">
                  <summary className="px-5 py-4 cursor-pointer font-semibold text-gray-900 text-sm flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className="text-blue-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-5 border-t border-gray-200">
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wide mt-3 mb-1">Subject</p>
                    <p className="text-sm text-gray-900 font-medium mb-3">{t.subject}</p>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wide mb-1">Body</p>
                    <pre className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{t.body}</pre>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Case Study */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{CASE_STUDY.title}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              {CASE_STUDY.story.split('\n\n').map((p, i) => (
                <p key={i} className="mb-3 leading-relaxed">{p}</p>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">Composite story based on public accounts from 2024-2025 tech layoff recoveries.</p>
          </section>

          {/* CTA */}
          <section className="text-center py-8">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Build your post-layoff resume in 30 minutes</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Free to start. 20 ATS-tested templates. Built-in score checker so you know it&apos;s clean before you submit.
            </p>
            <button
              onClick={() => openGateway('/builder')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              Start My Resume <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          {/* Internal links */}
          <section className="border-t border-gray-100 pt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Related guides</h3>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <Link href="/resume-after-career-gap" className="text-blue-600 hover:underline">→ Resume after a career gap</Link>
              <Link href="/resume-for-career-change" className="text-blue-600 hover:underline">→ Resume for career change</Link>
              <Link href="/ats-guide" className="text-blue-600 hover:underline">→ Complete ATS guide</Link>
              <Link href="/resume-tips" className="text-blue-600 hover:underline">→ Resume tips that work</Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
