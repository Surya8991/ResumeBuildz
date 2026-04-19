'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const actionVerbs = {
  Leadership: ['Led', 'Directed', 'Managed', 'Oversaw', 'Coordinated', 'Mentored', 'Supervised', 'Spearheaded', 'Championed', 'Orchestrated'],
  Technical: ['Developed', 'Engineered', 'Implemented', 'Architected', 'Automated', 'Debugged', 'Configured', 'Deployed', 'Integrated', 'Optimised'],
  Communication: ['Presented', 'Authored', 'Collaborated', 'Facilitated', 'Negotiated', 'Persuaded', 'Articulated', 'Briefed', 'Advocated', 'Consulted'],
  Achievement: ['Achieved', 'Exceeded', 'Delivered', 'Improved', 'Increased', 'Reduced', 'Generated', 'Transformed', 'Accelerated', 'Maximised'],
};

const resumeSections = [
  { title: 'Contact Information', content: 'Include your full name, phone number, professional email, LinkedIn URL, and city/state. Avoid full street addresses for privacy. Make sure your email sounds professional.' },
  { title: 'Professional Summary', content: 'Write 2-3 sentences highlighting your experience level, key skills, and career goals. Tailor it to each job. Use keywords from the job description. Avoid generic statements like "hard worker" or "team player."' },
  { title: 'Work Experience', content: 'List positions in reverse chronological order. Include company name, job title, dates, and location. Use 3-5 bullet points per role starting with action verbs. Quantify results wherever possible.' },
  { title: 'Education', content: 'Include degree, institution, graduation date, and GPA if above 3.5. Add relevant coursework, honors, or academic projects. Recent graduates can place this section before experience.' },
  { title: 'Skills', content: 'List technical skills, tools, languages, and frameworks relevant to the role. Organise by category. Match skill names to those in the job description. Avoid rating scales.' },
  { title: 'Projects & Certifications', content: 'Include relevant projects with brief descriptions and outcomes. List professional certifications with issuing organisations and dates. These add credibility and demonstrate initiative.' },
];

const commonMistakes = [
  { title: 'Using an Objective Statement', desc: 'Replace with a professional summary. Objectives focus on what you want; summaries focus on what you offer.' },
  { title: 'Including Irrelevant Experience', desc: 'Every item should relate to the target role. Cut old or unrelated positions to keep your resume focused.' },
  { title: 'Listing Duties Instead of Achievements', desc: '"Responsible for" tells nothing about impact. Show what you accomplished, not just what you were supposed to do.' },
  { title: 'Making It Too Long', desc: 'Keep to 1 page for early career, 2 pages for experienced professionals. Recruiters spend 6 to 7 seconds on initial scan.' },
  { title: 'Using Passive Language', desc: '"Was tasked with" and "helped with" are weak. Start every bullet with a strong action verb in past tense.' },
  { title: 'Inconsistent Formatting', desc: 'Mixed fonts, inconsistent date formats, and uneven spacing look unprofessional. Use a template for consistency.' },
  { title: 'No Metrics or Numbers', desc: 'Vague claims are forgettable. "Increased sales by 40%" is far more compelling than "Improved sales performance."' },
  { title: 'Typos and Grammar Errors', desc: '58% of recruiters reject resumes with typos. Proofread multiple times and have someone else review it.' },
];

const industryTips = [
  { industry: 'Tech', icon: '💻', tips: ['List programming languages and frameworks prominently', 'Include GitHub or portfolio links', 'Highlight system design and scalability experience', 'Mention Agile/Scrum methodologies'] },
  { industry: 'Finance', icon: '📈', tips: ['Emphasise quantitative and analytical skills', 'Include relevant certifications (CFA, CPA)', 'Highlight regulatory compliance knowledge', 'Show P&L impact with dollar amounts'] },
  { industry: 'Marketing', icon: '📣', tips: ['Showcase campaign results with ROI metrics', 'Include digital marketing tools and platforms', 'Link to portfolio or campaign case studies', 'Highlight content creation and analytics skills'] },
  { industry: 'Healthcare', icon: '🏥', tips: ['List all licenses and certifications first', 'Include clinical hours and specialisations', 'Mention EHR/EMR systems experience', 'Highlight patient outcomes and compliance record'] },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'summary', label: 'Writing your professional summary' },
  { id: 'verbs', label: '40 action verbs' },
  { id: 'before-after', label: 'Weak vs strong bullets' },
  { id: 'sections', label: 'Resume sections guide' },
  { id: 'mistakes', label: '8 mistakes to avoid' },
  { id: 'industry', label: 'Industry-specific tips' },
  { id: 'filename', label: 'File name + format' },
  { id: 'length-rules', label: 'Length discipline' },
  { id: 'proofread', label: 'Proofreading workflow' },
  { id: 'faq', label: 'FAQ' },
];

const RELATED = [
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
  { title: 'Fresher Resume Format 2026', slug: 'fresher-resume', excerpt: 'The exact 7-section format that beats Indian and global ATS for freshers.', read: 11 },
  { title: 'Resume for Career Change', slug: 'resume-for-career-change', excerpt: 'Transferable-skills rewriting and 6 common pivot examples.', read: 11 },
  { title: '8 Naukri Resume Tips That 3x Recruiter Views', slug: 'naukri-resume-tips', excerpt: 'How Arjun went from 2 to 40 recruiter views a week on Naukri.', read: 9 },
];

export default function ResumeTipsPage() {
  const { openGateway } = useLoginGateway();
  const [openSection, setOpenSection] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Resume Writing Tips & Action Verbs | ResumeBuildz';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Expert resume writing tips including action verbs, achievement examples, and industry-specific advice. Improve your resume today.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Expert resume writing tips including action verbs, achievement examples, and industry-specific advice. Improve your resume today.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Resume Writing Tips & Action Verbs | ResumeBuildz');
  }, []);

  return (
    <BlogPostLayout
      category="Resume Writing"
      breadcrumbCurrent="Resume writing tips"
      title="Resume Writing Tips That Actually Work"
      subtitle="Recruiters spend about 6 seconds scanning your resume (Ladders, 2024). Here is how to make every word count and land more interviews."
      dateModified="2026-04-15"
      readingTime={9}
      toc={TOC}
      related={RELATED}
    >
      <section id="intro" className="scroll-mt-6">
        <p>Tip: implement just 3 to 4 of these for immediate impact. You do not need them all at once. Below are the practical moves that consistently lift resume response rates, from summary writing to industry-specific tailoring.</p>
      </section>

      <section id="summary" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Writing your professional summary</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
              <h3 className="font-semibold text-green-800">Do&apos;s</h3>
            </div>
            <ul className="space-y-2">
              {['Lead with your years of experience and job title', 'Include 2-3 top relevant skills', 'Mention a key achievement with a number', 'Tailor it to the specific job posting', 'Keep it to 2-3 concise sentences'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-800"><span className="text-green-600 mt-0.5">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">×</span>
              <h3 className="font-semibold text-red-700">Don&apos;ts</h3>
            </div>
            <ul className="space-y-2">
              {['Use vague buzzwords like "go-getter" or "synergy"', 'Write a paragraph longer than 4 lines', 'Copy paste the same summary for every job', 'Use first person ("I am a...")', 'Include salary expectations or personal info'].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-800"><span className="text-red-600 mt-0.5">×</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="verbs" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">40 action verbs that grab attention</h2>
        <p className="text-gray-600 mb-5">Weak verbs kill resumes. Replace &ldquo;responsible for&rdquo; and &ldquo;helped with&rdquo; by starting every bullet point with one of these.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(actionVerbs).map(([category, verbs]) => (
            <div key={category} className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-indigo-600 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {verbs.map((verb) => (
                  <span key={verb} className="bg-gray-100 text-gray-700 text-sm px-2.5 py-1 rounded">{verb}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="before-after" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Before and after: weak vs strong bullet points</h2>
        <p className="text-gray-600 mb-5">Numbers make your resume memorable. A recruiter will not remember &ldquo;improved sales&rdquo; but will remember &ldquo;$2.4M revenue growth.&rdquo;</p>
        <div className="space-y-3">
          {[
            { weak: 'Managed a team', strong: 'Led a team of 12 engineers, increasing sprint velocity by 35%' },
            { weak: 'Improved sales', strong: 'Grew quarterly revenue by $2.4M through targeted outbound campaigns' },
            { weak: 'Handled customer support', strong: 'Resolved 150+ tickets per week with a 98% customer satisfaction rating' },
            { weak: 'Reduced costs', strong: 'Cut operational expenses by 22% ($180K annually) through process automation' },
            { weak: 'Built a website', strong: 'Developed a React application serving 50K+ daily active users with 99.9% uptime' },
          ].map((ex) => (
            <div key={ex.weak} className="bg-white rounded-lg border border-gray-200 p-4 grid sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">×</span>
                <div><span className="text-[10px] font-semibold text-red-600 uppercase tracking-wide">Weak</span><p className="text-sm text-gray-600 mt-0.5">{ex.weak}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                <div><span className="text-[10px] font-semibold text-green-700 uppercase tracking-wide">Strong</span><p className="text-sm text-gray-800 mt-0.5 font-medium">{ex.strong}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="sections" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Resume sections guide</h2>
        <p className="text-gray-600 mb-5">What to include in each section of your resume for maximum impact.</p>
        <div className="space-y-2">
          {resumeSections.map((section, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setOpenSection(openSection === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                <span className={`text-indigo-600 text-xl leading-none transition-transform ${openSection === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openSection === i && (<div className="px-4 pb-4"><p className="text-sm text-gray-700 leading-relaxed">{section.content}</p></div>)}
            </div>
          ))}
        </div>
      </section>

      <section id="mistakes" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">8 mistakes to avoid</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {commonMistakes.map((m, i) => (
            <div key={m.title} className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <div><h3 className="font-semibold text-gray-900 mb-1">{m.title}</h3><p className="text-sm text-gray-700">{m.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="industry" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Industry-specific tips</h2>
        <p className="text-gray-600 mb-5">Every industry has different expectations. Tailor your resume to match.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {industryTips.map((ind) => (
            <div key={ind.industry} className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl mb-2">{ind.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-3">{ind.industry}</h3>
              <ul className="space-y-1.5">
                {ind.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-700"><span className="text-indigo-600 mt-0.5">•</span>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="filename" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">File name and format rules</h2>
        <p>
          Recruiters see your filename before they open the file. Sloppy names signal sloppy candidates. Use these rules:
        </p>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="font-semibold text-emerald-900 mb-2">Do name your file</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li><code className="bg-white px-1.5 rounded">Arjun-Iyer-Resume.pdf</code></li>
              <li><code className="bg-white px-1.5 rounded">Arjun-Iyer-Resume-ProductManager.pdf</code></li>
              <li><code className="bg-white px-1.5 rounded">Arjun-Iyer-CV-2026.pdf</code></li>
            </ul>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="font-semibold text-rose-900 mb-2">Do not name your file</p>
            <ul className="space-y-1.5 text-sm text-gray-800 list-disc pl-5">
              <li><code className="bg-white px-1.5 rounded line-through">resume-final-v3.pdf</code></li>
              <li><code className="bg-white px-1.5 rounded line-through">my-resume.docx</code></li>
              <li><code className="bg-white px-1.5 rounded line-through">resume-keyword-stuffed.pdf</code></li>
              <li><code className="bg-white px-1.5 rounded line-through">untitled.pdf</code></li>
            </ul>
          </div>
        </div>
        <p className="mt-5">
          <strong>Format:</strong> PDF by default. Save with selectable text (not a scanned image). Save As PDF from Word or export from your resume builder with the PDF option, not Print to PDF (which sometimes rasterises text). Keep file size under 1 MB; a well-formatted text-based PDF is usually 150 to 400 KB.
        </p>
      </section>

      <section id="length-rules" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Length discipline: when to cut</h2>
        <p>
          Most resumes that feel &quot;thin&quot; are actually too long. Density matters more than page count. Run this cut-test on each of your bullets:
        </p>
        <ol className="mt-5 list-decimal pl-5 space-y-3">
          <li><strong>Can the first 3 words be deleted?</strong> &quot;Was responsible for managing&quot; becomes &quot;Managed&quot;. Do this on every bullet.</li>
          <li><strong>Does it contain a number?</strong> If not, either find one or cut the bullet. Vague bullets inflate the resume without convincing anyone.</li>
          <li><strong>Is the verb strong?</strong> &quot;Worked on&quot; is filler. &quot;Built&quot;, &quot;Shipped&quot;, &quot;Owned&quot; are not.</li>
          <li><strong>Is it role-relevant?</strong> A bullet for a past job that does not relate to your target role can go.</li>
          <li><strong>Does it repeat another bullet?</strong> Two bullets both saying &quot;led the team&quot; become one.</li>
        </ol>
        <p className="mt-5">
          For deeper guidance on 1-page vs 2-page decisions, see our <Link href="/resume-length" className="text-indigo-600 hover:underline">resume length guide</Link>.
        </p>
      </section>

      <section id="proofread" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Proofreading workflow</h2>
        <p>
          58% of recruiters reject resumes with typos. Your own eye goes blind to your own writing after about 3 passes. Use this 4-step workflow before any submission:
        </p>
        <ol className="mt-5 list-decimal pl-5 space-y-3">
          <li><strong>Read aloud.</strong> Your mouth catches awkward phrasing your eye glosses over.</li>
          <li><strong>Read backwards.</strong> Start from the last bullet and read each one in reverse order. This breaks the narrative flow and surfaces typos.</li>
          <li><strong>Run through a grammar tool.</strong> Grammarly, LanguageTool, or Claude/ChatGPT with &quot;find typos only, do not rewrite&quot;.</li>
          <li><strong>Have someone else read it.</strong> Fresh eyes catch everything the previous 3 steps missed. If no friend is available, print the resume and wait 24 hours before re-reading.</li>
        </ol>
      </section>

      <section id="faq" className="mt-10 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How often should I update my resume?', a: 'At minimum, every 6 months even when not actively job searching. Record new wins while they are fresh. A resume updated quarterly reads sharper than one rewritten in panic the week you start looking.' },
            { q: 'Should I include my photo?', a: 'In India: only if the role is customer-facing (hospitality, sales). In the US / UK / Canada: never. Many ATS systems flag photos; some companies discard photo-containing resumes to avoid bias-hiring complaints.' },
            { q: 'Do I need a references section?', a: 'No. "References available on request" is also unnecessary. The recruiter will ask if they need them. Use that space for a stronger section.' },
            { q: 'How important is the resume summary for mid-career candidates?', a: 'Very. A strong 3-sentence summary is the only section read in the 6-second first scan. For 5+ years of experience, the summary compresses your career story into something scannable.' },
            { q: 'Should I put my LinkedIn URL?', a: 'Yes, if your LinkedIn is up to date and matches your resume. Use a custom URL (linkedin.com/in/firstname-lastname) not the default numeric one.' },
            { q: 'What if I have skills from hobbies?', a: 'Include them only if they are job-relevant. A photographer who learned Photoshop from wedding shoots can list Photoshop. A software engineer with a wedding-photography hobby should skip it.' },
            { q: 'Is using Canva for my resume okay?', a: 'For visual / creative roles, yes. For everything else, no. Canva templates often use multi-column layouts and image-based text that break ATS parsers.' },
            { q: 'Should I tailor bullet order to the job?', a: 'Yes. The first bullet of each role is the most-read. Put the most job-relevant one first. Reorder per application.' },
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
        <h2 className="text-2xl font-bold text-white mb-3">Start building your resume</h2>
        <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Put these tips into action. Pick one of our <Link href="/templates" className="text-indigo-400 hover:underline">20 ATS-tested templates</Link>, use the AI to rewrite weak bullets, and run the <Link href="/ats-guide" className="text-indigo-400 hover:underline">ATS checker</Link> before you apply.</p>
        <button onClick={() => openGateway('/builder')} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">Start building your resume</button>
      </section>
    </BlogPostLayout>
  );
}
