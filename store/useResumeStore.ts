'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { generateId } from '@/lib/ids';
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

// Debounced localStorage wrapper.
// Writes are batched and flushed after 1 second of inactivity.
// Reduces battery drain on mobile devices and improves typing performance.
let writeTimer: ReturnType<typeof setTimeout> | null = null;
const pendingWrites = new Map<string, string>();

// Fires when a localStorage write fails (private mode / quota exceeded).
// The builder shell listens for this and shows a persistent banner so the
// user isn't misled by the "Saved" autosave chip.
function notifyStorageError() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resume-storage-error'));
  }
}

function flushWrites() {
  if (typeof window === 'undefined') return;
  for (const [key, value] of pendingWrites) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Quota exceeded or storage disabled (private mode, full disk, etc.)
      notifyStorageError();
    }
  }
  pendingWrites.clear();
  writeTimer = null;
}

const debouncedStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    // Read from pending buffer to avoid stale values while the 1-second flush is in flight.
    if (pendingWrites.has(name)) return pendingWrites.get(name) ?? null;
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    pendingWrites.set(name, value);
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(flushWrites, 1000);
  },
  removeItem: (name) => {
    pendingWrites.delete(name);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(name);
    } catch {
      // ignore
    }
  },
};

// Flush pending writes before page unload to prevent data loss.
// pagehide also fires on mobile bfcache navigation where beforeunload is skipped.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushWrites);
  window.addEventListener('pagehide', flushWrites);
}

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
  reorderProjects: (projects: Project[]) => void;

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

  // Saved Profiles
  savedProfiles: SavedProfile[];
  saveProfile: (name: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  renameProfile: (id: string, name: string) => void;

  // Undo / Redo
  history: ResumeData[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

interface SavedProfile {
  id: string;
  name: string;
  data: ResumeData;
  template: string;
  primaryColor: string;
  createdAt: number;
}

const MAX_HISTORY = 50;

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeData: sampleResumeData,
      selectedTemplate: 'modern',
      primaryColor: '#2563eb',
      activeSection: 'personalInfo',
      styleOptions: DEFAULT_STYLE_OPTIONS,
      savedProfiles: [],
      history: [],
      historyIndex: -1, // sentinel: no snapshot yet; first push sets it to 0

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
      reorderProjects: (projects) =>
        set((state) => ({
          resumeData: { ...state.resumeData, projects },
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

      importData: (data) =>
        set((state) => {
          // Snapshot current state before replacing so the user can undo an import.
          const snapshot = structuredClone(state.resumeData);
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(snapshot);
          while (newHistory.length > MAX_HISTORY) newHistory.shift();
          return { resumeData: data, history: newHistory, historyIndex: newHistory.length - 1 };
        }),
      resetData: () => set({ resumeData: defaultResumeData }),

      saveProfile: (name) =>
        set((state) => {
          const profile: SavedProfile = {
            id: generateId(),
            name,
            data: structuredClone(state.resumeData),
            template: state.selectedTemplate,
            primaryColor: state.primaryColor,
            createdAt: Date.now(),
          };
          const profiles = [profile, ...state.savedProfiles].slice(0, 10);
          return { savedProfiles: profiles };
        }),
      loadProfile: (id) =>
        set((state) => {
          const profile = state.savedProfiles.find((p) => p.id === id);
          if (!profile) return {};
          return {
            resumeData: structuredClone(profile.data),
            selectedTemplate: profile.template as TemplateName,
            primaryColor: profile.primaryColor,
          };
        }),
      deleteProfile: (id) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.id !== id),
        })),
      renameProfile: (id, name) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),

      // Undo/Redo: snapshot-based history
      pushHistory: () =>
        set((state) => {
          const snapshot = structuredClone(state.resumeData);
          // Drop any "redo" entries when a new edit happens
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(snapshot);
          // Cap history size
          while (newHistory.length > MAX_HISTORY) newHistory.shift();
          return { history: newHistory, historyIndex: newHistory.length - 1 };
        }),
      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return {};
          const newIndex = state.historyIndex - 1;
          return {
            resumeData: structuredClone(state.history[newIndex]),
            historyIndex: newIndex,
          };
        }),
      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return {};
          const newIndex = state.historyIndex + 1;
          return {
            resumeData: structuredClone(state.history[newIndex]),
            historyIndex: newIndex,
          };
        }),
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'resumeforge-storage',
      storage: createJSONStorage(() => debouncedStorage),
      // Bump when a schema change makes old payloads incompatible. Add the
      // matching forward step inside `migrate` below. Zustand persists this
      // number alongside the state and replays migrations on hydrate.
      version: 1,
      migrate: (persistedState, _version) => {
        // No schema diffs yet; this stub exists so adding a field later only
        // requires bumping `version` above and inserting a `if (_version < N)`
        // branch here. Any non-object payload is dropped and the store
        // falls back to its initial defaults.
        if (!persistedState || typeof persistedState !== 'object') {
          return {} as ResumeStore;
        }
        return persistedState as ResumeStore;
      },
      // History is session-only; persisting 50 deep-cloned snapshots would bloat localStorage by megabytes.
      partialize: (state) => {
        const { history: _h, historyIndex: _i, ...rest } = state;
        return rest;
      },
    }
  )
);
