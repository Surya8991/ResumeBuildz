'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

const actionVerbs = {
  Leadership: ['Led', 'Directed', 'Managed', 'Oversaw', 'Coordinated', 'Mentored', 'Supervised', 'Spearheaded', 'Championed', 'Orchestrated'],
  Technical: ['Developed', 'Engineered', 'Implemented', 'Architected', 'Automated', 'Debugged', 'Configured', 'Deployed', 'Integrated', 'Optimized'],
  Communication: ['Presented', 'Authored', 'Collaborated', 'Facilitated', 'Negotiated', 'Persuaded', 'Articulated', 'Briefed', 'Advocated', 'Consulted'],
  Achievement: ['Achieved', 'Exceeded', 'Delivered', 'Improved', 'Increased', 'Reduced', 'Generated', 'Transformed', 'Accelerated', 'Maximized'],
};

const resumeSections = [
  {
    title: 'Contact Information',
    content: 'Include your full name, phone number, professional email, LinkedIn URL, and city/state. Avoid full street addresses for privacy. Make sure your email sounds professional.',
  },
  {
    title: 'Professional Summary',
    content: 'Write 2-3 sentences highlighting your experience level, key skills, and career goals. Tailor it to each job. Use keywords from the job description. Avoid generic statements like "hard worker" or "team player."',
  },
  {
    title: 'Work Experience',
    content: 'List positions in reverse chronological order. Include company name, job title, dates, and location. Use 3-5 bullet points per role starting with action verbs. Quantify results wherever possible.',
  },
  {
    title: 'Education',
    content: 'Include degree, institution, graduation date, and GPA if above 3.5. Add relevant coursework, honors, or academic projects. Recent graduates can place this section before experience.',
  },
  {
    title: 'Skills',
    content: 'List technical skills, tools, languages, and frameworks relevant to the role. Organize by category. Match skill names to those in the job description. Avoid rating scales.',
  },
  {
    title: 'Projects & Certifications',
    content: 'Include relevant projects with brief descriptions and outcomes. List professional certifications with issuing organizations and dates. These add credibility and demonstrate initiative.',
  },
];

const commonMistakes = [
  { title: 'Using an Objective Statement', desc: 'Replace with a professional summary. Objectives focus on what you want; summaries focus on what you offer.' },
  { title: 'Including Irrelevant Experience', desc: 'Every item should relate to the target role. Cut old or unrelated positions to keep your resume focused.' },
  { title: 'Listing Duties Instead of Achievements', desc: '"Responsible for" tells nothing about impact. Show what you accomplished, not just what you were supposed to do.' },
  { title: 'Making It Too Long', desc: 'Keep to 1 page for early career, 2 pages for experienced professionals. Recruiters spend 6-7 seconds on initial scan.' },
  { title: 'Using Passive Language', desc: '"Was tasked with" and "helped with" are weak. Start every bullet with a strong action verb in past tense.' },
  { title: 'Inconsistent Formatting', desc: 'Mixed fonts, inconsistent date formats, and uneven spacing look unprofessional. Use a template for consistency.' },
  { title: 'No Metrics or Numbers', desc: 'Vague claims are forgettable. "Increased sales by 40%" is far more compelling than "Improved sales performance."' },
  { title: 'Typos and Grammar Errors', desc: '58% of recruiters reject resumes with typos. Proofread multiple times and have someone else review it.' },
];

const industryTips = [
  {
    industry: 'Tech',
    icon: '💻',
    tips: ['List programming languages and frameworks prominently', 'Include GitHub or portfolio links', 'Highlight system design and scalability experience', 'Mention Agile/Scrum methodologies'],
  },
  {
    industry: 'Finance',
    icon: '📈',
    tips: ['Emphasize quantitative and analytical skills', 'Include relevant certifications (CFA, CPA)', 'Highlight regulatory compliance knowledge', 'Show P&L impact with dollar amounts'],
  },
  {
    industry: 'Marketing',
    icon: '📣',
    tips: ['Showcase campaign results with ROI metrics', 'Include digital marketing tools and platforms', 'Link to portfolio or campaign case studies', 'Highlight content creation and analytics skills'],
  },
  {
    industry: 'Healthcare',
    icon: '🏥',
    tips: ['List all licenses and certifications first', 'Include clinical hours and specializations', 'Mention EHR/EMR systems experience', 'Highlight patient outcomes and compliance record'],
  },
];

export default function ResumeTipsPage() {
  useEffect(() => {
    document.title = 'Resume Writing Tips & Action Verbs | ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Expert resume writing tips including action verbs, achievement examples, and industry-specific advice. Improve your resume today.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Expert resume writing tips including action verbs, achievement examples, and industry-specific advice. Improve your resume today.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Resume Writing Tips & Action Verbs | ResumeForge');
  }, []);
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              Expert Advice
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up delay-100">
              Resume Writing Tips That Actually Work
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
              Recruiters spend about 6 seconds scanning your resume <span className="text-gray-500 text-sm">(Ladders, 2024)</span>. Here&apos;s how to make every word count and land more interviews.
            </p>
            <p className="text-sm text-blue-400 max-w-2xl mx-auto animate-fade-in-up delay-300 mt-4">
              Tip: Implement just 3 to 4 of these for immediate impact. You don&apos;t need them all at once.
            </p>
          </div>
        </section>

        {/* Writing Your Summary */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 animate-fade-in-up">Writing Your Professional Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">&#10003;</span>
                  <h3 className="font-semibold text-green-700 text-lg">Do&apos;s</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Lead with your years of experience and job title',
                    'Include 2-3 top relevant skills',
                    'Mention a key achievement with a number',
                    'Tailor it to the specific job posting',
                    'Keep it to 2-3 concise sentences',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-lg font-bold">&times;</span>
                  <h3 className="font-semibold text-red-600 text-lg">Don&apos;ts</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Use vague buzzwords like "go-getter" or "synergy"',
                    'Write a paragraph longer than 4 lines',
                    'Copy paste the same summary for every job',
                    'Use first person ("I am a...")',
                    'Include salary expectations or personal info',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-red-500 mt-0.5">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Action Verbs */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">40 Action Verbs That Grab Attention</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Weak verbs kill resumes. Replace &quot;responsible for&quot; and &quot;helped with&quot; by starting every bullet point with one of these.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(actionVerbs).map(([category, verbs], i) => (
                <div key={category} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-${(i + 1) * 100}`}>
                  <h3 className="font-semibold text-gray-900 mb-4 text-blue-500">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {verbs.map((verb) => (
                      <span key={verb} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quantifying Achievements */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">Before and After: Weak vs. Strong Bullet Points</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Numbers make your resume memorable. A recruiter won&apos;t remember &quot;improved sales&quot; but they&apos;ll remember &quot;$2.4M revenue growth.&quot; Here are real before-and-after examples.
            </p>
            <div className="space-y-4">
              {[
                { weak: 'Managed a team', strong: 'Led a team of 12 engineers, increasing sprint velocity by 35%' },
                { weak: 'Improved sales', strong: 'Grew quarterly revenue by $2.4M through targeted outbound campaigns' },
                { weak: 'Handled customer support', strong: 'Resolved 150+ tickets per week with a 98% customer satisfaction rating' },
                { weak: 'Reduced costs', strong: 'Cut operational expenses by 22% ($180K annually) through process automation' },
                { weak: 'Built a website', strong: 'Developed a React application serving 50K+ daily active users with 99.9% uptime' },
              ].map((ex, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs font-bold">&times;</span>
                    <div>
                      <span className="text-xs font-medium text-red-500 uppercase tracking-wide">Weak</span>
                      <p className="text-sm text-gray-600 mt-0.5">{ex.weak}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">&#10003;</span>
                    <div>
                      <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Strong</span>
                      <p className="text-sm text-gray-700 mt-0.5 font-medium">{ex.strong}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Sections Guide */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Resume Sections Guide</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              What to include in each section of your resume for maximum impact.
            </p>
            <div className="space-y-3">
              {resumeSections.map((section, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenSection(openSection === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${openSection === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSection === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 animate-fade-in-up">8 Mistakes to Avoid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonMistakes.map((mistake, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{mistake.title}</h3>
                      <p className="text-sm text-gray-600">{mistake.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry-Specific Tips */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Industry-Specific Tips</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Every industry has different expectations. Tailor your resume to match.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industryTips.map((ind, i) => (
                <div key={ind.industry} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up delay-${(i + 1) * 100}`}>
                  <div className="text-3xl mb-3">{ind.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-3">{ind.industry}</h3>
                  <ul className="space-y-2">
                    {ind.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-400 mt-0.5">&#8226;</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Start Building Your Resume
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Put these tips into action. Pick one of our <Link href="/templates" className="text-blue-400 hover:underline">20 ATS-tested templates</Link>, use the AI to rewrite weak bullet points, and run the <Link href="/ats-guide" className="text-blue-400 hover:underline">ATS checker</Link> before you apply.
            </p>
            <Link
              href="/builder"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Start Building Your Resume
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
