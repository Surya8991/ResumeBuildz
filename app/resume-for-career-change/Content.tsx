'use client';

import { ArrowRight, Sparkles, Target, HelpCircle, Clock, BookOpen, AlertTriangle, Mail } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const STEPS = [
  { title: '1. Identify your transferable skills', body: 'Career changers underestimate how much carries over. Project management, stakeholder communication, data analysis, budgeting, mentorship. Almost all of these transfer. Make a list of 10 skills from your old role and rate which ones the new role needs.' },
  { title: '2. Pick a functional or hybrid format', body: 'For traditional career changes, a chronological resume highlights the wrong things. Use a hybrid format: skills section at the top, then experience. This puts your transferable skills in front of the recruiter before they see your unrelated job titles.' },
  { title: '3. Rewrite the summary as a bridge', body: 'Your summary is the bridge from "what I did" to "what I want to do next." Example: "Marketing manager with 7 years driving B2B demand gen, transitioning into product management. Strong customer empathy, data-driven decision making, and 2 years of side-project shipping experience."' },
  { title: '4. Translate every bullet into the new domain', body: 'Strip out industry jargon from the old field. "Closed $2M ARR pipeline" becomes "Identified customer needs and shipped solutions worth $2M in measurable value." The work was the same; the language meets the new audience.' },
  { title: '5. Show evidence of the new direction', body: 'Recruiters need proof you are serious. Side projects, certifications, courses, freelance work, volunteer roles, blog posts. Anything that demonstrates you have already started moving toward the new field. List these in a "Relevant Projects" section above experience.' },
];

const TIMELINE_EXPECTATIONS = [
  { phase: 'Months 1-2', desc: 'Self-assessment, skill gap analysis, picking a target field, starting 1-2 relevant courses or certifications.' },
  { phase: 'Months 3-6', desc: 'Building 2-3 side projects, getting 1 unpaid or volunteer experience, rewriting your resume as hybrid format, updating LinkedIn.' },
  { phase: 'Months 6-9', desc: 'Active applications with tailored bullets, informational interviews with 15-20 people in the new field, interview prep.' },
  { phase: 'Months 9-12', desc: 'Landing the first role in the new field. Usually at a level lower than your previous role, with room to climb back up fast.' },
];

const COMMON_TRAPS = [
  'Expecting the same seniority in the new field. Most pivots involve a 1-level demotion in title (and sometimes pay) for 12-18 months before you re-enter at your old level.',
  'Applying without evidence. Recruiters for the new field expect at least 1-2 projects, an internship, or a certification before taking your pivot seriously.',
  'Leading the cover letter with "I want to transition." This sounds like you need something. Lead with what you bring instead.',
  'Ignoring network value. Referrals convert 4-5x better than cold applications for career changers. Spend 40% of your time on networking, not applications.',
  'Lying about experience to match the JD. Background checks and technical interviews will catch this and burn the bridge.',
];

const FAQS = [
  { q: 'How long does a career change realistically take?', a: '6 to 12 months for most pivots, assuming you are working on it consistently while still employed. Longer if the new field requires formal credentials (e.g., engineering to medicine). Shorter for adjacent pivots (e.g., customer success to product management).' },
  { q: 'Will I have to take a pay cut?', a: 'Usually yes, at least initially. Expect a 10-25% pay cut for the first role in the new field. Most career changers return to their pre-pivot compensation within 18-24 months and often exceed it within 3-4 years because the new field aligns better with their strengths.' },
  { q: 'Should I go back to school for a career change?', a: 'Rarely necessary. For most pivots (marketing to PM, engineering to consulting, finance to ops), a 3-6 month certification + side project portfolio beats a 2-year degree. Formal degrees only make sense when the target field has hard credentialing requirements (law, medicine, architecture, academia).' },
  { q: 'Is a bootcamp worth it for engineering pivots?', a: 'Sometimes. Top bootcamps can work for motivated career changers with a strong work ethic. But the return has dropped since 2023. Tech hiring is tighter, and bootcamp grads compete with laid-off senior engineers. Do 2 to 3 months of free pre-work (freeCodeCamp, CS50) before committing cash.' },
  { q: 'How do I explain the pivot to a hiring manager?', a: 'Use a 3-sentence script: (1) What you did before and what you were good at, (2) Why that experience makes you ready for this new field, (3) What specific recent work proves it. Example: "I spent 6 years in sales, where I learned to diagnose customer problems fast and communicate across stakeholders. Those skills translate directly to product management. Over the past 8 months, I have shipped 3 side projects and completed the Reforge PM foundations course."' },
  { q: 'Should my LinkedIn headline reflect the new field?', a: 'Yes, gradually. Use a transition headline: "Software Engineer | Aspiring Product Manager | Shipping side projects with user research." This signals direction without lying about your current title. Once you land your first PM role, update it fully.' },
];

const PIVOT_EMAIL = {
  subject: 'Exploring a transition into [Target Field]. Quick chat?',
  body: `Hi [Name],\n\nI found your profile while researching [their company / their field] and was struck by [specific thing they posted, published, or shipped].\n\nI am currently a [current role] with [N] years at [current company], and I am in the early stages of transitioning into [target field]. I have been [specific evidence of effort: built side projects, completed a certification, taken a course, done freelance work].\n\nI would love 15 minutes of your time to ask how you navigated your path into [target field]. I am not asking for a job or a referral, just learning from someone whose journey I admire. Totally understand if your schedule does not allow it.\n\nThanks for considering,\n[Your name]`,
};

const CASE_STUDY_PIVOT = {
  title: 'Case study: Nikhil pivoted from sales to product management',
  story: `Nikhil spent 6 years in B2B sales at a SaaS company, consistently hitting 110%+ of quota and managing key enterprise accounts. He decided to pivot into product management because he was more energised by discovery calls and customer research than by closing deals.\n\nHis first mistake: applying to senior PM roles at product companies with a straight chronological resume. Zero responses over 40 applications. The pivot framework on this page fixed it.\n\nHe rewrote the resume to a hybrid format, leading with "Customer-obsessed operator transitioning into product management" in the summary. He added a "Relevant Projects" section above experience that listed 3 PM-adjacent side projects: user research interviews he ran for a local non-profit, a prototype customer feedback portal he built in Notion, and a Reforge PM Foundations certification.\n\nIn experience, he rewrote sales bullets in PM language: "Identified and synthesised customer needs for 24 Fortune 500 accounts, shaping the product roadmap via direct feedback loops with product and engineering."\n\nOver 3 months he got 5 interviews for Associate PM roles and accepted a role at a mid-stage startup at a 12% pay cut. Within 18 months he was promoted to PM and exceeded his previous sales compensation.`,
};

const PIVOTS = [
  { from: 'Marketing', to: 'Product Management', overlap: 'Customer research, A/B testing, GTM strategy, copywriting' },
  { from: 'Sales', to: 'Customer Success', overlap: 'Stakeholder management, retention, expansion, account planning' },
  { from: 'Finance', to: 'Operations', overlap: 'Process improvement, financial modeling, vendor management, reporting' },
  { from: 'Software Engineer', to: 'Product Manager', overlap: 'Technical architecture, sprint planning, user stories, requirements writing' },
  { from: 'Teacher', to: 'L&D / Corporate Training', overlap: 'Curriculum design, public speaking, learner engagement, content development' },
  { from: 'Customer Support', to: 'UX Research', overlap: 'User empathy, qualitative interviewing, pain-point synthesis, journey mapping' },
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'framework', label: 'The 5-step framework' },
  { id: 'pivots', label: '6 common pivots' },
  { id: 'summary', label: 'Sample career-change summary' },
  { id: 'timeline', label: 'How long a pivot takes' },
  { id: 'traps', label: '5 traps that kill pivots' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'email', label: 'Pivot outreach email' },
  { id: 'case-study', label: 'Case study' },
];

const RELATED = [
  { title: 'Resume After a Career Gap', slug: 'resume-after-career-gap', excerpt: 'Real wording for childcare, health, caregiving, sabbatical. Gap-friendly templates.', read: 10 },
  { title: 'Resume After a Layoff', slug: 'resume-after-layoff', excerpt: 'A 5-step guide for 2026 with 3 email templates and a 60-day planner.', read: 12 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes.', read: 9 },
  { title: 'How to Beat ATS', slug: 'ats-guide', excerpt: 'How ATS works and exactly how to fix your resume so it gets through.', read: 12 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
];

export default function ResumeForCareerChangePage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="Career Transitions"
        breadcrumbCurrent="Resume for career change"
        title="Resume for Career Change: The 5-Step Pivot Guide"
        subtitle="The average professional changes careers 5 to 7 times in their working life (Pew Research). Here is how to translate your past experience into a resume that lands interviews in a new field."
        dateModified="2026-04-15"
        readingTime={11}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>The hardest part of a career change is not the new skills. It is rewriting your past so the new field sees you as a credible candidate, not as someone who is just starting over. The framework below has been used by thousands of pivoters from marketing to PM, sales to CS, finance to ops, and engineering to product.</p>
        </section>

        <section id="framework" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">The 5-step pivot framework</h2>
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div key={step.title} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pivots" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">6 common pivots and what transfers</h2>
          </div>
          <div className="space-y-2">
            {PIVOTS.map((p) => (
              <div key={`${p.from}-${p.to}`} className="bg-white rounded-md p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900">{p.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">{p.to}</span>
                </div>
                <p className="text-xs text-gray-600">Transferable: {p.overlap}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="summary" className="mt-10 scroll-mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Sample career-change summary</h2>
          <div className="bg-white rounded-md p-4 border border-gray-200">
            <p className="text-sm text-gray-800 italic">&quot;Customer success manager with 6 years scaling onboarding for B2B SaaS clients ($45M ARR portfolio). Now transitioning into product management, with 18 months of side experience shipping internal tools and running customer discovery interviews. Strong skills in stakeholder communication, prioritisation, and data-driven decision making. Looking for an Associate PM role at a customer-obsessed product team.&quot;</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">Notice how it owns both halves: real credibility from the old role, real evidence of effort toward the new one.</p>
        </section>

        <section id="timeline" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">How long a career pivot realistically takes</h2>
          </div>
          <p className="text-gray-600 mb-5">Pivots rarely happen in 30 days. Here is the honest, stage-by-stage timeline most career changers follow, assuming you are working on it while still employed.</p>
          <div className="space-y-3">
            {TIMELINE_EXPECTATIONS.map((t) => (
              <div key={t.phase} className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-20 sm:w-24"><p className="text-xs uppercase tracking-wide font-bold text-indigo-600">{t.phase}</p></div>
                <p className="text-sm text-gray-800 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="traps" className="mt-10 scroll-mt-6 bg-red-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">5 traps that kill career pivots</h2>
          </div>
          <ul className="space-y-3">
            {COMMON_TRAPS.map((trap) => (
              <li key={trap} className="flex gap-3 text-sm text-gray-800">
                <span className="text-red-600 font-bold mt-0.5">✗</span>
                <span className="leading-relaxed">{trap}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Career change FAQ</h2>
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

        <section id="email" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Pivot outreach email for informational interviews</h2>
          </div>
          <p className="text-gray-600 mb-5">Informational interviews are the highest-leverage activity during a career pivot. This template gets response rates around 25-30% when you customise the first line with something specific from the recipient&apos;s public work.</p>
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Subject</div>
            <div className="px-4 py-3 text-sm text-gray-900 font-medium border-b border-gray-200">{PIVOT_EMAIL.subject}</div>
            <div className="bg-gray-900 text-gray-300 px-4 py-2 text-xs font-mono">Body</div>
            <pre className="px-4 py-4 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{PIVOT_EMAIL.body}</pre>
          </div>
        </section>

        <section id="case-study" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{CASE_STUDY_PIVOT.title}</h2>
          </div>
          <div className="text-sm text-gray-800">
            {CASE_STUDY_PIVOT.story.split('\n\n').map((p, i) => (<p key={i} className="mb-3 leading-relaxed">{p}</p>))}
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">Composite story based on public accounts of sales-to-PM pivots from 2023 to 2025.</p>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Build your pivot resume in 30 minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. 20 templates. Hybrid layouts that put transferable skills first.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">Start My Resume <ArrowRight className="h-4 w-4" /></button>
        </section>
      </BlogPostLayout>
    </>
  );
}
