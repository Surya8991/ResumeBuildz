'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

const faqItems = [
  {
    question: 'Is ResumeForge free?',
    answer: 'The free tier includes all 20 templates, 12 ATS tools, DOCX and HTML export, and job description matching. No sign-up required. AI rewrites and PDF exports have daily limits on the free plan. Upgrade to Pro for unlimited access.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account is needed to start building. Just open the builder and go. Creating a free account is optional and lets you access Pro features when available.',
  },
  {
    question: 'Where is my data stored?',
    answer: "All your data is stored in your browser's localStorage. That's storage on your device, not on any server. We don't have servers that store user data. Your resume stays entirely on your machine. See our privacy policy for full details.",
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
    answer: "The AI feature uses the Groq API to provide intelligent suggestions for improving your resume content. You'll need your own free Groq API key, which you can obtain from Groq's website. Your data is sent directly from your browser to Groq  -  it never passes through our servers. The AI can help rewrite bullet points, suggest skills, and optimize your content for ATS systems.",
  },
  {
    question: 'Is my data private?',
    answer: "Yes, 100%. ResumeForge is entirely client-side, meaning all processing happens in your browser. We don't collect any data, use any cookies, or run any analytics. Your resume content is never sent to any server (unless you optionally use the AI feature, which communicates directly with Groq).",
  },
  {
    question: 'What is ATS?',
    answer: 'ATS stands for Applicant Tracking System. It\'s software that scans and filters resumes before a recruiter sees them. About 98% of Fortune 500 companies use one. If your resume doesn\'t match enough keywords from the job description, the ATS rejects it automatically. Read our complete ATS guide to learn how to beat it.',
  },
  {
    question: 'How do I get the best ATS score?',
    answer: 'Here are the key steps: (1) Use exact keywords from the job description, (2) stick to standard headings like "Experience," "Education," and "Skills," (3) avoid tables, columns, and graphics, (4) use a simple, single-column format, (5) include both full terms and acronyms (e.g., "Search Engine Optimization (SEO)"), and (6) run the built-in ATS Score Checker to catch what you missed. Our ATS guide covers each of these in detail.',
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
  {
    question: 'Can multiple people edit the same resume?',
    answer: 'Not yet. ResumeForge is currently a single-user tool. To share a resume with someone, export it as PDF, DOCX, or JSON and send the file. Real-time collaboration is on our roadmap for the Pro plan.',
  },
  {
    question: 'How do I share my resume?',
    answer: 'Export your resume in your preferred format: PDF for ATS systems and recruiters, DOCX for Word users, or HTML for online portfolios. You can also export the raw JSON file as a backup or to import on another device.',
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
  useEffect(() => {
    document.title = 'FAQ - ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Frequently asked questions about ResumeForge. Learn about features, data privacy, export formats, and AI capabilities.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Frequently asked questions about ResumeForge. Learn about features, data privacy, export formats, and AI capabilities.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'FAQ - ResumeForge');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300 animate-fade-in-up delay-100">Everything you need to know about ResumeForge</p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, i) => (
            <div key={item.question} className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
              <FAQItem question={item.question} answer={item.answer} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">We&apos;re here to help. You can also check our <Link href="/ats-guide" className="text-blue-500 hover:underline">ATS guide</Link> and <Link href="/resume-tips" className="text-blue-500 hover:underline">resume writing tips</Link>, or reach out directly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
            <Link href="/builder" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Start Building
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is ResumeForge free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The free tier includes all 20 templates, 12 ATS tools, DOCX/HTML export, and job description matching. AI rewrites and PDF exports have daily limits. Upgrade to Pro for unlimited access.",
                },
              },
              {
                "@type": "Question",
                name: "Does ResumeForge store my data?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. ResumeForge is entirely client-side. Your resume data never leaves your browser and is stored only in your device's localStorage. There are no servers, no tracking, and no analytics.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to create an account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No account is needed to start building. Creating an account is optional and lets you access Pro features when available.",
                },
              },
              {
                "@type": "Question",
                name: "What formats can I export my resume in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ResumeForge supports PDF export (via browser print), DOCX (Microsoft Word), and HTML. PDF gives the best visual output. DOCX is best for ATS compatibility.",
                },
              },
              {
                "@type": "Question",
                name: "How do the AI features work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "AI features use the Groq API (Llama 3.3 70B model). You bring your own free Groq API key from console.groq.com. It is stored only in your browser and never sent to any ResumeForge server.",
                },
              },
              {
                "@type": "Question",
                name: "Are the templates ATS-friendly?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. All 20 templates are tested for ATS compatibility with clean formatting, standard section headings, and no graphics or text boxes that confuse resume parsers.",
                },
              },
            ],
          }),
        }}
      />

      <SiteFooter />
    </div>
  );
}
