'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ResumeData,
  TemplateName,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  CustomSection,
  defaultResumeData,
  sampleResumeData,
} from '@/types/resume';
import { StyleOptions, DEFAULT_STYLE_OPTIONS } from '@/components/templates/TemplateWrapper';

interface ResumeStore {
  resumeData: ResumeData;
  selectedTemplate: TemplateName;
  primaryColor: string;
  activeSection: string;
  styleOptions: StyleOptions;

  setSelectedTemplate: (template: TemplateName) => void;
  setPrimaryColor: (color: string) => void;
  setActiveSection: (section: string) => void;
  updateStyleOptions: (options: Partial<StyleOptions>) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Summary
  updateSummary: (summary: string) => void;

  // Cover Letter
  updateCoverLetter: (coverLetter: string) => void;

  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (experiences: Experience[]) => void;

  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (education: Education[]) => void;

  // Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Certifications
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Custom Sections
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;

  // Section Order
  updateSectionOrder: (order: string[]) => void;

  // Import/Export
  importData: (data: ResumeData) => void;
  resetData: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: sampleResumeData,
      selectedTemplate: 'modern',
      primaryColor: '#2563eb',
      activeSection: 'personalInfo',
      styleOptions: DEFAULT_STYLE_OPTIONS,

      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setActiveSection: (section) => set({ activeSection: section }),
      updateStyleOptions: (options) =>
        set((state) => ({
          styleOptions: { ...state.styleOptions, ...options },
        })),

      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info },
          },
        })),

      updateSummary: (summary) =>
        set((state) => ({
          resumeData: { ...state.resumeData, summary },
        })),

      updateCoverLetter: (coverLetter) =>
        set((state) => ({
          resumeData: { ...state.resumeData, coverLetter },
        })),

      addExperience: (exp) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: [...state.resumeData.experience, exp],
          },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.filter((e) => e.id !== id),
          },
        })),
      reorderExperience: (experiences) =>
        set((state) => ({
          resumeData: { ...state.resumeData, experience: experiences },
        })),

      addEducation: (edu) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, edu],
          },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((e) => e.id !== id),
          },
        })),
      reorderEducation: (education) =>
        set((state) => ({
          resumeData: { ...state.resumeData, education },
        })),

      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, skill],
          },
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
          },
        })),
      removeSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((s) => s.id !== id),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [...state.resumeData.projects, project],
          },
        })),
      updateProject: (id, project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((p) => p.id !== id),
          },
        })),

      addCertification: (cert) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: [...state.resumeData.certifications, cert],
          },
        })),
      updateCertification: (id, cert) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: state.resumeData.certifications.map((c) =>
              c.id === id ? { ...c, ...cert } : c
            ),
          },
        })),
      removeCertification: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certifications: state.resumeData.certifications.filter((c) => c.id !== id),
          },
        })),

      addLanguage: (lang) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, lang],
          },
        })),
      updateLanguage: (id, lang) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.map((l) =>
              l.id === id ? { ...l, ...lang } : l
            ),
          },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter((l) => l.id !== id),
          },
        })),

      addCustomSection: (section) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            customSections: [...state.resumeData.customSections, section],
            sectionOrder: [...state.resumeData.sectionOrder, `custom-${section.id}`],
          },
        })),
      updateCustomSection: (id, section) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            customSections: state.resumeData.customSections.map((s) =>
              s.id === id ? { ...s, ...section } : s
            ),
          },
        })),
      removeCustomSection: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            customSections: state.resumeData.customSections.filter((s) => s.id !== id),
            sectionOrder: state.resumeData.sectionOrder.filter((s) => s !== `custom-${id}`),
          },
        })),

      updateSectionOrder: (order) =>
        set((state) => ({
          resumeData: { ...state.resumeData, sectionOrder: order },
        })),

      importData: (data) => set({ resumeData: data }),
      resetData: () => set({ resumeData: defaultResumeData }),
    }),
    {
      name: 'resumeforge-storage',
    }
  )
);
