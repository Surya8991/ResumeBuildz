'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

type VerbGroup = { category: string; accent: string; verbs: string[] };

const VERB_GROUPS: VerbGroup[] = [
  {
    category: 'Leadership',
    accent: 'from-blue-500 to-indigo-600',
    verbs: ['Led', 'Directed', 'Managed', 'Oversaw', 'Coordinated', 'Mentored', 'Supervised', 'Spearheaded', 'Championed', 'Orchestrated', 'Guided', 'Inspired', 'Motivated', 'Trained', 'Coached', 'Delegated', 'Empowered', 'Headed', 'Presided', 'Chaired', 'Established', 'Pioneered', 'Fostered', 'Cultivated', 'Recruited', 'Hired', 'Onboarded', 'Developed', 'Championed', 'Shepherded'],
  },
  {
    category: 'Communication',
    accent: 'from-emerald-500 to-teal-600',
    verbs: ['Presented', 'Authored', 'Collaborated', 'Facilitated', 'Negotiated', 'Persuaded', 'Articulated', 'Briefed', 'Advocated', 'Consulted', 'Conveyed', 'Explained', 'Clarified', 'Demonstrated', 'Translated', 'Interpreted', 'Addressed', 'Informed', 'Conveyed', 'Documented', 'Reported', 'Published', 'Edited', 'Drafted', 'Composed', 'Outlined', 'Summarised', 'Moderated', 'Mediated', 'Lectured'],
  },
  {
    category: 'Achievement',
    accent: 'from-amber-500 to-orange-600',
    verbs: ['Achieved', 'Exceeded', 'Delivered', 'Improved', 'Increased', 'Reduced', 'Generated', 'Transformed', 'Accelerated', 'Maximised', 'Surpassed', 'Attained', 'Completed', 'Secured', 'Won', 'Captured', 'Doubled', 'Tripled', 'Boosted', 'Amplified', 'Enhanced', 'Strengthened', 'Propelled', 'Advanced', 'Progressed', 'Outperformed', 'Elevated', 'Surged', 'Grew', 'Expanded'],
  },
  {
    category: 'Technical / Engineering',
    accent: 'from-purple-500 to-pink-600',
    verbs: ['Developed', 'Engineered', 'Implemented', 'Architected', 'Automated', 'Debugged', 'Configured', 'Deployed', 'Integrated', 'Optimised', 'Built', 'Designed', 'Programmed', 'Coded', 'Refactored', 'Migrated', 'Patched', 'Provisioned', 'Scaled', 'Containerised', 'Orchestrated', 'Instrumented', 'Benchmarked', 'Profiled', 'Tested', 'Validated', 'Verified', 'Hardened', 'Secured', 'Versioned'],
  },
  {
    category: 'Sales / Marketing',
    accent: 'from-rose-500 to-red-600',
    verbs: ['Sold', 'Closed', 'Pitched', 'Prospected', 'Converted', 'Marketed', 'Promoted', 'Launched', 'Campaigned', 'Branded', 'Positioned', 'Targeted', 'Acquired', 'Retained', 'Nurtured', 'Upsold', 'Cross-sold', 'Demonstrated', 'Negotiated', 'Forecasted', 'Segmented', 'Advertised', 'Publicised', 'Attributed', 'Analysed', 'Tested', 'Optimised', 'Drove', 'Generated', 'Cultivated'],
  },
  {
    category: 'Customer-facing',
    accent: 'from-cyan-500 to-blue-600',
    verbs: ['Assisted', 'Resolved', 'Answered', 'Handled', 'Served', 'Supported', 'Advised', 'Counselled', 'Guided', 'Recommended', 'Educated', 'Informed', 'Trained', 'Onboarded', 'Followed up', 'Retained', 'Satisfied', 'Delighted', 'Escalated', 'De-escalated', 'Diagnosed', 'Troubleshot', 'Mediated', 'Listened', 'Empathised', 'Clarified', 'Documented', 'Logged', 'Triaged', 'Prioritised'],
  },
  {
    category: 'Analysis / Research',
    accent: 'from-violet-500 to-purple-600',
    verbs: ['Analysed', 'Researched', 'Investigated', 'Examined', 'Evaluated', 'Assessed', 'Audited', 'Surveyed', 'Studied', 'Explored', 'Identified', 'Measured', 'Quantified', 'Modelled', 'Forecasted', 'Benchmarked', 'Compared', 'Correlated', 'Hypothesised', 'Interpreted', 'Synthesised', 'Mapped', 'Classified', 'Segmented', 'Validated', 'Tested', 'Concluded', 'Discovered', 'Uncovered', 'Detected'],
  },
];

const WEAK_TO_STRONG = [
  { weak: 'Responsible for', strong: 'Led', example: 'Led cross-functional team of 8 through 6-month migration.' },
  { weak: 'Worked on', strong: 'Built', example: 'Built real-time pricing engine handling 22k req/sec.' },
  { weak: 'Helped with', strong: 'Partnered with', example: 'Partnered with product to ship onboarding v3 in 4 sprints.' },
  { weak: 'Assisted in', strong: 'Contributed to', example: 'Contributed 8 PRs to the shared design system rollout.' },
  { weak: 'Tasked with', strong: 'Owned', example: 'Owned Q3 billing migration across 14 customer segments.' },
  { weak: 'Involved in', strong: 'Drove', example: 'Drove 40% reduction in CI pipeline runtime.' },
  { weak: 'Duties included', strong: 'Managed', example: 'Managed vendor relationships across 6 SaaS contracts.' },
  { weak: 'Handled', strong: 'Orchestrated', example: 'Orchestrated incident response for 3 SEV1s, MTTR 28 min.' },
  { weak: 'Did', strong: 'Executed', example: 'Executed A/B test across 120k users; lifted CVR 4.2 pp.' },
  { weak: 'Made', strong: 'Engineered', example: 'Engineered caching layer cutting DB load 71%.' },
];

const TOC = [
  { id: 'intro', label: 'Why action verbs matter' },
  { id: 'anatomy', label: 'Anatomy of a bullet point' },
  { id: 'leadership', label: 'Leadership verbs' },
  { id: 'communication', label: 'Communication verbs' },
  { id: 'achievement', label: 'Achievement verbs' },
  { id: 'technical', label: 'Technical verbs' },
  { id: 'sales', label: 'Sales & marketing verbs' },
  { id: 'customer', label: 'Customer-facing verbs' },
  { id: 'analysis', label: 'Analysis & research verbs' },
  { id: 'weak', label: 'Weak to strong swaps' },
  { id: 'examples', label: '10 bullet examples' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'How to Quantify Resume Achievements', slug: 'quantify-resume-achievements', excerpt: 'The XYZ formula plus 50+ metric-driven bullets by role.', read: 12 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '15 summary examples by career stage, 10 by industry.', read: 14 },
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: 'The 7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'Resume Writing Tips', slug: 'resume-tips', excerpt: 'The 8 practical tips recruiters wish more candidates followed.', read: 9 },
  { title: 'Resume Length 2026', slug: 'resume-length', excerpt: '1 page vs 2 pages, decided by your career stage and industry.', read: 8 },
];

export default function ResumeActionVerbsPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Resume action verbs"
      title="200+ Resume Action Verbs by Category (with Examples)"
      subtitle="Grouped by role so you find the right verb in seconds. Includes the weak-verb replacement table and 10 bullets that show these verbs doing real work."
      dateModified="2026-04-19"
      readingTime={9}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Why action verbs matter</p>
          <p className="text-gray-700">
            Recruiters spend about 6 seconds on the first scan (Ladders 2024 eye-tracking study). A strong verb at the start of every bullet tells them what you did before they finish reading. Weak openers like &quot;Responsible for&quot; or &quot;Worked on&quot; bury your actual contribution behind filler and force the reader to re-read. The fix is mechanical: pick one verb per bullet from the right category, put it at position 1, delete the filler.
          </p>
        </div>
        <p>
          This guide gives you 210 verbs organised into seven role-based categories, plus a weak-to-strong replacement table and ten before/after bullet examples. Skim to your category, pick three verbs you have not used, swap them into your top bullets, and keep moving.
        </p>
      </section>

      <section id="anatomy" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The anatomy of a resume bullet point</h2>
        <p>
          Every strong bullet follows a simple three-part structure. The action verb opens, the action explains what was done, and the measurable result closes. Miss any part and the bullet loses force.
        </p>
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="font-mono text-sm text-gray-800">
            <span className="bg-indigo-200 px-1.5 rounded">Verb</span> +{' '}
            <span className="bg-emerald-200 px-1.5 rounded">Action / scope</span> +{' '}
            <span className="bg-amber-200 px-1.5 rounded">Measurable result</span>
          </p>
          <p className="mt-4 text-gray-700">
            <span className="bg-indigo-200 px-1.5 rounded">Reduced</span>{' '}
            <span className="bg-emerald-200 px-1.5 rounded">API p95 latency by introducing Redis caching and connection pooling</span>,{' '}
            <span className="bg-amber-200 px-1.5 rounded">serving 4M requests/day with 75% cost reduction.</span>
          </p>
        </div>
        <p className="mt-5">
          The verb you choose sets the ceiling. &quot;Helped&quot; caps your impact at coordination. &quot;Built&quot; implies ownership. &quot;Led&quot; implies ownership plus people. Pick the strongest verb that remains true.
        </p>
      </section>

      {VERB_GROUPS.map((group, idx) => {
        const ids = ['leadership', 'communication', 'achievement', 'technical', 'sales', 'customer', 'analysis'];
        return (
          <section key={group.category} id={ids[idx]} className="mt-12 scroll-mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Action verbs for {group.category.toLowerCase()}</h2>
            <p className="text-gray-700 mb-5 text-[15px]">
              {group.verbs.length} verbs for {group.category.toLowerCase()} roles. Mix and match so no two bullets in the same role open the same way.
            </p>
            <div className={`bg-gradient-to-br ${group.accent} rounded-xl p-6`}>
              <div className="flex flex-wrap gap-2">
                {group.verbs.map((v) => (
                  <span key={v} className="px-3 py-1.5 bg-white/95 text-gray-900 rounded-full text-sm font-medium shadow-sm">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section id="weak" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Weak verbs to avoid (and what to use instead)</h2>
        <p className="mb-5">
          These ten phrases account for most weak bullets in early-career resumes. Swap them using the replacements below and your bullets become 40-60 percent shorter without losing substance.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-red-700 border-b border-gray-200">Weak</th>
                <th className="text-left p-3 font-semibold text-emerald-700 border-b border-gray-200">Strong</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Example</th>
              </tr>
            </thead>
            <tbody>
              {WEAK_TO_STRONG.map((row) => (
                <tr key={row.weak} className="border-b border-gray-100">
                  <td className="p-3 text-red-700 font-medium line-through">{row.weak}</td>
                  <td className="p-3 text-emerald-700 font-semibold">{row.strong}</td>
                  <td className="p-3 text-gray-700 italic">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="examples" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10 bullet point examples using these verbs</h2>
        <p className="mb-5">
          Each of the following pulls from a different verb category. Notice how every bullet opens with a verb, names the action with specificity, and closes with a measurable result.
        </p>
        <ol className="space-y-3">
          {[
            { role: 'Senior Engineer', bullet: 'Architected event-driven pipeline replacing nightly batch; data freshness improved from 24h to 90 seconds across 8 dashboards.' },
            { role: 'Product Manager', bullet: 'Shipped unified checkout across 3 products; cart abandonment down 23%, incremental revenue Rs 47 Cr annually.' },
            { role: 'Data Scientist', bullet: 'Trained XGBoost churn model at 0.89 AUC; rollout lifted retention 4.2 pp, recovering Rs 3.8 Cr ARR in 6 months.' },
            { role: 'Marketing Manager', bullet: 'Scaled paid acquisition from Rs 8L/mo to Rs 42L/mo while holding ROAS at 4.8x; contributed Rs 2.4 Cr pipeline.' },
            { role: 'Sales Lead', bullet: 'Closed 18 enterprise deals at Rs 62L ACV average in 9 months; exceeded quota by 140% two quarters running.' },
            { role: 'UX Designer', bullet: 'Redesigned onboarding for 34M-user SaaS; task completion 62% -> 91%, support tickets down 44% in 90 days.' },
            { role: 'DevOps Engineer', bullet: 'Reduced AWS bill 41% (Rs 2.8 Cr saved annually) via Spot Instance adoption + RDS right-sizing + Savings Plan restructuring.' },
            { role: 'Business Analyst', bullet: 'Authored requirements for payments reconciliation system; 220 user stories across 8 sprints; reclaimed 18 hrs/wk per analyst.' },
            { role: 'Customer Success', bullet: 'Retained 94% of at-risk accounts across a Rs 12 Cr book of business via structured health-score interventions.' },
            { role: 'Research Scientist', bullet: 'Published benchmark study on transformer efficiency at 2025 ICLR workshop; cited 34 times in 8 months.' },
          ].map((ex, i) => (
            <li key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">{ex.role}</p>
              <p className="text-gray-800 text-[15px] leading-relaxed">{ex.bullet}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Should every bullet start with a different verb?', a: 'Within the same role, yes. Repeating the same verb three or four times makes the resume feel thin. Across different roles, some overlap is fine. Shoot for 80% unique verbs per role section.' },
            { q: 'What tense should resume verbs be in?', a: 'Past tense for all past roles. Present tense (Lead, Build, Manage) only for your current job. Mixing tenses within a single job is the most common grammar error recruiters flag.' },
            { q: 'Are AI-suggested verbs too generic?', a: 'Sometimes. AI tends to reach for common verbs like "Developed" and "Managed". Use AI suggestions as a starting point, then swap in a more specific verb from the relevant category if it still fits.' },
            { q: 'Can I use the same action verb more than once per section?', a: 'Once is best, twice is tolerable, three times reads lazy. The variety signals range and keeps the reader engaged through a scan.' },
            { q: 'Does the ATS care about action verbs?', a: 'Less than humans do. ATS parsers mostly match on nouns (tools, skills, certifications). But strong verbs still help because some ATS platforms weight bullets that follow the "Verb + Result" pattern higher.' },
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
        <h2 className="text-2xl font-bold mb-3">Build your resume free with AI bullet rewrites</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          20 ATS-tested templates. AI that picks the right verb for the context. Free to start, no sign-up required.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
