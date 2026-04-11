'use client';

import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '@/store/useResumeStore';
import { downloadDocx } from '@/lib/exportDocx';
import { downloadHtml } from '@/lib/exportHtml';
import { importResumeFromFile, SUPPORTED_IMPORT_FORMATS } from '@/lib/importResume';
import ResumePreview from '@/components/preview/ResumePreview';
import HelpDialog from '@/components/HelpDialog';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import SummaryForm from '@/components/forms/SummaryForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import LanguagesForm from '@/components/forms/LanguagesForm';
import TemplateSelector from '@/components/TemplateSelector';
import FontLoader from '@/components/FontLoader';
import ErrorBoundary from '@/components/ErrorBoundary';
import OnboardingGuide from '@/components/OnboardingGuide';
import SectionReorder from '@/components/SectionReorder';
import ATSScoreChecker from '@/components/ats/ATSScoreChecker';
import AISuggestions from '@/components/ats/AISuggestions';
import CustomSectionForm from '@/components/forms/CustomSectionForm';
import CoverLetterForm from '@/components/forms/CoverLetterForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  FileJson,
  Upload,
  RotateCcw,
  Eye,
  PenLine,
  Settings2,
  BarChart3,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  Globe,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileType,
  Code,
  ChevronDown,
  ExternalLink,
  Heart,
  Sparkles,
  Plus,
  Layers,
  Mail,
} from 'lucide-react';

const BASE_SECTIONS = [
  { id: 'personalInfo', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'languages', label: 'Languages', icon: Globe },
  { id: 'coverLetter', label: 'Cover Letter', icon: Mail },
];

export default function HomePage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'templates' | 'ats' | 'ai'>('edit');
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [isDark, setIsDark] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showReorder, setShowReorder] = useState(false);
  const { importData, resetData, addCustomSection, resumeData } = useResumeStore();

  // Dynamic sections: base + custom sections
  const customSections = resumeData.customSections.map(s => ({
    id: `custom-${s.id}`, label: s.title || 'Custom', icon: Layers,
  }));
  const FORM_SECTIONS = [...BASE_SECTIONS, ...customSections];

  // Word count / page estimate
  const wordCount = [
    resumeData.summary,
    ...resumeData.experience.flatMap(e => [e.description, ...e.highlights]),
    ...resumeData.education.flatMap(e => e.highlights),
    ...resumeData.skills.flatMap(s => s.items),
    ...resumeData.projects.flatMap(p => [p.description, ...p.highlights]),
  ].join(' ').split(/\s+/).filter(Boolean).length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 400));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'Resume',
  });

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleExportJSON = () => {
    const data = useResumeStore.getState().resumeData;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleImportFile = () => {
    if (isImporting) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = SUPPORTED_IMPORT_FORMATS;
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setIsImporting(true);
      try {
        const result = await importResumeFromFile(file);
        if (result.success && result.data) {
          importData(result.data);
          alert(`Resume imported from ${file.name}! Review the extracted data and make any corrections.`);
        } else {
          alert(result.error || 'Failed to import file');
        }
      } catch {
        alert('Failed to import file. Please try a different format.');
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const handleExportDocx = async () => {
    const { resumeData, primaryColor } = useResumeStore.getState();
    await downloadDocx(resumeData, primaryColor);
    setShowExportMenu(false);
  };

  const handleExportHtml = () => {
    const { resumeData, primaryColor } = useResumeStore.getState();
    downloadHtml(resumeData, primaryColor);
    setShowExportMenu(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetData();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExportJSON();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const handleAddCustomSection = () => {
    const id = Math.random().toString(36).substring(2, 9);
    addCustomSection({ id, title: 'New Section', items: [] });
    setActiveSection(`custom-${id}`);
  };

  const renderForm = () => {
    if (activeSection.startsWith('custom-')) {
      const customId = activeSection.replace('custom-', '');
      return <CustomSectionForm sectionId={customId} />;
    }
    switch (activeSection) {
      case 'personalInfo': return <PersonalInfoForm />;
      case 'summary': return <SummaryForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'certifications': return <CertificationsForm />;
      case 'languages': return <LanguagesForm />;
      case 'coverLetter': return <CoverLetterForm />;
      default: return <PersonalInfoForm />;
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          <span className="text-2xl font-bold text-foreground">ResumeForge</span>
          <span className="text-sm text-muted-foreground">Loading...</span>
          <span className="text-xs text-muted-foreground/60 mt-1">Built by Surya L</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="h-screen flex flex-col overflow-hidden">
      <FontLoader />
      <OnboardingGuide />
      {/* Navbar */}
      <header className="h-14 border-b bg-background/95 backdrop-blur-sm shrink-0 sticky top-0 z-30">
        <div className="h-full flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight leading-none">
                  <span className="text-primary">Resume</span><span className="text-foreground">Forge</span>
                </h1>
                <span className="text-[9px] text-muted-foreground leading-none">ATS-Friendly Resume Builder</span>
              </div>
            </div>
          </div>

          {/* Center - Mobile tabs */}
          <div className="flex md:hidden">
            <div className="flex border rounded-lg overflow-hidden bg-muted/50">
              {[
                { id: 'edit' as const, icon: PenLine, label: 'Edit' },
                { id: 'preview' as const, icon: Eye, label: 'Preview' },
                { id: 'templates' as const, icon: Settings2, label: 'Style' },
                { id: 'ats' as const, icon: BarChart3, label: 'ATS' },
                { id: 'ai' as const, icon: Sparkles, label: 'AI' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1.5 text-[11px] flex items-center gap-1 transition-all ${
                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1.5">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-1">
              {/* Download dropdown */}
              <div className="relative">
                <Button variant="default" size="sm" onClick={() => setShowExportMenu(!showExportMenu)} className="gap-1.5 shadow-sm">
                  <Download className="h-3.5 w-3.5" /> Export <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-50 bg-background border rounded-xl shadow-xl py-1.5 w-48 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button onClick={() => { handlePrint(); setShowExportMenu(false); }} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <Download className="h-4 w-4 text-muted-foreground" /> PDF <span className="text-[10px] text-emerald-600 font-medium ml-auto">Best for ATS</span>
                      </button>
                      <button onClick={handleExportDocx} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <FileType className="h-4 w-4 text-muted-foreground" /> DOCX <span className="text-[10px] text-muted-foreground ml-auto">Word</span>
                      </button>
                      <button onClick={handleExportHtml} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <Code className="h-4 w-4 text-muted-foreground" /> HTML <span className="text-[10px] text-muted-foreground ml-auto">Web</span>
                      </button>
                      <div className="border-t my-1.5 mx-2" />
                      <button onClick={() => { handleExportJSON(); setShowExportMenu(false); }} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <FileJson className="h-4 w-4 text-muted-foreground" /> JSON <span className="text-[10px] text-muted-foreground ml-auto">Data</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleImportFile} title="Import Resume (PDF, DOCX, TXT, JSON)">
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <HelpDialog />
            </div>

            <div className="w-px h-6 bg-border mx-0.5 hidden md:block" />

            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Panel */}
        <div className={`hidden md:flex flex-col border-r bg-background transition-all duration-200 ${sidebarCollapsed ? 'w-[52px]' : 'w-[460px]'}`}>
          {/* Section navigation - sticky */}
          <div className="flex border-b bg-muted/30 sticky top-0 z-10 shrink-0">
            {sidebarCollapsed ? (
              <div className="flex flex-col gap-0.5 p-1.5 flex-1">
                {FORM_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => { setActiveSection(section.id); setSidebarCollapsed(false); }}
                    className={`flex items-center justify-center p-2 rounded-md transition-all ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                    title={section.label}
                  >
                    <section.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto p-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                <div className="flex gap-1 min-w-max">
                  {FORM_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border'
                      }`}
                    >
                      <section.icon className="h-3 w-3 shrink-0" />
                      {section.label}
                    </button>
                  ))}
                  <button
                    onClick={handleAddCustomSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    Add Section
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="px-1.5 hover:bg-muted border-l transition-colors shrink-0"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <ScrollArea className="flex-1">
              <div className="p-4">
                {showReorder ? (
                  <div>
                    <SectionReorder />
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setShowReorder(false)}>
                      Done Reordering
                    </Button>
                  </div>
                ) : (
                  <>
                    {renderForm()}

                    {/* Step navigation */}
                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                          if (idx > 0) setActiveSection(FORM_SECTIONS[idx - 1].id);
                        }}
                        disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === 0}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>
                      <span className="text-[10px] text-muted-foreground">
                        {FORM_SECTIONS.findIndex(s => s.id === activeSection) + 1} / {FORM_SECTIONS.length}
                      </span>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                          if (idx < FORM_SECTIONS.length - 1) setActiveSection(FORM_SECTIONS[idx + 1].id);
                        }}
                        disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === FORM_SECTIONS.length - 1}
                        className="gap-1"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator className="my-3" />
                    <button
                      onClick={() => setShowReorder(true)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5" /> Reorder Sections
                    </button>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Mobile view */}
        <div className="flex-1 md:hidden">
          {activeTab === 'edit' && (
            <ScrollArea className="h-full">
              <div className="p-4 pb-20">
                {/* Step indicator */}
                {(() => {
                  const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                  const current = FORM_SECTIONS[idx];
                  return (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {current && <current.icon className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{current?.label}</p>
                        <p className="text-[10px] text-muted-foreground">Step {idx + 1} of {FORM_SECTIONS.length}</p>
                      </div>
                      <div className="flex gap-1">
                        {FORM_SECTIONS.map((s, i) => (
                          <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === idx ? 'w-4 bg-primary' : i < idx ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-muted-foreground/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {renderForm()}

                {/* Step navigation */}
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                      if (idx > 0) setActiveSection(FORM_SECTIONS[idx - 1].id);
                    }}
                    disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <span className="text-[10px] text-muted-foreground">
                    {FORM_SECTIONS.findIndex(s => s.id === activeSection) + 1} / {FORM_SECTIONS.length}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                      if (idx < FORM_SECTIONS.length - 1) setActiveSection(FORM_SECTIONS[idx + 1].id);
                    }}
                    disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === FORM_SECTIONS.length - 1}
                    className="gap-1"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
          {activeTab === 'preview' && (
            <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
              <div className="flex justify-center">
                <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}>
                  <ResumePreview ref={resumeRef} />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'templates' && (
            <ScrollArea className="h-full">
              <div className="p-4"><TemplateSelector /></div>
            </ScrollArea>
          )}
          {activeTab === 'ats' && (
            <ScrollArea className="h-full">
              <div className="p-4"><ATSScoreChecker /></div>
            </ScrollArea>
          )}
          {activeTab === 'ai' && (
            <ScrollArea className="h-full">
              <div className="p-4"><AISuggestions /></div>
            </ScrollArea>
          )}
        </div>

        {/* Desktop Right Panel - Preview */}
        <div className={`hidden md:flex flex-col flex-1 ${isFullPreview ? 'absolute inset-0 z-50 bg-background' : ''}`}>
          {/* Preview toolbar */}
          <div className="h-10 border-b flex items-center justify-between px-3 shrink-0 bg-muted/30">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Live Preview</span>
              <span className="text-[10px] text-muted-foreground ml-2">~{estimatedPages} page{estimatedPages > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))} className="text-xs px-2 py-0.5 rounded hover:bg-muted transition-colors">-</button>
              <span className="text-xs text-muted-foreground w-12 text-center font-mono">{Math.round(previewScale * 100)}%</span>
              <button onClick={() => setPreviewScale(Math.min(1, previewScale + 0.1))} className="text-xs px-2 py-0.5 rounded hover:bg-muted transition-colors">+</button>
              <div className="w-px h-4 bg-border mx-1" />

              <button
                onClick={() => setActiveTab(activeTab === 'templates' ? 'edit' : 'templates')}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-all ${activeTab === 'templates' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <Settings2 className="h-3 w-3" /> Style
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'ats' ? 'edit' : 'ats')}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-all ${activeTab === 'ats' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <BarChart3 className="h-3 w-3" /> ATS
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'ai' ? 'edit' : 'ai')}
                className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-all ${activeTab === 'ai' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <Sparkles className="h-3 w-3" /> AI
              </button>

              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullPreview(!isFullPreview)}>
                {isFullPreview ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 resume-preview-container">
              <div className="flex justify-center p-4 pb-16">
                <div
                  className="resume-preview-scaled shadow-xl rounded-sm origin-top"
                  style={{ transform: `scale(${previewScale})` }}
                >
                  <ResumePreview ref={resumeRef} />
                </div>
              </div>
            </div>

            {(activeTab === 'templates' || activeTab === 'ats' || activeTab === 'ai') && (
              <div className="w-[300px] xl:w-[340px] border-l overflow-y-auto bg-background shrink-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {activeTab === 'templates' && <TemplateSelector />}
                    {activeTab === 'ats' && <ATSScoreChecker />}
                    {activeTab === 'ai' && <AISuggestions />}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden border-t p-2 flex justify-center gap-1.5 bg-background/95 backdrop-blur-sm">
        <Button size="sm" onClick={() => handlePrint()} className="gap-1 shadow-sm">
          <Download className="h-3.5 w-3.5" /> PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportDocx} className="gap-1">
          <FileType className="h-3.5 w-3.5" /> DOCX
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportHtml} className="gap-1">
          <Code className="h-3.5 w-3.5" /> HTML
        </Button>
        <Button variant="ghost" size="sm" onClick={handleImportFile} title="Import Resume">
          <Upload className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset} title="Reset">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="h-7 border-t bg-muted/30 flex items-center justify-between px-4 shrink-0">
        <span className="text-[10px] text-muted-foreground hidden sm:inline">
          ResumeForge - Free ATS-Friendly Resume Builder
        </span>
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            Designed with <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500" /> by Surya L
          </span>
          <a
            href="https://github.com/Surya8991"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> GitHub
          </a>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
