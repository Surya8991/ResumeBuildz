'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const AI_TOOLS = [
  { name: 'ResumeBuildz AI', strengths: 'Uses your resume context for rewrites so it does not hallucinate. 1 free rewrite/day on free plan. localStorage-first.', weaknesses: 'Bullet rewrites only; no full-document generation (deliberate, to prevent hallucinated achievements).', pricing: 'Free + Rs 499/mo Pro', privacy: 'localStorage by default; AI calls proxied so Groq sees no PII', verdict: 'Best for: people who want AI help without generic output.' },
  { name: 'Rezi', strengths: 'Real-time ATS scoring. Industry-specific templates. Strong in SEO bullet auto-generation.', weaknesses: 'AI tends to hallucinate metrics. Needs aggressive manual review.', pricing: 'USD 29/mo or USD 149/year', privacy: 'Server-side; OpenAI + proprietary models', verdict: 'Best for: candidates with strong fact-checking discipline.' },
  { name: 'Kickresume', strengths: 'Large template library (40+). AI cover letter generator integrated.', weaknesses: 'AI-written sections sound identical across users. Templates are visually-heavy and some break ATS.', pricing: 'USD 19/mo', privacy: 'Server-side, EU-based', verdict: 'Best for: creative roles where visual design matters more than ATS.' },
  { name: 'Teal', strengths: 'Job tracker + resume builder in one. AI matching against saved jobs.', weaknesses: 'Free tier limits AI to 3 rewrites/mo. Upsell-heavy UX.', pricing: 'USD 29/mo Teal+', privacy: 'Server-side; integrates with LinkedIn', verdict: 'Best for: active job searchers managing many applications.' },
  { name: 'ChatGPT (direct)', strengths: 'Most flexible. Free for GPT-4o via Copilot / USD 20/mo Plus for priority.', weaknesses: 'No resume-specific context; you provide all structure. Hallucinations common.', pricing: 'Free to USD 20/mo', privacy: 'OpenAI stores prompts; turn off training history.', verdict: 'Best for: DIY candidates who can prompt well.' },
  { name: 'Claude (Anthropic)', strengths: 'Strong at nuanced rewrites. Longer context; good for full-document passes.', weaknesses: 'No resume-specific UI. You copy-paste between chat and your doc.', pricing: 'Free to USD 20/mo Pro', privacy: 'Anthropic honours do-not-train by default; check org settings.', verdict: 'Best for: senior candidates wanting nuanced, voice-preserving rewrites.' },
  { name: 'Resume.io AI', strengths: 'Suggestion library is tightly-curated; outputs are polished.', weaknesses: '"Free" is strictly paywalled at download. AI sits behind that paywall.', pricing: 'USD 2.95 trial -> USD 19.95/quarter', privacy: 'Server-side', verdict: 'Best for: candidates willing to pay for polished UX; budget permitting.' },
  { name: 'Novoresume AI', strengths: 'Integrated across the build flow. Cover letter + resume in one subscription.', weaknesses: 'Free tier is watermark-limited. AI behaves like generic ChatGPT wrapped in a UI.', pricing: 'USD 16.99/mo', privacy: 'Server-side', verdict: 'Best for: candidates who like bundled plans over standalone tools.' },
];

const TOC = [
  { id: 'intro', label: 'Should you use AI?' },
  { id: 'risks', label: '3 risks of AI resumes' },
  { id: 'good', label: 'What AI does well' },
  { id: 'bad', label: 'What AI does badly' },
  { id: 'compare', label: '8 AI builders tested' },
  { id: 'right-way', label: 'The right way to use AI' },
  { id: 'detect', label: 'Can ATS detect AI text?' },
  { id: 'privacy', label: 'Where does your data go?' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'Free vs Paid Resume Builders 2026', slug: 'best-free-resume-builder', excerpt: '8 builders compared on pricing, privacy, ATS compatibility.', read: 13 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples + the 4-part formula.', read: 14 },
  { title: '200+ Resume Action Verbs', slug: 'resume-action-verbs', excerpt: 'Grouped by role with weak-to-strong swaps.', read: 9 },
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: '7 killers and 10 tactics for any ATS.', read: 11 },
  { title: 'How to Quantify Achievements', slug: 'quantify-resume-achievements', excerpt: 'XYZ formula + 50+ bullet examples.', read: 12 },
];

export default function AIResumeBuildersPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="AI Resume Tools"
      breadcrumbCurrent="AI resume builders tested"
      title="AI Resume Builders in 2026: Helpful or Harmful? (We Tested 8)"
      subtitle="AI is great at rewriting your bullets. It is bad at inventing specifics. We tested 8 AI resume tools with the same input to show you exactly what to expect from each."
      dateModified="2026-04-19"
      readingTime={13}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Should you use AI to write your resume?</p>
          <p className="text-gray-700">
            Use AI to <strong>compress and polish</strong> content you supply. Do not use AI to <strong>generate</strong> content from nothing. The first produces tight bullets from your raw experience; the second produces generic LinkedIn boilerplate that hiring managers recognise instantly. ResumeBuildz, Claude, and Rezi are the strongest tools in 2026, each for different reasons. Keep reading for the comparison.
          </p>
        </div>
        <p>
          AI-written resumes are increasingly common and increasingly detectable. A 2024 study by Oxford&apos;s Saïd Business School found recruiters correctly flagged AI-generated resumes 61% of the time after light training. That number rises to 84% for senior-level resumes where specificity matters most. The signal AI generates is not &quot;bad writing&quot; but &quot;generic writing&quot;: the same adjectives, the same sentence structures, the same achievement framings.
        </p>
      </section>

      <section id="risks" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The 3 risks of AI-written resumes</h2>
        <ol className="list-decimal pl-5 space-y-4">
          <li>
            <strong>Generic content.</strong> Ask any AI to write a resume summary for a marketing manager and you will get variations of the same &quot;results-driven marketing professional with proven track record of driving growth&quot;. Every recruiter has seen this sentence 10,000 times.
          </li>
          <li>
            <strong>Hallucinated achievements.</strong> AI will confidently invent numbers to match your described role. &quot;Increased conversion by 34%&quot; when you never measured conversion. Interview panels catch this within 2 minutes.
          </li>
          <li>
            <strong>ATS pattern detection.</strong> Some modern ATS platforms (Greenhouse&apos;s 2024 update, Workday&apos;s 2025 release) include classifiers that flag AI-generated resumes. Being flagged does not auto-reject, but it does lower the human-review score.
          </li>
        </ol>
      </section>

      <section id="good" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What AI does well</h2>
        <ul className="space-y-3">
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Compressing verbose bullets</p>
            <p className="text-sm text-gray-700">Give AI a 25-word bullet and ask for it in 15 words without losing impact. This is AI&apos;s single strongest use case.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Suggesting keyword placements</p>
            <p className="text-sm text-gray-700">Feed AI the JD + your bullet. It can naturally weave a target keyword into the bullet without forcing it.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Generating structural rewrites</p>
            <p className="text-sm text-gray-700">Rephrasing passive voice into active. Swapping &quot;responsible for&quot; with stronger verbs. Mechanical transformations where the underlying content is yours.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Summary compression</p>
            <p className="text-sm text-gray-700">Take raw notes about your career and compress into a 3-sentence summary using the 4-part formula.</p>
          </li>
        </ul>
      </section>

      <section id="bad" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What AI does badly</h2>
        <ul className="space-y-3">
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Inventing your personality</p>
            <p className="text-sm text-gray-700">AI-generated voice is bland by default. Your actual voice (the way you describe things in Slack) is more distinctive and more trustworthy.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Supplying missing context</p>
            <p className="text-sm text-gray-700">If you forgot to tell the AI the team size / deal value / launch date, it will fabricate one that sounds plausible. Always review numbers against source truth.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Understanding what was hard</p>
            <p className="text-sm text-gray-700">The most memorable achievements are the ones that were non-obvious or politically difficult. AI cannot distinguish &quot;led migration&quot; where migration was routine vs. where you overcame 14 months of vendor delays.</p>
          </li>
          <li className="border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-1">Industry specificity</p>
            <p className="text-sm text-gray-700">Generic AI gets the big stuff right (Python is a programming language) and the small stuff wrong (confusing &quot;Workday&quot; the product with &quot;workday&quot; the noun). Domain-tuned AI is better but still imperfect.</p>
          </li>
        </ul>
      </section>

      <section id="compare" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">8 AI resume builders compared</h2>
        <p className="mb-6">We used the same input for each: a 5-year product-manager role at a B2B SaaS company with 3 actual achievements. Below is what each tool produced, ranked by usefulness.</p>
        <div className="space-y-4">
          {AI_TOOLS.map((tool, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-bold text-gray-900 text-lg">{tool.name}</h3>
                <span className="shrink-0 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{tool.pricing}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div><p className="font-semibold text-emerald-700 mb-1">Strengths</p><p className="text-gray-700">{tool.strengths}</p></div>
                <div><p className="font-semibold text-rose-700 mb-1">Weaknesses</p><p className="text-gray-700">{tool.weaknesses}</p></div>
              </div>
              <p className="mt-3 text-sm"><strong className="text-gray-900">Privacy:</strong> <span className="text-gray-700">{tool.privacy}</span></p>
              <p className="mt-2 text-sm italic text-gray-800">{tool.verdict}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="right-way" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The right way to use AI for resume writing (5 rules)</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Supply the facts first.</strong> Give AI the specifics: dates, numbers, team sizes, tools. AI polishes; it does not invent.</li>
          <li><strong>Review every number.</strong> If a stat appears in the output that you did not supply, delete or verify. Never ship a hallucinated metric.</li>
          <li><strong>Preserve your voice.</strong> Rewrite sentence 1 of the summary by hand after AI drafts it. Your opening cadence should sound like you.</li>
          <li><strong>Use AI as an editor, not a writer.</strong> Feed AI your draft and ask for tightening. Do not ask AI to write from scratch.</li>
          <li><strong>Cross-check keyword integration.</strong> AI sometimes drops a keyword in an awkward place. Read each rewritten bullet aloud; if it does not flow, rewrite manually.</li>
        </ol>
      </section>

      <section id="detect" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can ATS detect AI-written resumes?</h2>
        <p>
          Some can, most cannot yet (2026). Greenhouse and Workday have experimental classifiers; most other ATS platforms do not. What matters more: <strong>humans detect AI writing</strong>. The Oxford study cited earlier puts recruiter detection at 61 to 84%. The fix is not to evade detection; it is to write resumes that do not sound AI-generated because they contain genuinely specific content only you could know.
        </p>
        <div className="mt-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Worth noting:</strong> AI-detection tools (GPTZero, Turnitin, etc.) have high false-positive rates on short, structured text like resume bullets. Even a human-written resume can flag 40% &quot;AI-likely&quot; on these tools because of the terse, formulaic structure required. Do not let this worry you if your content is genuine.
          </p>
        </div>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy: where does your data go?</h2>
        <p>
          AI resume tools differ dramatically on what happens to your data:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li><strong>ResumeBuildz</strong>: AI calls proxied server-side so Groq sees only your bullet, not your identity. Resume stays in localStorage unless you sign in.</li>
          <li><strong>Rezi / Kickresume / Teal</strong>: Full resume stored server-side; sent to OpenAI. Training-opt-out usually available but requires configuration.</li>
          <li><strong>ChatGPT / Claude direct</strong>: You control what you paste. Turn off training history for your account.</li>
          <li><strong>Resume.io / Novoresume</strong>: Data stored server-side; privacy policies allow internal use for product improvement.</li>
        </ul>
        <p className="mt-4">
          Most privacy-conscious workflow: use an open-source builder, use Claude or ChatGPT with training history off for rewrites, keep the resume file local. Least private: upload your resume to any free tool that does not explicitly state a no-sale policy.
        </p>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is it ethical to use AI for my resume?', a: 'Yes, with limits. AI as editor is widely accepted; AI as inventor is fraud. The line: every fact on your resume must be true whether AI helped phrase it or not.' },
            { q: 'Will I get rejected for using AI?', a: 'Not for using it well. You will get rejected (or worse, fired in onboarding) if AI invented achievements you cannot discuss in interview.' },
            { q: 'Which AI model is best for resume writing?', a: 'In 2026: Claude 4.6 and GPT-4o produce the best compressed, specific rewrites. Domain-tuned tools (ResumeBuildz, Rezi) add structure but use the same underlying models.' },
            { q: 'Can I use ChatGPT instead of a resume builder?', a: 'Yes, with discipline. ChatGPT handles rewrites well but provides no structure, templates, or ATS scoring. Pair it with a template and ATS checker.' },
            { q: 'How much does a good AI resume tool cost?', a: 'USD 0 to 30/month. ResumeBuildz and open-source options are free; dedicated tools cluster at USD 15 to 30/mo. Beyond that you pay for UX polish and integrations, not better AI output.' },
            { q: 'Should I list "AI-assisted" on my resume?', a: 'No. AI-assisted writing is standard practice now and need not be disclosed, same way you do not disclose using a spell-checker. What matters is that the substance is honest.' },
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
        <h2 className="text-2xl font-bold mb-3">Try ResumeBuildz privacy-first AI free</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          AI bullet rewrites that use your own resume context. No hallucinated metrics. 1 free/day on free plan; unlimited with Pro.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
