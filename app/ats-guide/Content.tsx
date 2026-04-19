'use client';

import Link from 'next/link';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const TIPS = [
  { num: 1, title: 'Use Relevant Keywords', desc: 'Mirror the exact language from the job description. Include both spelled-out terms and acronyms (e.g., "Search Engine Optimization (SEO)").' },
  { num: 2, title: 'Stick to Standard Headings', desc: 'Use conventional section headings like "Work Experience," "Education," and "Skills" that ATS systems expect.' },
  { num: 3, title: 'Keep Formatting Simple', desc: 'Avoid complex layouts, columns, text boxes, headers/footers, and fancy formatting that can confuse parsers.' },
  { num: 4, title: 'Submit as PDF or DOCX', desc: 'These are the most widely supported formats. Check the job posting for any format preference.' },
  { num: 5, title: 'Avoid Images and Tables', desc: 'ATS cannot read text embedded in images, graphics, charts, or complex tables.' },
  { num: 6, title: 'Use Strong Action Verbs', desc: 'Start bullet points with impactful verbs like "Led," "Developed," "Implemented," "Achieved," and "Optimised."' },
  { num: 7, title: 'Quantify Your Achievements', desc: 'Use numbers and metrics to demonstrate impact: percentages, dollar amounts, team sizes, and time saved.' },
  { num: 8, title: 'Tailor Each Application', desc: 'Customise your resume for every job. One-size-fits-all resumes score poorly with ATS keyword matching.' },
  { num: 9, title: 'Proofread Carefully', desc: 'Typos and misspellings can prevent keyword matches. Double-check all text, especially technical terms.' },
  { num: 10, title: 'Use an ATS-Optimised Template', desc: 'Start with a template that is already built for ATS compatibility. ResumeBuildz 20 templates are tested against real ATS parsers.' },
];

const MISTAKES = [
  { title: 'Using Creative File Formats', desc: 'Submitting resumes as JPG, PNG, or in portfolio formats that ATS cannot parse.' },
  { title: 'Stuffing Keywords Unnaturally', desc: 'Hiding white text or cramming keywords out of context gets flagged or ignored by modern ATS.' },
  { title: 'Using Only Graphics and Icons', desc: 'Replacing text with icons for contact info, skills ratings as bars, or image-based layouts.' },
  { title: 'Ignoring Job Description Language', desc: 'Using different terminology than the job posting, even if they mean the same thing.' },
  { title: 'Multi-Column Complex Layouts', desc: 'Fancy two or three-column designs can scramble the reading order for ATS parsers.' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what-is-ats', label: 'What is an ATS' },
  { id: 'how-it-works', label: 'How ATS works' },
  { id: 'parser-deep', label: 'What the parser actually does' },
  { id: 'ats-stats', label: 'ATS statistics' },
  { id: 'tips', label: '10 ways to get past ATS' },
  { id: 'mistakes', label: 'Common mistakes' },
  { id: 'formats', label: 'ATS-friendly file formats' },
  { id: 'systems', label: 'Per-system tuning' },
  { id: 'manual-test', label: 'Testing your resume manually' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'Fresher Resume Format 2026', slug: 'fresher-resume', excerpt: 'The exact 7-section format that beats Indian and global ATS for freshers.', read: 11 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes that sink your resume.', read: 9 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
  { title: '8 Naukri Resume Tips That 3x Recruiter Views', slug: 'naukri-resume-tips', excerpt: 'How Arjun went from 2 to 40 recruiter views a week on Naukri.', read: 9 },
  { title: 'Campus Placement Resume 2026', slug: 'campus-placement-resume', excerpt: '10-point checklist and 5-round process walkthrough for Indian campus placements.', read: 10 },
];

export default function ATSGuidePage() {
  const { openGateway } = useLoginGateway();


  return (
    <>
      <BlogPostLayout
        category="ATS & Optimisation"
        breadcrumbCurrent="Complete ATS guide"
        title="How to Beat ATS: The Complete Guide"
        subtitle="75% of resumes never reach a human recruiter. Here is how ATS works, why your resume might be getting filtered out, and exactly how to fix it."
        dateModified="2026-04-15"
        readingTime={12}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>Most recruiters never see 75% of the resumes submitted to a job posting. The bottleneck is not a person, it is software: the Applicant Tracking System. This guide covers exactly how ATS works, the 10 ways to get past it, the mistakes that kill your chances, and the file formats the system actually prefers.</p>
        </section>

        <section id="what-is-ats" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What is an ATS?</h2>
          <p className="mb-4">An Applicant Tracking System (ATS) is software that companies use to sort through job applications. According to Jobscan, 98% of Fortune 500 companies use one. When you submit your resume online, it almost always goes through an ATS before any human reads it.</p>
          <p className="mb-4">Here is what happens: the ATS scans your resume, pulls out your contact info, job titles, skills, and education, then compares everything against the job description. If your resume does not match enough keywords and criteria, it gets filtered out, and no recruiter ever sees it.</p>
          <p>The good news: once you understand how ATS works, it is not hard to beat. You can check your resume right now with our{' '}
            <button onClick={() => openGateway('/builder')} className="text-indigo-600 hover:underline inline">free ATS score checker</button>.
          </p>
        </section>

        <section id="how-it-works" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How ATS works</h2>
          <p className="text-gray-600 mb-5">Understanding the ATS pipeline helps you optimise your resume for each stage.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { step: '1', title: 'Resume Upload', desc: 'You submit your resume through an online portal or email. The ATS receives and stores the file.' },
              { step: '2', title: 'Parsing', desc: 'The system extracts text from your resume, identifying sections like experience, education, and skills.' },
              { step: '3', title: 'Keyword Match', desc: 'Your resume is compared against the job description. The ATS looks for matching keywords and phrases.' },
              { step: '4', title: 'Ranking', desc: 'Resumes are scored and ranked. Top-scoring resumes are forwarded to recruiters for review.' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="inline-flex h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold items-center justify-center mb-2">{item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="parser-deep" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the parser actually does (in 5 steps)</h2>
          <p className="mb-5">Understanding the parser step-by-step makes every optimisation decision obvious. Here is what happens between your upload click and the candidate record in the recruiter&apos;s database.</p>
          <ol className="space-y-4">
            {[
              { t: 'Text extraction', d: 'The parser converts your PDF/DOCX into a flat text stream. Selectable-text PDFs extract perfectly; image-based PDFs extract nothing (they have no text layer). Complex column layouts extract top-to-bottom left-to-right, often interleaving unrelated content.' },
              { t: 'Section recognition', d: 'The parser looks for standard section headings ("Experience", "Education", "Skills") to chunk the text into logical blocks. Non-standard headings ("What I have been up to", "My toolbox") get flagged as unknown and the content may be dropped.' },
              { t: 'Entity extraction', d: 'Within each section, the parser pulls out structured entities: company names, job titles, employment dates (in multiple formats), school names, degrees, and a flat list of skills. Any of these that fail regex match are stored as "unstructured" which recruiters cannot search against.' },
              { t: 'Normalisation', d: 'The parser normalises variants: "JavaScript" and "JS" map to the same skill entity on modern parsers. Older ones (iCIMS pre-2020, legacy Taleo) do not normalise, which is why listing both the acronym and the full form helps.' },
              { t: 'Keyword matching + ranking', d: 'Finally, the recruiter runs searches like "Python AND (React OR Vue) AND NOT intern". Your candidate record either matches or it does not. The rank is based on match density and optional recency weighting.' },
            ].map((step, i) => (
              <li key={step.t} className="border border-gray-200 rounded-lg p-5 flex gap-4">
                <span className="shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.t}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5">
            Any optimisation you make should map back to one of these 5 stages. Stuck at stage 1 (text extraction)? That is a file format issue. Losing content at stage 2? Your headings are non-standard. Failing at stage 5? You do not have enough JD-matched keywords.
          </p>
        </section>

        <section id="ats-stats" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">ATS statistics that matter</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: '75%', desc: 'of resumes are filtered out by ATS before a recruiter ever reads them (Jobscan, 2024)' },
              { stat: '98%', desc: 'of Fortune 500 companies use an ATS to screen applicants (Jobscan)' },
              { stat: '250+', desc: 'applications per corporate job posting on average (Glassdoor, 2024)' },
              { stat: '6 sec', desc: 'is the average time a recruiter spends on an initial resume scan (Ladders, 2024)' },
            ].map((item) => (
              <div key={item.stat} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{item.stat}</div>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="tips" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">10 ways to get past ATS screening</h2>
          <p className="text-gray-600 mb-5">These are the tactics that actually work. Each one addresses a specific reason resumes get filtered out.</p>
          <div className="space-y-3">
            {TIPS.map((tip) => (
              <div key={tip.num} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{tip.num}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-700">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="mistakes" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Common ATS mistakes to avoid</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {MISTAKES.map((m) => (
              <div key={m.title} className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">×</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-700">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="formats" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">ATS-friendly file formats</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center font-semibold">PDF</th>
                  <th className="px-4 py-3 text-center font-semibold">DOCX</th>
                  <th className="px-4 py-3 text-center font-semibold">Other (JPG, PNG)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'ATS Compatibility', pdf: 'High', docx: 'Highest', other: 'None' },
                  { feature: 'Formatting Preserved', pdf: 'Excellent', docx: 'Good', other: 'N/A' },
                  { feature: 'Parsing Accuracy', pdf: 'Good', docx: 'Best', other: 'Not Supported' },
                  { feature: 'Universal Support', pdf: 'Yes', docx: 'Yes', other: 'No' },
                  { feature: 'Recommended', pdf: 'Yes', docx: 'Yes', other: 'No' },
                ].map((row, i) => (
                  <tr key={row.feature} className={i < 4 ? 'border-b border-gray-100' : ''}>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.pdf}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.docx}</td>
                    <td className="px-4 py-2.5 text-center text-gray-700">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="systems" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Per-system tuning</h2>
          <p className="mb-5">Different ATS platforms have different quirks. You can usually identify which system a company uses by looking at the URL of the application page. Then tune accordingly.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Workday', url: 'myworkdayjobs.com', note: 'Most common for Fortune 500 HR. Strong modern parser. Handles PDF and DOCX equally well. Very strict about exact skill-string matches. Tip: include both the exact JD phrasing and common synonyms.' },
              { name: 'Greenhouse', url: 'greenhouse.io, boards.greenhouse.io', note: 'Standard in tech startups. Excellent parser. Often lets you paste plain text directly (useful for sanity-checking your content).' },
              { name: 'Lever', url: 'jobs.lever.co', note: 'Common in mid-size tech. Weights the skills section heavily. Ingests LinkedIn data automatically; ensure your profile and resume tell the same story.' },
              { name: 'iCIMS', url: 'icims.com', note: 'Used by large US enterprises. Older parser, more fragile. Avoid tables, avoid multi-column layouts, keep headings standard.' },
              { name: 'Taleo', url: 'taleo.net', note: 'Oldest of the major platforms. Still used by legacy banks and government. Sometimes prefers DOCX over PDF. Spell out every acronym on first use. Simple formatting wins.' },
              { name: 'SmartRecruiters', url: 'jobs.smartrecruiters.com', note: 'Growing presence in mid-market. Modern parser; handles both PDF and DOCX well. Skills section parsing is stronger than experience parsing.' },
            ].map((s) => (
              <div key={s.name} className="border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500 mb-2">URL pattern: {s.url}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="manual-test" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing your resume manually (no tool needed)</h2>
          <p className="mb-5">A 2-minute manual check that tells you almost everything an ATS will see.</p>
          <ol className="list-decimal pl-5 space-y-3">
            <li><strong>Open your PDF and select-all.</strong> If the entire page highlights as one block, you have an image-based PDF. Re-export with selectable text.</li>
            <li><strong>Copy, paste into Notepad or TextEdit.</strong> Whatever the ATS sees is now in front of you. Read it top to bottom.</li>
            <li><strong>Check the reading order.</strong> Do job titles sit with their correct employer? Or is your 2022 title showing under your 2019 employer? Multi-column layouts break here.</li>
            <li><strong>Look for missing content.</strong> If bullets or sections are missing from the Notepad version, they will be missing from the ATS record too.</li>
            <li><strong>Search for key terms.</strong> Use Ctrl+F on the Notepad version to find each skill listed in the JD. Missing ones need to be added or rephrased.</li>
          </ol>
          <p className="mt-5">
            This simple test catches 80% of parser-level problems. The remaining 20% (keyword density, ranking) is what our free 12-point ATS checker addresses.
          </p>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Does every company use an ATS?', a: '98% of Fortune 500 companies do. Roughly 70% of mid-size companies do. Very small businesses (under 50 employees) sometimes manage resumes via email. Assume yes unless the posting is from a small shop.' },
              { q: 'Will an ATS reject my resume for typos?', a: 'Not directly, but yes indirectly. A typo in "Python" becomes "Pthyon" and the ATS does not match it against the JD\'s "Python" requirement. Your keyword match rate drops and your rank falls.' },
              { q: 'Is PDF or DOCX better for ATS?', a: 'Both are excellent on modern parsers. Marginally, selectable-text PDF is safer because DOCX can reformat slightly between Word versions. Unless the posting explicitly asks for DOCX, use PDF.' },
              { q: 'How do I know if my resume passed the ATS?', a: 'You do not. ATS systems do not send rejection emails for low-ranked resumes; you just never hear back. Run a free ATS check before submitting, aim for 70%+ match, and follow up if silence lasts over 3 weeks.' },
              { q: 'Does the ATS read my LinkedIn profile?', a: 'Only when you apply via LinkedIn (Easy Apply) or the employer pays for LinkedIn Recruiter. In those cases, yes, and inconsistencies between LinkedIn and your resume flag your application.' },
              { q: 'Can I game the ATS with hidden white-text keywords?', a: 'Modern parsers flag this as spam and down-rank. Even when it slips through the parser, human reviewers spot it immediately in the candidate record. Stick to legitimate keyword integration.' },
              { q: 'How long does ATS screening take?', a: 'The parsing itself takes seconds. The actual ranking and recruiter review can take days to weeks depending on company size and hiring urgency.' },
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

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <h2 className="text-2xl font-bold text-white mb-3">Check your resume&apos;s ATS score</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">
            Upload your resume or build one from scratch. Our 12-point ATS checker shows exactly what to fix.
            Browse our <Link href="/templates" className="text-indigo-400 hover:underline">ATS-friendly templates</Link>{' '}
            or read our <Link href="/resume-tips" className="text-indigo-400 hover:underline">resume writing tips</Link>.
          </p>
          <button onClick={() => openGateway('/builder')} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">
            Check ATS Score Now
          </button>
        </section>
      </BlogPostLayout>
    </>
  );
}
