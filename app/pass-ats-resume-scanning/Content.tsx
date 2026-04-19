'use client';

import Link from 'next/link';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const TOC = [
  { id: 'intro', label: 'The 60-second answer' },
  { id: 'what-is-ats', label: 'What an ATS actually does' },
  { id: 'why-filtered', label: 'Why 75% of resumes get filtered' },
  { id: 'killers', label: 'The 7 ATS killers' },
  { id: 'tactics', label: '10 tactics that get past ATS' },
  { id: 'formats', label: 'PDF vs DOCX vs TXT' },
  { id: 'systems', label: 'The top 5 ATS systems in 2026' },
  { id: 'tools', label: 'Free tools to test your score' },
  { id: 'faq', label: 'Frequently asked questions' },
];

const RELATED = [
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: 'Deeper dive into parsing, keyword density, and per-system tuning.', read: 12 },
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role. Includes the weak-verb replacement table.', read: 9 },
  { title: 'How to Quantify Resume Achievements', slug: 'quantify-resume-achievements', excerpt: '50+ metric-driven bullets by role plus the XYZ formula.', read: 12 },
  { title: 'Best Resume Format 2026', slug: 'resume-format-guide', excerpt: 'Chronological vs functional vs hybrid, decided by your situation.', read: 10 },
  { title: 'How to Tailor Your Resume in 10 Minutes', slug: 'tailor-resume', excerpt: 'Minute-by-minute process that 3x\'s callback rate without starting over.', read: 10 },
];

export default function PassAtsContent() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="ATS & Keywords"
      breadcrumbCurrent="Pass ATS resume scanning"
      title="How to Pass ATS Resume Scanning in 2026: The Complete Guide"
      subtitle="98% of Fortune 500 companies use an applicant tracking system. 75% of resumes never reach a human. This is the practical playbook to be in the 25% that do."
      dateModified="2026-04-19"
      readingTime={11}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">The 60-second answer</p>
          <p className="text-gray-700">
            An applicant tracking system (ATS) is software that parses your resume into a database, scores it against the job description, and ranks it before a human sees it. To pass one: use a single-column layout with standard section headings, mirror 60 to 80 percent of the job description&apos;s hard skills word-for-word, submit as a selectable-text PDF (never a scanned image), avoid tables / text boxes / headers / footers, and spell out every acronym on first use. That is the whole game.
          </p>
        </div>
        <p>
          If your resume is landing nowhere despite good experience, the system that rejected you was almost certainly an ATS, not a recruiter. This guide walks through exactly how these systems work, the seven things that break them, the ten tactics that reliably get through, and the free tools to verify your resume before you hit submit.
        </p>
      </section>

      <section id="what-is-ats" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What an applicant tracking system actually does</h2>
        <p>
          An ATS is a database with a parser on the front end. When you submit a resume, the parser reads the file and tries to extract structured data: your name, contact info, employers, job titles, dates, schools, skills, and individual bullet points. That structured data is stored as a candidate record. The recruiter then searches or filters against that record using Boolean queries (for example, &quot;Python AND (PySpark OR Airflow) AND senior NOT intern&quot;) and ranks the results.
        </p>
        <p className="mt-4">
          The quality of your ranking depends on two things: whether the parser extracted your content cleanly, and whether the extracted content matched the recruiter&apos;s query. Break either one and you are invisible, no matter how strong your background is. A CV that took five years to earn can be filtered out by a table boundary the parser misread in three milliseconds.
        </p>
      </section>

      <section id="why-filtered" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why 75% of resumes get filtered out before a human reads them</h2>
        <p>
          The 75% figure is from Jobscan&apos;s 2024 benchmark against 1.2 million resumes. Three broad failure modes explain almost all rejections:
        </p>
        <ul className="space-y-3 mt-4">
          <li>
            <strong>Parsing failures (roughly 40%).</strong> The ATS could not extract your content correctly. Fancy two-column layouts, embedded icons, and text inside images all break parsers. The recruiter sees a half-empty candidate record and moves on.
          </li>
          <li>
            <strong>Keyword mismatch (roughly 45%).</strong> Your resume was parsed fine but does not contain the hard skills in the job description with enough density. If the JD lists &quot;Kubernetes&quot; eight times and your resume says &quot;container orchestration&quot; instead, you score low.
          </li>
          <li>
            <strong>Formatting rejections (roughly 15%).</strong> Some ATS platforms auto-reject resumes that fail structural checks: no email detected, no work history section, or file type the parser cannot read (such as a scanned image PDF).
          </li>
        </ul>
        <p className="mt-4">
          The good news: all three are fixable in under an hour once you know what to look for.
        </p>
      </section>

      <section id="killers" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">The 7 ATS killers you are probably doing</h2>
        <div className="grid gap-3">
          {[
            { n: '1', title: 'Multi-column layouts', body: 'Most parsers read top-to-bottom, left-to-right in a single pass. A two-column layout causes them to interleave your experience dates with your skills list. The resume looks beautiful to humans and gibberish to the ATS.' },
            { n: '2', title: 'Tables and text boxes', body: 'Tables are the number-one cause of parsing errors. Your job title ends up under a different employer. Text boxes can be ignored entirely. Replace both with plain heading + paragraph structure.' },
            { n: '3', title: 'Headers and footers', body: 'Many ATS parsers do not read the header/footer zones at all. Move your contact info into the body of the document, near the top, as normal text.' },
            { n: '4', title: 'Images, icons, and charts', body: 'Text inside an image is invisible to the parser. Even decorative icons can confuse column detection. The only image an ATS handles reliably is no image at all.' },
            { n: '5', title: 'Fancy fonts and small sizes', body: 'Stick to Calibri, Arial, Helvetica, Georgia, or Garamond at 10pt or higher. Scripts, ligatures, and condensed faces throw off character recognition on older parsers.' },
            { n: '6', title: 'Wrong file type', body: 'Save as a selectable-text PDF or a clean DOCX. Never submit a scanned image PDF, JPG, PNG, or a Pages / Keynote / InDesign export the ATS cannot read.' },
            { n: '7', title: 'Missing keywords', body: 'You can be perfectly formatted and still fail if you do not use the job description\'s exact words. The ATS matches strings, not meaning. Write "Python" not "scripting language"; write "Kubernetes" not "container orchestration".' },
          ].map((k) => (
            <div key={k.n} className="border border-gray-200 rounded-lg p-4 flex gap-4">
              <span className="shrink-0 h-8 w-8 rounded-full bg-red-100 text-red-700 text-sm font-bold flex items-center justify-center">{k.n}</span>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{k.title}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{k.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tactics" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">The 10 tactics that reliably get past ATS in 2026</h2>
        <ol className="space-y-4 list-none pl-0">
          {[
            { n: '1', title: 'Use a single-column layout', body: 'One column, top to bottom. This alone resolves 80% of parsing failures. All 20 ResumeBuildz templates are single-column by default.' },
            { n: '2', title: 'Use standard section headings', body: '"Experience", "Education", "Skills", "Projects", "Certifications". Avoid creative headings like "Where I\'ve Been" or "My Toolbox". Parsers are trained on the standard set.' },
            { n: '3', title: 'Mirror 60–80% of the JD\'s hard skills', body: 'Copy the exact phrasing for tools, frameworks, certifications, and methodologies. If the JD says "SCRUM", write "SCRUM" not "agile".' },
            { n: '4', title: 'Include both acronym and long form', body: '"AWS (Amazon Web Services)", "SaaS (Software-as-a-Service)", "CI/CD (Continuous Integration / Continuous Deployment)". Different JDs index different forms.' },
            { n: '5', title: 'Put skills in a dedicated section', body: 'ATS platforms have a skills slot in their schema. A dedicated Skills section feeds that slot directly. Burying skills inside prose makes them harder to index.' },
            { n: '6', title: 'Use dates in MM/YYYY format', body: 'May 2022 – Aug 2024, not "Summer 2022 to Fall 2024". Parsers extract dates better when they are numeric.' },
            { n: '7', title: 'Save as selectable-text PDF', body: 'Open the file and try to select a word. If text highlights normally, you are fine. If the whole page highlights as one block, it is an image PDF and the ATS sees nothing.' },
            { n: '8', title: 'Start bullets with action verbs', body: '"Led", "Built", "Shipped", "Reduced". Bullets starting with verbs parse into the achievement slot more reliably than "Responsibilities included..."' },
            { n: '9', title: 'Quantify at least 60% of bullets', body: 'Numbers do not just impress humans. Some ATS ranking algorithms weight bullets containing digits higher because they signal specificity.' },
            { n: '10', title: 'Keep file size under 1 MB', body: 'Larger files occasionally trigger upload limits or partial parses. A well-formatted text-based PDF should be 150 to 400 KB.' },
          ].map((t) => (
            <li key={t.n} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <span className="shrink-0 h-7 w-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">{t.n}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{t.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold mb-2">Run a free ATS scan on your resume in 30 seconds</h3>
          <p className="text-indigo-100 mb-4 text-sm">No sign-up. 12 checks. Fix suggestions inline.</p>
          <button onClick={() => openGateway('/builder')} className="bg-white text-indigo-700 hover:bg-gray-50 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors">
            Open the free ATS checker
          </button>
        </div>
      </section>

      <section id="formats" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ATS-friendly file formats: PDF vs DOCX vs plain text</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Format</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">ATS compatibility</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">Text-based PDF</td>
                <td className="p-3 text-emerald-700">Excellent (all modern ATS)</td>
                <td className="p-3 text-gray-700">Default choice in 2026. Preserves formatting, parses cleanly.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">DOCX (Word)</td>
                <td className="p-3 text-emerald-700">Excellent</td>
                <td className="p-3 text-gray-700">Required by some older ATS (pre-2018 Taleo). Slightly more reformatting risk.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">Plain text (TXT)</td>
                <td className="p-3 text-emerald-700">Perfect parsing</td>
                <td className="p-3 text-gray-700">Paste-into-form fields. No formatting so rarely needed as upload.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium">Scanned / image PDF</td>
                <td className="p-3 text-red-700">Fails</td>
                <td className="p-3 text-gray-700">Never use. ATS sees zero text. You will be auto-rejected.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Pages, InDesign, PSD</td>
                <td className="p-3 text-red-700">Fails</td>
                <td className="p-3 text-gray-700">Export to PDF or DOCX first.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5">
          Unless the job posting explicitly says otherwise, submit a text-based PDF. It is the safest bet across the ATS market in 2026.
        </p>
      </section>

      <section id="systems" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The top 5 ATS systems used by companies in 2026</h2>
        <p>
          Understanding which ATS a company uses can help you tune your resume for that system&apos;s quirks. You can often spot it from the URL of the job application page.
        </p>
        <div className="grid gap-4 mt-5 md:grid-cols-2">
          {[
            { name: 'Workday', users: 'Most Fortune 500 HR orgs', tell: 'URL contains "myworkdayjobs.com"', note: 'Strong parser. Handles PDFs and DOCX equally well. Cares about exact skill-string matches.' },
            { name: 'Greenhouse', users: 'Tech startups and scale-ups', tell: 'URL contains "greenhouse.io" or "boards.greenhouse.io"', note: 'Excellent parser. Often lets you paste plain text directly. Custom questions matter almost as much as resume.' },
            { name: 'Lever', users: 'Mid-size tech companies', tell: 'URL contains "jobs.lever.co"', note: 'Modern parser. Weights skills section heavily. Resume + LinkedIn auto-merge into the candidate record.' },
            { name: 'iCIMS', users: 'Large US enterprises', tell: 'URL contains "icims.com"', note: 'Older parser. Extra sensitive to tables, columns, and non-standard headings. Keep formatting minimal.' },
            { name: 'Taleo (Oracle)', users: 'Legacy enterprise (banks, govt)', tell: 'URL contains "taleo.net"', note: 'Oldest parser of the group. Sometimes prefers DOCX over PDF. Spell out every acronym.' },
          ].map((s) => (
            <div key={s.name} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-500 mb-2">{s.users}</p>
              <p className="text-xs text-gray-600 mb-2"><strong>How to spot it:</strong> {s.tell}</p>
              <p className="text-sm text-gray-700">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Free tools to test your resume&apos;s ATS score</h2>
        <ol className="space-y-4 list-decimal pl-5">
          <li>
            <strong>ResumeBuildz free ATS checker.</strong> 12 structural and keyword checks. No sign-up, no upload: paste your resume and paste the JD. Scores on a 100-point scale with exact fixes.{' '}
            <Link href="/builder" className="text-indigo-600 hover:underline">Open the checker →</Link>
          </li>
          <li>
            <strong>Jobscan.</strong> Paid after three free uses per month. Strong keyword matching, weaker on structural advice.
          </li>
          <li>
            <strong>Resume Worded.</strong> Free tier gives a score. Heavily up-sells on the paid coaching.
          </li>
          <li>
            <strong>Manual plain-text test.</strong> Open your PDF, select-all, copy, paste into Notepad. Whatever the ATS sees is now in Notepad. If sections are jumbled or text is missing, the ATS will have the same problem.
          </li>
        </ol>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Does ATS read PDF?', a: 'Yes, modern ATS systems read selectable-text PDFs reliably. Scanned image PDFs fail because the text is locked inside an image. To verify yours is text-based: open the file and try to highlight a word. If text highlights, you are safe.' },
            { q: 'How many keywords should I include?', a: 'Aim for 60 to 80 percent match on the hard skills and tools listed in the job description. Do not keyword-stuff. Each keyword should appear in context within a bullet point, not in a list you dumped at the bottom.' },
            { q: 'Can I use a resume template from Canva or Word?', a: 'Canva templates often use multi-column layouts and image-based text that break ATS parsers. Standard Word templates are safer. The safest option is an ATS-tested template from a resume builder that explicitly tests against ATS parsers.' },
            { q: 'Should I have different resumes for different jobs?', a: 'Yes. Tailor the skills section and your top three bullets to each job. A tailored resume gets roughly 3x more callbacks than a generic one sent to multiple postings.' },
            { q: 'Does LinkedIn Easy Apply skip the ATS?', a: 'No. Easy Apply feeds LinkedIn\'s extracted data directly into the company\'s ATS. Your LinkedIn profile is effectively your resume for those applications, so the same ATS rules apply.' },
            { q: 'What is a good ATS score?', a: 'Above 70/100 on most checkers puts you in the top 25 percent of applicants. Above 85 is elite. Aim for 80+ and move on. Diminishing returns kick in hard after that.' },
            { q: 'How do I know if a company uses an ATS?', a: 'Assume yes. 98 percent of Fortune 500 companies and around 70 percent of mid-size companies use an ATS. The URL of the application page often reveals which one (myworkdayjobs.com, greenhouse.io, lever.co, icims.com, taleo.net).' },
          ].map((item) => (
            <details key={item.q} className="border border-gray-200 rounded-lg group">
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
        <h2 className="text-2xl font-bold mb-3">Build an ATS-optimized resume for free</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          20 ATS-tested templates. Live 12-point ATS score. Free AI bullet rewrites. No sign-up required to start.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
