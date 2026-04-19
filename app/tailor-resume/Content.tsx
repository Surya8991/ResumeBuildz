'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const STEPS = [
  { minute: '0-1', title: 'Read the job description top to bottom', body: 'Do this without touching your resume yet. Scan for 3 things: the role\'s core responsibilities (section 1), the required skills list (usually bulleted), and any "nice to have" section that reveals priorities. Flag the 3 to 5 words that appear multiple times.' },
  { minute: '1-3', title: 'Extract and rank keywords', body: 'Copy the JD into a scratch doc. Highlight every hard skill, tool, certification, and domain term. Count frequency. The top 8 to 12 most-repeated terms are your target keywords. Ignore soft skills ("team player", "problem solver") — they do not pass ATS filters and they bloat your bullets.' },
  { minute: '3-5', title: 'Rewrite the summary', body: 'Lead your 2 to 3 sentence summary with the target job title, your years in the most-relevant field, and 2 of the top JD keywords in context. Cut anything unrelated. Keep under 90 words.' },
  { minute: '5-8', title: 'Tweak your top 3 bullets', body: 'Open your most-recent role. Pick the 3 bullets that best match the JD priorities. Rewrite each to surface a target keyword naturally in the first half of the bullet. Do not invent results; reword existing ones.' },
  { minute: '8-9', title: 'Align your Skills section', body: 'Reorder Skills so the top row matches the JD\'s required-skills order. Add any JD keyword that you have genuine experience with but left off. Remove anything that clearly does not apply to this role.' },
  { minute: '9-10', title: 'Run a final ATS scan', body: 'Paste resume + JD into a free ATS checker (ResumeBuildz\'s is free, no sign-up). Aim for 70%+ match on hard skills. Fix any obvious gaps. Stop when you hit 80%; diminishing returns kick in.' },
];

const TOC = [
  { id: 'intro', label: 'Why tailoring works' },
  { id: 'process', label: 'The 10-minute process' },
  { id: 'keywords', label: 'How to find real keywords' },
  { id: 'whatto', label: 'What to tailor (and leave alone)' },
  { id: 'ai', label: 'Using AI to tailor faster' },
  { id: 'mistakes', label: 'Common tailoring mistakes' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: '7 killers and 10 tactics that clear any ATS.', read: 11 },
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role with the weak-to-strong swap table.', read: 9 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples by career stage and industry.', read: 14 },
  { title: 'How to Quantify Achievements', slug: 'quantify-resume-achievements', excerpt: 'The XYZ formula + 50+ bullets by role.', read: 12 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: '4-part structure, 6 industry templates.', read: 8 },
];

export default function TailorResumePage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="ATS & Keywords"
      breadcrumbCurrent="Tailor your resume"
      title="How to Tailor Your Resume in 10 Minutes (Without Starting Over)"
      subtitle="Tailored resumes get roughly 3x more callbacks than generic ones sent across many postings. The minute-by-minute process below takes 10 minutes per JD."
      dateModified="2026-04-19"
      readingTime={10}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Why tailoring beats mass-applying</p>
          <p className="text-gray-700">
            A Jobscan 2024 study of 1.2M resume/JD pairs showed tailored applications scored 40 to 60 points higher on keyword-match metrics and converted to interview 2.8x more often than generic ones. ATS algorithms reward specificity. Humans do too. The difference between &quot;applied to 50 jobs, no response&quot; and &quot;applied to 15 jobs, 4 interviews&quot; is usually tailoring.
          </p>
        </div>
        <p>
          Tailoring does not mean rewriting your resume from scratch. It means touching 4 zones (summary, top 3 bullets, skills order, keyword density) in a defined order. The first time takes 20 minutes. After your third application, you are at 10.
        </p>
      </section>

      <section id="process" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">The 10-minute tailoring process</h2>
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5 flex gap-4">
              <div className="shrink-0 h-16 w-16 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center">
                <span>Min</span>
                <span className="text-lg">{step.minute}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="keywords" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to find the real keywords in a job description</h2>
        <p>
          Not every word in a JD is a keyword. Here is the filter:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-semibold text-emerald-900 mb-2">Real keywords (include)</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Hard skills: &quot;Python&quot;, &quot;SQL&quot;, &quot;Tableau&quot;</li>
              <li>Frameworks / tools: &quot;React&quot;, &quot;Airflow&quot;, &quot;Salesforce&quot;</li>
              <li>Methodologies: &quot;SCRUM&quot;, &quot;Agile&quot;, &quot;Six Sigma&quot;</li>
              <li>Certifications: &quot;AWS SAA&quot;, &quot;PMP&quot;, &quot;CFA&quot;</li>
              <li>Domain terms: &quot;healthcare claims&quot;, &quot;B2B SaaS&quot;, &quot;quant trading&quot;</li>
              <li>Systems: &quot;Workday&quot;, &quot;Oracle Fusion&quot;, &quot;SAP S/4HANA&quot;</li>
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="font-semibold text-rose-900 mb-2">Not keywords (skip)</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Soft skills: &quot;team player&quot;, &quot;problem solver&quot;</li>
              <li>Generic adjectives: &quot;fast-paced&quot;, &quot;dynamic&quot;</li>
              <li>Fluff: &quot;we are looking for&quot;, &quot;the ideal candidate&quot;</li>
              <li>Company values boilerplate</li>
              <li>Benefits / perks language</li>
              <li>Legal disclaimers</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="whatto" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What to tailor (and what to leave alone)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="font-semibold text-indigo-900 mb-2">Tailor</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Summary (every time)</li>
              <li>Top 3 bullets of most-recent role</li>
              <li>Skills section order</li>
              <li>Certifications shown (bring relevant ones up)</li>
              <li>Projects featured (if relevant to role)</li>
              <li>Cover letter opening + closing</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">Leave alone</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li>Education (unless degree is newly relevant)</li>
              <li>Older roles (3+ years back)</li>
              <li>Employer names + dates</li>
              <li>Job titles as shown in payroll (don&apos;t fudge)</li>
              <li>Contact info</li>
              <li>Core narrative of your career</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="ai" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Using AI to tailor faster</h2>
        <p>
          The biggest time-saver in tailoring is AI-assisted bullet rewriting. The workflow:
        </p>
        <ol className="mt-5 space-y-2 list-decimal pl-5">
          <li>Paste the JD and your 3 target bullets into an AI tool.</li>
          <li>Ask: &quot;Rewrite each bullet to naturally incorporate [top 3 JD keywords] without inventing new results.&quot;</li>
          <li>Review the 3 outputs. Pick the version that stays closest to your actual achievement.</li>
          <li>Manually adjust any number or scope the AI inflated.</li>
        </ol>
        <p className="mt-4">
          ResumeBuildz&apos;s JD matcher does this in-builder. You paste the JD once; it surfaces the 12 to 15 highest-impact keywords, suggests bullet rewrites for each affected role, and shows a live match score. 10-minute tailoring becomes 4-minute tailoring.
        </p>
      </section>

      <section id="mistakes" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common tailoring mistakes</h2>
        <ul className="space-y-3">
          {[
            { m: 'Keyword stuffing', fix: 'Dumping every JD keyword into a list at the bottom. ATS ranks on keyword-in-context. Keywords scattered across real bullets score higher than a wall of terms.' },
            { m: 'Inventing experience you don\'t have', fix: 'If the JD asks for Kubernetes and you have never used it, do not list it. Interviews catch this in 30 seconds.' },
            { m: 'Rewriting everything', fix: 'You are tailoring, not rewriting. If you are touching more than 20% of the resume, stop. You are producing variance without signal.' },
            { m: 'Ignoring the nice-to-haves', fix: 'The "preferred" section of a JD reveals hiring priorities. If you hit 3 of 5 nice-to-haves, highlight them. Many candidates only check the required list.' },
            { m: 'Submitting an "ATS-optimized" file-name', fix: '"resume-keyword-stuffed-final-v3.pdf" looks spammy. Use "firstname-lastname-resume.pdf". Recruiters see the filename.' },
            { m: 'Skipping the cover letter tailoring', fix: 'Reusing a generic cover letter while tailoring the resume is inconsistent. If you tailor the resume, spend 5 extra minutes on paragraphs 1-2 of the cover letter.' },
          ].map((item, i) => (
            <li key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-1">{item.m}</p>
              <p className="text-sm text-gray-700">{item.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Should I tailor for every application?', a: 'For every application you actually care about, yes. For exploratory applications (low-intent, mass postings), a 2-minute tailoring of the summary + top 3 bullets is still worth it.' },
            { q: 'How much tailoring is too much?', a: 'If you are editing 5+ bullets per application or making structural changes, you are over-tailoring. Keep a clean "master" resume; tailor deltas only.' },
            { q: 'Can AI do the full tailoring for me?', a: 'It can draft, but review every output. AI hallucinates numbers and can list skills you do not have. Treat AI output as a starting point, never a finished resume.' },
            { q: 'How do I keep track of multiple tailored versions?', a: 'Save each version with a clear filename: "firstname-lastname-resume-[company].pdf". Keep a spreadsheet of applied roles + file version used. Useful when you get an interview 4 weeks later and need to remember what you submitted.' },
            { q: 'Does the order of bullets matter?', a: 'Yes. The first bullet of each role is the most-read. Put the most JD-aligned bullet first. Impact + relevance, in that order.' },
            { q: 'What if the JD is vague?', a: 'Check the company\'s LinkedIn for team posts, the hiring manager\'s profile, and recent press releases. You can infer specific skills from context even when the JD is thin.' },
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
        <h2 className="text-2xl font-bold mb-3">Tailor your resume free with the JD matcher</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Paste the job description, get the 12 highest-impact keywords ranked, and see AI rewrites of your bullets that surface them naturally. No sign-up.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Open the JD matcher
        </button>
      </section>
    </BlogPostLayout>
  );
}
