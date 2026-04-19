'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const TOC = [
  { id: 'intro', label: 'Quick answer' },
  { id: 'resume-does', label: 'What a resume does' },
  { id: 'cover-does', label: 'What a cover letter does' },
  { id: 'compare', label: 'Side-by-side' },
  { id: 'need', label: 'When you need a cover letter' },
  { id: 'skip', label: 'When you can skip it' },
  { id: 'cost', label: 'Real cost of skipping' },
  { id: 'ai', label: 'AI cover letter generators' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: '4-part structure, 6 industry templates, hiring manager signals.', read: 8 },
  { title: 'How to Tailor Resume in 10 Minutes', slug: 'tailor-resume', excerpt: 'Minute-by-minute process, 3x more callbacks.', read: 10 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples by career stage and industry.', read: 14 },
  { title: 'How to Pass ATS Scanning', slug: 'pass-ats-resume-scanning', excerpt: '7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'Resume Writing Tips', slug: 'resume-tips', excerpt: 'The 8 practical tips recruiters wish more candidates followed.', read: 9 },
];

export default function CoverLetterVsResumePage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Interviews & Cover Letters"
      breadcrumbCurrent="Cover letter vs resume"
      title="Cover Letter vs Resume: Do You Need Both in 2026?"
      subtitle={'83% of hiring managers still read cover letters when included. The real question is not "do I need one" but "when is it worth the 15 minutes".'}
      dateModified="2026-04-19"
      readingTime={8}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Quick answer</p>
          <p className="text-gray-700">
            Write a cover letter when: (1) the job posting asks for one, (2) you are applying to a company where culture fit matters (startups, small teams, brand-driven companies), (3) you have an unusual angle (career change, gap, relocation), or (4) you are one of 200+ applicants and need something to separate you. Skip it when: the posting explicitly says &quot;no cover letter needed&quot;, you are applying via LinkedIn Easy Apply with no custom fields, or you are internal at the same company.
          </p>
        </div>
        <p>
          Cover letters are debated more than they deserve. They take 15 minutes if you have a template. The return is asymmetric: a good one can push you from pile to interview. A missing one rarely actively disqualifies you but often quietly drops you from the top tier.
        </p>
      </section>

      <section id="resume-does" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What a resume does</h2>
        <p>
          Your resume is a structured, skimmable summary of your work. It answers three questions for the reader in 6 to 60 seconds:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li><strong>Are you qualified?</strong> Skills, education, years of experience.</li>
          <li><strong>Are you credible?</strong> Where you have worked, what you shipped, with what outcome.</li>
          <li><strong>Are you the right level?</strong> Scope, scale, and team size visible from bullets.</li>
        </ul>
        <p className="mt-4">
          The resume is the hard filter: does the candidate pass the minimum bar? It is parsed by ATS, scanned by recruiters, and compared against dozens of other resumes for the same role. Formatting, density, and keywords all matter.
        </p>
      </section>

      <section id="cover-does" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What a cover letter does</h2>
        <p>
          A cover letter is narrative. It answers a different question: <strong>why you, specifically, for this role, now?</strong> That context does not fit in a resume bullet. The cover letter adds:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li><strong>Motivation.</strong> Why this company, this team, this problem? (Resume can&apos;t say.)</li>
          <li><strong>Connection.</strong> The friend who referred you, the talk that introduced you to the company.</li>
          <li><strong>Context for an unusual resume.</strong> Career gap, pivot, relocation, short tenure.</li>
          <li><strong>Voice.</strong> How you actually write. Important for communication-heavy roles (PM, marketing, customer-facing, writing).</li>
          <li><strong>A specific achievement tied to the JD.</strong> You can pull one result forward and explain the before / after in a way a bullet cannot.</li>
        </ul>
        <p className="mt-4">
          A resume gets you in the door. A cover letter tells a short story about why you are walking through it.
        </p>
      </section>

      <section id="compare" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Side-by-side comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Dimension</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Resume</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Cover Letter</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Purpose</td><td className="p-3">Qualification proof</td><td className="p-3">Motivation + narrative</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Length</td><td className="p-3">1 to 2 pages</td><td className="p-3">3 to 4 short paragraphs, 1 page</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Voice</td><td className="p-3">Terse, third-person implied</td><td className="p-3">First-person, conversational</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Structure</td><td className="p-3">Sections with bullets</td><td className="p-3">Paragraphs</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Tailoring</td><td className="p-3">Light (skills, summary)</td><td className="p-3">Heavy (every paragraph)</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">ATS parsing</td><td className="p-3">Primary parse target</td><td className="p-3">Stored but rarely parsed</td></tr>
              <tr><td className="p-3 font-medium">Reviewer time</td><td className="p-3">6 to 60 seconds</td><td className="p-3">30 to 90 seconds</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="need" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When you need a cover letter (5 scenarios)</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>The job posting explicitly asks.</strong> Non-negotiable. Not submitting gets you auto-rejected at some companies.</li>
          <li><strong>Small teams and startups under 200 people.</strong> Every hire matters; the cover letter is how they filter for motivation and culture fit.</li>
          <li><strong>You are making a career change.</strong> Your resume cannot explain the pivot. The cover letter can.</li>
          <li><strong>You are returning from a gap or re-entering.</strong> A cover letter lets you address it head-on in 2 sentences instead of letting the reader speculate.</li>
          <li><strong>Communication-heavy roles.</strong> PM, marketing, content, sales, customer success, executive roles. Your cover letter is a writing sample.</li>
        </ol>
      </section>

      <section id="skip" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When you can skip it (3 scenarios)</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>The posting explicitly says not to submit one.</strong> Follow the instruction. It is an inbox-management decision, not a culture signal.</li>
          <li><strong>LinkedIn Easy Apply without a custom field.</strong> Most Easy Apply postings have no cover letter slot. Skipping is expected.</li>
          <li><strong>Internal transfer at the same company.</strong> A hiring manager who already knows you doesn&apos;t need a written introduction.</li>
        </ol>
        <p className="mt-4">
          Outside these three, defaulting to &quot;no cover letter&quot; is a small but real penalty.
        </p>
      </section>

      <section id="cost" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The real cost of skipping a cover letter</h2>
        <p>
          A 2023 ResumeLab survey of 200 recruiters found:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li>83% read cover letters when included</li>
          <li>55% consider a cover letter a tie-breaker between two equally-qualified candidates</li>
          <li>26% auto-reject applications without cover letters when one was optional</li>
        </ul>
        <p className="mt-4">
          That last number is the real story. For 1 in 4 recruiters, a missing cover letter is a silent disqualifier even when the posting said &quot;optional&quot;. The 15 minutes to write one is the best time investment in your application.
        </p>
      </section>

      <section id="ai" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AI cover letter generators save time (when used well)</h2>
        <p>
          AI is excellent at the structural part of cover letter writing: opening hook, experience paragraph framing, closing call-to-action. It is bad at the specific hook line that makes a cover letter memorable.
        </p>
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="font-semibold mb-3">Useful AI workflow:</p>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Paste the job description.</li>
            <li>Paste your resume.</li>
            <li>Tell the AI the single hook sentence you want to lead with (a mutual connection, a specific product you love, an unusual relevant experience).</li>
            <li>Let it draft 3 paragraphs.</li>
            <li>Rewrite sentence 1 by hand to match your voice.</li>
            <li>Verify every claim in paragraph 2 matches something on your resume.</li>
          </ol>
        </div>
        <p className="mt-5">
          ResumeBuildz&apos;s AI cover letter generator pre-loads your resume as context so it does not invent achievements. Faster + safer than ChatGPT from scratch for this specific task.
        </p>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How long should a cover letter be?', a: '200 to 400 words. 3 to 4 short paragraphs. Always 1 page. Over 1 page reads as low-signal; under 200 words reads as low-effort.' },
            { q: 'Do I write a new cover letter for every application?', a: 'Every application needs substantive tailoring of paragraphs 1 and 2 (the hook and the why-this-company). Paragraph 3 (the most-relevant achievement) can be recycled across similar roles with minor tweaks. Paragraph 4 (close) can be boilerplate.' },
            { q: 'Can I just paste my resume into a cover letter?', a: 'No. A cover letter repeating resume bullets is wasted space. The whole point is adding the context that the resume cannot show.' },
            { q: 'What do recruiters hate in cover letters?', a: 'Generic openers ("I am writing to express my interest..."), copy-pasted company praise, and 6-paragraph walls of text. Keep it short, specific, and skimmable.' },
            { q: 'Should the cover letter match the resume\'s design?', a: 'Yes, visually. Same font, same header style, same colour accents. It signals attention to detail. ResumeBuildz pairs each template with a matching cover letter layout automatically.' },
            { q: 'Do ATS systems read cover letters?', a: 'They store the file but rarely parse it for keywords. A cover letter\'s value is entirely in human review. Do not stuff keywords; focus on narrative.' },
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

      <section className="mt-14 bg-gray-900 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Build both free in ResumeBuildz</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          ATS-tested resume templates + matching cover letter layouts. AI that uses your resume context so it doesn&apos;t invent achievements. Free to start.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
