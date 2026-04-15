'use client';

import Link from 'next/link';
import { ArrowRight, ChevronLeft, CheckCircle2, Tag, Briefcase, MapPin, Sparkles, FileText, Lightbulb, Users, AlertTriangle, Quote, Wrench, HelpCircle, Mail, MessageSquare, DollarSign, Share2 } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TOC from '@/components/TOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleMeta from '@/components/ArticleMeta';
import ReadingProgress from '@/components/ReadingProgress';
import { useLoginGateway } from '@/components/LoginGateway';
import type { CompanyEntry } from '@/lib/resumeCompanyData';
import { getCompanyExtended } from '@/lib/resumeCompanyDataExtended';
import { getCompanyDeep } from '@/lib/resumeCompanyDataDeep';

interface Props {
  data: CompanyEntry;
  related: CompanyEntry[];
}

export default function CompanyResumeView({ data, related }: Props) {
  const { openGateway } = useLoginGateway();
  const extended = getCompanyExtended(data.slug);
  const deep = getCompanyDeep(data.slug);

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Company Guides', href: '/resume-for' },
              { label: data.name },
            ]}
            className="mb-4"
          />
          <Link
            href="/resume-for"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition"
          >
            <ChevronLeft className="h-4 w-4" /> All company guides
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
              <Briefcase className="h-3 w-3" /> {data.industry}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 text-xs px-3 py-1 rounded-full">
              <MapPin className="h-3 w-3" /> {data.hq}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 text-xs px-3 py-1 rounded-full">
              {data.tier}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            {data.name} Resume Guide
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl animate-fade-in-up delay-100">
            {data.description}
          </p>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 bg-white py-12 md:py-16">
        <TOC />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ArticleMeta
            publishedDate="2026-04-15"
            updatedDate="2026-04-15"
            readingTime={Math.max(6, Math.round((deep ? 14 : 8)))}
            reviewed
          />

          {/* Hiring Focus */}
          <section>
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-12 w-12 rounded-xl bg-blue-50 items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What {data.name} actually screens for</h2>
                <p className="text-gray-700 leading-relaxed">{data.hiringFocus}</p>
              </div>
            </div>
          </section>

          {/* Keywords */}
          <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">15 ATS keywords for {data.name}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Use these inside your bullet points and skills section, not stuffed in a hidden block. Aim for natural integration in 6-10 of these terms across your resume.
            </p>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-block bg-white border border-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-lg font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>

          {/* Resume Tips */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{data.resumeTips.length} insider tips for {data.name}</h2>
            </div>
            <ol className="space-y-5">
              {data.resumeTips.map((tip, i) => (
                <li key={i} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ol>
          </section>

          {extended && (
            <>
              {/* Interview Process */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">What the {data.name} interview looks like</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{extended.interviewProcess}</p>
              </section>

              {/* Common Pitfalls */}
              <section className="bg-red-50 rounded-2xl p-6 md:p-8 border border-red-100">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{extended.commonPitfalls.length} common pitfalls that tank {data.name} resumes</h2>
                </div>
                <ul className="space-y-3">
                  {extended.commonPitfalls.map((item, i) => (
                    <li key={i} className="flex gap-3 text-gray-700 text-sm">
                      <span className="flex-shrink-0 text-red-500 font-bold mt-0.5">✗</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Sample bullet */}
              <section className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 md:p-8 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Quote className="h-5 w-5 text-slate-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">A sample {data.name}-ready bullet</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Notice the structure: action verb, specific scope, quantified outcome, and clear business value. This is the format {data.name} recruiters look for.
                </p>
                <div className="bg-white rounded-xl p-5 border-l-4 border-blue-500 shadow-sm">
                  <p className="text-gray-800 leading-relaxed font-medium">{extended.sampleBullet}</p>
                </div>
              </section>

              {/* How to tailor */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">How to tailor your existing resume for {data.name}</h2>
                </div>
                <p className="text-gray-600 mb-5">
                  You probably already have a resume that works for general applications. Here is exactly what to change before applying to {data.name}:
                </p>
                <ol className="space-y-4">
                  {extended.howToTailor.map((step, i) => (
                    <li key={i} className="flex gap-4 bg-gray-50 rounded-xl border border-gray-100 p-5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* FAQ */}
              <section className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{data.name} resume FAQ</h2>
                </div>
                <div className="space-y-4">
                  {extended.faqs.map((faq, i) => (
                    <details key={i} className="group bg-white rounded-xl border border-gray-200 p-5 open:shadow-sm">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm">
                        <span>{faq.q}</span>
                        <span className="text-blue-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                      </summary>
                      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}

          {deep && (
            <>
              {/* Cover Letter Template */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Cover letter template for {data.name}</h2>
                </div>
                <p className="text-gray-600 mb-5">
                  A 3-paragraph structure tuned for {data.name}&apos;s recruiting style. Copy it, fill in the bracketed placeholders, and edit for voice before sending.
                </p>
                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-900 text-gray-300 px-5 py-2.5 text-xs font-mono flex items-center justify-between">
                    <span>Cover Letter — {data.name}</span>
                    <span className="text-gray-500">Plain text, 3 paragraphs</span>
                  </div>
                  <div className="p-6 space-y-4">
                    {deep.coverLetterTemplate.map((para, i) => (
                      <p key={i} className="text-sm text-gray-800 leading-relaxed">
                        <span className="text-xs font-mono text-gray-400 mr-2">¶{i + 1}</span>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </section>

              {/* Interview Questions */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{deep.interviewQuestions.length} common {data.name} interview questions</h2>
                </div>
                <p className="text-gray-600 mb-5">
                  These questions show up in {data.name}&apos;s loops more than most. Hints are starting points, not full answers — practice saying each one out loud in 90 seconds.
                </p>
                <ol className="space-y-3">
                  {deep.interviewQuestions.map((qa, i) => (
                    <li key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                      <p className="font-semibold text-gray-900 text-sm mb-2 flex gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        {qa.q}
                      </p>
                      <p className="text-xs text-gray-600 ml-8">
                        <span className="font-semibold text-blue-600">Hint:</span> {qa.hint}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Red Flags */}
              <section className="bg-red-50 rounded-2xl p-6 md:p-8 border border-red-100">
                <div className="flex items-center gap-2 mb-5">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{deep.redFlags.length} red flags that auto-reject you at {data.name}</h2>
                </div>
                <p className="text-sm text-gray-700 mb-5">
                  These are the fast-rejection triggers {data.name} recruiters have openly discussed. Fix these before you submit.
                </p>
                <ul className="space-y-3">
                  {deep.redFlags.map((flag, i) => (
                    <li key={i} className="flex gap-3 bg-white rounded-lg p-4 border border-red-100">
                      <span className="flex-shrink-0 text-red-500 font-bold mt-0.5">🚩</span>
                      <span className="text-sm text-gray-800 leading-relaxed">{flag}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Salary Benchmark */}
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{data.name} salary benchmarks</h2>
                </div>
                <p className="text-gray-600 mb-5 text-sm">
                  Estimated total compensation (base + bonus + equity, annualized) by role and seniority. Numbers are public market estimates from Levels.fyi, Glassdoor, AmbitionBox, and Indeed — use them as rough ranges, not exact offers.
                </p>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Role</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Junior</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Mid</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Senior</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deep.salaryBenchmark.map((row, i) => (
                        <tr key={i} className={i < deep.salaryBenchmark.length - 1 ? 'border-b border-gray-100' : ''}>
                          <td className="px-4 py-3 font-semibold text-gray-900">{row.role}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{row.junior}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{row.mid}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{row.senior}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Referral Strategy */}
              <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">How to get a {data.name} referral</h2>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{deep.referralStrategy}</p>
              </section>
            </>
          )}

          {/* Recommended Template */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold mb-1">Recommended template</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{data.recommendedTemplate}</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Of our 20 templates, {data.recommendedTemplate.charAt(0).toUpperCase() + data.recommendedTemplate.slice(1)} matches {data.name}&apos;s screening philosophy best — clean parsing, conservative typography, and section ordering that mirrors how their recruiters skim.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openGateway('/builder')}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                  >
                    Use this template <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition border border-gray-200"
                  >
                    Browse all 20
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Checklist */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">Before you hit submit at {data.name}</h2>
            <ul className="space-y-3">
              {[
                'Run your resume through our free ATS checker.',
                `Confirm at least 6-10 of the ${data.name} keywords above appear naturally in your bullets.`,
                'Quantify every bullet (%, $, users, time saved). No vague responsibilities.',
                'Save as PDF (not DOCX) unless the job posting explicitly asks for Word.',
                'One page if you have less than 10 years experience. Two pages max.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Internal Links */}
          <section className="border-t border-gray-100 pt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/resume-for/${c.slug}`}
                  className="flex items-center justify-between bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg px-4 py-3 transition group"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.industry}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </Link>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
              <Link href="/ats-guide" className="text-blue-600 hover:underline">→ Complete ATS Guide</Link>
              <Link href="/resume-tips" className="text-blue-600 hover:underline">→ Resume tips that work</Link>
              <Link href="/templates" className="text-blue-600 hover:underline">→ All 20 templates</Link>
            </div>
          </section>
        </div>
      </main>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Build your {data.name}-ready resume in minutes</h2>
          <p className="text-blue-100 mb-6">
            Free to start. ATS-tested. Tailor the bullets, run the score, and apply with confidence.
          </p>
          <button
            onClick={() => openGateway('/builder')}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
          >
            Start My Resume <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
