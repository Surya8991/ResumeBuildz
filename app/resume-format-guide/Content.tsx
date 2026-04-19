'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const TOC = [
  { id: 'intro', label: '3 formats explained' },
  { id: 'chrono', label: 'Reverse-chronological' },
  { id: 'functional', label: 'Functional / skills-based' },
  { id: 'hybrid', label: 'Hybrid / combination' },
  { id: 'compare', label: 'Side-by-side comparison' },
  { id: 'ats', label: 'Which format is best for ATS' },
  { id: 'decision', label: 'Choosing by your situation' },
  { id: 'fails', label: 'Where each format falls apart' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: 'The 7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'Resume Length 2026', slug: 'resume-length', excerpt: '1 page vs 2 pages, by stage + industry.', read: 8 },
  { title: 'Resume for Career Change', slug: 'resume-for-career-change', excerpt: 'Transferable-skills framing and 6 pivot examples.', read: 11 },
  { title: 'Resume After Career Gap', slug: 'resume-after-career-gap', excerpt: 'Honest gap framing without apologetic tone.', read: 10 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples by stage and industry.', read: 14 },
];

export default function ResumeFormatPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Best resume format"
      title="Best Resume Format in 2026: Chronological vs Functional vs Hybrid"
      subtitle="A direct comparison of the 3 formats, decided by your situation. Includes the ATS-compatibility truth that competitor articles avoid: functional resumes fail most ATS parsers."
      dateModified="2026-04-19"
      readingTime={10}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">The 3 formats in one breath</p>
          <p className="text-gray-700">
            <strong>Reverse-chronological</strong>: jobs listed newest to oldest. The default for almost everyone. Easiest for ATS to parse, easiest for recruiters to scan.<br/>
            <strong>Functional / skills-based</strong>: skills grouped at the top, employment history minimised. Looks good for people hiding gaps, but breaks most ATS parsers. Avoid.<br/>
            <strong>Hybrid / combination</strong>: skills summary at the top, then reverse-chronological work history. The best choice for career changers and returners.
          </p>
        </div>
        <p>
          Three formats exist; one is correct for roughly 85% of job seekers. This guide explains when to pick each, why &quot;functional resumes&quot; are a minefield in 2026, and how to build a hybrid that signals a pivot without hiding your work history.
        </p>
      </section>

      <section id="chrono" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Format 1: Reverse-Chronological (the default)</h2>
        <p>
          Your most recent job is at the top. Each role shows title, company, dates, and 3 to 5 bullets. Work backward through time. Below that: Education, Skills, and any supplementary sections.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-semibold text-emerald-900 mb-2">Pros</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>ATS parses it cleanly; most parsers are trained on this structure</li>
              <li>Recruiters scan it in 6 seconds because they know where to look</li>
              <li>Shows career progression naturally</li>
              <li>Works for 85% of job seekers</li>
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="font-semibold text-rose-900 mb-2">Cons</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Highlights employment gaps</li>
              <li>Makes career changes look like lateral moves</li>
              <li>Older roles get the same structural weight as recent ones</li>
            </ul>
          </div>
        </div>
        <p className="mt-5">
          <strong>Best for:</strong> anyone with a continuous career in one field. Early-career through executive. Default choice unless you have a specific reason to pick another.
        </p>
      </section>

      <section id="functional" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Format 2: Functional / Skills-Based (use with caution)</h2>
        <p>
          Skills grouped into categories (Leadership, Analysis, Communication, Technical) take the top half of the resume. Employment history is relegated to a single line per role at the bottom, often without bullet points.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-5 mt-5">
          <p className="font-semibold text-amber-900 mb-2">Why ATS struggles with functional resumes</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            ATS parsers rely on the &quot;company + title + dates + bullets&quot; pattern to map your achievements to roles. Functional format breaks that mapping. The parser cannot tell which employer gave you which skill, so the candidate record ends up with orphaned achievement bullets. Some older ATS platforms (iCIMS, legacy Taleo) auto-reject or low-rank resumes without a proper Experience section.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-semibold text-emerald-900 mb-2">Pros</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Hides employment gaps</li>
              <li>De-emphasises a non-linear path</li>
              <li>Groups transferable skills together</li>
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="font-semibold text-rose-900 mb-2">Cons</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Breaks most ATS parsers</li>
              <li>Recruiters distrust it; they assume you are hiding something</li>
              <li>Hard to verify claims against specific employment</li>
              <li>Blocked by some company application portals</li>
            </ul>
          </div>
        </div>
        <p className="mt-5">
          <strong>Best for:</strong> almost nobody in 2026. If you are tempted by functional, use <strong>hybrid</strong> instead. You get the skills summary at the top without losing the employer-level bullets that ATS and recruiters expect.
        </p>
      </section>

      <section id="hybrid" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Format 3: Hybrid / Combination (best of both)</h2>
        <p>
          Starts with a skills-oriented summary (2 to 4 key specialties with supporting evidence), then moves into reverse-chronological work history with full bullets per role. Essentially a chronological resume with a beefier top section.
        </p>
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-5 font-mono text-sm">
          <p className="font-semibold mb-3 not-italic">Typical hybrid structure:</p>
          <ol className="space-y-1.5 list-decimal pl-5">
            <li>Contact info</li>
            <li>Professional summary (3 to 4 sentences)</li>
            <li><strong>Core competencies / skills highlight</strong> (3 to 5 category groups, one line each)</li>
            <li>Experience (reverse-chronological, full bullets)</li>
            <li>Education</li>
            <li>Certifications + supplementary sections</li>
          </ol>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-semibold text-emerald-900 mb-2">Pros</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>ATS-friendly (preserves the company/title/dates structure)</li>
              <li>Surfaces key transferable skills without hiding history</li>
              <li>Signals a career pivot cleanly</li>
              <li>Works at any career stage</li>
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="font-semibold text-rose-900 mb-2">Cons</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Harder to fit on 1 page; may need to cut bullets</li>
              <li>Easy to overdo the skills summary (keep it under 10 lines)</li>
            </ul>
          </div>
        </div>
        <p className="mt-5">
          <strong>Best for:</strong> career changers, returners from a break, people with non-linear paths, candidates whose title does not reflect their breadth, senior ICs pivoting into management.
        </p>
      </section>

      <section id="compare" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Side-by-side comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Criteria</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Chronological</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Functional</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Hybrid</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">ATS compatibility</td><td className="p-3 text-emerald-700">Excellent</td><td className="p-3 text-red-700">Poor</td><td className="p-3 text-emerald-700">Excellent</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Recruiter preference</td><td className="p-3 text-emerald-700">Strong</td><td className="p-3 text-red-700">Distrusted</td><td className="p-3 text-emerald-700">Strong</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Hides gaps</td><td className="p-3 text-red-700">No</td><td className="p-3 text-emerald-700">Yes</td><td className="p-3 text-amber-700">Partially</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Signals career pivot</td><td className="p-3 text-red-700">Poorly</td><td className="p-3 text-amber-700">Yes (but risky)</td><td className="p-3 text-emerald-700">Cleanly</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Works for freshers</td><td className="p-3 text-emerald-700">Yes</td><td className="p-3 text-amber-700">With projects</td><td className="p-3 text-emerald-700">Yes</td></tr>
              <tr className="border-b border-gray-100"><td className="p-3 font-medium">Works for executives</td><td className="p-3 text-emerald-700">Yes</td><td className="p-3 text-red-700">Looks evasive</td><td className="p-3 text-emerald-700">Yes</td></tr>
              <tr><td className="p-3 font-medium">Ease of writing</td><td className="p-3 text-emerald-700">Easy</td><td className="p-3 text-amber-700">Hard to do well</td><td className="p-3 text-amber-700">Medium</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="ats" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Which format is best for ATS in 2026?</h2>
        <p>
          <strong>Reverse-chronological is the ATS-safest format.</strong> Hybrid is an equally safe second. Functional is structurally risky: the lack of a clean company/title/dates section causes parsing failures on roughly 30% of large-enterprise ATS deployments.
        </p>
        <p className="mt-4">
          If you need the benefits of functional (highlighting transferable skills, de-emphasising a gap), use a hybrid. You keep the ATS-friendly Experience section while still bringing the skills summary to the top. Real-world testing across Workday, Greenhouse, Lever, iCIMS, and Taleo shows hybrid resumes score within 2 to 4 percentage points of pure chronological on the same content. Functional resumes score 15 to 40 points lower because entire sections go unparsed.
        </p>
      </section>

      <section id="decision" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing by your situation (decision tree)</h2>
        <div className="space-y-4">
          {[
            { q: 'Continuous career in one field, each role builds on the last?', a: 'Use reverse-chronological.', fmt: 'chrono' },
            { q: 'Fresher with no full-time jobs yet?', a: 'Use reverse-chronological. List internships, projects, and campus work. Functional looks weak here.', fmt: 'chrono' },
            { q: 'Changing careers into a new field where past titles do not map?', a: 'Use hybrid. Lead with transferable skills, then show full history so recruiters can verify experience.', fmt: 'hybrid' },
            { q: 'Returning from a 1+ year break?', a: 'Use hybrid. Own the break; the skills summary keeps focus on what you bring.', fmt: 'hybrid' },
            { q: 'Many short-term contract / freelance roles?', a: 'Use hybrid. Group short engagements under a "Selected Clients" line; keep full bullets for longer roles.', fmt: 'hybrid' },
            { q: 'Executive with a clear promotion track?', a: 'Reverse-chronological. Scale and progression is the story.', fmt: 'chrono' },
            { q: 'Academic applying to industry?', a: 'Hybrid. Translate research methods + publications into transferable skills at the top.', fmt: 'hybrid' },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{item.q}</p>
              <p className="text-sm text-gray-700">{item.a}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${item.fmt === 'chrono' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}>
                Go with: {item.fmt === 'chrono' ? 'Reverse-chronological' : 'Hybrid'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="fails" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Where each format falls apart</h2>
        <ul className="space-y-3">
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Chronological fails when...</p>
            <p className="text-sm text-gray-700">You have multiple gaps, several short roles, or an employer stretch that does not match your target role. Raw reverse-chronological without a summary amplifies the discontinuities.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Functional fails when...</p>
            <p className="text-sm text-gray-700">The employer requires electronic submission via any major ATS. Your skills never bind to a specific role, so the record is orphaned. Also fails in recruiter review: the resume reads as evasive by default.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Hybrid fails when...</p>
            <p className="text-sm text-gray-700">The skills summary section expands to half the page. Recruiters skim past it and lose patience before reaching Experience. Keep the skills highlight to 3 to 6 lines maximum.</p>
          </li>
        </ul>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is the functional resume really dead?', a: 'Essentially yes, for most job seekers. It still has niche uses (very short targeted proposals for freelance gigs) but for any corporate application flow in 2026, use chronological or hybrid.' },
            { q: 'Can I use different formats for different applications?', a: 'Yes, within reason. Keep a chronological master copy and produce a hybrid for career-change applications. Do not produce a functional version.' },
            { q: 'Does the format affect the page length?', a: 'Hybrid tends to run slightly longer because of the skills summary block. If you are tight on space, cut older bullets, not the summary.' },
            { q: 'Should the skills summary be bullet points or prose?', a: 'Short category + 1-line evidence per category. Not full bullets (too dense), not prose (too loose). Think of it as a highly-scannable block.' },
            { q: 'What resume format do FAANG companies prefer?', a: 'Chronological at SDE-I to SDE-II levels. Hybrid is acceptable at Staff+ for candidates with unusual breadth. Functional is never appropriate at FAANG.' },
            { q: 'Does the format matter for LinkedIn Easy Apply?', a: 'Your LinkedIn profile is effectively chronological by construction. The resume you attach should match that structure to avoid mismatches in the candidate record.' },
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
        <h2 className="text-2xl font-bold mb-3">Try all 3 formats free in ResumeBuildz</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          20 ATS-tested templates across chronological and hybrid. Switch between them without re-typing. Live ATS score as you go.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
