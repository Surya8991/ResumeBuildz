'use client';

import { ArrowRight, CheckCircle2, Sparkles, Award, AlertCircle, Calendar, HelpCircle, TrendingUp, BookOpen } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const CHECKLIST = [
  '10th, 12th, and graduation percentages or CGPA prominently listed (top of education section).',
  'No active backlogs unless the job description allows them. Mention "Cleared all backlogs" if applicable.',
  '2-3 strong projects with GitHub links, tech stack, and quantified outcomes.',
  '1-2 internships if you have any. List even unpaid or short ones.',
  'Skills section grouped by category: Languages, Frameworks, Databases, Tools.',
  'Coding contest profiles (LeetCode, Codeforces, CodeChef, HackerRank) with current rating.',
  'Position of responsibility: club lead, sports captain, event organiser, NSS, NCC.',
  'Achievements: hackathon wins, scholarships, competition ranks, published papers.',
  'A clean ATS-friendly format with no graphics, no columns, no skill bars.',
  'PDF format, named correctly: Firstname_Lastname_Resume.pdf',
];

const CASE_STUDY_CAMPUS = {
  title: 'Case study: Rohan from a tier-2 engineering college',
  story: `Rohan was a B.Tech CSE student at a tier-2 Maharashtra engineering college with a CGPA of 7.8. His 10th was 88%, 12th was 82%, and he had no active backlogs. Through the placement season, he cleared TCS NQT with 78%, Infosys InfyTQ with Pro-level certification, and completed 3 LeetCode-verified projects on his GitHub.\n\nDuring placements, TCS offered him the Digital track at ₹7.1 LPA based on his NQT score. Infosys offered him System Engineer at ₹6.5 LPA. Wipro offered Elite NTH at ₹3.5 LPA. He also cleared the first round at Flipkart but was rejected in round 3.\n\nHe accepted the TCS Digital offer and started at the Bangalore center. His resume strategy was simple: one page, academic percentages prominently on line 2, three projects with real GitHub links and quantified bullets, InfyTQ Pro and TCS NQT scores as certifications, and zero fluff.\n\nThe difference-maker: Rohan used the same resume format across all 4 companies but tailored the "Interests" section at the bottom to mention relevant domain interest (BFSI for TCS, Digital for Infosys, EdTech for Wipro). The core was identical.`,
};

const PLACEMENT_ROUNDS = [
  { round: 'Round 1: Pre-placement talk (PPT)', what: 'The company visits campus (virtually or in person) and presents culture, compensation, and role. Takes 30-60 min.', prep: 'Take notes on exact role names, CTC, bond period, and the specific team. These become interview hooks.' },
  { round: 'Round 2: Online assessment', what: 'Usually HackerRank or AMCAT: aptitude (logical + quantitative + English) + 1-3 coding questions. 60-90 minutes.', prep: 'Practice 30+ AMCAT-pattern aptitude questions. For coding, revise 2 easy + 1 medium DSA problems daily for 4 weeks before placement season.' },
  { round: 'Round 3: Group discussion (for some companies)', what: 'A 15-20 minute GD with 8-12 candidates on a current topic. Used by TCS, Infosys, Deloitte, Accenture.', prep: 'Keep a running list of 10 current affairs topics. Speak early, cite data, summarise others, never interrupt.' },
  { round: 'Round 4: Technical interview', what: 'One or two 30-45 min rounds with a senior engineer or PM. Expect coding, project walk-through, and CS fundamentals.', prep: 'Be able to walk through every project on your resume in 2 minutes. Revise OS, DBMS, networks, and 2 design patterns.' },
  { round: 'Round 5: HR interview', what: '15-30 min with HR or the hiring manager. Tests motivation, relocation willingness, culture fit, and salary expectations.', prep: 'Prepare answers to "Why this company," "Why this role," "Your biggest weakness," "5-year plan." Practice out loud.' },
];

const PLACEMENT_STATS = [
  { n: '1.5M+', label: 'engineering graduates from Indian colleges each year' },
  { n: '45%', label: 'of Tier-2 college students placed on campus (AICTE, 2024)' },
  { n: '85%+', label: 'of Tier-1 IITs and NITs placed on campus (placement reports, 2024)' },
  { n: '6-8', label: 'weeks. Typical duration of a placement season at most campuses' },
];

const PLACEMENT_FAQS = [
  { q: 'When should I start preparing my placement resume?', a: 'Start in the summer before your final year. Most placement seasons run August through November. Give yourself 4-6 weeks of DSA practice + 2 weeks of resume polish + 2 weeks of mock interviews before Day 1.' },
  { q: 'Can I skip placements if I want a product company?', a: 'Most campuses allow you to sit for specific companies only. You can skip TCS/Infosys/Wipro if you are aiming for Flipkart, Amazon, Google, or Microsoft. But read your Training & Placement Cell rules. Some colleges make first placements mandatory.' },
  { q: 'Should I apply to service companies and product companies with the same resume?', a: 'No. Create 2 versions: a service-company version (emphasise academics, project breadth, communication, Java) and a product-company version (emphasise DSA, coding profiles, GitHub, system design basics). The same single resume signals mediocrity to both.' },
  { q: 'How important are coding profiles for campus placements?', a: 'Very important for product companies (Flipkart, Amazon, Microsoft, Google). Expected: LeetCode 1800+, Codeforces specialist+, CodeChef 4-star+. Service companies care less. Academic percentages and aptitude test scores matter more there.' },
  { q: 'What if I do not get placed on Day 1?', a: 'Normal. Most students place in the second or third wave. The companies that visit later (Day 5+) are often better ones that prefer to see how the cohort performs before committing. Day 1 is not the "best" day.' },
  { q: 'Is it okay to negotiate CTC during campus placements?', a: 'Generally no. Campus offers are standardised and take-it-or-leave-it. You can negotiate joining date, relocation support, or training location in rare cases. Never bluff with a fake offer.' },
];

const COMPANIES = [
  { name: 'TCS NQT', focus: 'Aptitude score, academic consistency, English communication, no backlogs' },
  { name: 'Infosys', focus: 'InfyTQ certification, full-stack skills, problem solving, English communication' },
  { name: 'Wipro Elite NTH', focus: 'NTH score, academic consistency, programming fundamentals' },
  { name: 'Accenture', focus: 'Communication, learning agility, basic coding, college tier' },
  { name: 'Cognizant', focus: 'Aptitude score, academic record, technical fundamentals' },
  { name: 'Capgemini', focus: 'Aptitude, English, programming fundamentals, learning mindset' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'warning', label: 'A note on inflated claims' },
  { id: 'checklist', label: '10-point checklist' },
  { id: 'companies', label: 'What top recruiters screen for' },
  { id: 'stats', label: 'State of Indian campus placements' },
  { id: 'rounds', label: 'The 5 placement rounds' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'case-study', label: 'Case study' },
];

const RELATED = [
  { title: 'Fresher Resume Format 2026', slug: 'fresher-resume', excerpt: 'The exact 7-section format that beats Indian and global ATS for freshers.', read: 11 },
  { title: '8 Naukri Resume Tips That 3x Views', slug: 'naukri-resume-tips', excerpt: 'How Arjun went from 2 to 40 recruiter views a week on Naukri.', read: 9 },
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes.', read: 9 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
];

export default function CampusPlacementResumePage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="India Hiring"
        breadcrumbCurrent="Campus placement resume"
        title="Campus Placement Resume 2026"
        subtitle="India runs the world's largest campus placement system, with over 1.5 million graduates placed each year. Here is the exact resume format and 10-point checklist that gets students into TCS, Infosys, Wipro, Accenture, and beyond."
        dateModified="2026-04-15"
        readingTime={10}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>Most college Training and Placement (T&P) cells require a standard one-page resume. The mistake students make is treating the resume like a casual document. The companies that visit campus screen 20,000+ resumes in 48 hours. Every formatting issue, missing percentage, or unverified claim costs you the interview slot.</p>
        </section>

        <section id="warning" className="mt-10 scroll-mt-6 bg-amber-50 rounded-lg p-5 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">A note on inflated claims</h3>
              <p className="text-sm text-amber-900 leading-relaxed">Indian campus recruiters increasingly verify GitHub commits, LeetCode profiles, and project authorship. If you list a project, you should be able to walk through it line by line in the technical interview. Inflating CGPA, falsifying internships, or copying GitHub projects has led to immediate rejection and even college blacklisting from companies like TCS and Infosys.</p>
            </div>
          </div>
        </section>

        <section id="checklist" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">The 10-point campus placement checklist</h2>
          </div>
          <ul className="space-y-2.5">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex gap-3 text-gray-800">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="companies" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">What top campus recruiters actually screen for</h2>
          <div className="space-y-3">
            {COMPANIES.map((c) => (
              <div key={c.name} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                <p className="text-sm text-gray-700">{c.focus}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="stats" className="mt-10 scroll-mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">The state of Indian campus placements</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLACEMENT_STATS.map((s) => (
              <div key={s.n} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-2xl md:text-3xl font-bold text-indigo-600">{s.n}</p>
                <p className="text-xs text-gray-700 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rounds" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">The 5 rounds of a typical placement process</h2>
          </div>
          <p className="text-gray-600 mb-5">Know what each round actually tests. Campus recruiters move through candidates fast; you only get one shot per round.</p>
          <div className="space-y-3">
            {PLACEMENT_ROUNDS.map((r) => (
              <div key={r.round} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-1.5">{r.round}</h3>
                <p className="text-sm text-gray-700 mb-1.5"><span className="font-semibold">What:</span> {r.what}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold text-green-700">How to prep:</span> {r.prep}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Campus placement FAQ</h2>
          </div>
          <div className="space-y-3">
            {PLACEMENT_FAQS.map((faq, i) => (
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

        <section id="case-study" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{CASE_STUDY_CAMPUS.title}</h2>
          </div>
          <div className="text-sm text-gray-800">
            {CASE_STUDY_CAMPUS.story.split('\n\n').map((p, i) => (<p key={i} className="mb-3 leading-relaxed">{p}</p>))}
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Composite based on public tier-2 placement stories from the 2024 to 2025 season.</p>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Get placement-ready in 25 minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates. ATS-clean and accepted by every major Indian campus recruiter.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">Start My Resume <ArrowRight className="h-4 w-4" /></button>
        </section>
      </BlogPostLayout>
    </>
  );
}
