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
  sectionOrder: string[];
}

export type TemplateName = 'classic' | 'modern' | 'minimalist' | 'professional' | 'executive' | 'creative' | 'compact' | 'tech' | 'elegant' | 'bold' | 'academic' | 'corporate' | 'nordic' | 'gradient' | 'timeline' | 'sidebar' | 'infographic' | 'federal' | 'startup' | 'monochrome';

export interface TemplateConfig {
  name: TemplateName;
  label: string;
  description: string;
  primaryColor: string;
}

export const TEMPLATES: TemplateConfig[] = [
  { name: 'classic', label: 'Classic', description: 'Traditional single-column layout with serif fonts', primaryColor: '#1a1a1a' },
  { name: 'modern', label: 'Modern', description: 'Two-column layout with accent sidebar', primaryColor: '#2563eb' },
  { name: 'minimalist', label: 'Minimalist', description: 'Clean whitespace with subtle typography', primaryColor: '#374151' },
  { name: 'professional', label: 'Professional', description: 'Bold headers with structured sections', primaryColor: '#0f766e' },
  { name: 'executive', label: 'Executive', description: 'Elegant design with muted tones', primaryColor: '#4338ca' },
  { name: 'creative', label: 'Creative', description: 'Colorful accents with unique layout', primaryColor: '#db2777' },
  { name: 'compact', label: 'Compact', description: 'Dense single-column, fits more content', primaryColor: '#334155' },
  { name: 'tech', label: 'Tech', description: 'Developer-focused with dark sidebar', primaryColor: '#10b981' },
  { name: 'elegant', label: 'Elegant', description: 'Refined typography with soft accents', primaryColor: '#8b5cf6' },
  { name: 'bold', label: 'Bold', description: 'Heavy typography with strong visual impact', primaryColor: '#1e293b' },
  { name: 'academic', label: 'Academic', description: 'Research-focused with publications style', primaryColor: '#1e40af' },
  { name: 'corporate', label: 'Corporate', description: 'Conservative design for traditional industries', primaryColor: '#0c4a6e' },
  { name: 'nordic', label: 'Nordic', description: 'Scandinavian clean design with soft tones', primaryColor: '#64748b' },
  { name: 'gradient', label: 'Gradient', description: 'Subtle gradient header with modern feel', primaryColor: '#7c3aed' },
  { name: 'timeline', label: 'Timeline', description: 'Vertical timeline layout for experience', primaryColor: '#0891b2' },
  { name: 'sidebar', label: 'Sidebar', description: 'Right-aligned sidebar with clean layout', primaryColor: '#059669' },
  { name: 'infographic', label: 'Infographic', description: 'Visual skill bars and metric highlights', primaryColor: '#d946ef' },
  { name: 'federal', label: 'Federal', description: 'Government resume format, formal style', primaryColor: '#1e3a5f' },
  { name: 'startup', label: 'Startup', description: 'Modern startup aesthetic with bold accents', primaryColor: '#f97316' },
  { name: 'monochrome', label: 'Monochrome', description: 'Pure black and white, no color accents', primaryColor: '#18181b' },
];

export const DEFAULT_COLORS = [
  '#1a1a1a', '#2563eb', '#0f766e', '#4338ca', '#db2777',
  '#dc2626', '#ea580c', '#16a34a', '#7c3aed', '#0891b2',
];

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 987-6543',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    github: 'github.com/alexjohnson',
    photo: '',
  },
  summary:
    'Experienced software engineer with 8+ years building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Led teams of 5-10 engineers and delivered products serving millions of users.',
  coverLetter: '',
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead engineer for the core platform team.',
      highlights: [
        'Architected microservices platform serving 2M+ daily active users',
        'Reduced API response times by 40% through caching and query optimization',
        'Mentored 4 junior engineers and led code review processes',
      ],
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Built and maintained customer-facing web applications.',
      highlights: [
        'Developed React-based dashboard used by 500+ enterprise clients',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Integrated third-party APIs for payment processing and analytics',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
      highlights: ['Dean\'s List 2016-2018', 'Capstone: Real-time collaborative editor'],
    },
  ],
  skills: [
    { id: 'skill-1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
    { id: 'skill-2', category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
    { id: 'skill-3', category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenTasker',
      description: 'Open-source project management tool with real-time collaboration.',
      technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
      link: 'github.com/alexjohnson/opentasker',
      startDate: '2023-01',
      endDate: '2023-06',
      highlights: [
        '1.2K+ GitHub stars and 50+ contributors',
        'Featured in JavaScript Weekly newsletter',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-08',
      expiryDate: '2025-08',
      credentialId: 'AWS-SA-12345',
      url: '',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Intermediate' },
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
