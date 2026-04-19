// Central SEO metadata for every blog post. Server components under
// app/<slug>/page.tsx import from here so titles, descriptions, canonicals,
// and FAQ schema arrays all live in one place — no duplication between the
// useEffect-based client code and the metadata export.
//
// Rules applied while authoring this file:
// - Titles trimmed to <=60 characters (Google SERP truncation point).
// - Descriptions 150-160 characters, primary keyword in first 90 chars.
// - FAQ arrays mirror the accordion questions already visible on each page.

import type { FAQItem } from '@/lib/articleSchema';

export interface BlogSeo {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string; // the /blog?cat= value
  datePublished: string;
  dateModified: string;
  faqs?: FAQItem[];
}

export const BLOG_SEO: Record<string, BlogSeo> = {
  'pass-ats-resume-scanning': {
    slug: 'pass-ats-resume-scanning',
    title: 'How to Pass ATS Resume Scanning in 2026',
    description: 'Beat applicant tracking systems in 2026. 10 tactics, 7 ATS killers, PDF vs DOCX truth, top 5 systems, and free tools to test your resume.',
    category: 'ATS & Keywords',
    categorySlug: 'ats-keywords',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Does ATS read PDF?', a: 'Yes, modern ATS systems read selectable-text PDFs reliably. Scanned image PDFs fail because the text is locked inside an image.' },
      { q: 'How many keywords should I include?', a: 'Aim for 60 to 80 percent match on the hard skills and tools listed in the job description. Do not keyword-stuff.' },
      { q: 'Does LinkedIn Easy Apply skip the ATS?', a: 'No. Easy Apply feeds LinkedIn data directly into the company ATS, so the same rules apply.' },
      { q: 'What is a good ATS score?', a: 'Above 70/100 puts you in the top 25 percent of applicants. Above 85 is elite. Aim for 80+.' },
      { q: 'How do I know if a company uses an ATS?', a: 'Assume yes. 98% of Fortune 500 companies and around 70% of mid-size companies use one.' },
    ],
  },
  'resume-action-verbs': {
    slug: 'resume-action-verbs',
    title: '200+ Resume Action Verbs by Category (2026)',
    description: '210 resume verbs grouped by role (leadership, technical, sales, analysis + more). Weak-to-strong swap table plus 10 real bullet examples.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Should every bullet start with a different verb?', a: 'Within the same role, yes. Repeating the same verb three or four times makes the resume feel thin. Shoot for 80% unique verbs per role section.' },
      { q: 'What tense should resume verbs be in?', a: 'Past tense for all past roles. Present tense only for your current job. Mixing tenses within a single job is the most common grammar error recruiters flag.' },
      { q: 'Does the ATS care about action verbs?', a: 'Less than humans do. ATS parsers mostly match on nouns. But strong verbs still help because some ATS platforms weight bullets in the Verb + Result pattern higher.' },
    ],
  },
  'resume-length': {
    slug: 'resume-length',
    title: 'Resume Length 2026: 1 Page vs 2 Pages',
    description: 'How long should a resume be in 2026? 1 page under 5 years experience, 2 above. Full framework by career stage, industry, and cutting tactics.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Can a resume be 1.5 pages?', a: 'No. Either fill page 2 to at least 60 percent or cut to 1 page. A half-empty page 2 looks sloppy.' },
      { q: 'Does resume length matter for ATS?', a: 'ATS parsers do not care about page count. They care about whether they can extract your content. A 1-page resume is no better or worse than 2 pages for parsing.' },
      { q: 'Should I have different-length resumes for different jobs?', a: 'Usually not. Keep one canonical version, tailor the skills section and summary. Only vary length across wildly different roles.' },
      { q: 'Can my resume be shorter than 1 page?', a: 'Only for very early fresher resumes. Half a page reads as "not enough to say".' },
    ],
  },
  'resume-summary-examples': {
    slug: 'resume-summary-examples',
    title: '25 Resume Summary Examples That Get Interviews',
    description: '15 summary examples by career stage + 10 by industry. Before/after versions, the 4-part formula, mistakes, and how to use AI without sounding generic.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'How long should my resume summary be?', a: '40 to 90 words. Three to four sentences. Under three sentences reads thin; over five reads like bad Experience writing.' },
      { q: 'Do I need a summary if I have no experience?', a: 'Yes, a shortened one. For freshers: 2 sentences naming your degree, strongest project or internship with a number, and the role level you are targeting.' },
      { q: 'Do recruiters actually read the summary?', a: 'About 65 to 70 percent do. For them, a strong summary is the single highest-impact sentence on your resume.' },
    ],
  },
  'resume-format-guide': {
    slug: 'resume-format-guide',
    title: 'Best Resume Format 2026: Chronological vs Functional',
    description: 'The 3 resume formats compared: chronological, functional, hybrid. Which beats ATS, which recruiters trust, and the decision tree for your situation.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Is the functional resume really dead?', a: 'Essentially yes, for most job seekers. For any corporate application flow in 2026, use chronological or hybrid.' },
      { q: 'What resume format do FAANG companies prefer?', a: 'Chronological at SDE-I to SDE-II levels. Hybrid is acceptable at Staff+ for candidates with unusual breadth.' },
    ],
  },
  'quantify-resume-achievements': {
    slug: 'quantify-resume-achievements',
    title: 'How to Quantify Resume Achievements (2026 Guide)',
    description: 'Turn vague bullets into metric-driven proof. The XYZ formula, 9 places to find numbers, and 50+ quantified bullet examples across 8 roles.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'How many bullets on my resume should have numbers?', a: 'At least 60%. Ideally every bullet has at least one piece of quantification: a count, percentage, scale, or timeframe.' },
      { q: 'Can I round numbers for readability?', a: 'Yes, within reason. Round to the nearest easily-grasped figure (14k not 14,237), but do not inflate.' },
      { q: 'Should I use % or absolute numbers?', a: 'Both when possible. Cut CAC 40% (Rs 1,200 to Rs 720) is stronger than either alone.' },
    ],
  },
  'cover-letter-vs-resume': {
    slug: 'cover-letter-vs-resume',
    title: 'Cover Letter vs Resume: Do You Need Both?',
    description: 'Do you still need a cover letter in 2026? Honest answer with data. When to write one, when to skip, and the hidden cost of going without.',
    category: 'Interviews & Cover Letters',
    categorySlug: 'interviews-cover-letters',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'How long should a cover letter be?', a: '200 to 400 words. 3 to 4 short paragraphs. Always 1 page.' },
      { q: 'Do I write a new cover letter for every application?', a: 'Paragraphs 1 and 2 need substantive tailoring. Paragraph 3 can be recycled across similar roles with minor tweaks.' },
      { q: 'Can I just paste my resume into a cover letter?', a: 'No. A cover letter repeating resume bullets is wasted space.' },
    ],
  },
  'tailor-resume': {
    slug: 'tailor-resume',
    title: 'How to Tailor Your Resume in 10 Minutes',
    description: 'Tailored resumes get 3x more callbacks. The minute-by-minute process to customize for any JD without starting over. AI-assisted workflow included.',
    category: 'ATS & Keywords',
    categorySlug: 'ats-keywords',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Should I tailor for every application?', a: 'For every application you actually care about, yes. For low-intent mass postings, a 2-minute tailoring of the summary + top 3 bullets is still worth it.' },
      { q: 'How much tailoring is too much?', a: 'If you are editing 5+ bullets per application or making structural changes, you are over-tailoring. Keep a clean master resume; tailor deltas only.' },
      { q: 'Can AI do the full tailoring for me?', a: 'It can draft, but review every output. AI hallucinates numbers and can list skills you do not have.' },
    ],
  },
  'best-free-resume-builder': {
    slug: 'best-free-resume-builder',
    title: 'Free vs Paid Resume Builders 2026: Honest Review',
    description: '8 resume builders compared honestly: pricing, privacy, ATS compatibility, AI. Which "free" builders paywall the download. Open-source options.',
    category: 'AI Resume Tools',
    categorySlug: 'ai-resume',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Is there a truly 100% free resume builder?', a: 'Yes. Indeed Resume Builder, ResumeBuildz, and open-source tools all offer full-function build + export without paywalls.' },
      { q: 'Do paid resume builders produce better resumes?', a: 'Not inherently. What you write matters far more than which builder you use.' },
      { q: 'How do I cancel a resume builder trial?', a: 'Set a calendar reminder for 48 hours before the trial ends. Cancel via account settings; if that fails, email support AND dispute with your card issuer.' },
    ],
  },
  'ai-resume-builders-tested': {
    slug: 'ai-resume-builders-tested',
    title: 'AI Resume Builders 2026: We Tested 8',
    description: 'We tested 8 AI resume tools with the same input. What AI does well, what it hallucinates, privacy gotchas, and 5 rules for using AI honestly.',
    category: 'AI Resume Tools',
    categorySlug: 'ai-resume',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Is it ethical to use AI for my resume?', a: 'Yes, with limits. AI as editor is widely accepted; AI as inventor is fraud. Every fact on your resume must be true whether AI helped phrase it or not.' },
      { q: 'Will I get rejected for using AI?', a: 'Not for using it well. You will get rejected (or fired in onboarding) if AI invented achievements you cannot discuss in interview.' },
      { q: 'Can ATS detect AI-written resumes?', a: 'Some can, most cannot yet in 2026. Humans detect AI writing more reliably: recruiters flag AI-generated resumes 61% of the time after light training.' },
    ],
  },
  'fresher-resume': {
    slug: 'fresher-resume',
    title: 'Fresher Resume Format 2026 (7-Section Template)',
    description: 'The exact 7-section fresher resume format that beats Indian and global ATS. Built for campus placements, NQT/InfyTQ, and off-campus drives.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
  'resume-tips': {
    slug: 'resume-tips',
    title: 'Resume Writing Tips That Actually Work',
    description: 'The practical resume tips recruiters wish candidates followed. Quantified bullets, action verbs, the one-page rule, filename rules, proofread checklist.',
    category: 'Resume Writing',
    categorySlug: 'resume-writing',
    datePublished: '2026-03-20',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'How often should I update my resume?', a: 'At minimum, every 6 months even when not actively job searching. Record new wins while they are fresh.' },
      { q: 'Should I include my photo?', a: 'In India: only if customer-facing. In the US / UK / Canada: never. Many ATS systems flag photos.' },
      { q: 'Do I need a references section?', a: 'No. References available on request is also unnecessary. Use that space for a stronger section.' },
    ],
  },
  'ats-guide': {
    slug: 'ats-guide',
    title: 'How to Beat ATS: The Complete Guide',
    description: '75% of resumes never reach a human. Here is how ATS works, why yours is filtered, and exactly how to fix it. 10 tactics + per-system tuning.',
    category: 'ATS & Keywords',
    categorySlug: 'ats-keywords',
    datePublished: '2026-02-15',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Does every company use an ATS?', a: '98% of Fortune 500 companies do. Roughly 70% of mid-size companies do. Assume yes unless the posting is from a small shop.' },
      { q: 'Will an ATS reject my resume for typos?', a: 'Not directly, but yes indirectly. A typo in Python becomes Pthyon and the ATS does not match it against the JD Python requirement.' },
      { q: 'Is PDF or DOCX better for ATS?', a: 'Both are excellent on modern parsers. Marginally, selectable-text PDF is safer. Unless the posting explicitly asks for DOCX, use PDF.' },
    ],
  },
  'resume-after-layoff': {
    slug: 'resume-after-layoff',
    title: 'Resume After a Layoff: 5-Step Guide for 2026',
    description: '350,000+ tech workers were laid off since 2024. The 5-step playbook to rewrite your resume with no apologetic tone and no awkward gaps.',
    category: 'Career Transitions',
    categorySlug: 'career-transitions',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
  'resume-after-career-gap': {
    slug: 'resume-after-career-gap',
    title: 'How to Write a Resume After a Career Gap',
    description: 'A career gap is not a deal-breaker. 62% of professionals have non-linear paths. Here is how to address the gap honestly and still get interviews.',
    category: 'Career Transitions',
    categorySlug: 'career-transitions',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
  'resume-for-career-change': {
    slug: 'resume-for-career-change',
    title: 'Resume for Career Change: 5-Step Pivot Guide',
    description: 'Transferable-skills rewriting, hybrid format, 6 common pivot examples, realistic 12-month timeline, and an informational interview email template.',
    category: 'Career Transitions',
    categorySlug: 'career-transitions',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
  'cover-letter': {
    slug: 'cover-letter',
    title: 'Cover Letter Guide & Templates (2026)',
    description: 'How to write a cover letter that pairs with a strong resume. 4-part structure, complete example, 6 industry templates, mistakes, FAQ.',
    category: 'Interviews & Cover Letters',
    categorySlug: 'interviews-cover-letters',
    datePublished: '2026-03-15',
    dateModified: '2026-04-19',
    faqs: [
      { q: 'Do I still need a cover letter in 2026?', a: 'Yes, in most cases. 83% of hiring managers read cover letters when included. Roughly 1 in 4 recruiters treats a missing cover letter as a silent disqualifier.' },
      { q: 'How long should a cover letter be?', a: '250 to 400 words, 3 to 4 paragraphs, always under 1 page.' },
      { q: 'Should I use the same cover letter for multiple applications?', a: 'Paragraphs 1 and 2 must be tailored per application. Paragraph 3 can be recycled across similar roles.' },
    ],
  },
  'campus-placement-resume': {
    slug: 'campus-placement-resume',
    title: 'Campus Placement Resume 2026 (India)',
    description: 'The 10-point checklist + 5-round process walkthrough for Indian campus placements. Built around TCS NQT, Infosys InfyTQ, and Wipro Elite NTH.',
    category: 'India Hiring',
    categorySlug: 'india-hiring',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
  'naukri-resume-tips': {
    slug: 'naukri-resume-tips',
    title: '8 Naukri Resume Tips That 3x Recruiter Views',
    description: 'Naukri 90M candidates and 350k recruiters work off filters, not browsing. Here is how to rank higher in the search results that matter.',
    category: 'India Hiring',
    categorySlug: 'india-hiring',
    datePublished: '2026-04-14',
    dateModified: '2026-04-15',
  },
};

export function getBlogSeo(slug: string): BlogSeo | undefined {
  return BLOG_SEO[slug];
}
