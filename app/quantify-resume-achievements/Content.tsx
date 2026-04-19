'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const BULLETS_BY_ROLE: { role: string; items: string[] }[] = [
  {
    role: 'Software Engineering',
    items: [
      'Cut API p95 latency from 380ms to 95ms via Redis caching + connection pooling; serves 4M req/day.',
      'Migrated 12-service monolith to Kubernetes on AWS EKS; deploy time 45 min to 4 min.',
      'Shipped fraud detection microservice in Go at 8K req/sec; blocked Rs 28L/month in fraudulent charges.',
      'Reduced AWS bill 41% (Rs 2.8 Cr/yr saved) via Spot adoption + RDS right-sizing.',
      'Mentored 3 interns on React + TypeScript; 100% conversion rate to full-time offers.',
      'Rewrote test pipeline in GitHub Actions; CI runtime 22 min to 6 min (-73%).',
      'Led CVE patch rollout across 84 repos within SLA (14 days); zero downtime.',
      'Built shared UI component library adopted by 9 product teams; ticket lead time -38%.',
    ],
  },
  {
    role: 'Sales',
    items: [
      'Closed Rs 4.8 Cr ACV enterprise deal (largest in FY24) from cold outbound in 7 months.',
      'Exceeded quota by 140% for 3 consecutive years; Rs 14 Cr in net-new ARR.',
      'Built outbound sequence with 22% reply rate (team avg 6%); top-performing rep in H2.',
      'Shortened sales cycle from 98 to 64 days via discovery-framework rollout across SDR team of 12.',
      'Grew key account from Rs 12L to Rs 1.8 Cr ARR through executive-sponsor program (15x in 24 months).',
      'Generated Rs 2.4 Cr pipeline from single trade show via 1-1 meeting ops + follow-up cadence.',
      'Recovered 11 at-risk renewals (Rs 3.6 Cr) through quarterly business reviews.',
      'Ramped 2 new reps to quota attainment in 90 days (vs 180-day team baseline).',
    ],
  },
  {
    role: 'Marketing',
    items: [
      'Scaled paid acquisition from Rs 8L/mo to Rs 42L/mo while holding ROAS at 4.8x; Rs 2.4 Cr pipeline.',
      'Rewrote top 40 landing pages; organic traffic +117% YoY, CPA -38% as share of spend.',
      'Launched lifecycle email across 5 segments; open 32%, click 6.8%, incremental Rs 14 Cr revenue.',
      'Built creator program from 0 to 1,800 creators; 28% of new paid signups at blended CAC Rs 1,240.',
      'A/B tested homepage hero across 8 variants; winner lifted signups 18% (Rs 4.3 Cr annual impact).',
      'Grew MQL volume 3.2x in 6 months via webinar + gated whitepaper pair (qualified leads only).',
      'Dropped unsubscribe rate from 2.1% to 0.6% via segment-based send-time optimization.',
      'Attributed Rs 8.4 Cr in closed-won revenue to partner marketing (18% of total) via first-touch model.',
    ],
  },
  {
    role: 'Operations',
    items: [
      'Redesigned S&OP cycle dropping OOS from 7.1% to 2.3% across 12 SKUs in North India.',
      'Cut working capital tied to inventory by Rs 24 Cr via weekly replenishment switch.',
      'Led ERP migration (Oracle to SAP) for 8-country footprint; on-time, within 92% of budget.',
      'Standardised returns process across 14 warehouses; refund cycle time 7 days to 2 days.',
      'Negotiated freight contracts with 6 carriers saving Rs 3.8 Cr annually at same SLA.',
      'Reduced direct labour cost per unit 18% via cross-training + shift-mix optimization.',
    ],
  },
  {
    role: 'Finance',
    items: [
      'Closed monthly books in 5 days (down from 11) via automation of 22 recurring entries.',
      'Identified Rs 6.4 Cr in duplicate vendor payments over 3 years; implemented 3-way match control.',
      'Built zero-based budgeting process for 2026 plan; reallocated Rs 14 Cr to highest-ROI lines.',
      'Passed ISO + internal audit with zero material findings across 4 consecutive cycles.',
      'Modelled Series B scenarios driving 14-month runway target at 92% revenue-achievement confidence.',
      'Cut audit fees 22% (Rs 18L saved) via PBC automation + cleaner quarterly close.',
    ],
  },
  {
    role: 'Healthcare',
    items: [
      'Implemented Practo EHR migration at 14-provider clinic with zero downtime; +11 pp on collections.',
      'Reduced 30-day readmission rate from 18% to 9.4% via discharge-call protocol across 220 patients.',
      'Ran monthly clinical quality reviews; raised CG-CAHPS from 67% to 84% in 9 months.',
      'Coded 3,400 charts/month with 99.6% accuracy over 18 months; zero compliance findings.',
      'Led ICD-10 transition training for 84 staff; all certified within 60-day deadline.',
      'Standardised medication reconciliation reducing errors 62% (4.1 to 1.6 per 1,000 doses).',
    ],
  },
  {
    role: 'Education',
    items: [
      'Raised Grade 10 board average from 71% to 82% over 2 years through spiral revision schedule.',
      'Piloted flipped-classroom model with 3 cohorts; homework completion +38%, test scores +14 pts.',
      'Secured Rs 8L grant for computer lab upgrade serving 340 students.',
      'Reduced teacher attrition from 28% to 11% via mentorship program (18-month pilot).',
      'Launched peer tutoring; served 180 low-performing students, avg grade lift 1.4 points.',
    ],
  },
  {
    role: 'Retail',
    items: [
      'Increased store conversion rate from 18% to 27% via visual-merch refresh across 14 locations.',
      'Cut shrinkage from 1.8% to 0.9% of revenue (Rs 1.4 Cr saved) in 12 months.',
      'Grew loyalty sign-ups from 120/week to 480/week at zero incremental marketing spend.',
      'Reduced POS training time 5 days to 1.5 days via updated playbook + video library.',
      'Managed Rs 48 Cr inventory across 3 warehouses with 99.2% accuracy at quarterly audit.',
    ],
  },
];

const WHERE_TO_FIND_NUMBERS = [
  { cat: 'Time saved', ex: 'Dropped report generation from 3 hrs to 15 min weekly.' },
  { cat: 'Money saved', ex: 'Negotiated vendor contract for Rs 18L annual savings.' },
  { cat: 'Money earned', ex: 'Closed Rs 2.4 Cr in new ARR over 2 quarters.' },
  { cat: 'People impacted', ex: 'Served 22 internal stakeholders across 4 departments.' },
  { cat: 'Scale', ex: 'Managed 140 servers across 3 regions; zero P1 outages in 18 months.' },
  { cat: '% improvement', ex: 'Lifted email CTR from 3.1% to 5.4% via subject-line tests.' },
  { cat: 'Frequency', ex: 'Ran weekly sprint reviews with 6 team leads across 9 sprints.' },
  { cat: 'Ranking', ex: 'Placed in top 5% of Kaggle Benchmark X (38 of 1,800 teams).' },
  { cat: 'Relative', ex: 'Launched feature 3x faster than team\'s 90-day baseline.' },
];

const TOC = [
  { id: 'intro', label: 'Why numbers get interviews' },
  { id: 'xyz', label: 'The XYZ formula' },
  { id: 'find-numbers', label: 'Where to find numbers' },
  { id: 'examples', label: '50+ quantified bullets by role' },
  { id: 'before-after', label: 'Weak vs quantified pairs' },
  { id: 'no-numbers', label: 'What if I have no numbers' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role with the weak-to-strong swap table.', read: 9 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples by stage and industry.', read: 14 },
  { title: 'How to Pass ATS Scanning', slug: 'pass-ats-resume-scanning', excerpt: 'The 7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'Resume Writing Tips', slug: 'resume-tips', excerpt: 'The 8 practical tips recruiters wish more candidates followed.', read: 9 },
  { title: 'How to Tailor Resume in 10 Minutes', slug: 'tailor-resume', excerpt: 'The minute-by-minute process that lifts callback rates 3x.', read: 10 },
];

export default function QuantifyAchievementsPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Quantify achievements"
      title="How to Quantify Resume Achievements (50+ Examples by Role)"
      subtitle="A bullet without a number is a claim without proof. The XYZ formula, nine places to find numbers when you do not think you have any, and 50+ examples across 8 roles."
      dateModified="2026-04-19"
      readingTime={12}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Why quantified bullets get interviews</p>
          <p className="text-gray-700">
            Vague bullets (&quot;improved performance&quot;) tell a recruiter nothing they could verify. Quantified bullets (&quot;cut build times from 8 minutes to 90 seconds&quot;) give a concrete claim + scale + outcome in one line. Recruiters trust them more, hiring managers remember them longer, and some ATS ranking algorithms explicitly weight bullets containing digits higher because numbers signal specificity.
          </p>
        </div>
        <p>
          The single move that separates amateur resumes from professional ones is quantification. This guide gives you the formula, shows you where to find numbers even when you think you have none, and provides 50+ examples across 8 common roles you can adapt directly.
        </p>
      </section>

      <section id="xyz" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The XYZ formula (accomplished X, measured by Y, by doing Z)</h2>
        <p>
          Developed at Google and now universal. Every strong bullet answers three questions:
        </p>
        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-gray-800">
            <strong className="text-indigo-700">X:</strong> What did you accomplish? (the outcome)<br/>
            <strong className="text-indigo-700">Y:</strong> How do we know? (the measurable)<br/>
            <strong className="text-indigo-700">Z:</strong> How did you do it? (the mechanism)
          </p>
          <div className="mt-5 border-t border-gray-200 pt-4">
            <p className="text-gray-700 italic">
              Example: <span className="text-gray-900">Reduced checkout abandonment<strong className="text-indigo-700"> (X)</strong> by 14 percentage points<strong className="text-indigo-700"> (Y)</strong> by shipping a unified payment flow across 3 products<strong className="text-indigo-700"> (Z)</strong>.</span>
            </p>
          </div>
        </div>
        <p className="mt-5">
          If any of the three is missing, the bullet feels thin. Verify each bullet on your resume hits all three.
        </p>
      </section>

      <section id="find-numbers" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to find numbers when you don&apos;t think you have any</h2>
        <p>
          Most candidates say &quot;my work isn&apos;t measurable&quot; and mean &quot;I haven&apos;t thought hard enough about it.&quot; Here are nine categories to mine for numbers on any job.
        </p>
        <div className="mt-5 grid md:grid-cols-2 gap-3">
          {WHERE_TO_FIND_NUMBERS.map((cat, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1 text-sm">{cat.cat}</p>
              <p className="text-sm text-gray-700 italic">{cat.ex}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="examples" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">50+ quantified bullet examples by role</h2>
        <p className="mb-6">
          Copy the structure, not the number. Adapt these to your context with honest metrics.
        </p>
        <div className="space-y-8">
          {BULLETS_BY_ROLE.map((section) => (
            <div key={section.role}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{section.role}</h3>
              <ul className="space-y-2">
                {section.items.map((bullet, j) => (
                  <li key={j} className="border-l-2 border-indigo-200 pl-4 py-1 text-sm text-gray-800 leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="before-after" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Weak vs quantified pairs (before/after)</h2>
        <div className="space-y-4">
          {[
            { weak: 'Helped improve customer service.', strong: 'Cut first-response time from 8 hrs to 42 min across 2,400 monthly tickets via triage rules + SLA dashboard.' },
            { weak: 'Responsible for managing a team.', strong: 'Led 8-person growth squad; shipped 14 A/B tests in 6 months, 4 winners contributing Rs 3.2 Cr incremental revenue.' },
            { weak: 'Worked on various marketing campaigns.', strong: 'Owned 9 paid campaigns across Meta + Google totaling Rs 2.8 Cr spend at blended 4.2x ROAS.' },
            { weak: 'Assisted with financial reporting.', strong: 'Built 6 monthly board-pack schedules automating prior manual work; close time 9 days to 4 days.' },
            { weak: 'Involved in product launch.', strong: 'Co-led launch of mobile ordering; 14k users in month 1, Rs 42L MRR by month 3.' },
            { weak: 'Handled patient care duties.', strong: 'Managed caseload of 28 patients weekly; 96% reported high satisfaction on post-visit CG-CAHPS survey.' },
          ].map((row, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r text-sm text-gray-800 mb-2">
                <p className="text-xs font-semibold text-red-700 mb-1">Weak</p>
                <p>{row.weak}</p>
              </div>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r text-sm text-gray-800">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Strong</p>
                <p>{row.strong}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="no-numbers" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What if you genuinely have no numbers?</h2>
        <p>
          Genuine cases exist: confidential work, early-career projects, volunteer roles with no formal metrics. In those cases, substitute with <strong>structural specifics</strong>.
        </p>
        <ul className="space-y-3 mt-4">
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Name specific tools, frameworks, and standards.</p>
            <p className="text-sm text-gray-700">&quot;Implemented OWASP Top-10 remediation across 22 internal apps&quot; beats &quot;Improved application security&quot; even without a count.</p>
          </li>
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Name specific people, roles, and stakeholders.</p>
            <p className="text-sm text-gray-700">&quot;Presented quarterly updates to CFO and 4-person audit committee&quot; signals scope better than &quot;Presented to leadership&quot;.</p>
          </li>
          <li className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
            <p className="font-semibold text-gray-900 mb-1">Name specific outputs.</p>
            <p className="text-sm text-gray-700">&quot;Authored 4 go-to-market playbooks adopted across the APAC sales org&quot; beats &quot;Created documentation&quot;.</p>
          </li>
        </ul>
        <p className="mt-5">
          Specificity is a proxy for quantification. If you cannot measure, describe the scope in terms reviewers can evaluate.
        </p>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How many bullets on my resume should have numbers?', a: 'At least 60%. Ideally every bullet has at least one piece of quantification: a count, percentage, scale, or timeframe. Bullets without numbers should at minimum have concrete nouns (named tools, stakeholders, outputs).' },
            { q: 'Can I round numbers for readability?', a: 'Yes, within reason. Round to the nearest easily-grasped figure (14k not 14,237), but do not inflate. If challenged in an interview, you should be able to cite the true figure.' },
            { q: 'What if my company is confidential about numbers?', a: 'Use relative figures and scope indicators. "Grew the book 4x over 18 months" works without revealing absolute revenue. "Across our top 5 enterprise accounts" works without naming them.' },
            { q: 'Should I use % or absolute numbers?', a: 'Both when possible. "Cut CAC 40% (Rs 1,200 to Rs 720)" is stronger than either alone. Percentages establish relative impact; absolutes establish scale.' },
            { q: 'Is it okay to estimate?', a: 'Only if the estimate is defensible. "Trained approximately 40 staff members" is fine if you remember running 4 cohorts of 10. "Increased sales by roughly 25%" is weasel-worded; find the real number or leave it out.' },
            { q: 'Does AI help with quantification?', a: 'It helps you find the right format. It cannot invent the numbers. Useful workflow: tell AI the raw context (what you did, the team size, any outcomes you remember) and ask it to draft a quantified bullet. Then verify the number yourself before pasting.' },
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
        <h2 className="text-2xl font-bold mb-3">Get AI to quantify your bullets free</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Paste a vague bullet and supply the context; our AI suggests 2 to 3 quantified rewrites using your own specifics. Free to start.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
