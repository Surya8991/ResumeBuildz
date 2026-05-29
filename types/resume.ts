// Central data contract for the resume builder.
// TemplateName + TEMPLATES power the template picker; sectionOrder controls render order in all templates.

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
  photo: string; // base64 data URL
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic' | '';
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  coverLetter: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
  sectionOrder: string[]; // Determines render order in templates; reordering this array moves sections up/down in the preview.
}

export type TemplateName = 'classic' | 'modern' | 'minimalist' | 'professional' | 'executive' | 'creative' | 'compact' | 'tech' | 'elegant' | 'bold' | 'academic' | 'corporate' | 'nordic' | 'gradient' | 'timeline' | 'sidebar' | 'infographic' | 'federal' | 'startup' | 'monochrome';

// ATS parser compatibility hint:
//  - 'safe'   : single column, plain text. Parses cleanly in every major ATS.
//  - 'caution': decorative elements (timelines, gradient headers, skill bars) most ATS handle but a few mis-read.
//  - 'risky'  : multi-column or sidebar layouts. Many ATS read top-to-bottom and reorder content or drop the sidebar entirely.
export type AtsRisk = 'safe' | 'caution' | 'risky';

export interface TemplateConfig {
  name: TemplateName;
  label: string;
  description: string;
  primaryColor: string;
  atsRisk: AtsRisk;
}

export const TEMPLATES: TemplateConfig[] = [
  { name: 'classic', label: 'Classic', description: 'Traditional single-column layout with serif fonts', primaryColor: '#1a1a1a', atsRisk: 'safe' },
  { name: 'modern', label: 'Modern', description: 'Two-column layout with accent sidebar', primaryColor: '#2563eb', atsRisk: 'risky' },
  { name: 'minimalist', label: 'Minimalist', description: 'Clean whitespace with subtle typography', primaryColor: '#374151', atsRisk: 'safe' },
  { name: 'professional', label: 'Professional', description: 'Bold headers with structured sections', primaryColor: '#0f766e', atsRisk: 'safe' },
  { name: 'executive', label: 'Executive', description: 'Elegant design with muted tones', primaryColor: '#4338ca', atsRisk: 'safe' },
  { name: 'creative', label: 'Creative', description: 'Colorful accents with unique layout', primaryColor: '#db2777', atsRisk: 'safe' },
  { name: 'compact', label: 'Compact', description: 'Dense single-column, fits more content', primaryColor: '#334155', atsRisk: 'safe' },
  { name: 'tech', label: 'Tech', description: 'Developer-focused with dark sidebar', primaryColor: '#10b981', atsRisk: 'risky' },
  { name: 'elegant', label: 'Elegant', description: 'Refined typography with soft accents', primaryColor: '#8b5cf6', atsRisk: 'safe' },
  { name: 'bold', label: 'Bold', description: 'Heavy typography with strong visual impact', primaryColor: '#1e293b', atsRisk: 'safe' },
  { name: 'academic', label: 'Academic', description: 'Research-focused with publications style', primaryColor: '#1e40af', atsRisk: 'safe' },
  { name: 'corporate', label: 'Corporate', description: 'Conservative design for traditional industries', primaryColor: '#0c4a6e', atsRisk: 'safe' },
  { name: 'nordic', label: 'Nordic', description: 'Scandinavian clean design with soft tones', primaryColor: '#64748b', atsRisk: 'safe' },
  { name: 'gradient', label: 'Gradient', description: 'Subtle gradient header with modern feel', primaryColor: '#7c3aed', atsRisk: 'caution' },
  { name: 'timeline', label: 'Timeline', description: 'Vertical timeline layout for experience', primaryColor: '#0891b2', atsRisk: 'caution' },
  { name: 'sidebar', label: 'Sidebar', description: 'Right-aligned sidebar with clean layout', primaryColor: '#059669', atsRisk: 'risky' },
  { name: 'infographic', label: 'Infographic', description: 'Visual skill bars and metric highlights', primaryColor: '#d946ef', atsRisk: 'caution' },
  { name: 'federal', label: 'Federal', description: 'Government resume format, formal style', primaryColor: '#1e3a5f', atsRisk: 'safe' },
  { name: 'startup', label: 'Startup', description: 'Modern startup aesthetic with bold accents', primaryColor: '#f97316', atsRisk: 'safe' },
  { name: 'monochrome', label: 'Monochrome', description: 'Pure black and white, no color accents', primaryColor: '#18181b', atsRisk: 'safe' },
];

export const ATS_RISK_META: Record<AtsRisk, { label: string; tooltip: string; classes: string }> = {
  safe: {
    label: 'ATS-safe',
    tooltip: 'Single column, plain text. Parses cleanly in every major ATS.',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  caution: {
    label: 'ATS-caution',
    tooltip: 'Decorative elements that most ATS handle, but a few mis-read. Run an ATS check after editing.',
    classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  risky: {
    label: 'ATS-risky',
    tooltip: 'Multi-column layout. Many ATS reorder or drop sidebar content. Use only if you know the employer parses cleanly.',
    classes: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  },
};

// Accent presets offered in the builder color picker.
export const DEFAULT_COLORS = [
  '#1a1a1a', '#2563eb', '#0f766e', '#4338ca', '#db2777',
  '#dc2626', '#ea580c', '#16a34a', '#7c3aed', '#0891b2',
];

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Sarah Mitchell',
    jobTitle: 'Senior Product Manager',
    email: 'sarah.mitchell@email.com',
    phone: '+1 (415) 223-8910',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/sarahmitchell',
    website: 'sarahmitchell.io',
    github: '',
    photo: '',
  },
  summary:
    'Results-driven Product Manager with 7+ years of experience launching B2B SaaS products from ideation to scale. Skilled in user research, data-driven prioritization, and cross-functional leadership. Grew ARR from $2M to $18M by aligning product strategy with market needs and customer feedback.',
  coverLetter: '',
  experience: [
    {
      id: 'exp-1',
      company: 'NovaTech Solutions',
      position: 'Senior Product Manager',
      location: 'New York, NY',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Leading product strategy for the enterprise analytics platform.',
      highlights: [
        'Launched 3 major product features that increased user retention by 35%',
        'Led a cross-functional team of 12 engineers, 3 designers, and 2 data scientists',
        'Defined product roadmap generating $8M in new annual recurring revenue',
        'Established OKR framework adopted across 5 product teams company-wide',
      ],
    },
    {
      id: 'exp-2',
      company: 'CloudSync Inc.',
      position: 'Product Manager',
      location: 'San Francisco, CA',
      startDate: '2019-03',
      endDate: '2021-12',
      current: false,
      description: 'Managed the core collaboration product used by 200K+ users.',
      highlights: [
        'Conducted 150+ user interviews to identify pain points and validate solutions',
        'Increased NPS from 32 to 58 through targeted UX improvements',
        'Reduced customer churn by 22% with proactive engagement features',
        'Shipped MVP for mobile app in 10 weeks, reaching 50K downloads in 3 months',
      ],
    },
    {
      id: 'exp-3',
      company: 'DataFlow Analytics',
      position: 'Associate Product Manager',
      location: 'Austin, TX',
      startDate: '2017-06',
      endDate: '2019-02',
      current: false,
      description: 'Supported product development for the reporting and dashboards module.',
      highlights: [
        'Managed backlog of 200+ feature requests using RICE scoring framework',
        'Designed A/B testing program that improved conversion rates by 18%',
        'Created competitive analysis framework adopted by the product organization',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Columbia University',
      degree: 'Master of Business Administration',
      field: 'Technology Management',
      location: 'New York, NY',
      startDate: '2015-09',
      endDate: '2017-05',
      gpa: '3.9',
      highlights: ['Product Management Club President', 'Case Competition Winner 2016'],
    },
    {
      id: 'edu-2',
      institution: 'University of Michigan',
      degree: 'Bachelor of Science',
      field: 'Information Systems',
      location: 'Ann Arbor, MI',
      startDate: '2011-09',
      endDate: '2015-05',
      gpa: '3.7',
      highlights: ['Honors Program', 'Dean\'s List all semesters'],
    },
  ],
  skills: [
    { id: 'skill-1', category: 'Product', items: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'Agile/Scrum'] },
    { id: 'skill-2', category: 'Analytics', items: ['SQL', 'Mixpanel', 'Amplitude', 'Google Analytics', 'Tableau'] },
    { id: 'skill-3', category: 'Tools', items: ['Jira', 'Figma', 'Notion', 'Confluence', 'Miro'] },
    { id: 'skill-4', category: 'Leadership', items: ['Stakeholder Management', 'Cross-functional Teams', 'OKRs', 'Go-to-Market'] },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Customer Health Score Dashboard',
      description: 'Built an internal tool to predict churn risk and drive proactive customer success.',
      technologies: ['Figma', 'SQL', 'Amplitude', 'Python'],
      link: '',
      startDate: '2023-03',
      endDate: '2023-09',
      highlights: [
        'Reduced churn prediction time from 30 days to 7 days',
        'Adopted by Customer Success team saving 15 hours/week in manual analysis',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Scrum Product Owner (CSPO)',
      issuer: 'Scrum Alliance',
      date: '2020-11',
      expiryDate: '2026-11',
      credentialId: 'CSPO-78901',
      url: '',
    },
    {
      id: 'cert-2',
      name: 'Google Analytics Certification',
      issuer: 'Google',
      date: '2021-05',
      expiryDate: '',
      credentialId: '',
      url: '',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'French', proficiency: 'Advanced' },
    { id: 'lang-3', name: 'Mandarin', proficiency: 'Basic' },
  ],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
};

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    photo: '',
  },
  summary: '',
  coverLetter: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
};
