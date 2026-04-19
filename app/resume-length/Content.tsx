'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const TOC = [
  { id: 'intro', label: 'Quick answer' },
  { id: 'why', label: 'Why length matters' },
  { id: 'one-page', label: 'When 1 page is right' },
  { id: 'two-pages', label: 'When 2 pages is right' },
  { id: 'never', label: 'When never to go past 2' },
  { id: 'stage', label: 'By career stage' },
  { id: 'industry', label: 'By industry' },
  { id: 'cut', label: 'How to cut to 1 page' },
  { id: 'expand', label: 'How to expand to 2 pages' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'Best Resume Format 2026', slug: 'resume-format-guide', excerpt: 'Chronological vs functional vs hybrid, decided by your situation.', read: 10 },
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: 'The 7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '15 summary examples by career stage, 10 by industry.', read: 14 },
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role with weak-to-strong swaps and 10 bullet examples.', read: 9 },
  { title: 'How to Quantify Achievements', slug: 'quantify-resume-achievements', excerpt: 'The XYZ formula plus 50+ metric-driven bullets by role.', read: 12 },
];

export default function ResumeLengthPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Resume length"
      title="Resume Length in 2026: 1 Page vs 2 Pages (Definitive Guide)"
      subtitle="Recruiters spend about 6 seconds on first scan. Here is exactly how long your resume should be, by career stage and industry, with cutting and expanding tactics that preserve signal."
      dateModified="2026-04-19"
      readingTime={8}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Quick answer</p>
          <p className="text-gray-700">
            Less than 5 years of experience: <strong>1 page</strong>. 5 to 15 years: <strong>1 or 2 pages</strong> depending on density. 15+ years or senior-executive / academic / federal: <strong>2 pages</strong>, occasionally 3 for academic CVs. Never exceed 2 pages for a standard industry resume in 2026. If a recruiter has to flip past page 2, your top bullets were not strong enough.
          </p>
        </div>
        <p>
          Length is one of the most second-guessed resume decisions. The honest truth: recruiters care more about density than page count. A dense, high-signal 2-page resume reads faster than a padded 1-page one. The page-count rule exists because most resumes need forcing into shorter form, not because brevity is itself the goal.
        </p>
      </section>

      <section id="why" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The real reason length matters</h2>
        <p>
          Three separate forces push against long resumes. Understand each to decide when the tradeoff is worth it.
        </p>
        <div className="mt-5 space-y-4">
          <div className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Recruiter time</p>
            <p className="text-sm text-gray-700">
              A Ladders 2024 eye-tracking study clocked average first-scan time at 6 to 7 seconds. Page 2 is rarely reached during that scan. If your best material is on page 2, it is effectively invisible in the first pass.
            </p>
          </div>
          <div className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">ATS truncation</p>
            <p className="text-sm text-gray-700">
              Some older ATS platforms (particularly Taleo deployments pre-2020) truncate candidate profiles at a character limit during parsing. Content on page 3 may never make it into the candidate record at all.
            </p>
          </div>
          <div className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Signal density</p>
            <p className="text-sm text-gray-700">
              The longer the resume, the more filler appears. Reviewers notice. A dense 2-page resume is trusted more than a bloated 3-page one even if total useful content is identical. Curation is itself a signal.
            </p>
          </div>
        </div>
      </section>

      <section id="one-page" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When 1 page is right</h2>
        <ul className="space-y-3">
          {[
            { h: 'Less than 5 years of full-time experience.', b: 'Recent grads, early-career professionals, and mid-career people with one short career. No need for more; there is not enough substantive content to fill page 2 without padding.' },
            { h: 'Applying for entry-level or junior roles.', b: 'Hiring managers for these roles explicitly prefer 1 page. They are filtering on basics (GPA, internships, projects, skills) and a longer resume signals weaker prioritisation.' },
            { h: 'Career changer with limited relevant experience.', b: 'If most of your past roles do not apply to the new field, compress them to 1 line each and spend the page on transferable skills, projects, and relevant training.' },
            { h: 'Applying at a top-tier consulting or IB firm (fresher/analyst).', b: 'McKinsey, BCG, Bain, Goldman expect 1 page at the analyst level. Always. Deviating signals misread of their culture.' },
            { h: 'Freelance / gig economy worker with many short engagements.', b: 'Group similar clients under a "Selected Clients" line rather than listing each. 1 page forces this discipline.' },
          ].map((item) => (
            <li key={item.h} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{item.h}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.b}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="two-pages" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When 2 pages is right</h2>
        <ul className="space-y-3">
          {[
            { h: '5+ years of relevant experience.', b: 'Enough substantive material exists. Forcing it onto 1 page requires cutting bullets that signal important capabilities. 2 pages, well-curated, is more persuasive.' },
            { h: 'Senior engineering, product, or design roles.', b: 'Interview panels at Staff level and above expect to see system design impact, mentorship, cross-functional leadership. 1 page cannot fit all three while preserving metrics.' },
            { h: 'Strong mix of recent experience + projects/publications.', b: 'If you have 3-4 experience entries with measurable impact AND substantive open-source or publication work, both deserve space. Do not choose one.' },
            { h: 'Manager / director roles with team and P&L scope.', b: 'You need to show people managed, budget managed, strategic initiatives owned. That context needs room to breathe.' },
            { h: 'Deep technical specialists (research, security, ML).', b: 'When certifications, tool stacks, and publications all matter to hiring managers, try to trim and fail. Go to 2 pages. Trying to fit it all into 1 comes across as under-qualified.' },
          ].map((item) => (
            <li key={item.h} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{item.h}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.b}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="never" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When you should never go past 2 pages</h2>
        <p>
          Almost every industry resume. The exceptions are narrow and specific:
        </p>
        <ul className="space-y-2 mt-4 list-disc pl-6">
          <li><strong>Academic CVs</strong>: 3 to 8 pages standard. Publications, grants, courses taught, and conference presentations all listed.</li>
          <li><strong>US Federal resumes</strong>: 3 to 5 pages, required by USAJobs applications. Follow the Federal Resume Guide format.</li>
          <li><strong>Executive biographical documents</strong>: CEO / CFO / board-director materials sometimes run 3+ pages. These are not resumes; they are separate biographical artefacts.</li>
          <li><strong>Medical / scientific CVs</strong>: 4 to 10 pages with comprehensive publication lists for residency and research applications.</li>
        </ul>
        <p className="mt-5">
          For everything else, if you are tempted to go to page 3, the problem is not length. The problem is that you have not decided what is essential yet.
        </p>
      </section>

      <section id="stage" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended length by career stage</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Stage</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Years of experience</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Recommended pages</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Student / Fresher</td><td className="p-3">0 to 1</td><td className="p-3 text-indigo-700 font-semibold">1 page</td><td className="p-3 text-gray-700">Not enough substantive work yet.</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Early career</td><td className="p-3">1 to 4</td><td className="p-3 text-indigo-700 font-semibold">1 page</td><td className="p-3 text-gray-700">Curation proves discipline.</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Mid-level</td><td className="p-3">5 to 9</td><td className="p-3 text-indigo-700 font-semibold">1 or 2 pages</td><td className="p-3 text-gray-700">Fit decides. If dense and sharp, 1 is fine. If substantive, 2.</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Senior IC</td><td className="p-3">10 to 15</td><td className="p-3 text-indigo-700 font-semibold">2 pages</td><td className="p-3 text-gray-700">Scope and depth need room.</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Director / VP</td><td className="p-3">15+</td><td className="p-3 text-indigo-700 font-semibold">2 pages</td><td className="p-3 text-gray-700">Leadership context; still curated.</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">C-suite / executive</td><td className="p-3">20+</td><td className="p-3 text-indigo-700 font-semibold">2 pages + bio</td><td className="p-3 text-gray-700">Resume stays at 2 pages. Longer bio is a separate doc.</td></tr>
              <tr><td className="p-3 font-medium">Academic</td><td className="p-3">Any</td><td className="p-3 text-amber-700 font-semibold">3 to 8 pages (CV)</td><td className="p-3 text-gray-700">Different document norms apply.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="industry" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Length conventions by industry</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { industry: 'Tech / Software', rec: '1 page under 5yrs, 2 pages above', note: 'Google, Meta, Amazon review 2-page resumes above SDE II / L5. FAANG accepts 2 for senior.' },
            { industry: 'Management consulting', rec: '1 page always (analyst/assoc)', note: 'McKinsey, BCG, Bain explicitly ask for 1. Partner-level leaves resume behind entirely.' },
            { industry: 'Investment banking', rec: '1 page at analyst, 2 at VP+', note: 'Goldman, Morgan Stanley, JPMC expect 1 page through associate. MD-level has different norms.' },
            { industry: 'Finance / accounting', rec: '1 page under 5yrs, 2 above', note: 'Similar to tech. CPA/CFA gets its own prominent section.' },
            { industry: 'Academia / research', rec: '3 to 8+ pages (CV)', note: 'Publications, grants, teaching, conferences all listed. No length cap.' },
            { industry: 'Government / federal', rec: '3 to 5 pages (US federal)', note: 'USAJobs format. Include supervisor contact and hours/week per role.' },
            { industry: 'Healthcare / medical', rec: '2 pages clinical, 4+ research', note: 'Licenses + rotations + publications expand CV length.' },
            { industry: 'Creative / design / marketing', rec: '1 page + portfolio link', note: 'Portfolio does the heavy lifting. Resume is a sidebar.' },
          ].map((row) => (
            <div key={row.industry} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{row.industry}</p>
              <p className="text-sm text-indigo-700 font-medium mb-2">{row.rec}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cut" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to cut a 2-page resume to 1 page (8 tactics)</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Drop roles older than 10 years.</strong> Replace with a single &quot;Earlier experience&quot; line listing employer names.</li>
          <li><strong>Compress each bullet to one line.</strong> Two-line bullets almost always have a connective phrase that can be deleted.</li>
          <li><strong>Limit each role to 3 to 4 bullets.</strong> Pick the ones with the strongest measurable outcome.</li>
          <li><strong>Move education to one line.</strong> Degree, institution, year. Cut GPA if above 5 years experience or below 7.5 CGPA.</li>
          <li><strong>Cut the Interests section.</strong> If you have anything above entry-level experience, nobody cares about your hobbies unless they directly relate to the role.</li>
          <li><strong>Delete the Objective statement.</strong> Replace with a 2-line Summary or cut entirely. Modern resumes rarely need an Objective.</li>
          <li><strong>Tighten margins and leading.</strong> 0.5 to 0.75 inch margins, 1.1 line-height. Do not go smaller than 10pt font.</li>
          <li><strong>Remove full addresses and duplicate emails.</strong> City + state + one email + LinkedIn is enough.</li>
        </ol>
      </section>

      <section id="expand" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to expand a 1-page resume to 2 pages (without padding)</h2>
        <p>
          The goal is never to pad. If you are stretching, stay on 1 page. But if you have material that genuinely belongs and did not fit, use these expansion moves:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          <li><strong>Add a Projects section.</strong> 2 to 4 substantial projects with stacks, outcomes, and live links.</li>
          <li><strong>Add a Publications or Talks section.</strong> Conference talks, blog posts with real readership, papers.</li>
          <li><strong>Add Certifications + Training.</strong> Standalone section with issue dates and credential URLs.</li>
          <li><strong>Add Volunteer / Community Work.</strong> If genuinely relevant (open-source maintainer, Toastmasters, tech mentor program).</li>
          <li><strong>Expand bullets from 3 to 5 per role.</strong> Only for the most recent 2 to 3 roles.</li>
          <li><strong>Add a Leadership section.</strong> For senior candidates: team sizes, direct reports, hiring decisions, budget scope.</li>
        </ol>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Can a resume be 1.5 pages?', a: 'No. Either fill page 2 to at least 60 percent or cut to 1 page. A half-empty page 2 looks sloppy and signals the writer could not commit.' },
            { q: 'Does resume length matter for ATS?', a: 'ATS parsers do not care about page count directly. They care about whether they can extract your content. A 1-page resume is no better or worse than 2 pages for parsing. What matters is structure and keyword density.' },
            { q: 'Should I have different-length resumes for different jobs?', a: 'Usually not. Keep one canonical version, tailor the skills section and summary. Only vary length across wildly different roles (e.g. a 1-page consulting version + a 2-page engineering version).' },
            { q: 'Does 2 pages mean I need to print double-sided?', a: 'No. Submit as a single PDF with 2 pages. Printing is almost never expected in 2026. If asked to print, single-sided is safer.' },
            { q: 'What resume length do recruiters actually prefer?', a: 'A 2018 survey of 1,000 recruiters (CareerBuilder) found 38% prefer 1 page, 34% prefer 2, and 28% said "depends on experience". The split tracks with what the candidate brings. Use the career-stage table above.' },
            { q: 'Can my resume be shorter than 1 page?', a: 'Only for very early fresher resumes. Half a page reads as "not enough to say". If you cannot fill a page, add a Projects or Volunteer section with real content.' },
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
        <h2 className="text-2xl font-bold mb-3">See your live page count as you type</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          ResumeBuildz shows the live page count and a dense-vs-padded indicator so you always know where you stand. Free to start.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
