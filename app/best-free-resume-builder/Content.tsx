'use client';

import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const BUILDERS = [
  { name: 'ResumeBuildz', free: 'Full build + unlimited free export (PDF/DOCX/HTML)', paid: 'Pro unlocks unlimited AI rewrites', privacy: 'localStorage by default; no resume data on servers without signup', open: 'Open source on GitHub', tag: 'Our pick' },
  { name: 'Zety', free: 'Build for free, download paywalled', paid: 'USD 2.99 14-day trial -> USD 23.99/mo auto-renew', privacy: 'Data stored server-side; opt-out of marketing required', open: 'No' },
  { name: 'Resume.io', free: 'Build for free, download paywalled', paid: 'USD 2.95 4-day trial -> USD 19.95/quarter', privacy: 'Server-side storage', open: 'No' },
  { name: 'Novoresume', free: '1 page, basic template, watermarked download', paid: 'USD 16.99/mo premium plan', privacy: 'Server-side', open: 'No' },
  { name: 'Indeed Resume Builder', free: 'Fully free, basic templates only', paid: 'None (tied to Indeed job board)', privacy: 'Data shared with Indeed recruiters by default (opt-out available)', open: 'No' },
  { name: 'Canva', free: 'Free resume templates with limits', paid: 'Canva Pro USD 12.99/mo', privacy: 'Server-side storage', open: 'No' },
  { name: 'ResumeGenius', free: 'Partial build; download paywalled', paid: 'USD 7.95 14-day trial -> USD 24.95/mo', privacy: 'Server-side', open: 'No' },
  { name: 'MyPerfectResume', free: 'Free build; download paywalled', paid: 'USD 2.95 14-day trial -> USD 24.95/mo', privacy: 'Server-side; aggressive upsell emails', open: 'No' },
];

const TOC = [
  { id: 'intro', label: 'Free vs paid: the honest answer' },
  { id: 'hidden', label: 'The hidden cost of "free"' },
  { id: 'compare', label: '8 builders compared' },
  { id: 'best-free', label: 'Best free resume builder' },
  { id: 'best-paid', label: 'When paid is worth it' },
  { id: 'privacy', label: 'Privacy: what they do with your data' },
  { id: 'open', label: 'Open-source builders' },
  { id: 'checklist', label: 'What to look for' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'AI Resume Builders 2026 Tested', slug: 'ai-resume-builders-tested', excerpt: 'We tested 8 AI resume tools. Which work, which hallucinate.', read: 13 },
  { title: 'How to Pass ATS Scanning 2026', slug: 'pass-ats-resume-scanning', excerpt: '7 killers + 10 tactics that clear any ATS.', read: 11 },
  { title: 'Best Resume Format 2026', slug: 'resume-format-guide', excerpt: 'Chronological vs functional vs hybrid.', read: 10 },
  { title: 'How to Write a Resume Summary', slug: 'resume-summary-examples', excerpt: '25 examples by career stage and industry.', read: 14 },
  { title: 'Resume Writing Tips', slug: 'resume-tips', excerpt: '8 practical tips recruiters wish more candidates followed.', read: 9 },
];

export default function BestFreeResumeBuilderPage() {
  const { openGateway } = useLoginGateway();

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Best free resume builder"
      title="Free vs Paid Resume Builders 2026: A Brutally Honest Comparison"
      subtitle={'Most "free" resume builders paywall the download button. Here is which 8 builders actually deliver free work, which hide the bill until you try to export, and what each one does with your data.'}
      dateModified="2026-04-19"
      readingTime={13}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 mb-8">
          <p className="font-semibold text-indigo-900 mb-2">Free vs paid: the honest answer</p>
          <p className="text-gray-700">
            Free is enough for 90% of job seekers. The value a paid resume builder adds in 2026 is marginal: slightly more templates, AI features you can already get from ChatGPT, and prettier PDFs. What paid builders actually sell is the ability to download the resume you just spent an hour building. A free builder that genuinely lets you export is strictly better than a paid one that pretends to be free.
          </p>
        </div>
        <p>
          This guide compares 8 builders on the dimensions that matter: cost-to-export, ATS compatibility, template quality, AI features, and data privacy. No affiliate deals; full disclosure in the comparison table.
        </p>
        <p className="mt-3 text-sm text-gray-500 italic">
          Full disclosure: ResumeBuildz is our product. We try to be fair to competitors below. Our bias is obvious; cross-check with Reddit r/resumes and G2 reviews before deciding.
        </p>
      </section>

      <section id="hidden" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The hidden cost of &quot;free&quot; resume builders</h2>
        <p>
          Three patterns to watch for:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
            <p className="font-semibold text-amber-900 mb-1">1. Paywall at download</p>
            <p className="text-sm text-gray-700">Zety, Resume.io, and MyPerfectResume let you build for free, then charge USD 2 to 8 for a &quot;trial&quot; that auto-renews at USD 20+/month. Cancel windows are tight and easy to miss.</p>
          </li>
          <li className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
            <p className="font-semibold text-amber-900 mb-1">2. Watermark or limit on &quot;free&quot; exports</p>
            <p className="text-sm text-gray-700">Novoresume offers a &quot;free&quot; 1-page PDF with a watermark. Useless in any serious application.</p>
          </li>
          <li className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
            <p className="font-semibold text-amber-900 mb-1">3. Data harvested as the real cost</p>
            <p className="text-sm text-gray-700">Some free tools (Indeed, LinkedIn) are free because your resume data is the product. Your resume goes to recruiter sourcing tools automatically. Not inherently bad, but disclose-worthy.</p>
          </li>
        </ul>
      </section>

      <section id="compare" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8 top resume builders compared</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Builder</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Free tier</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Paid tier</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Privacy</th>
                <th className="text-left p-3 font-semibold text-gray-700 border-b border-gray-200">Open source</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {BUILDERS.map((b) => (
                <tr key={b.name} className={`border-b border-gray-100 ${b.tag ? 'bg-indigo-50' : ''}`}>
                  <td className="p-3 font-semibold">{b.name}{b.tag && <span className="ml-2 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">{b.tag}</span>}</td>
                  <td className="p-3 text-sm">{b.free}</td>
                  <td className="p-3 text-sm">{b.paid}</td>
                  <td className="p-3 text-xs">{b.privacy}</td>
                  <td className="p-3 text-sm">{b.open}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="best-free" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our pick: ResumeBuildz</h2>
        <p>
          We built ResumeBuildz because we could not find a resume builder that was genuinely free, privacy-respecting, AND produced ATS-ready output. Here is what you actually get free:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li>20 ATS-tested templates across chronological and hybrid formats</li>
          <li>Unlimited PDF, DOCX, HTML, and plain text exports (no paywall, no watermark)</li>
          <li>Live 12-point ATS scoring as you build</li>
          <li>AI bullet rewrites (1 free per day; paid unlocks unlimited)</li>
          <li>localStorage-first: your data does not leave your browser unless you sign up</li>
          <li>Cover letter builder with matching template design</li>
          <li>Open source code on GitHub (Surya8991/ResumeBuildz)</li>
        </ul>
        <p className="mt-4">
          What we do not do: charge USD 20/mo to download the file you made. Full disclosure: if you use our AI rewrite feature heavily, you will hit the free daily limit and want the paid plan. But the core build + export is free forever.
        </p>
      </section>

      <section id="best-paid" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">When a paid builder is worth it</h2>
        <p>
          Three scenarios where paid builders genuinely add value:
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li><strong>You need 1-on-1 resume review with a human.</strong> Services like TopResume and LinkedIn ProFinder connect you to a writer for USD 99 to 299 per review. Useful for senior-level candidates where the resume is worth optimising carefully.</li>
          <li><strong>You want ATS scoring against specific job descriptions.</strong> Jobscan is the only tool specifically focused on this. USD 49.95/month for unlimited scans. If you are applying to 10+ jobs per week, worth it.</li>
          <li><strong>You need extensive content assistance and lack baseline writing skill.</strong> Resume.io and Zety have strong auto-suggest libraries that beat starting from scratch for candidates who hate writing.</li>
        </ol>
        <p className="mt-4">
          For everyone else, a good free builder + ChatGPT or Claude for ad-hoc bullet rewrites covers 95% of what paid builders offer.
        </p>
      </section>

      <section id="privacy" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy: what each builder does with your data</h2>
        <p>
          Most resume builders store your resume server-side by default. That is fine for functionality but means: (1) breach risk (several builders have had breaches; LinkedIn 2012, Resume.io unverified 2019), (2) your resume is searchable internally, (3) &quot;free&quot; sometimes means &quot;resume goes to partner recruiter networks&quot;.
        </p>
        <p className="mt-4">
          Options ranked by privacy (most to least):
        </p>
        <ol className="list-decimal pl-5 mt-4 space-y-2">
          <li><strong>Open-source + self-hosted</strong> (Reactive-Resume, HackMyResume). Best privacy; worst UX.</li>
          <li><strong>localStorage-first</strong> (ResumeBuildz). Data on your device by default; sync is opt-in.</li>
          <li><strong>Server-side with clear privacy policy</strong> (Resume.io, Novoresume). Data stored but not sold.</li>
          <li><strong>Server-side, data shared with partners</strong> (Indeed, some free tools). Resume enters recruiter sourcing pools.</li>
          <li><strong>Ambiguous</strong> (unmaintained free tools). Assume worst case.</li>
        </ol>
      </section>

      <section id="open" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Open source resume builders</h2>
        <p>
          If you want maximum privacy and full control:
        </p>
        <ul className="mt-4 space-y-2 list-disc pl-6">
          <li><strong>Reactive-Resume</strong> (AmruthPillai/Reactive-Resume on GitHub). Popular, actively maintained. Self-host or use the hosted free tier.</li>
          <li><strong>HackMyResume</strong>. CLI tool; generates from JSON. Best for developers who prefer writing resumes in code.</li>
          <li><strong>ResumeBuildz</strong> (Surya8991/ResumeBuildz). Our own tool, open source. Self-hostable.</li>
          <li><strong>Overleaf + LaTeX templates</strong>. Not strictly a builder, but the academic gold standard.</li>
        </ul>
        <p className="mt-4">
          Trade-offs: open-source tools require more technical skill and often lack the UX polish of commercial options. Worth it for privacy-sensitive industries.
        </p>
      </section>

      <section id="checklist" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What to look for in a resume builder</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Free export without watermark.</strong> If you cannot get a clean PDF out without paying, the tool is not free.</li>
          <li><strong>ATS-tested templates.</strong> The builder should explicitly state its templates pass ATS parsing. Ideally link to tested scores.</li>
          <li><strong>Multiple export formats.</strong> PDF + DOCX minimum. Some ATS require DOCX.</li>
          <li><strong>Clear pricing.</strong> If the &quot;free trial&quot; is buried or hard to cancel, that signals the rest of the experience.</li>
          <li><strong>Data policy.</strong> What happens to your resume? Read the privacy policy.</li>
          <li><strong>AI features, if you want them.</strong> Bullet rewrites, keyword suggestions. Most free builders have some form.</li>
          <li><strong>Cover letter integration.</strong> Matching design with the resume. Small thing; makes a polished impression.</li>
        </ol>
      </section>

      <section id="faq" className="mt-12 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is there a truly 100% free resume builder?', a: 'Yes. Indeed Resume Builder, ResumeBuildz, and open-source tools (Reactive-Resume) all offer full-function build + export without paywalls. Most other "free" builders paywall the download.' },
            { q: 'Do paid resume builders produce better resumes?', a: 'Not inherently. What you write matters far more than which builder you use. A great resume in any template beats a mediocre resume in a polished one.' },
            { q: 'What is the best AI resume builder?', a: 'All the major builders (Zety, Resume.io, ResumeBuildz, Rezi, Kickresume) now have AI. Quality varies. See our in-depth AI resume builder comparison for details.' },
            { q: 'Should I pay for resume writing services?', a: 'For very senior roles (Director+), possibly. A USD 200 to 500 expert review on a USD 50L+ compensation package is high-ROI. For mid-career or below, you can get 80% of the value from a good builder + friends for review.' },
            { q: 'How do I cancel a resume builder "trial"?', a: 'Set a calendar reminder for 48 hours before the trial ends. Cancel via account settings; if that fails, email support AND dispute with your card issuer. Several builders make cancellation deliberately slow.' },
            { q: 'Which builders are actually recommended on Reddit?', a: 'r/resumes consistently points people to free tools or LaTeX. ResumeBuildz, Indeed Resume Builder, and Reactive-Resume get the most positive mentions. Zety and Resume.io catch frequent complaints about trial-cancellation friction.' },
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
        <h2 className="text-2xl font-bold mb-3">Try ResumeBuildz free</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Genuinely free. No paywalled download. localStorage-first privacy. Open source on GitHub.
        </p>
        <button onClick={() => openGateway('/builder')} className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 text-sm font-bold transition-colors">
          Start building free
        </button>
      </section>
    </BlogPostLayout>
  );
}
