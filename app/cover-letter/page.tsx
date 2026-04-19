'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const structureParts = [
  { step: '1', title: 'Opening Paragraph', desc: 'Hook the reader immediately. State the position you are applying for, how you found it, and one compelling reason you are the right fit. If you have a referral, mention it here.', example: 'As a senior full-stack engineer with 7 years of experience building scalable SaaS platforms, I was excited to see your opening for a Lead Engineer...' },
  { step: '2', title: 'Why This Company', desc: 'Show you have researched the company. Reference their mission, recent news, products, or values. Explain why this company specifically appeals to you and how your goals align.', example: 'Your commitment to democratising financial literacy through technology resonates deeply with my own passion for building tools that make complex systems accessible...' },
  { step: '3', title: 'Your Value Proposition', desc: 'This is the core of your letter. Highlight 2-3 specific achievements with metrics that directly relate to the job requirements. Draw a clear line from your experience to their needs.', example: 'At my current role, I led the migration of a monolithic Rails app to microservices, reducing deployment time by 80% and improving system reliability to 99.99% uptime...' },
  { step: '4', title: 'Closing Statement', desc: 'Reiterate your enthusiasm, include a clear call to action, and thank the reader. Keep it confident but not presumptuous. Mention your availability for an interview.', example: 'I would welcome the opportunity to discuss how my experience in scaling engineering teams could contribute to your growth goals. I am available for a conversation at your convenience.' },
];

const industryTemplates = [
  { industry: 'Software Engineering', icon: '💻', opening: 'With 5+ years building production-grade applications in React and Node.js, and a track record of reducing load times by 60%, I am eager to bring my full-stack expertise to...' },
  { industry: 'Product Management', icon: '📋', opening: 'Having launched 3 B2B products from zero to $5M ARR, I understand the intersection of user needs, business goals, and technical constraints that defines great product management at...' },
  { industry: 'Data Science', icon: '📊', opening: 'As a data scientist who has built ML pipelines processing 10M+ daily predictions with 94% accuracy, I am excited about the opportunity to drive data-informed decisions at...' },
  { industry: 'Marketing', icon: '📣', opening: 'With a proven record of growing organic traffic by 300% and managing $2M+ annual ad budgets with 4.5x ROAS, I am excited to bring my growth marketing expertise to...' },
  { industry: 'Finance', icon: '📈', opening: 'As a CFA charterholder with 8 years of experience in equity research covering the technology sector, managing coverage of 15+ companies with a combined market cap of $500B, I am drawn to...' },
  { industry: 'Healthcare', icon: '🏥', opening: 'With 6 years of clinical experience and a passion for improving patient outcomes through evidence-based practice, I am enthusiastic about joining your team to advance...' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'why', label: 'Why cover letters matter' },
  { id: 'structure', label: 'The 4-part structure' },
  { id: 'full-example', label: 'Complete example' },
  { id: 'length', label: 'Length and formatting' },
  { id: 'email-vs-attached', label: 'Email vs attached' },
  { id: 'dos-donts', label: 'Do\'s and don\'ts' },
  { id: 'mistakes', label: 'Mistakes explained' },
  { id: 'templates', label: 'Templates by industry' },
  { id: 'ai', label: 'AI-powered cover letters' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes that sink your resume.', read: 9 },
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Fresher Resume Format 2026', slug: 'fresher-resume', excerpt: 'The exact 7-section format that beats Indian and global ATS for freshers.', read: 11 },
  { title: 'Resume for Career Change: The 5-Step Pivot Guide', slug: 'resume-for-career-change', excerpt: 'Transferable-skills rewriting, hybrid format, and 6 common pivot examples.', read: 11 },
  { title: 'Resume After a Layoff', slug: 'resume-after-layoff', excerpt: 'A 5-step guide for 2026 with 3 email templates and a 60-day planner.', read: 12 },
];

export default function CoverLetterGuidePage() {
  const { openGateway } = useLoginGateway();

  useEffect(() => {
    document.title = 'Cover Letter Guide & Templates | ResumeBuildz';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Learn how to write compelling cover letters with our complete guide. Structure, dos and donts, and industry templates.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Learn how to write compelling cover letters with our complete guide. Structure, dos and donts, and industry templates.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Cover Letter Guide & Templates | ResumeBuildz');
  }, []);

  return (
    <BlogPostLayout
      category="Interviews & Cover Letters"
      breadcrumbCurrent="Cover letter guide"
      title="How to Write a Cover Letter That Gets Read"
      subtitle="83% of hiring managers read cover letters. Here is a practical structure, real examples, and the mistakes that get applications rejected."
      dateModified="2026-04-15"
      readingTime={8}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <p>Your resume shows what you have done. Your cover letter explains why you are the right person for this specific job. Even when companies say cover letters are optional, a strong one puts you ahead of everyone who skipped it. This guide covers the 4-part structure, the do and don&apos;t list every recruiter wishes more candidates followed, and industry-specific opening lines you can copy.</p>
      </section>

      <section id="why" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Why cover letters matter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { stat: '83%', label: 'of hiring managers read cover letters (ResumeLab, 2023)' },
            { stat: '49%', label: 'say cover letters are their second most valued document (ResumeGo, 2023)' },
            { stat: '2x', label: 'more likely to land interviews with a strong cover letter (CareerBuilder, 2023)' },
          ].map((item) => (
            <div key={item.stat} className="bg-gray-50 rounded-lg border border-gray-200 p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{item.stat}</div>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
        <p>Pair your cover letter with a well-built{' '}
          <button onClick={() => openGateway('/builder')} className="text-indigo-600 hover:underline inline">ATS-optimised resume</button>
          {' '}and you are in a strong position.
        </p>
      </section>

      <section id="structure" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">The 4-part structure</h2>
        <p className="text-gray-600 mb-5">Follow this proven structure for a cover letter that is clear, compelling, and professional.</p>
        <div className="space-y-4">
          {structureParts.map((part) => (
            <div key={part.step} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{part.step}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1.5">{part.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{part.desc}</p>
                  <div className="bg-gray-50 rounded-md p-3 border-l-4 border-indigo-600">
                    <p className="text-sm text-gray-600 italic">&ldquo;{part.example}&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="full-example" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">A complete cover letter example</h2>
        <p className="mb-5">A full cover letter for a mid-level product manager role. Hand-written in 14 minutes; not AI-generated. Annotations in blue after each paragraph show what each section does.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 font-serif text-[15px] leading-relaxed text-gray-800">
          <p className="mb-4">Dear Priya Menon,</p>
          <p className="mb-4">
            When I read your team&apos;s retro post about Zaggle Spend Card&apos;s re-architecture last month, I knew I wanted to apply. I&apos;ve been at this exact intersection of B2B SaaS + Indian fintech for 5 years at Razorpay and Cred, and the problem you described (reconciling approvals across finance, IT, and employees) is the one I worked on through all of 2024.
          </p>
          <p className="text-xs text-indigo-600 mb-5 not-italic font-sans">
            ↑ Opening (hook): specific, shows research, positions experience. No &quot;I am writing to express my interest&quot;.
          </p>
          <p className="mb-4">
            At Cred Business (2022-2024), I owned the spend-management product through its first Rs 340 Cr of ARR. I shipped the three-way-match feature your post discussed wanting. Metrics: 87% of customers activated within 14 days of signup, expense-report time down from 34 min to 8 min, Finance team approval SLA cut in half. The hardest part was aligning finance and IT on a single approval workflow. I spent six weeks running paired customer calls before writing the spec.
          </p>
          <p className="text-xs text-indigo-600 mb-5 not-italic font-sans">
            ↑ Value paragraph: one specific feature, three concrete metrics, one sentence on the hard part. No resume repetition.
          </p>
          <p className="mb-4">
            Zaggle&apos;s focus on the mid-market (Rs 50 Cr to Rs 500 Cr revenue) customers is where I want to work next. The customers who need this most are the ones under-served by both Ramp (US-focused) and Razorpay X (too SMB-heavy). I would love to talk about the re-architecture goals for 2026 and how my background with Indian finance team workflows could accelerate them.
          </p>
          <p className="text-xs text-indigo-600 mb-5 not-italic font-sans">
            ↑ Why-this-company: demonstrates market understanding. Positions fit without flattery.
          </p>
          <p className="mb-4">
            I am available any afternoon this week for a 30-minute conversation. Thank you for considering my application.
          </p>
          <p className="text-xs text-indigo-600 mb-5 not-italic font-sans">
            ↑ Close: concrete next step, polite, no &quot;humbly request&quot; or overuse of apologies.
          </p>
          <p>Best,<br/>Arjun Iyer</p>
        </div>
        <p className="mt-5 text-sm text-gray-600">
          Total: 266 words. 4 paragraphs. Under 1 page. Specifics not findable on LinkedIn. Zero generic phrases. This is the bar.
        </p>
      </section>

      <section id="length" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Length and formatting rules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Length</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li><strong>250 to 400 words</strong> total, across 3 to 4 paragraphs.</li>
              <li>Never longer than 1 page.</li>
              <li>Under 200 words reads low-effort; over 500 reads self-indulgent.</li>
              <li>Each paragraph 3 to 5 sentences max.</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Formatting</h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>Same font and header as your resume.</li>
              <li>10 to 11 pt body text, 1.1 line-height.</li>
              <li>0.5 to 0.75 inch margins.</li>
              <li>Left-aligned text, not justified.</li>
              <li>Save as PDF with your name in the filename.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="email-vs-attached" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Email body vs attached file</h2>
        <p>
          When you are emailing the application directly (increasingly common for executive searches, startups, and internal referrals), you have a choice: put the cover letter in the email body, attach it as a separate PDF, or both.
        </p>
        <ul className="mt-5 space-y-3">
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Email body (recommended for direct contact)</p>
            <p className="text-sm text-gray-700">Most hiring managers read the email first. Put the full cover letter in the body. Attach the resume as a PDF. Skip the separate cover-letter file.</p>
          </li>
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Attached PDF (recommended for ATS upload)</p>
            <p className="text-sm text-gray-700">When submitting via a careers portal with a &quot;cover letter&quot; field, attach a PDF. Match formatting to your resume for a polished set.</p>
          </li>
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Both (over-engineering)</p>
            <p className="text-sm text-gray-700">Pasting in email AND attaching the same letter is redundant and slightly annoying. Pick one.</p>
          </li>
        </ul>
      </section>

      <section id="dos-donts" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Do&apos;s and don&apos;ts</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
              <h3 className="font-semibold text-green-800">Do</h3>
            </div>
            <ul className="space-y-2">
              {['Address the hiring manager by name when possible', 'Research the company and reference specific details', 'Quantify your achievements with numbers', 'Match your tone to the company culture', 'Keep it to one page (250-400 words)', 'Proofread multiple times for errors', 'Include a clear call to action in closing', 'Explain employment gaps honestly if relevant'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-800"><span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">×</span>
              <h3 className="font-semibold text-red-700">Don&apos;t</h3>
            </div>
            <ul className="space-y-2">
              {['Repeat your resume word for word', 'Use "To Whom It May Concern"', 'Focus only on what you want from the job', 'Write more than one page', 'Use a generic template without customisation', 'Include salary requirements unless asked', 'Apologise for lack of experience', 'Send the same letter to every application'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-800"><span className="text-red-600 mt-0.5 flex-shrink-0">×</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="mistakes" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">The 8 mistakes that kill cover letters</h2>
        <div className="space-y-4">
          {[
            { title: 'Starting with "I am writing to express my interest"', why: 'The most-overused cover letter opener in history. Recruiters skim the first sentence; if it matches this pattern they mentally file it with the generic pile. Open with a specific hook: a product insight, a mutual connection, a post you read from the team.' },
            { title: 'Repeating the resume in prose', why: 'The cover letter exists to add context, not duplicate. If your letter could be copy-pasted onto a generic resume and still work, you are repeating instead of supplementing. Include things the resume cannot say: motivation, a story, a pivot explanation.' },
            { title: 'Generic "To Whom It May Concern"', why: 'Almost always possible to find the hiring manager\'s name via LinkedIn, the company website, or by asking in your referral email. Addressing by name signals effort; generic greetings signal mass-applying.' },
            { title: 'Six paragraphs of self-promotion', why: 'Each claim without evidence weakens the whole letter. Three concrete paragraphs with proof beat six vague ones.' },
            { title: 'Apologising for gaps or lack of experience', why: 'Frame neutrally. &quot;My career gap from 2022 to 2024 was time I used to caregive and complete a Reforge course&quot; works. &quot;I apologise for my career gap&quot; puts the reader on the defensive.' },
            { title: 'Mentioning salary or benefits', why: 'Unless explicitly requested in the JD, never mention compensation. It signals the priority is wrong for a first contact.' },
            { title: 'Using the same letter for every application', why: 'Paragraphs 1 and 2 must be tailored. Paragraph 3 can be recycled across similar roles with light edits. Paragraph 4 can be boilerplate. If 100% of the letter stays the same, you are not tailoring.' },
            { title: 'Ignoring the company culture', why: 'A startup letter should feel different from a bank letter. Read 5 company blog posts to absorb the voice; let it influence your writing slightly (not enough to lose your own voice).' },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">{i + 1}. {item.title}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Templates by industry</h2>
        <p className="text-gray-600 mb-5">Sample opening lines tailored to different industries. Use these as inspiration for your own cover letter.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryTemplates.map((tmpl) => (
            <div key={tmpl.industry} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl mb-2">{tmpl.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{tmpl.industry}</h3>
              <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{tmpl.opening}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ai" className="mt-10 scroll-mt-6 bg-gray-900 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-3">AI-powered cover letters</h2>
        <p className="text-white/70 mb-5 leading-relaxed">
          Don&apos;t want to start from scratch? ResumeBuildz AI takes your resume data and the job description, then writes a tailored cover letter in seconds. It pulls your most relevant experience, matches the company tone, and follows the 4-part structure above. You can edit every word before exporting.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Groq AI Powered', 'Job-Specific', 'Instant Generation', 'Editable Output'].map((t) => (
            <span key={t} className="text-xs bg-white/10 text-indigo-300 px-2.5 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Do I still need a cover letter in 2026?', a: 'Yes, in most cases. 83% of hiring managers read cover letters when included, and roughly 1 in 4 recruiters treats a missing cover letter as a silent disqualifier even when the posting marked it optional. The 15 minutes to write one is the single best-ROI part of the application.' },
            { q: 'How long should a cover letter be?', a: '250 to 400 words, 3 to 4 paragraphs, always under 1 page. Shorter looks low-effort; longer looks self-indulgent.' },
            { q: 'Should I use the same cover letter for multiple applications?', a: 'Paragraphs 1 and 2 must be tailored per application. Paragraph 3 (your strongest achievement tied to the JD) can be recycled across similar roles with minor edits. Paragraph 4 (the close) can be boilerplate. If nothing changes across applications, you are not tailoring.' },
            { q: 'Can I use AI to write my cover letter?', a: 'Yes, as an editor. Provide the AI with the JD, your resume, and 1 to 2 specific facts you want to lead with; let it draft paragraphs. Then rewrite sentence 1 and sentence 2 in your own voice. See our AI resume tools guide for more on when to trust AI output.' },
            { q: 'What is the best way to find the hiring manager\'s name?', a: 'Try, in order: the LinkedIn post announcing the role, the careers-page team section, a company email-guess pattern, or asking in your initial referral conversation. If truly unknown, use &quot;Dear Hiring Team&quot; or &quot;Dear [Company] Team&quot;. Never &quot;To Whom It May Concern&quot;.' },
            { q: 'Should the cover letter be in the email or attached?', a: 'For direct email contact (referrals, executive searches): put it in the email body. For careers-portal uploads: attach as a PDF matching your resume formatting.' },
            { q: 'Can I mention I am applying to other companies?', a: 'No. It adds nothing and can trigger the "we do not want to be the backup" reaction. Exception: if you are in final rounds elsewhere and want to speed this one up, mention in conversation only, not in the cover letter.' },
            { q: 'What if the job posting says "no cover letter required"?', a: 'Respect the instruction. Sending one anyway looks like you did not read the posting. Save the effort for postings where it counts.' },
          ].map((item, i) => (
            <details key={i} className="border border-gray-200 rounded-lg group">
              <summary className="cursor-pointer p-4 font-semibold text-gray-900 list-none flex items-center justify-between">
                {item.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Generate your cover letter</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm">
          Our AI writes a tailored cover letter based on your resume and the job description. Need help with your resume first? Check out our <Link href="/resume-tips" className="text-indigo-600 hover:underline">resume writing tips</Link> and <Link href="/templates" className="text-indigo-600 hover:underline">ATS-friendly templates</Link>.
        </p>
        <button onClick={() => openGateway('/builder')} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">
          Generate your cover letter
        </button>
      </section>
    </BlogPostLayout>
  );
}
