'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

export default function ATSGuidePage() {
  useEffect(() => {
    document.title = 'Complete ATS Guide - How to Pass ATS Screening | ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Learn how Applicant Tracking Systems work and how to optimize your resume to pass ATS screening. Complete guide with tips and statistics.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Learn how Applicant Tracking Systems work and how to optimize your resume to pass ATS screening. Complete guide with tips and statistics.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Complete ATS Guide - How to Pass ATS Screening | ResumeForge');
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              ATS Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up delay-100">
              How to Beat ATS: The Complete Guide
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-200">
              75% of resumes never reach a human recruiter. Here&apos;s how ATS works, why your resume might be getting filtered out, and exactly how to fix it.
            </p>
          </div>
        </section>

        {/* What is ATS */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-start gap-4 md:gap-6 animate-fade-in-up">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is an ATS?</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  An Applicant Tracking System (ATS) is software that companies use to sort through job applications. According to Jobscan, 98% of Fortune 500 companies use one. When you submit your resume online, it almost always goes through an ATS before any human reads it.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Here&apos;s what happens: the ATS scans your resume, pulls out your contact info, job titles, skills, and education, then compares everything against the job description. If your resume doesn&apos;t match enough keywords and criteria, it gets filtered out -- and no recruiter ever sees it.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The good news? Once you understand how ATS works, it&apos;s not hard to beat. You can check your resume right now with our <Link href="/builder" className="text-blue-500 hover:underline">free ATS score checker</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How ATS Works */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">How ATS Works</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Understanding the ATS pipeline helps you optimize your resume for each stage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Resume Upload', desc: 'You submit your resume through an online portal or email. The ATS receives and stores the file.', icon: '📄' },
                { step: '2', title: 'Parsing', desc: 'The system extracts text from your resume, identifying sections like experience, education, and skills.', icon: '🔍' },
                { step: '3', title: 'Keyword Match', desc: 'Your resume is compared against the job description. The ATS looks for matching keywords and phrases.', icon: '🔑' },
                { step: '4', title: 'Ranking', desc: 'Resumes are scored and ranked. Top-scoring resumes are forwarded to recruiters for review.', icon: '📊' },
              ].map((item, i) => (
                <div key={item.step} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center relative animate-fade-in-up delay-${(i + 1) * 100}`}>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 animate-fade-in-up">ATS Statistics That Matter</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { stat: '75%', desc: 'of resumes are filtered out by ATS before a recruiter ever reads them (Jobscan, 2024)' },
                { stat: '98%', desc: 'of Fortune 500 companies use an ATS to screen applicants (Jobscan)' },
                { stat: '250+', desc: 'applications per corporate job posting on average (Glassdoor, 2024)' },
                { stat: '6 sec', desc: 'is the average time a recruiter spends on an initial resume scan (Ladders, 2024)' },
              ].map((item, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center animate-fade-in-up delay-${(i + 1) * 100}`}>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 animate-fade-in-up">10 Ways to Get Past ATS Screening</h2>
            <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
              These are the tactics that actually work. Each one addresses a specific reason resumes get filtered out.
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
                { num: 10, title: 'Use an ATS-Optimized Template', desc: 'Start with a template that\'s already built for ATS compatibility. ResumeForge\'s 20 templates are tested against real ATS parsers.' },
              ].map((tip, i) => (
                <div key={tip.num} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 animate-fade-in-up">Common ATS Mistakes to Avoid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Using Creative File Formats', desc: 'Submitting resumes as JPG, PNG, or in portfolio formats that ATS cannot parse.' },
                { title: 'Stuffing Keywords Unnaturally', desc: 'Hiding white text or cramming keywords out of context gets flagged or ignored by modern ATS.' },
                { title: 'Using Only Graphics and Icons', desc: 'Replacing text with icons for contact info, skills ratings as bars, or image-based layouts.' },
                { title: 'Ignoring Job Description Language', desc: 'Using different terminology than the job posting, even if they mean the same thing.' },
                { title: 'Multi-Column Complex Layouts', desc: 'Fancy two or three-column designs can scramble the reading order for ATS parsers.' },
              ].map((mistake, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Check Your Resume&apos;s ATS Score
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Upload your resume or build one from scratch. Our 12-point ATS checker shows you exactly what to fix -- keyword gaps, formatting issues, and weak verbs. You can also browse our <Link href="/templates" className="text-blue-400 hover:underline">ATS-friendly templates</Link> or read our <Link href="/resume-tips" className="text-blue-400 hover:underline">resume writing tips</Link>.
            </p>
            <Link
              href="/builder"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
            >
              Check ATS Score Now
            </Link>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is an ATS?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "An Applicant Tracking System (ATS) is software used by companies to automatically scan, filter, and rank resumes before a human recruiter ever sees them. 98% of Fortune 500 companies use ATS software.",
                },
              },
              {
                "@type": "Question",
                name: "Why do 75% of resumes get rejected by ATS?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Most resumes get filtered out because they use complex formatting, missing keywords from the job description, non-standard section headings, or file formats that ATS cannot parse correctly.",
                },
              },
              {
                "@type": "Question",
                name: "What file format is best for ATS?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DOCX has the highest ATS compatibility, followed closely by PDF. Never submit resumes as JPG, PNG, or image files — ATS systems cannot read text from images.",
                },
              },
              {
                "@type": "Question",
                name: "How do I make my resume ATS-friendly?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Use standard section headings like Work Experience, Education, and Skills. Mirror keywords from the job description. Avoid tables, text boxes, headers/footers, and graphics. Use a clean single-column layout and submit as PDF or DOCX.",
                },
              },
              {
                "@type": "Question",
                name: "How can I check my resume's ATS score?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ResumeForge has a free built-in ATS checker with 12 analysis tools including keyword matching, formatting checks, readability scoring, and active voice detection — no sign-up required.",
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
