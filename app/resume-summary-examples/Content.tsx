'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const STAGE_EXAMPLES = [
  { stage: 'Fresher / Entry-level', weak: 'Recent graduate looking for opportunities in software development. Passionate about coding and eager to learn.', strong: 'CS graduate from Delhi University (CGPA 8.4) with 4 built-and-shipped Next.js projects, 1 with 12k live users. Seeking SDE-1 role at a product company where I can ship code in week 1.' },
  { stage: 'Early career (1-3 yrs)', weak: 'Software engineer with experience in web development and strong problem-solving skills.', strong: 'Full-stack engineer (2 yrs) who shipped the unified login at Stack-A across 3 product lines (1.2M MAU). Strongest in TypeScript + Postgres; now looking to go deeper on distributed systems at a seed-to-Series-B startup.' },
  { stage: 'Mid-career (4-7 yrs)', weak: 'Experienced marketing professional with a track record of successful campaigns.', strong: 'Growth marketer (6 yrs) who scaled paid acquisition at FinEdge from Rs 4L/mo to Rs 42L/mo at steady 4.8x ROAS, contributing Rs 2.4 Cr pipeline. Specialise in multi-touch attribution + lifecycle automation across HubSpot + Braze.' },
  { stage: 'Senior IC (8-12 yrs)', weak: 'Senior engineer with extensive experience in backend development.', strong: 'Staff Backend Engineer (10 yrs) who architected payments reconciliation at Razorpay serving 18M merchants. Led migration off monolith to 14 services on AWS EKS; cut deploy time 45 min to 4 min. Now exploring staff-plus roles in climate tech.' },
  { stage: 'Manager / Director', weak: 'Engineering manager with a strong technical background and leadership skills.', strong: 'Engineering Director (13 yrs, 6 as manager) running a 32-person org across 5 squads at Flipkart Grocery. Landed Q4 OKR at 91% on-time (from 61% baseline) via restructured planning. Hired 17, promoted 8.' },
  { stage: 'Career changer', weak: 'Career changer transitioning from finance to tech with transferable skills.', strong: 'Former investment banker (5 yrs at Morgan Stanley) now 14 months into self-directed ML transition. Shipped 3 production models on AWS SageMaker (fraud detection, KYC risk scoring). Looking for MLE roles where finance domain knowledge is a plus, not baggage.' },
  { stage: 'Returning after break', weak: 'Seeking to return to the workforce after a career break.', strong: 'Senior product manager returning after a 22-month caregiving break. Used the time to ship 2 side projects (one at 3k DAU), complete Reforge Growth, and mentor 4 early-stage founders. Most relevant before-break role: PM at Swiggy Instamart scaling reorder flow.' },
  { stage: 'Laid-off / between roles', weak: 'Seeking new opportunities after company restructuring.', strong: 'Senior Product Designer (9 yrs) from Twitter\'s Nov 2023 layoff cohort. Led design for Spaces post-launch; grew DAU 3.2x in 18 months. Spent the past 4 months shipping a SaaS side project (1,200 signups). Ready for the next large-scale product challenge.' },
  { stage: 'Freelancer -> FTE', weak: 'Freelance developer looking for a full-time position.', strong: 'Independent full-stack developer (4 yrs, 27 clients) ready to join a product team full-time. Shipped the MVP for two seed-funded companies (one acquired). Strongest at Next.js + Postgres; looking for Series-A to B product engineering roles.' },
  { stage: 'Over-50 re-entry', weak: 'Experienced professional returning to the industry.', strong: 'Operations leader (22 yrs, 8 at director level) returning after 3 years running a non-profit. Most recently scaled supply ops at BigBasket through a 40x GMV run. Fluent modern stack (Looker, Notion, Slack, JIRA). Ready for a director-level operator role in Q-commerce or logistics.' },
  { stage: 'MBA / post-grad', weak: 'Recent MBA graduate with internship experience and analytical skills.', strong: 'ISB MBA \'25 with 4 yrs pre-MBA as a BCG consultant across healthcare + retail. Summer internship: ran go-to-market for a Razorpay B2B product (Rs 3.2 Cr pipeline in 10 weeks). Targeting product management at Indian unicorns.' },
  { stage: 'First job after service / military', weak: 'Veteran transitioning to civilian workforce with leadership experience.', strong: 'Former Indian Navy officer (7 yrs, Commander rank). Ran 42-person engineering division across 3 ships; managed Rs 28 Cr logistics budget. Completed AWS Solutions Architect Pro + 2 Azure certs post-separation. Seeking solution architect / programme manager roles.' },
  { stage: 'Academic -> industry', weak: 'PhD seeking to transition from academia to industry.', strong: 'IIT Bombay PhD (Computational Neuroscience, 2022). 3 first-author papers on reinforcement learning applied to motor control. Post-doc at Mila through mid-2024. Now building an RLHF fine-tuning pipeline for a stealth AI startup (consulting). Targeting Research Engineer roles.' },
  { stage: 'Consulting -> industry', weak: 'Management consultant looking to transition to industry roles.', strong: 'Bain consultant (4 yrs) running engagements across retail + financial services. Latest: diagnostic + turnaround for a Rs 800 Cr revenue retail chain; recovered 3.8 pp margin in 9 months. Targeting COO / VP Ops roles at growth-stage startups.' },
  { stage: 'Executive / C-suite', weak: 'Accomplished executive with decades of leadership experience seeking new opportunities.', strong: 'COO who scaled Neobank-X from 180 to 1,100 employees across 4 markets (India, UAE, Singapore, Indonesia). Grew revenue from Rs 40 Cr to Rs 920 Cr ARR in 38 months while holding burn to <18 months runway. Now exploring CEO / COO roles at Series C+ fintech.' },
];

const INDUSTRY_EXAMPLES = [
  { industry: 'Tech / Software', sample: 'Senior full-stack engineer (7 yrs) shipping at scale on Next.js, Go, and Postgres. Owned the rewrite of Acme\'s billing platform (Rs 160 Cr ARR) to event-driven; cut nightly batch runtime from 6 hrs to 12 minutes. Looking for Staff SWE roles at product companies.' },
  { industry: 'Finance / Banking', sample: 'CFA level III, 8 yrs in equity research covering mid-cap Indian IT services. Initiated coverage on 14 names; 4 of 6 OUTPERFORM picks beat the sector by 22%+. Author of "Tier-2 Indian IT: The Margin Question" (Bloomberg Intelligence note). Seeking sell-side or buy-side analyst role.' },
  { industry: 'Product Management', sample: 'Senior PM (6 yrs) behind Swiggy Dineout\'s loyalty rebuild. Shipped 3 A/B-tested iterations increasing redemption rate 2.4x to 31%, lifting weekly actives 14%. Targeting Group PM roles at consumer tech companies.' },
  { industry: 'Marketing / Growth', sample: 'Performance marketer (5 yrs) who built CureFit\'s creator programme from 0 to 1,800 active creators driving 28% of new paid signups at blended CAC Rs 1,240. Now exploring growth lead roles at Series B consumer brands.' },
  { industry: 'Design / UX', sample: 'Product designer (8 yrs) with end-to-end ownership of PhonePe\'s merchant dashboard (3.2M MAU). Led 2 major rewrites; latest dropped task-completion time 42s to 9s on the top-5 flows. Hiring a design system into a 4-person team at next opportunity.' },
  { industry: 'Healthcare', sample: 'Practice manager (9 yrs) running a 14-provider multi-specialty clinic (Bengaluru). Implemented Practo EHR migration (zero downtime); raised collections 11 pp via new claims follow-up process. Targeting Director of Operations at a hospital chain.' },
  { industry: 'Sales', sample: 'Enterprise AE (6 yrs) closing Rs 2 Cr+ ACV SaaS deals in APAC. 140% quota attainment 3 years running; biggest deal (Rs 4.8 Cr, IndusInd Bank) closed in 7 months from cold outbound. Exploring Regional Sales Manager roles.' },
  { industry: 'Data / Analytics', sample: 'Senior data scientist (5 yrs) behind Urban Company\'s supply-forecast model (MAPE 6.4%, 28% below baseline). Ships monthly retraining via Airflow + MLflow. Next: ML platform role where model lifecycle is part of the charter.' },
  { industry: 'Operations / Supply Chain', sample: 'Supply chain manager (11 yrs, Unilever + Nestle). Led S&OP redesign dropping OOS from 7.1% to 2.3% across 12 SKUs in North India; cut working-capital tied to inventory by Rs 24 Cr. Targeting Director of Supply Chain.' },
  { industry: 'HR / People', sample: 'Head of Talent (9 yrs) who hired 180 people (Eng + Product) in 14 months at Series B fintech. Built the interview calibration + hiring bar system adopted across 6 leaders. Now exploring VP People roles at 300-1000 person companies.' },
];

const TOC = [
  { id: 'intro', label: 'What a resume summary is' },
  { id: 'vs-objective', label: 'Summary vs objective' },
  { id: 'formula', label: 'The 4-part formula' },
  { id: 'by-stage', label: '15 examples by career stage' },
  { id: 'by-industry', label: '10 examples by industry' },
  { id: 'mistakes', label: 'Mistakes that kill your summary' },
  { id: 'ai-help', label: 'How AI can help' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role with the weak-to-strong swap table.', read: 9 },
  { title: 'How to Quantify Achievements', slug: 'quantify-resume-achievements', excerpt: '50+ metric-driven bullets and the XYZ formula.', read: 12 },
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: 'The 7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: 'Resume Length 2026', slug: 'resume-length', excerpt: '1 page vs 2 pages, decided by career stage + industry.', read: 8 },
  { title: 'Best Resume Format 2026', slug: 'resume-format-guide', excerpt: 'Chronological vs functional vs hybrid.', read: 10 },
];

export default function ResumeSummaryPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Resume summary examples"
      title="How to Write a Resume Summary That Gets Interviews (15 + 10 Examples)"
      subtitle="The 4-part formula, 15 examples by career stage, and 10 by industry. Every example has a weak version and a strong rewrite so you see the exact moves that work."
      dateModified="2026-04-19"
      readingTime={14}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">What a resume summary is</p>
          <p className="text-gray-700">
            A resume summary is a 2 to 4 sentence paragraph at the top of your resume that names your role, years of relevant experience, 1 to 2 specialties, and 1 measurable achievement. It sits below your contact information and above the Experience section. Done right, it is the single line that decides whether a recruiter reads the rest. Done wrong, it is filler. Most candidates default to filler.
          </p>
        </div>
        <p>
          The summary is the highest-leverage 40 words on your resume. A strong one tells a recruiter in one breath: what you do, how long you have been doing it, what you are good at, and what you have shipped. The trick is writing it without slipping into generic phrases like &quot;results-driven&quot; or &quot;passionate about&quot; that read as LinkedIn boilerplate.
        </p>
      </section>

      <section id="vs-objective" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume summary vs objective: which should you use in 2026?</h2>
        <p>
          <strong>Summary</strong>: focuses on what you offer. &quot;Senior PM with 6 years at Swiggy who shipped reorder flow that drove +14% weekly actives.&quot;
        </p>
        <p className="mt-3">
          <strong>Objective</strong>: focuses on what you want. &quot;Seeking a Product Manager role at a fast-growing consumer tech company.&quot;
        </p>
        <p className="mt-3">
          In 2026, <strong>use a summary, not an objective</strong>, in almost every case. Objectives date from an era when HR needed to sort applications into role categories. Modern ATS does that automatically based on job posting. The one exception: very early-career candidates with no work history can use a short Objective to clarify direction, but a well-framed Summary still works better.
        </p>
      </section>

      <section id="formula" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The 4-part formula that works</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="space-y-3">
            <div><span className="inline-block min-w-[28px] font-bold text-indigo-600">1.</span><strong> Job title + years.</strong> &quot;Senior software engineer (7 yrs)&quot;</div>
            <div><span className="inline-block min-w-[28px] font-bold text-indigo-600">2.</span><strong> Where + scope.</strong> &quot;at Razorpay, owning payments reconciliation across 18M merchants&quot;</div>
            <div><span className="inline-block min-w-[28px] font-bold text-indigo-600">3.</span><strong> Specialty or shipped outcome.</strong> &quot;led migration off monolith to 14 services on EKS; deploy time 45 min to 4 min&quot;</div>
            <div><span className="inline-block min-w-[28px] font-bold text-indigo-600">4.</span><strong> What next.</strong> &quot;Now exploring staff-plus roles in climate tech&quot;</div>
          </div>
        </div>
        <p className="mt-4">
          Join them with periods, not commas. Three to four sentences total. Under 90 words. Rewrite until the strongest achievement lives in sentence 2 or 3, never buried at the end.
        </p>
      </section>

      <section id="by-stage" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">15 resume summary examples by career stage</h2>
        <p className="mb-5">Each shows the weak version most candidates write first, then the strong rewrite using the 4-part formula.</p>
        <div className="space-y-5">
          {STAGE_EXAMPLES.map((ex, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">{ex.stage}</p>
              <div className="space-y-2">
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r text-sm text-gray-800">
                  <p className="text-xs font-semibold text-red-700 mb-1">Weak</p>
                  <p>{ex.weak}</p>
                </div>
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r text-sm text-gray-800">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">Strong</p>
                  <p>{ex.strong}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="by-industry" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">10 resume summary examples by industry</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {INDUSTRY_EXAMPLES.map((ex, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">{ex.industry}</p>
              <p className="text-sm text-gray-800 leading-relaxed">{ex.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mistakes" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Common mistakes that kill your summary</h2>
        <ul className="space-y-3">
          {[
            { m: 'Starting with adjectives', fix: '"Results-driven", "passionate", "dedicated" are noise. Lead with a concrete noun: your title and years.' },
            { m: 'Listing skills you haven\'t proven', fix: 'Every claim needs a moment of proof in bullet form below. If you say "led teams" in the summary, a bullet must show the team size and outcome.' },
            { m: 'Copy-paste across roles', fix: 'Retune the specialty and most-recent-outcome sentence for each application. Same skeleton, different meat.' },
            { m: 'Third-person writing', fix: 'Use first-person implied, never third. Not "John is a senior engineer who..." Just "Senior engineer who..."' },
            { m: 'No numbers', fix: 'A summary without a single number feels thin. Aim for one revenue, user, or efficiency metric in the strongest sentence.' },
            { m: 'Too long', fix: 'If your summary is 5+ sentences, it is becoming the Experience section. Keep it under 90 words.' },
            { m: 'Generic closing "seeking new opportunities"', fix: 'Name the company stage, the role level, and the focus area. "Now exploring Staff SWE roles at Series B to C product companies" is specific and filters out poor fits.' },
          ].map((item, i) => (
            <li key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{item.m}</p>
              <p className="text-sm text-gray-700">{item.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="ai-help" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How AI can help you write a better summary</h2>
        <p>
          AI is great at turning your raw bullet points into a tight summary. It is bad at inventing specifics you have not supplied. The useful workflow:
        </p>
        <ol className="mt-5 space-y-3 list-decimal pl-5">
          <li><strong>Dump raw facts first.</strong> Years in role, 2 to 3 shipped projects with numbers, the domain you want to target next.</li>
          <li><strong>Ask AI to compress into 3 sentences using the 4-part formula.</strong> Specify: 75 words max, no adjectives, open with title + years.</li>
          <li><strong>Rewrite sentence 1 by hand.</strong> AI tends to generic wording there. You know your own title/years best.</li>
          <li><strong>Check every claim has a supporting bullet below.</strong> Delete the claim if not.</li>
        </ol>
        <p className="mt-4">
          ResumeBuildz&apos;s AI assistant does this compression with the builder context already loaded, so it can pull the specifics from your own experience bullets instead of hallucinating them. One click, no copy-paste.
        </p>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How long should my resume summary be?', a: '40 to 90 words. Three to four sentences. Under three sentences reads thin; over five reads like bad Experience writing.' },
            { q: 'Do I need a summary if I have no experience?', a: 'Yes, a shortened one. For freshers: 2 sentences naming your degree, strongest project or internship with a number, and the role level you are targeting. Skip Objectives.' },
            { q: 'Should the summary include skills?', a: '1 to 2 core specialties, named. Not a full skill list. That goes in the Skills section. The summary is narrative, the Skills section is scannable.' },
            { q: 'Can I use ChatGPT to write my summary?', a: 'Yes, as a compression tool. No, as a first-draft generator if you feed it nothing about yourself. AI output is only as specific as your input.' },
            { q: 'Do recruiters actually read the summary?', a: 'About 65 to 70 percent do. The rest skip to Experience directly. That means your top bullet must also stand alone. But for the 65% who read it, a strong summary is the single highest-impact sentence on your resume.' },
            { q: 'What if my background is non-linear?', a: 'Lead with the role you are targeting next, not the last role you held. "Growth marketer (5 yrs) after 3 years in equity research. Specialize in data-driven acquisition..."' },
            { q: 'How is a resume summary different from a LinkedIn About?', a: 'Resume summary: 40 to 90 words, dense, past tense or present perfect, zero personality. LinkedIn About: 200 to 400 words, allowed to have voice and narrative arc. Do not paste one into the other.' },
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
        <h2 className="text-2xl font-bold mb-3">Build your resume with AI summary help</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Write the raw facts; our AI compresses them into a tight summary using your own specifics. No generic LinkedIn boilerplate.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
