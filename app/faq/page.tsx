'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/ats-guide', label: 'ATS Guide' },
  { href: '/resume-tips', label: 'Resume Tips' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const faqItems = [
  {
    question: 'Is ResumeForge free?',
    answer: 'Yes, ResumeForge is completely free and open source. There are no hidden fees, no premium tiers, and no paywalls. All 20+ templates, the ATS scoring tool, AI suggestions, and every export format are available to everyone at no cost.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No, no sign-up or account creation is required. You can start building your resume immediately without providing any personal information, email address, or password. Just open the app and start typing.',
  },
  {
    question: 'Where is my data stored?',
    answer: "All your data is stored in your browser's localStorage. Nothing is ever sent to our servers because we don't have servers that store user data. Your resume information stays entirely on your device, giving you complete control over your data.",
  },
  {
    question: 'How do I transfer my resume to another device?',
    answer: 'You can export your resume data as a JSON backup file using Ctrl+S (or Cmd+S on Mac). This creates a complete backup of your resume that you can import on another device. You can also export your finished resume as PDF, DOCX, or HTML to share or print.',
  },
  {
    question: 'Can I have multiple resumes?',
    answer: 'Yes! ResumeForge supports up to 10 resume profiles. You can create different versions of your resume tailored for different job applications, industries, or career paths. Switch between profiles instantly using the profile manager.',
  },
  {
    question: 'What file formats can I import?',
    answer: 'ResumeForge supports importing resumes from multiple formats including PDF, DOCX, TXT, HTML, and Markdown (MD). The import feature intelligently parses your existing resume and maps the content to the appropriate sections.',
  },
  {
    question: 'What export formats are available?',
    answer: 'You can export your resume in three professional formats: PDF (best for submitting to employers and ATS systems), DOCX (Microsoft Word format for easy editing), and HTML (for web-based portfolios or online applications).',
  },
  {
    question: 'How does the AI feature work?',
    answer: "The AI feature uses the Groq API to provide intelligent suggestions for improving your resume content. You'll need your own free Groq API key, which you can obtain from Groq's website. Your data is sent directly from your browser to Groq — it never passes through our servers. The AI can help rewrite bullet points, suggest skills, and optimize your content for ATS systems.",
  },
  {
    question: 'Is my data private?',
    answer: "Yes, 100%. ResumeForge is entirely client-side, meaning all processing happens in your browser. We don't collect any data, use any cookies, or run any analytics. Your resume content is never sent to any server (unless you optionally use the AI feature, which communicates directly with Groq).",
  },
  {
    question: 'What is ATS?',
    answer: 'ATS stands for Applicant Tracking System. It is software used by employers and recruiters to manage job applications. ATS systems scan and parse resumes to filter candidates based on keywords, formatting, and relevance. ResumeForge helps you create resumes that are optimized to pass through these systems successfully.',
  },
  {
    question: 'How do I get the best ATS score?',
    answer: 'To maximize your ATS score: use keywords from the job description throughout your resume, stick to standard section headings (Experience, Education, Skills), avoid tables, columns, and graphics that ATS systems struggle to parse, use a clean and simple format, include both spelled-out and abbreviated terms (e.g., "Search Engine Optimization (SEO)"), and use the built-in ATS Score Checker to identify areas for improvement.',
  },
  {
    question: 'Can I use this commercially?',
    answer: "ResumeForge is released under a non-commercial license. You're free to use it for personal resume building, but commercial use (such as offering it as a paid service or integrating it into commercial products) requires a separate commercial license. Please contact us at Suryaraj8147@gmail.com for commercial licensing inquiries.",
  },
  {
    question: 'How do I report a bug?',
    answer: 'You can report bugs by opening an issue on our GitHub repository at github.com/Surya8991. Please include steps to reproduce the bug, your browser version, and any relevant screenshots. You can also reach out via our contact page.',
  },
  {
    question: 'What browsers are supported?',
    answer: 'ResumeForge supports all modern browsers including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge (version 90 and above). For the best experience, we recommend using the latest version of your preferred browser.',
  },
  {
    question: 'Is it mobile-friendly?',
    answer: 'Yes, ResumeForge is built with a fully responsive design that works on smartphones, tablets, and desktop computers. While you can view and make quick edits on mobile devices, we recommend using a desktop or laptop for the full resume-building experience.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-blue-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">ResumeForge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Build Resume
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <Link key={link.href} href={link.href} className="block text-gray-300 hover:text-white text-sm py-2 transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/" className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors">
                Build Resume
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">Everything you need to know about ResumeForge</p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">We&apos;re here to help. Reach out to us or start building your resume today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Start Building
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">ResumeForge</span>
            </div>
            <p className="text-sm">Build professional, ATS-optimized resumes right in your browser.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="/home" className="block hover:text-white transition-colors">Home</Link>
              <Link href="/templates" className="block hover:text-white transition-colors">Templates</Link>
              <Link href="/" className="block hover:text-white transition-colors">Build Resume</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <div className="space-y-2 text-sm">
              <Link href="/ats-guide" className="block hover:text-white transition-colors">ATS Guide</Link>
              <Link href="/resume-tips" className="block hover:text-white transition-colors">Resume Tips</Link>
              <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
