'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/ats-guide', label: 'ATS Guide' },
  { href: '/resume-tips', label: 'Resume Tips' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const structureParts = [
  {
    step: '1',
    title: 'Opening Paragraph',
    desc: 'Hook the reader immediately. State the position you are applying for, how you found it, and one compelling reason you are the right fit. If you have a referral, mention it here.',
    example: 'As a senior full-stack engineer with 7 years of experience building scalable SaaS platforms, I was excited to see your opening for a Lead Engineer...',
  },
  {
    step: '2',
    title: 'Why This Company',
    desc: 'Show you have researched the company. Reference their mission, recent news, products, or values. Explain why this company specifically appeals to you and how your goals align.',
    example: 'Your commitment to democratizing financial literacy through technology resonates deeply with my own passion for building tools that make complex systems accessible...',
  },
  {
    step: '3',
    title: 'Your Value Proposition',
    desc: 'This is the core of your letter. Highlight 2-3 specific achievements with metrics that directly relate to the job requirements. Draw a clear line from your experience to their needs.',
    example: 'At my current role, I led the migration of a monolithic Rails app to microservices, reducing deployment time by 80% and improving system reliability to 99.99% uptime...',
  },
  {
    step: '4',
    title: 'Closing Statement',
    desc: 'Reiterate your enthusiasm, include a clear call to action, and thank the reader. Keep it confident but not presumptuous. Mention your availability for an interview.',
    example: 'I would welcome the opportunity to discuss how my experience in scaling engineering teams could contribute to your growth goals. I am available for a conversation at your convenience.',
  },
];

const industryTemplates = [
  {
    industry: 'Software Engineering',
    icon: '💻',
    opening: 'With 5+ years building production-grade applications in React and Node.js, and a track record of reducing load times by 60%, I am eager to bring my full-stack expertise to...',
  },
  {
    industry: 'Product Management',
    icon: '📋',
    opening: 'Having launched 3 B2B products from zero to $5M ARR, I understand the intersection of user needs, business goals, and technical constraints that defines great product management at...',
  },
  {
    industry: 'Data Science',
    icon: '📊',
    opening: 'As a data scientist who has built ML pipelines processing 10M+ daily predictions with 94% accuracy, I am excited about the opportunity to drive data-informed decisions at...',
  },
  {
    industry: 'Marketing',
    icon: '📣',
    opening: 'With a proven record of growing organic traffic by 300% and managing $2M+ annual ad budgets with 4.5x ROAS, I am excited to bring my growth marketing expertise to...',
  },
  {
    industry: 'Finance',
    icon: '📈',
    opening: 'As a CFA charterholder with 8 years of experience in equity research covering the technology sector, managing coverage of 15+ companies with a combined market cap of $500B, I am drawn to...',
  },
  {
    industry: 'Healthcare',
    icon: '🏥',
    opening: 'With 6 years of clinical experience and a passion for improving patient outcomes through evidence-based practice, I am enthusiastic about joining your team to advance...',
  },
];

export default function CoverLetterGuidePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-white">
              Resume<span className="text-blue-400">Forge</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Build Resume
              </Link>
            </div>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-300 hover:text-white py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/"
                className="block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center mt-2"
              >
                Build Resume
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Cover Letter Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Cover Letter Guide
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Write compelling cover letters that get interviews and set you apart from other candidates.
            </p>
          </div>
        </section>

        {/* Why Cover Letters Matter */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Why Cover Letters Matter</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { stat: '83%', label: 'of hiring managers read cover letters' },
                { stat: '49%', label: 'say a cover letter is their second most valued document' },
                { stat: '2x', label: 'more likely to get an interview with a strong cover letter' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">{item.stat}</div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed text-center max-w-2xl mx-auto">
              A cover letter is your chance to tell a story that your resume cannot. It shows personality, motivation, and cultural fit. While some employers say they are optional, submitting a well-crafted cover letter almost always gives you an edge over candidates who skip it.
            </p>
          </div>
        </section>

        {/* Structure */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">The 4-Part Structure</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Follow this proven structure for a cover letter that is clear, compelling, and professional.
            </p>
            <div className="space-y-6">
              {structureParts.map((part) => (
                <div key={part.step} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {part.step}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{part.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{part.desc}</p>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 italic">&ldquo;{part.example}&rdquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Do&apos;s and Don&apos;ts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">&#10003;</span>
                  <h3 className="font-semibold text-green-700 text-lg">Do</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Address the hiring manager by name when possible',
                    'Research the company and reference specific details',
                    'Quantify your achievements with numbers',
                    'Match your tone to the company culture',
                    'Keep it to one page (250-400 words)',
                    'Proofread multiple times for errors',
                    'Include a clear call to action in closing',
                    'Explain employment gaps honestly if relevant',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-lg font-bold">&times;</span>
                  <h3 className="font-semibold text-red-600 text-lg">Don&apos;t</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Repeat your resume word for word',
                    'Use "To Whom It May Concern"',
                    'Focus only on what you want from the job',
                    'Write more than one page',
                    'Use a generic template without customization',
                    'Include salary requirements unless asked',
                    'Apologize for lack of experience',
                    'Send the same letter to every application',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Templates by Industry */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">Templates by Industry</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Sample opening lines tailored to different industries. Use these as inspiration for your own cover letter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryTemplates.map((tmpl) => (
                <div key={tmpl.industry} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-3xl mb-3">{tmpl.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-3">{tmpl.industry}</h3>
                  <p className="text-sm text-gray-500 italic leading-relaxed">&ldquo;{tmpl.opening}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Generation */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    AI-Powered Cover Letters
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    ResumeForge uses Groq-powered AI to generate personalized cover letters in seconds. Simply paste the job description and your resume data, and our AI will craft a tailored cover letter that highlights your most relevant experience, matches the company&apos;s tone, and follows the proven 4-part structure.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">Groq AI Powered</span>
                    <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">Job-Specific</span>
                    <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">Instant Generation</span>
                    <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">Editable Output</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Generate Your Cover Letter
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Let our AI create a tailored, professional cover letter that complements your resume and impresses hiring managers.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Generate Your Cover Letter
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Resume Builder</Link></li>
                <li><Link href="/templates" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Templates</Link></li>
                <li><Link href="/ats-guide" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">ATS Guide</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resume-tips" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Resume Tips</Link></li>
                <li><Link href="/cover-letter" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Cover Letters</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
