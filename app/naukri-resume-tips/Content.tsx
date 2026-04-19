'use client';

import { ArrowRight, CheckCircle2, Sparkles, Tag, Eye, HelpCircle, TrendingUp, Zap, BookOpen } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const RANKING_FACTORS = [
  { factor: 'Active in last 7 days', weight: 'Very High', note: 'Profiles that have not been active for 30+ days drop out of most recruiter filters entirely.' },
  { factor: 'Exact skill match', weight: 'Very High', note: 'Recruiters search for specific skills (e.g., "Java"). Missing even one must-have skill excludes you.' },
  { factor: 'Preferred location match', weight: 'High', note: 'A Bangalore candidate preferring "Bangalore only" ranks above one preferring "Bangalore, Mumbai, Pune."' },
  { factor: 'Notice period', weight: 'High', note: '"Immediate joiner" and "15-30 days" rank highest. "3 months" drops you significantly.' },
  { factor: 'Profile completeness', weight: 'High', note: 'Naukri scores profile completeness 0-100%. Below 80% reduces search visibility substantially.' },
  { factor: 'Experience match', weight: 'High', note: 'Recruiters filter by exact year range (e.g., 4-6 years). Off by one year often excludes you.' },
  { factor: 'CTC range match', weight: 'Medium', note: 'Current CTC and expected CTC are both filters. Too high or too low both hurt.' },
  { factor: 'Resume last updated date', weight: 'Medium', note: 'Resumes updated in the last 30 days rank higher than stale ones, even if the content has not changed.' },
];

const PROFILE_FIELDS = [
  'Resume Headline (100-120 chars, updated for current target role)',
  'Profile Summary (4-6 lines, full paragraphs)',
  'Current + Previous 2 employers with crisp achievements',
  'Key Skills (up to 50, recruiter-search-relevant)',
  'Education with degree, institute, year, percentage/CGPA',
  'IT Skills with proficiency level (1-5 scale or years)',
  'Projects (5+ entries with tech stack)',
  'Work Authorisation status',
  'Preferred Location (up to 5 cities, ordered by preference)',
  'Expected CTC (range, not hidden)',
  'Notice Period (exact, not "negotiable")',
  'Profile photo (professional headshot)',
];

const FAQS = [
  { q: 'Does Naukri have an ATS like Workday?', a: 'Naukri is not an ATS itself. It is a database that recruiters search. When they find you and you apply, the company internal ATS (Workday, Taleo, Greenhouse) takes over. The Naukri resume parser converts your upload into structured fields, and its search algorithm ranks you based on those fields.' },
  { q: 'Should I pay for Naukri Premium?', a: 'Rarely worth it for most candidates. The free Naukri version already exposes your profile to all recruiter searches. Premium mostly buys you better visibility to jobseekers (not recruiters) and some profile analytics. The one exception: Naukri FastForward, which can be valuable if you are switching after 2+ years of inactivity.' },
  { q: 'How often should I update my Naukri profile?', a: 'Touch your profile at least once every 5-7 days during active job search. Even a small edit (one word in your summary) resets the "last updated" timestamp and boosts your ranking. During passive search, once a month is enough.' },
  { q: 'Will recruiters see my current company if I mark confidentiality?', a: 'Yes, partially. Naukri "Hide from current employer" feature blocks recruiters from your current company domain but does not block all of them. If you are doing a confidential search, use a private email and do not apply to roles at partner companies.' },
  { q: 'Is LinkedIn better than Naukri for tech roles in India?', a: 'It depends. LinkedIn wins for product companies (Flipkart, Swiggy, Razorpay, Google India). Naukri wins for IT services (TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini) and for non-metro cities. For a complete India search, keep both updated.' },
  { q: 'How do I handle Naukri spam calls and emails?', a: 'Unavoidable if you keep your profile active. Use a dedicated job search phone number and email, or at least filter aggressively. Naukri "Do Not Disturb" settings help but do not eliminate the volume.' },
];

const CASE_STUDY_NAUKRI = {
  title: 'Case study: Arjun Naukri profile went from 2 views/week to 40',
  story: `Arjun was a 5-year Java backend developer at an IT services firm in Hyderabad, actively looking for product-company roles. His Naukri profile was getting 2-3 recruiter views per week despite his strong experience. Not enough to land interviews.\n\nHe applied the 8 tips on this page over one weekend. The biggest changes: he rewrote his headline from "Software Engineer" to "Senior Java Backend Engineer | 5 yrs | Spring Boot, Microservices, Kafka, AWS | Bangalore | 30 days notice." He added 42 key skills (he had only listed 8). He updated his notice period from "3 months" to "30 days" (which matched his actual situation after negotiation). He added 6 detailed projects with tech stacks.\n\nWithin two weeks, his recruiter views jumped from 2-3/week to 40/week. He got 11 first-round calls in the following month and accepted an offer at a Bangalore fintech at a 68% hike.\n\nThe single highest-leverage change: the headline. Recruiters search Naukri primarily via keyword filters, and his old headline had almost none of the terms they were searching for.`,
};

const TIPS = [
  { title: '1. Use a Naukri-friendly resume headline', body: 'Naukri displays your headline above your resume in every recruiter search. Use 100-120 characters with your role, years of experience, and 2-3 top skills. Example: "Senior Java Backend Engineer | 6 years | Spring Boot, Microservices, AWS, Kafka, Bangalore."' },
  { title: '2. Fill the Key Skills section completely', body: 'Naukri allows up to 50 key skills. Recruiters search by exact skill match. List every framework, language, tool, and platform you have used. Be honest. You will be asked about each in screening calls.' },
  { title: '3. Optimise the Profile Summary', body: 'Write a 4-6 line summary that names your role, total experience, primary tech/domain, biggest 1-2 wins, and what you want next. This is the first thing a recruiter reads after the headline.' },
  { title: '4. Update preferred location and notice period accurately', body: 'These are the two filters every recruiter uses. Bangalore + immediate joiner profiles get 3x more views than the same profile with "Negotiable" notice. Update the day your situation changes.' },
  { title: '5. Mark Active status weekly', body: 'Naukri ranks "Active in last 7 days" profiles much higher in recruiter searches. Even a quick login bumps you. Profiles that have not logged in for 30+ days drop off most search results entirely.' },
  { title: '6. Add salary expectations honestly', body: 'Recruiters filter by CTC range. Quoting too high removes you from junior shortlists; too low removes you from senior ones. List a 15-20% range above current CTC for laterals.' },
  { title: '7. Upload a clean, ATS-friendly PDF', body: 'Naukri parser converts your uploaded resume into structured fields. Avoid columns, tables, headers/footers, graphics. Use a simple single-column template. Naukri parses these almost perfectly.' },
  { title: '8. Add 5+ project entries with tech stack', body: 'Naukri Projects section is searchable. Each entry should have project name, tech used, your role, and one outcome. This dramatically increases visibility for niche skill searches.' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'tips', label: 'The 8 tips' },
  { id: 'search', label: 'How recruiters search Naukri' },
  { id: 'ranking', label: 'Naukri ranking factors' },
  { id: 'completeness', label: '12 profile fields to fill' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'compare', label: 'Naukri vs LinkedIn vs Indeed' },
  { id: 'case-study', label: 'Case study' },
];

const RELATED = [
  { title: 'Campus Placement Resume 2026', slug: 'campus-placement-resume', excerpt: '10-point checklist and 5-round process walkthrough for Indian campus placements.', read: 10 },
  { title: 'Fresher Resume Format 2026', slug: 'fresher-resume', excerpt: 'The exact 7-section format that beats Indian and global ATS for freshers.', read: 11 },
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes.', read: 9 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
];

export default function NaukriResumeTipsPage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="India Hiring"
        breadcrumbCurrent="Naukri.com resume tips"
        title="8 Naukri.com Resume Tips That 3x Recruiter Views"
        subtitle="Naukri.com is India's largest job portal with over 90 million registered candidates and 350,000+ recruiters. Here is how to make your profile and resume stand out in the recruiter search algorithm."
        dateModified="2026-04-15"
        readingTime={9}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>Naukri does not work like LinkedIn. Recruiters do not browse profiles. They search using narrow filters: skill, location, notice period, current CTC, expected CTC, total experience, and last active date. Every tip below moves the dial on one of those filters.</p>
        </section>

        <section id="tips" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">The 8 tips</h2>
          <div className="space-y-3">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-1.5">{tip.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="search" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">How recruiters actually search Naukri</h2>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">
            A typical Naukri recruiter search looks like this:{' '}
            <span className="font-mono bg-white px-2 py-0.5 rounded text-xs">Skill: &quot;Java&quot; AND &quot;Spring Boot&quot;, Location: Bangalore, Notice period: &lt;30 days, Total experience: 4-7 years, Active in last 7 days, CTC: 12-25 LPA</span>. Profiles that satisfy every filter rank highest. Profiles missing any field drop off entirely. The trick is to match all filters honestly.
          </p>
        </section>

        <section id="ranking" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">What Naukri ranking algorithm actually weighs</h2>
          </div>
          <p className="text-gray-600 mb-5">Naukri does not publish its algorithm, but after talking to recruiters who use the platform every day, these are the factors that consistently move candidates up or down in search results.</p>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {RANKING_FACTORS.map((r, i, arr) => (
              <div key={r.factor} className={`flex flex-col sm:flex-row gap-3 p-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="sm:w-52 shrink-0">
                  <p className="font-semibold text-gray-900 text-sm">{r.factor}</p>
                  <span className={`inline-block mt-1 text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${r.weight === 'Very High' ? 'bg-red-100 text-red-700' : r.weight === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.weight}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{r.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="completeness" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">12 profile fields to fill to 100%</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4">Naukri gives your profile a completeness score from 0-100%. Profiles below 80% drop out of most searches. Here is every field you need filled.</p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {PROFILE_FIELDS.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />{f}</li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Naukri.com FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4 open:shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 text-sm">
                  <span>{faq.q}</span>
                  <span className="text-indigo-600 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="compare" className="mt-10 scroll-mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Naukri vs LinkedIn vs Indeed for India</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-800">
            <li><span className="font-semibold text-gray-900">Naukri:</span> highest volume of Indian recruiters and IT services hiring (TCS, Infosys, Wipro, Cognizant, Capgemini). Filter-heavy search. Most active for laterals.</li>
            <li><span className="font-semibold text-gray-900">LinkedIn:</span> better for product companies, startups, fintech, global roles. Recruiter Lite uses different signals. Engagement and content matter.</li>
            <li><span className="font-semibold text-gray-900">Indeed:</span> aggregator with strong search by job title and city. Easier resume parsing. Useful for non-IT roles.</li>
          </ul>
        </section>

        <section id="case-study" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{CASE_STUDY_NAUKRI.title}</h2>
          </div>
          <div className="text-sm text-gray-800">
            {CASE_STUDY_NAUKRI.story.split('\n\n').map((p, i) => (<p key={i} className="mb-3 leading-relaxed">{p}</p>))}
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Composite story based on typical Naukri profile optimisation outcomes.</p>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Build a Naukri-friendly resume in minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates that parse cleanly through Naukri resume scanner.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">Start My Resume <ArrowRight className="h-4 w-4" /></button>
        </section>
      </BlogPostLayout>
    </>
  );
}
