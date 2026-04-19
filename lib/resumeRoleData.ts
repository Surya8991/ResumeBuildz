// Role-based resume guide data. Each entry powers one /resume-for/[role]
// static page. Content is hand-written, fact-checked, and India + global
// aware. No scraping, no generated filler — every bullet on the page is
// something a real recruiter would call out.

export interface RoleEntry {
  slug: string;
  name: string;
  category: 'engineering' | 'data' | 'product' | 'design' | 'marketing' | 'business' | 'security';
  metaTitle: string;
  metaDescription: string;
  shortBlurb: string;
  coreKeywords: string[];
  mustHaveSections: { title: string; why: string }[];
  sampleBullets: string[];
  commonMistakes: string[];
  actionVerbs: string[];
  salaryIndia: { junior: string; mid: string; senior: string };
  atsTips: string[];
  relatedRoles: string[]; // other role slugs
}

export const ROLES: RoleEntry[] = [
  {
    slug: 'software-engineer',
    name: 'Software Engineer',
    category: 'engineering',
    metaTitle: 'Software Engineer Resume Guide 2026 | ATS Template + Bullets | ResumeBuildz',
    metaDescription: 'Complete software engineer resume guide with ATS-friendly template, real bullet examples for FAANG and Indian IT, tech stack keywords, and salary benchmarks for 2026.',
    shortBlurb: 'Build a resume that gets past ATS keyword scanners at Google, Microsoft, TCS, Infosys, Wipro, Flipkart and lands engineering interviews.',
    coreKeywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'System Design', 'REST API', 'Git', 'CI/CD', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'Data Structures', 'Algorithms', 'Microservices', 'Agile', 'Unit Testing'],
    mustHaveSections: [
      { title: 'Technical Skills', why: 'ATS scanners parse this section for exact keyword matches. List languages, frameworks, tools, and cloud platforms in plain text.' },
      { title: 'Work Experience', why: 'Each role needs 3 to 5 measurable bullets. Start with an action verb, include scale (requests/sec, users, data volume), end with impact.' },
      { title: 'Projects', why: 'Mandatory for freshers. Mid level engineers include 1 or 2 side projects that show beyond-job-scope work.' },
      { title: 'Education', why: 'Degree, institution, year, CGPA (if above 7.5). Place below Experience for anyone with more than 2 years of experience.' },
    ],
    sampleBullets: [
      'Reduced API p95 latency from 380ms to 95ms by introducing Redis caching and connection pooling, serving 4M requests per day.',
      'Led migration of 12-service monolith to Kubernetes on AWS EKS, cutting deployment time from 45 minutes to 4 minutes.',
      'Built fraud-detection microservice in Go handling 8K transactions/sec; caught 340 fraudulent charges per month (USD 28K blocked).',
      'Mentored 3 interns on React + TypeScript; all 3 converted to full-time offers after 8-week program.',
    ],
    commonMistakes: [
      'Using "Responsible for" or "Worked on" — recruiters skim and these add zero signal. Start with a measurable verb.',
      'Listing every technology you\'ve ever touched. 15 to 20 core skills is the sweet spot; more signals that none is deep.',
      'No numbers. "Improved performance" is invisible. "Cut build times 8 min to 90s" is not.',
      'Single-page at FAANG for senior roles. Two pages is fine if bullets are dense; recruiters expect more detail above SDE-II.',
    ],
    actionVerbs: ['Architected', 'Built', 'Shipped', 'Reduced', 'Scaled', 'Migrated', 'Automated', 'Debugged', 'Refactored', 'Deployed', 'Optimized', 'Led', 'Mentored'],
    salaryIndia: { junior: 'Rs 6-12 LPA (0-2 yrs)', mid: 'Rs 18-35 LPA (3-6 yrs)', senior: 'Rs 45-90 LPA+ (7+ yrs)' },
    atsTips: [
      'Save as PDF with selectable text. Scanned or image-based PDFs return 0 keyword matches.',
      'Keep section headings standard: Experience, Skills, Projects, Education. ATS parsers break on creative names like "My Journey".',
      'Avoid tables and text boxes. Most ATS parsers flatten them incorrectly.',
      'Include both full and short form of tech terms: "AWS (Amazon Web Services)", "SQL (Structured Query Language)".',
    ],
    relatedRoles: ['full-stack-developer', 'devops-engineer', 'machine-learning-engineer'],
  },
  {
    slug: 'data-scientist',
    name: 'Data Scientist',
    category: 'data',
    metaTitle: 'Data Scientist Resume Guide 2026 | ATS Template + Keywords | ResumeBuildz',
    metaDescription: 'Land data scientist interviews with an ATS-optimized resume. Covers ML keywords, statistics bullet examples, Kaggle/research section, India + US salary benchmarks.',
    shortBlurb: 'Highlight statistical rigor, production ML experience, and business impact so ATS parsers and hiring managers both take notice.',
    coreKeywords: ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost', 'Hypothesis Testing', 'A/B Testing', 'Regression', 'Classification', 'Clustering', 'NLP', 'Computer Vision', 'Feature Engineering', 'MLOps', 'Airflow', 'Spark'],
    mustHaveSections: [
      { title: 'Core Competencies', why: 'Split skills into Languages, ML/Stats, Tools, Cloud. Recruiters scan for "Python + SQL + one ML framework" within 6 seconds.' },
      { title: 'Experience with Business Impact', why: 'Every bullet needs $ saved, % lift, or hours reclaimed. Model accuracy without business context is a red flag.' },
      { title: 'Projects / Kaggle', why: 'Freshers lean here. Link GitHub with well-documented READMEs. Top 10% Kaggle finishes are portfolio gold.' },
      { title: 'Publications / Research', why: 'Papers, arXiv preprints, or conference talks. Include for PhD/research-track roles; skip for pure product DS roles.' },
    ],
    sampleBullets: [
      'Built customer-churn XGBoost model at 0.89 AUC; rollout lifted retention 4.2 percentage points, recovering Rs 3.8 crore ARR in 6 months.',
      'Designed A/B test framework adopted by 7 product teams; reduced false positive rate from 11% to 3% via sequential testing.',
      'Led recommender-system refresh (two-tower neural net on PyTorch); CTR up 18%, revenue per session up Rs 42.',
      'Published benchmark study on transformer efficiency at 2025 ICLR workshop; cited 34 times in 8 months.',
    ],
    commonMistakes: [
      'Listing "Big Data" as a skill. Name the actual tools: Spark, Kafka, Delta Lake.',
      'Model accuracy without baseline or test-set size. "92% accuracy" is meaningless without "vs logistic regression baseline of 71% on 40K holdout".',
      'No mention of production deployment. Recruiters discount purely notebook-based work for senior roles.',
    ],
    actionVerbs: ['Built', 'Trained', 'Deployed', 'Validated', 'Analyzed', 'Modeled', 'Forecasted', 'Reduced', 'Lifted', 'Published', 'Benchmarked'],
    salaryIndia: { junior: 'Rs 8-16 LPA (0-2 yrs)', mid: 'Rs 22-45 LPA (3-6 yrs)', senior: 'Rs 55-1.2 Cr (7+ yrs)' },
    atsTips: [
      'Use both "Machine Learning" and "ML" in the text; different JDs search for different forms.',
      'Spell out libraries fully on first use: "Scikit-learn (sklearn)".',
      'Include "A/B testing" and "hypothesis testing" as separate bullets; they rank differently on ATS.',
    ],
    relatedRoles: ['machine-learning-engineer', 'business-analyst', 'software-engineer'],
  },
  {
    slug: 'product-manager',
    name: 'Product Manager',
    category: 'product',
    metaTitle: 'Product Manager Resume Guide 2026 | PM Template + Real Bullets | ResumeBuildz',
    metaDescription: 'Product manager resume guide with ATS-friendly sections, measurable-impact bullet examples, FAANG + Indian unicorn keywords, and PM salary benchmarks.',
    shortBlurb: 'PM resumes live or die on measurable impact. Learn to phrase bullets so they clear ATS and pass the 6-second recruiter scan.',
    coreKeywords: ['Product Strategy', 'Roadmap', 'User Research', 'A/B Testing', 'Agile', 'Scrum', 'JIRA', 'Figma', 'SQL', 'KPI', 'OKR', 'Prioritization', 'Stakeholder Management', 'Go-to-Market', 'Market Analysis', 'Wireframing'],
    mustHaveSections: [
      { title: 'Impact Summary', why: 'A 2-3 line summary at the top: total users launched to, revenue influenced, teams led. Gets picked up by hiring managers scanning LinkedIn exports.' },
      { title: 'Experience with Metrics', why: 'Every bullet needs a before -> after number. PM roles filter hard on "measurable outcome".' },
      { title: 'Launches', why: 'Named launches ("Shipped Payments v2 to 18M users in 8 weeks") stick better than generic "owned roadmap".' },
    ],
    sampleBullets: [
      'Led launch of unified checkout across 3 products; conversion up 11.4 pp, cart abandonment down 23%, incremental Rs 47 Cr annual revenue.',
      'Ran quarterly OKR process for 42-person product org; on-time delivery rose from 61% to 89% across 14 teams.',
      'Shipped onboarding rewrite based on 28 user interviews + funnel analysis; D7 retention +9%, time-to-first-value halved.',
      'Built 18-month roadmap aligning engineering, design, and GTM; presented to CEO + board; approved within one review cycle.',
    ],
    commonMistakes: [
      'Vague verbs. "Drove alignment" tells the reader nothing. "Ran weekly cross-functional review with 6 team leads" is specific.',
      'No product screenshots/links. GitHub profile or portfolio link with live products is a huge trust signal.',
      'Listing "Agile/Scrum" as a skill without any numbers. Everyone claims it. Show sprint velocity you maintained or stand-up cadence.',
    ],
    actionVerbs: ['Launched', 'Shipped', 'Scaled', 'Prioritized', 'Led', 'Owned', 'Defined', 'Ran', 'Synthesized', 'Grew', 'Killed'],
    salaryIndia: { junior: 'Rs 12-22 LPA (0-2 yrs)', mid: 'Rs 30-55 LPA (3-6 yrs)', senior: 'Rs 70-1.8 Cr (7+ yrs)' },
    atsTips: [
      'Use both "Product Manager" and "PM" in the body; JDs differ.',
      'Include SQL as a skill even for senior PM roles; most product orgs expect it.',
      'Quantify scope: team size, users reached, revenue ownership, runway extended.',
    ],
    relatedRoles: ['business-analyst', 'ui-ux-designer', 'marketing-manager'],
  },
  {
    slug: 'ui-ux-designer',
    name: 'UI/UX Designer',
    category: 'design',
    metaTitle: 'UI/UX Designer Resume Guide 2026 | Portfolio + ATS Template | ResumeBuildz',
    metaDescription: 'UI/UX designer resume guide with ATS keywords, portfolio integration tips, bullet examples showing user research + design impact, and India + global salary data.',
    shortBlurb: 'A designer resume still needs to clear ATS. Learn to show craft, research depth, and measurable impact in under 450 words.',
    coreKeywords: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Sketch', 'Adobe XD', 'Design Systems', 'Interaction Design', 'Usability Testing', 'Information Architecture', 'User Journey', 'A/B Testing', 'Accessibility', 'WCAG', 'Design Thinking'],
    mustHaveSections: [
      { title: 'Portfolio Link', why: 'First line after your name. ATS reads it, recruiters click it. Dribbble, Behance, or your own domain.' },
      { title: 'Design Process', why: 'A 1-line sentence per case study: problem -> research -> design -> outcome. Shows thinking, not just deliverables.' },
      { title: 'Tools + Methods', why: 'Separate them. Tools (Figma, Sketch) go under Skills; methods (usability testing, card sorting) go under Methodology.' },
    ],
    sampleBullets: [
      'Led redesign of onboarding for SaaS product (34M users); task completion 62% -> 91%, support tickets down 44% in 90 days.',
      'Built and governed 180-component design system; adopted by 9 product teams, shipped design-to-production time down from 3 weeks to 4 days.',
      'Ran 42 remote moderated usability sessions; findings killed 2 planned features + validated 1 new flow pre-engineering investment.',
    ],
    commonMistakes: [
      'Showing 20+ projects. 5 deep case studies beat 20 thumbnails every time.',
      'No measurable outcomes. "Redesigned onboarding" is a task. "Redesigned onboarding, completion up 62% to 91%" is a win.',
      'Sending a PDF portfolio instead of a live link. Recruiters want to click, not download.',
    ],
    actionVerbs: ['Designed', 'Redesigned', 'Researched', 'Prototyped', 'Validated', 'Shipped', 'Audited', 'Led', 'Built', 'Facilitated'],
    salaryIndia: { junior: 'Rs 5-10 LPA (0-2 yrs)', mid: 'Rs 14-26 LPA (3-6 yrs)', senior: 'Rs 32-70 LPA (7+ yrs)' },
    atsTips: [
      'Include both "UX" and "User Experience" once each.',
      'List WCAG + accessibility explicitly; many enterprise JDs require it.',
      'Keep portfolio URL in the header, not buried in the summary.',
    ],
    relatedRoles: ['product-manager', 'digital-marketer'],
  },
  {
    slug: 'digital-marketer',
    name: 'Digital Marketer',
    category: 'marketing',
    metaTitle: 'Digital Marketer Resume Guide 2026 | SEO, Paid, CRM Bullets | ResumeBuildz',
    metaDescription: 'Digital marketer resume guide covering SEO, paid ads, CRM, and performance keywords. Real bullet examples with ROAS, CAC, LTV metrics. India + US salary data.',
    shortBlurb: 'Marketing resumes need hard numbers. Learn to show ROAS, CAC payback, and organic traffic growth in recruiter-scannable bullets.',
    coreKeywords: ['SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Email Marketing', 'CRM', 'HubSpot', 'Salesforce', 'Google Analytics', 'GA4', 'A/B Testing', 'Conversion Rate', 'Attribution', 'Content Strategy', 'Copywriting', 'Marketing Automation', 'Lifecycle Marketing'],
    mustHaveSections: [
      { title: 'Performance Metrics', why: 'Lead with ROAS, CAC, LTV, CTR numbers. Marketing hiring is "show me the spreadsheet".' },
      { title: 'Channel Breakdown', why: 'Specialists list 1-2 channels deep; generalists list 5-7 at moderate depth. Be honest about primary vs supporting.' },
      { title: 'Tool Stack', why: 'ATS scans for GA4, HubSpot, Salesforce, Google Ads, Meta Business Manager. List the version/platform, not the vendor name alone.' },
    ],
    sampleBullets: [
      'Scaled Meta + Google paid from Rs 8L/mo to Rs 42L/mo while holding ROAS steady at 4.8x; contributed Rs 2.4 Cr pipeline.',
      'Rewrote top 40 landing pages; organic traffic up 117% YoY, CPA down 38% as share of total marketing spend.',
      'Launched lifecycle email program across 5 segments; open rate 32%, click rate 6.8%, driving Rs 14 Cr incremental revenue.',
    ],
    commonMistakes: [
      'Vanity metrics. "1M impressions" with no conversion is noise. Always pair with a downstream metric.',
      'Listing "Social Media" as one skill. Recruiters want channel specifics: Instagram + LinkedIn + YouTube are different jobs.',
      'No channel-mix context. "Cut CAC 40%" needs "while holding spend constant at Rs 1Cr/month" to be believable.',
    ],
    actionVerbs: ['Scaled', 'Launched', 'Optimized', 'Grew', 'Cut', 'Ran', 'Built', 'Tested', 'Attributed', 'Nurtured'],
    salaryIndia: { junior: 'Rs 3-7 LPA (0-2 yrs)', mid: 'Rs 10-22 LPA (3-6 yrs)', senior: 'Rs 28-60 LPA (7+ yrs)' },
    atsTips: [
      'Include "GA4" explicitly; "Google Analytics" alone misses the version filter on many JDs.',
      'Spell out funnels: TOFU, MOFU, BOFU. Enterprise marketing JDs use these acronyms.',
      'Pair every % with an absolute. "Cut CAC 40%" + "from Rs 1,200 to Rs 720" is stronger.',
    ],
    relatedRoles: ['product-manager', 'business-analyst'],
  },
  {
    slug: 'full-stack-developer',
    name: 'Full Stack Developer',
    category: 'engineering',
    metaTitle: 'Full Stack Developer Resume Guide 2026 | MERN + LAMP Bullets | ResumeBuildz',
    metaDescription: 'Full stack resume guide covering React, Node, Next.js, databases, and DevOps keywords. ATS-friendly bullet examples and salary benchmarks for India + global.',
    shortBlurb: 'Show fluency across frontend, backend, and infra without looking like a jack-of-none. Concrete stack + scale numbers win.',
    coreKeywords: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Vercel', 'Git', 'CI/CD', 'Jest', 'Playwright', 'Tailwind CSS'],
    mustHaveSections: [
      { title: 'Tech Stack', why: 'Split into Frontend, Backend, Database, DevOps. Hiring managers scan this to decide fit in under 10 seconds.' },
      { title: 'Shipped Projects', why: 'For freshers: 2-3 projects with live URLs + GitHub. For mid-level: 1 impressive side project is enough, rest is job experience.' },
    ],
    sampleBullets: [
      'Built end-to-end Next.js + Supabase subscription platform; 24K signups in 90 days, Rs 18L MRR at launch + 6.',
      'Migrated legacy PHP monolith to Node + React; LCP 4.8s -> 1.1s, Lighthouse perf 32 -> 94, SEO traffic 2.3x in 4 months.',
      'Owned CI/CD pipeline on GitHub Actions + Vercel; deploy time 18 min -> 3 min; rollback automated via preview URLs.',
    ],
    commonMistakes: [
      'Listing every JS framework ever. Pick 2-3 you\'d debate on; drop the rest to "Familiar with" section.',
      'No backend metrics. Frontend pixel perfection is easy; show API throughput, DB query improvements.',
    ],
    actionVerbs: ['Built', 'Shipped', 'Migrated', 'Owned', 'Architected', 'Refactored', 'Deployed', 'Scaled'],
    salaryIndia: { junior: 'Rs 5-10 LPA (0-2 yrs)', mid: 'Rs 15-30 LPA (3-6 yrs)', senior: 'Rs 35-75 LPA (7+ yrs)' },
    atsTips: [
      'Include both "Node.js" and "Node" — ATS word boundaries vary.',
      'List databases explicitly: PostgreSQL, not just "SQL"; MongoDB, not just "NoSQL".',
    ],
    relatedRoles: ['software-engineer', 'devops-engineer'],
  },
  {
    slug: 'devops-engineer',
    name: 'DevOps Engineer',
    category: 'engineering',
    metaTitle: 'DevOps Engineer Resume Guide 2026 | K8s + AWS Bullets | ResumeBuildz',
    metaDescription: 'DevOps/SRE resume guide with AWS, Kubernetes, Terraform keywords. Bullet examples showing uptime, deploy time, and cost savings. India + global pay benchmarks.',
    shortBlurb: 'DevOps hiring filters hard on uptime numbers and blast-radius stories. Lead with measurable reliability wins.',
    coreKeywords: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Prometheus', 'Grafana', 'ELK', 'Datadog', 'Linux', 'Bash', 'Python', 'Networking', 'Load Balancing', 'SRE'],
    mustHaveSections: [
      { title: 'Infrastructure Scope', why: 'State the numbers: nodes managed, monthly cloud spend, services in production. Hiring managers filter on this.' },
      { title: 'Uptime / SLO History', why: 'Raw uptime numbers ("99.97% over 18 months across 140 services") stand out vs. vague "reliability ownership".' },
    ],
    sampleBullets: [
      'Cut AWS bill 41% (Rs 2.8 Cr saved annually) via Spot Instance adoption + Savings Plan restructuring + RDS right-sizing.',
      'Led migration from Jenkins to GitHub Actions across 84 repos; pipeline duration 22 min -> 6 min, flakiness -73%.',
      'Ran incident response for 4 SEV1s in past year; mean time to recovery 37 min, zero data loss across all events.',
    ],
    commonMistakes: [
      'Listing "AWS" without specific services. Write EKS, RDS, Lambda, S3, CloudFront individually.',
      'No cost numbers. Cloud cost savings is the single biggest DevOps hiring signal outside uptime.',
    ],
    actionVerbs: ['Automated', 'Scaled', 'Migrated', 'Reduced', 'Monitored', 'Deployed', 'Hardened', 'Rotated'],
    salaryIndia: { junior: 'Rs 7-14 LPA (0-2 yrs)', mid: 'Rs 20-40 LPA (3-6 yrs)', senior: 'Rs 48-1 Cr (7+ yrs)' },
    atsTips: [
      'Include both "Kubernetes" and "K8s".',
      'Call out specific clouds: AWS + GCP + Azure score differently on multi-cloud JDs.',
    ],
    relatedRoles: ['software-engineer', 'cybersecurity-analyst'],
  },
  {
    slug: 'business-analyst',
    name: 'Business Analyst',
    category: 'business',
    metaTitle: 'Business Analyst Resume Guide 2026 | BA Template + Real Bullets | ResumeBuildz',
    metaDescription: 'Business analyst resume guide with SQL + Excel + BI keywords, stakeholder-bridging bullet examples, and IT + consulting + product BA salary data.',
    shortBlurb: 'BAs live at the seam between business and engineering. Show you translate ambiguity into specs that ship.',
    coreKeywords: ['SQL', 'Excel', 'Power BI', 'Tableau', 'Requirements Gathering', 'User Stories', 'JIRA', 'Confluence', 'Stakeholder Management', 'Process Mapping', 'BPMN', 'UAT', 'SDLC', 'Agile', 'Gap Analysis', 'KPI', 'Forecasting'],
    mustHaveSections: [
      { title: 'Domain Expertise', why: 'Fintech vs healthcare vs retail BAs hire on domain. Lead with the domain + years in it.' },
      { title: 'Projects Delivered', why: 'Named projects with outcome beat generic "delivered requirements". Quantify: 14 user stories, 3 sprints, USD 400K savings.' },
    ],
    sampleBullets: [
      'Owned requirements for payments reconciliation system; 220 user stories across 8 sprints; reduced manual work 18 hrs/week for 12 analysts.',
      'Built Power BI dashboard tracking 47 KPIs for CFO org; refresh time 2 hrs -> 4 min, board-ready in real time.',
      'Facilitated UAT for loan-origination module; 180 test cases, 14 defects caught pre-prod, on-time go-live.',
    ],
    commonMistakes: [
      'Listing "Communication" as a skill. Show it in bullets via "facilitated workshop with 22 stakeholders".',
      'SQL but no level. "SQL (joins, window functions, CTEs)" beats bare "SQL".',
    ],
    actionVerbs: ['Analyzed', 'Documented', 'Elicited', 'Facilitated', 'Translated', 'Mapped', 'Validated'],
    salaryIndia: { junior: 'Rs 5-10 LPA (0-2 yrs)', mid: 'Rs 12-24 LPA (3-6 yrs)', senior: 'Rs 28-55 LPA (7+ yrs)' },
    atsTips: [
      'Include both "Business Analyst" and "BA" once each.',
      'List BPMN, UML, SDLC even if used lightly; many JDs filter on these.',
    ],
    relatedRoles: ['data-scientist', 'product-manager'],
  },
  {
    slug: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'security',
    metaTitle: 'Cybersecurity Analyst Resume Guide 2026 | SOC + Cert Keywords | ResumeBuildz',
    metaDescription: 'Cybersecurity resume guide covering SOC, incident response, OWASP, CompTIA, CISSP keywords. Real bullet examples and salary benchmarks for India + global markets.',
    shortBlurb: 'Security hiring is cert-heavy and incident-driven. Foreground certifications and specific incident metrics.',
    coreKeywords: ['SOC', 'SIEM', 'Splunk', 'QRadar', 'Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'Incident Response', 'Vulnerability Assessment', 'Penetration Testing', 'OWASP Top 10', 'NIST', 'ISO 27001', 'CompTIA Security+', 'CEH', 'CISSP', 'IDS', 'IPS', 'Firewall', 'Zero Trust'],
    mustHaveSections: [
      { title: 'Certifications', why: 'Most security JDs gate on certs. List CompTIA, CEH, OSCP, CISSP with issue + expiry dates.' },
      { title: 'Incident Experience', why: 'Number of incidents handled, SEV levels, MTTR. Concrete more than generic "investigated alerts".' },
      { title: 'Tools + Frameworks', why: 'SIEM (Splunk, QRadar), EDR (CrowdStrike, SentinelOne), scanners (Nessus, Qualys). List actual products.' },
    ],
    sampleBullets: [
      'Triaged 2,400+ alerts monthly in Splunk SIEM across 8 regional SOCs; escalated 87 true positives; SLA met 99.4%.',
      'Led IR for ransomware on 140-node domain; isolated within 38 minutes, full restore under 6 hrs, zero ransom paid.',
      'Completed OWASP Top 10 pen test across 22 internal apps; 34 highs patched + 11 critical auth bypasses closed in 90 days.',
    ],
    commonMistakes: [
      'Stating "Security minded" without certs or specific tools. Meaningless.',
      'No framework mentions. NIST, ISO 27001, CIS, MITRE ATT&CK should appear at least once.',
    ],
    actionVerbs: ['Hardened', 'Investigated', 'Triaged', 'Patched', 'Audited', 'Responded', 'Remediated', 'Mapped'],
    salaryIndia: { junior: 'Rs 6-12 LPA (0-2 yrs)', mid: 'Rs 16-32 LPA (3-6 yrs)', senior: 'Rs 40-85 LPA (7+ yrs)' },
    atsTips: [
      'List certifications in the top 1/3 of the resume; recruiters filter hard on this.',
      'Include both "Penetration Testing" and "Pen Testing" for JD variance.',
    ],
    relatedRoles: ['devops-engineer', 'software-engineer'],
  },
  {
    slug: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    category: 'data',
    metaTitle: 'Machine Learning Engineer Resume Guide 2026 | MLOps Bullets | ResumeBuildz',
    metaDescription: 'ML engineer resume guide with MLOps, PyTorch, production deployment keywords. Real bullet examples covering latency, accuracy, infrastructure. India + global salary.',
    shortBlurb: 'MLE is data scientist + software engineer. Show both: modeling rigor AND production-grade deployment and monitoring.',
    coreKeywords: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'Hugging Face', 'MLflow', 'Kubeflow', 'Airflow', 'Feature Store', 'Feast', 'Docker', 'Kubernetes', 'AWS SageMaker', 'GCP Vertex AI', 'Model Serving', 'Triton', 'TorchServe', 'A/B Testing', 'Model Monitoring'],
    mustHaveSections: [
      { title: 'Production ML', why: 'Distinguish yourself from data scientists. List models in prod, QPS, p95 latency, monitoring stack.' },
      { title: 'Modeling Range', why: 'Classical ML + DL + LLM. One bullet per family is enough; depth over breadth.' },
    ],
    sampleBullets: [
      'Deployed fraud detection XGBoost model to 3K QPS production traffic; p95 latency 42ms; drift monitoring via Evidently + Prometheus.',
      'Built LLM summarization service with Llama 3 + LoRA fine-tuning; reduced human review time 71%, rolled out to 180 agents.',
      'Owned feature store migration to Feast; 240 features across 14 teams; training/serving skew bugs eliminated.',
    ],
    commonMistakes: [
      'Listing only notebook work. MLE roles weight production 2x over experimentation.',
      'No serving framework. TorchServe, Triton, BentoML, or SageMaker endpoints should appear for any MLE claim.',
    ],
    actionVerbs: ['Deployed', 'Trained', 'Fine-tuned', 'Optimized', 'Monitored', 'Scaled', 'Productionized'],
    salaryIndia: { junior: 'Rs 10-18 LPA (0-2 yrs)', mid: 'Rs 25-50 LPA (3-6 yrs)', senior: 'Rs 60-1.5 Cr (7+ yrs)' },
    atsTips: [
      'Include MLOps as a standalone skill; some JDs filter on it specifically.',
      'List at least one LLM family (Llama, GPT, Claude, Mistral) if you have any.',
    ],
    relatedRoles: ['data-scientist', 'software-engineer', 'devops-engineer'],
  },
];

export function getRoleBySlug(slug: string): RoleEntry | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function getRelatedRoles(role: RoleEntry): RoleEntry[] {
  return role.relatedRoles.map((s) => ROLES.find((r) => r.slug === s)).filter((r): r is RoleEntry => !!r);
}

export function rolesByCategory(): Record<string, RoleEntry[]> {
  const out: Record<string, RoleEntry[]> = {};
  for (const role of ROLES) {
    if (!out[role.category]) out[role.category] = [];
    out[role.category].push(role);
  }
  return out;
}
