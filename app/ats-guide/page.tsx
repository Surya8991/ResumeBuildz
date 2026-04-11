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

export default function ATSGuidePage() {
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
                  className={`text-sm font-medium transition-colors ${
                    link.href === '/ats-guide'
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
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
              ATS Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              The Complete ATS Guide
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Applicant Tracking Systems and how to get your resume past them.
            </p>
          </div>
        </section>

        {/* What is ATS */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is an ATS?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  An Applicant Tracking System (ATS) is software used by employers and recruiters to manage the recruitment process. It collects, scans, sorts, and ranks job applications automatically. When you submit your resume online, it almost always goes through an ATS before a human ever sees it.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The ATS parses your resume into a structured format, extracts key information like your contact details, work experience, education, and skills, and then compares this data against the job description. If your resume does not match enough criteria, it may never reach a recruiter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How ATS Works */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">How ATS Works</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Understanding the ATS pipeline helps you optimize your resume for each stage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Resume Upload', desc: 'You submit your resume through an online portal or email. The ATS receives and stores the file.', icon: '📄' },
                { step: '2', title: 'Parsing', desc: 'The system extracts text from your resume, identifying sections like experience, education, and skills.', icon: '🔍' },
                { step: '3', title: 'Keyword Match', desc: 'Your resume is compared against the job description. The ATS looks for matching keywords and phrases.', icon: '🔑' },
                { step: '4', title: 'Ranking', desc: 'Resumes are scored and ranked. Top-scoring resumes are forwarded to recruiters for review.', icon: '📊' },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center relative">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATS Statistics */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">ATS Statistics You Should Know</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { stat: '75%', desc: 'of resumes are rejected by ATS before reaching a human recruiter' },
                { stat: '98%', desc: 'of Fortune 500 companies use ATS to filter candidates' },
                { stat: '250+', desc: 'applications are received for a single corporate job posting on average' },
                { stat: '70%', desc: 'of jobs are filled through networking and optimized applications' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">{item.stat}</div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Pass ATS */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">10 Tips to Pass ATS Screening</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              Follow these proven strategies to increase your chances of getting past the ATS.
            </p>
            <div className="space-y-4">
              {[
                { num: 1, title: 'Use Relevant Keywords', desc: 'Mirror the exact language from the job description. Include both spelled-out terms and acronyms (e.g., "Search Engine Optimization (SEO)").' },
                { num: 2, title: 'Stick to Standard Headings', desc: 'Use conventional section headings like "Work Experience," "Education," and "Skills" that ATS systems expect.' },
                { num: 3, title: 'Keep Formatting Simple', desc: 'Avoid complex layouts, columns, text boxes, headers/footers, and fancy formatting that can confuse parsers.' },
                { num: 4, title: 'Submit as PDF or DOCX', desc: 'These are the most widely supported formats. Check the job posting for any format preference.' },
                { num: 5, title: 'Avoid Images and Tables', desc: 'ATS cannot read text embedded in images, graphics, charts, or complex tables.' },
                { num: 6, title: 'Use Strong Action Verbs', desc: 'Start bullet points with impactful verbs like "Led," "Developed," "Implemented," "Achieved," and "Optimized."' },
                { num: 7, title: 'Quantify Your Achievements', desc: 'Use numbers and metrics to demonstrate impact: percentages, dollar amounts, team sizes, and time saved.' },
                { num: 8, title: 'Tailor Each Application', desc: 'Customize your resume for every job. One-size-fits-all resumes score poorly with ATS keyword matching.' },
                { num: 9, title: 'Proofread Carefully', desc: 'Typos and misspellings can prevent keyword matches. Double-check all text, especially technical terms.' },
                { num: 10, title: 'Use ResumeForge', desc: 'Our ATS-optimized templates and built-in ATS score checker help you create resumes that pass any system.' },
              ].map((tip) => (
                <div key={tip.num} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {tip.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common ATS Mistakes */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Common ATS Mistakes to Avoid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Using Creative File Formats', desc: 'Submitting resumes as JPG, PNG, or in portfolio formats that ATS cannot parse.' },
                { title: 'Stuffing Keywords Unnaturally', desc: 'Hiding white text or cramming keywords out of context gets flagged or ignored by modern ATS.' },
                { title: 'Using Only Graphics and Icons', desc: 'Replacing text with icons for contact info, skills ratings as bars, or image-based layouts.' },
                { title: 'Ignoring Job Description Language', desc: 'Using different terminology than the job posting, even if they mean the same thing.' },
                { title: 'Multi-Column Complex Layouts', desc: 'Fancy two or three-column designs can scramble the reading order for ATS parsers.' },
              ].map((mistake, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold text-lg">
                    &times;
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{mistake.title}</h3>
                    <p className="text-sm text-gray-600">{mistake.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ATS-Friendly Formats */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">ATS-Friendly File Formats</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">PDF</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">DOCX</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Other (JPG, PNG, etc.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { feature: 'ATS Compatibility', pdf: 'High', docx: 'Highest', other: 'None' },
                    { feature: 'Formatting Preserved', pdf: 'Excellent', docx: 'Good', other: 'N/A' },
                    { feature: 'Parsing Accuracy', pdf: 'Good', docx: 'Best', other: 'Not Supported' },
                    { feature: 'Universal Support', pdf: 'Yes', docx: 'Yes', other: 'No' },
                    { feature: 'Recommended', pdf: 'Yes', docx: 'Yes', other: 'No' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">{row.pdf}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">{row.docx}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Check Your Resume&apos;s ATS Score
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Use our free ATS score checker to see how your resume performs and get actionable suggestions for improvement.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Check ATS Score Now
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
