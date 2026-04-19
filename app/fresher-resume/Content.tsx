'use client';

import { ArrowRight, Sparkles, Award, AlertTriangle, HelpCircle, Layout, BookOpen, LayoutGrid } from 'lucide-react';
import BlogPostLayout from '@/components/BlogPostLayout';
import { useLoginGateway } from '@/components/LoginGateway';

const SECTIONS = [
  {
    title: '1. Header (Name + Contact)',
    body: 'Full name, professional email (use firstname.lastname format), one phone number with country code, LinkedIn URL, GitHub URL (if technical), and current city. No photo, no marital status, no date of birth. These are 1990s conventions and modern Indian and global ATS strip them anyway.',
  },
  {
    title: '2. Career Objective (2-3 lines max)',
    body: 'A short forward-looking statement: who you are, what you can do, and what role you want. Skip the cliche "Hardworking individual seeking growth." Instead: "Final-year B.Tech CSE student with strong fundamentals in DSA and 4 React projects. Seeking a SDE-1 role to apply problem-solving and full-stack skills."',
  },
  {
    title: '3. Education (highest first)',
    body: 'Degree, institute, year, CGPA or percentage. Include 12th and 10th if you are a fresher. Indian recruiters and TCS / Infosys NQT explicitly require them. Mention any backlog-free record if applicable. List relevant coursework only if highly relevant to the role.',
  },
  {
    title: '4. Technical Skills (categorised)',
    body: 'Group skills: Languages (Java, Python, JavaScript), Frameworks (React, Spring Boot), Databases (PostgreSQL, MongoDB), Tools (Git, Docker, Postman). Avoid the soft-skills paragraph. Recruiters skip it. Be honest; you will be tested.',
  },
  {
    title: '5. Projects (this is where you win)',
    body: 'For freshers, projects matter more than internships. List 3 projects max. Each one needs: name, tech stack used, 2-3 bullet points, GitHub link, and a one-line outcome ("Used by 80 students in my college club"). Generic CRUD apps lose; real problems solved win.',
  },
  {
    title: '6. Internships and Experience',
    body: 'List any internship, freelance gig, or part-time job. Format like a normal job entry: company, role, dates, 2-3 quantified bullets. Even unpaid open-source contributions count if you can quantify the impact.',
  },
  {
    title: '7. Achievements and Certifications',
    body: 'Coding contest ranks (LeetCode, Codeforces, HackerRank), hackathon wins, scholarships, published papers, GitHub stars, certifications (AWS, Google Cloud, NPTEL). Recruiters scan this section to spot outliers.',
  },
];

const MISTAKES = [
  { mistake: 'Listing "Languages Known: English, Hindi, Tamil" at the top', fix: 'Move this to the bottom of the resume or remove entirely. Recruiters assume English proficiency; only include if you speak 3+ languages or a specific one is required (e.g., Japanese for JapanGlobal hiring).' },
  { mistake: 'Including hobbies and interests section', fix: 'Remove unless you have space AND the hobbies are directly relevant (e.g., competitive chess for a quant fund, marathon running for a sales role where grit matters). "Reading and cricket" add nothing.' },
  { mistake: 'Using a photograph', fix: 'Remove. Modern Indian ATS and all global ATS strip photos. They also open up potential bias. The only exception is flight attendant or acting/modeling roles.' },
  { mistake: 'Writing paragraphs instead of bullets', fix: 'Rewrite every experience and project block as 2-3 crisp bullets. Paragraphs signal you do not understand the format and recruiters skip them.' },
  { mistake: 'Claiming technologies you cannot defend', fix: 'If you list React, you must be able to explain hooks, useEffect cleanup, and controlled inputs. Interviewers will ask. Better to list 5 technologies you know well than 15 you half-know.' },
  { mistake: 'No GitHub profile for CS students', fix: 'Create one today. Push your projects, even the college ones. A CS fresher resume without a GitHub link in 2026 is a visible red flag.' },
];

const LAYOUT_GUIDE = {
  header: 'Name (22pt bold) | Phone | Email | LinkedIn | GitHub | City. One line each or comma-separated.',
  objective: '2-3 lines. Current degree + college, strongest skills, target role.',
  education: 'B.Tech [branch], [College Name], Year. CGPA: 8.4/10 | 12th: 92% (CBSE) | 10th: 94% (CBSE)',
  skills: 'Group by category: Languages | Frameworks | Databases | Tools. 4-5 items per group maximum.',
  projects: 'Project name (bold) + tech stack in parentheses + GitHub link. 2-3 quantified bullets each.',
  experience: 'Company, role, dates on one line. Quantified bullets below.',
  achievements: 'Coding profiles (LeetCode 1900+, CodeChef 4-star), hackathon wins, scholarships, certifications.',
};

const FAQS = [
  { q: 'How many pages should a fresher resume be?', a: 'Strictly one page. Freshers do not have enough material to justify two pages. A two-page fresher resume signals that you padded it, and recruiters will notice.' },
  { q: 'Should I include my 10th and 12th percentages?', a: 'Yes for Indian campus placements and IT services (TCS, Infosys, Wipro, Accenture, Cognizant). These companies explicitly filter on academic consistency. For product companies, graduation CGPA alone is enough.' },
  { q: 'How do I fill a fresher resume if I have no internships?', a: 'Projects are the answer. Pick 3 projects that solve real problems (not CRUD apps), publish them on GitHub, and write 2-3 outcome-focused bullets per project. Open-source contributions, college club leadership, and hackathon participation also count.' },
  { q: 'Should freshers include references?', a: 'No. "References available on request" is a 1990s convention that wastes a line. Recruiters will ask if they want them.' },
  { q: 'How do I handle backlogs on a fresher resume?', a: 'If cleared: add "(All backlogs cleared)" next to your CGPA line. If active: many companies filter out candidates with active backlogs entirely (TCS, Infosys, Wipro are strict). Clear them before applying whenever possible.' },
  { q: 'Which file format should I use, PDF or DOCX?', a: 'PDF always, unless the job posting explicitly asks for Word. PDF preserves formatting across systems and is what 99% of modern ATS parse best. Name the file Firstname_Lastname_Resume.pdf.' },
];

const GLOSSARY = [
  { term: 'ATS', full: 'Applicant Tracking System. Software companies use to parse and filter resumes. 98% of Fortune 500 companies use one (Jobscan, 2024).' },
  { term: 'CGPA', full: 'Cumulative Grade Point Average. Typically on a 10-point scale in Indian universities. TCS/Infosys often require 7.0+ for Ninja and 7.5+ for Digital tracks.' },
  { term: 'DSA', full: 'Data Structures and Algorithms. The foundation of technical interviews at product companies. Typically assessed via LeetCode, HackerRank, or CodeChef.' },
  { term: 'NQT', full: 'National Qualifier Test. TCS\'s standardised assessment for fresher hiring. Score determines Ninja or Digital track.' },
  { term: 'InfyTQ', full: 'Infosys\' free certification platform on Python, DBMS, and software engineering. Pro-level certification fast-tracks candidates.' },
  { term: 'NTH', full: 'National Talent Hunt. Wipro\'s assessment for fresher hiring. Elite NTH and WILP are common tracks.' },
  { term: 'OT', full: 'Online Test. The first round at most campus drives. Typically 60-90 min of aptitude + coding.' },
  { term: 'GD', full: 'Group Discussion. Used by TCS, Deloitte, and Accenture to assess communication and leadership in a group setting.' },
  { term: 'PPT', full: 'Pre-Placement Talk. Company presentation before the placement drive. Attend every one for the companies you want to target.' },
  { term: 'CTC', full: 'Cost to Company. Total annual compensation including base, benefits, bonuses, and employer contributions. Different from take-home pay.' },
];

const COMPARISON_ROWS = [
  { feature: 'Length', chrono: '1 page', funct: '1 page', hybrid: '1-2 pages' },
  { feature: 'Best for', chrono: 'Most freshers and laterals', funct: 'Career changers, gaps', hybrid: 'Pivot + experienced freshers' },
  { feature: 'ATS parsing', chrono: 'Excellent', funct: 'Poor, dates get lost', hybrid: 'Good' },
  { feature: 'Skill visibility', chrono: 'Buried', funct: 'Top', hybrid: 'Top + timeline' },
  { feature: 'Recruiter perception', chrono: 'Standard, trusted', funct: 'Suspicious (hides gaps)', hybrid: 'Modern, confident' },
  { feature: 'Recommended for freshers?', chrono: 'Yes (default)', funct: 'No', hybrid: 'Optional' },
];

const TIPS = [
  'One page only. Freshers do not have enough material to justify two pages, and ATS prefers single-page resumes for entry roles.',
  'Lead bullets with action verbs (Built, Designed, Optimised, Reduced) and end with a number or outcome.',
  'For Indian campus placements, mention 10th, 12th, and graduation percentages clearly. TCS, Infosys, Wipro all filter on these.',
  'Use a clean ATS-friendly template. Skip the columns, photos, graphics, and skill bars. They break parsers.',
  'List a public GitHub URL even if the projects are small. A blank GitHub for a CS fresher is a red flag in 2026.',
  'For non-IT freshers, replace projects with college events organised, club leadership, or relevant case studies.',
];

const TOC = [
  { id: 'intro', label: 'Introduction' },
  { id: 'sections', label: 'The 7 sections' },
  { id: 'rules', label: '6 rules to live by' },
  { id: 'sample', label: 'Sample project bullet' },
  { id: 'layout', label: 'Visual layout, section by section' },
  { id: 'mistakes', label: '6 mistakes that kill fresher resumes' },
  { id: 'faq', label: 'Frequently asked' },
  { id: 'formats', label: 'Chronological vs functional vs hybrid' },
  { id: 'glossary', label: 'Glossary' },
];

const RELATED = [
  { title: 'How to Beat ATS: The Complete Guide', slug: 'ats-guide', excerpt: '75% of resumes never reach a human. Here is how ATS works and how to fix yours.', read: 12 },
  { title: 'Campus Placement Resume 2026', slug: 'campus-placement-resume', excerpt: '10-point checklist and 5-round process walkthrough for Indian campus placements.', read: 10 },
  { title: '8 Naukri Resume Tips That 3x Recruiter Views', slug: 'naukri-resume-tips', excerpt: 'How Arjun went from 2 to 40 recruiter views a week, and the 8 things he changed.', read: 9 },
  { title: 'Resume Writing Tips That Actually Work', slug: 'resume-tips', excerpt: '40 action verbs, 5 before-and-after bullet rewrites, and 8 mistakes that sink your resume.', read: 9 },
  { title: 'Cover Letter Guide & Templates', slug: 'cover-letter', excerpt: 'The 4-part structure plus 6 industry templates hiring managers actually read.', read: 8 },
];

export default function FresherResumePage() {
  const { openGateway } = useLoginGateway();



  return (
    <>      <BlogPostLayout
        category="Resume Writing"
        breadcrumbCurrent="Fresher resume format"
        title="Fresher Resume Format 2026"
        subtitle="The exact 7-section format that beats Indian and global ATS for freshers. Built for campus placements, off-campus drives, and TCS NQT / Infosys InfyTQ / Wipro NTH applications."
        dateModified="2026-04-15"
        readingTime={11}
        toc={TOC}
        related={RELATED}
      >
        <section id="intro" className="scroll-mt-6">
          <p>India produces over 1.5 million engineering graduates every year. The students who get placed first are not always the ones with the highest CGPA. They are the ones with resumes that are easy for recruiters to skim, ATS-clean, and full of evidence of doing real things. Here is the format that consistently wins.</p>
        </section>

        <section id="sections" className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The 7 Sections of a Winning Fresher Resume</h2>
          <div className="space-y-4">
            {SECTIONS.map((section, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="rules" className="mt-10 scroll-mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">6 fresher resume rules to live by</h2>
          </div>
          <ol className="space-y-3">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex gap-3 text-gray-800">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="sample" className="mt-10 scroll-mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Sample fresher project bullet</h2>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-gray-900 mb-2">Smart Attendance System (React, Node.js, MongoDB)</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>. Built a face-recognition based attendance system using TensorFlow.js, reducing marking time per class from 8 minutes to 30 seconds.</li>
              <li>. Designed REST APIs serving 12 endpoints with JWT auth, deployed on Vercel and MongoDB Atlas.</li>
              <li>. Open sourced on GitHub (110 stars) and adopted by 3 college departments.</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-3">Notice: tech stack is named, the impact is quantified, and there is verifiable proof (GitHub stars, real adoption).</p>
        </section>

        <section id="layout" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Layout className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">The visual layout, section by section</h2>
          </div>
          <p className="text-gray-600 mb-4">Here is exactly how each section should look on the page. This is the single-column, ATS-safe layout that works for every major Indian and global recruiter.</p>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {Object.entries(LAYOUT_GUIDE).map(([key, val], i, arr) => (
              <div key={key} className={`flex flex-col sm:flex-row sm:items-start gap-3 p-4 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600 sm:w-32 shrink-0">{key}</span>
                <span className="text-sm text-gray-700 leading-relaxed">{val}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="mistakes" className="mt-10 scroll-mt-6 bg-red-50 rounded-xl border border-red-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">6 mistakes that kill fresher resumes</h2>
          </div>
          <div className="space-y-3">
            {MISTAKES.map((m, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-red-100">
                <p className="text-sm font-semibold text-red-900 mb-1">✗ {m.mistake}</p>
                <p className="text-sm text-gray-700"><span className="text-green-700 font-semibold">✓ Fix:</span> {m.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Fresher resume FAQ</h2>
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

        <section id="formats" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Chronological vs functional vs hybrid</h2>
          </div>
          <p className="text-gray-600 mb-4">Most freshers use chronological without thinking about it, and that is usually correct. Here is the full comparison so you can see why the default wins for entry-level applicants.</p>
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Feature</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Chronological</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Functional</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 text-xs uppercase tracking-wide">Hybrid</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className={i < COMPARISON_ROWS.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{row.chrono}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{row.funct}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{row.hybrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="glossary" className="mt-10 scroll-mt-6 bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Fresher resume glossary</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">The terms that show up on Indian campus placement notices and hiring portals, defined clearly.</p>
          <dl className="grid sm:grid-cols-2 gap-3">
            {GLOSSARY.map((g, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <dt className="font-bold text-gray-900 text-sm mb-1">{g.term}</dt>
                <dd className="text-xs text-gray-600 leading-relaxed">{g.full}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 text-center bg-gray-900 text-white rounded-2xl py-10 px-6">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-3">Build your fresher resume in 20 minutes</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">Free to start. ATS-clean templates that pass TCS, Infosys, Wipro internal portals.</p>
          <button onClick={() => openGateway('/builder')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm">
            Start My Resume <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </BlogPostLayout>
    </>
  );
}
