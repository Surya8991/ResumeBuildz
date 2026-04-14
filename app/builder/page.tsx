'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '@/store/useResumeStore';
import { downloadDocx } from '@/lib/exportDocx';
import { downloadHtml } from '@/lib/exportHtml';
import { importResumeFromFile, SUPPORTED_IMPORT_FORMATS } from '@/lib/importResume';
import ResumePreview from '@/components/preview/ResumePreview';
import HelpDialog from '@/components/HelpDialog';
import ResumeProfileManager from '@/components/ResumeProfileManager';
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
import WhatsNew from '@/components/WhatsNew';
import ATSScoreChecker from '@/components/ats/ATSScoreChecker';
import AISuggestions from '@/components/ats/AISuggestions';
import UpgradeModal from '@/components/UpgradeModal';
import { getUsage, incrementUsage, canUse } from '@/lib/usage';
import { useToast } from '@/components/Toast';
import { useAuthContext as useAuth } from '@/components/Providers';
import CustomSectionForm from '@/components/forms/CustomSectionForm';
import CoverLetterForm from '@/components/forms/CoverLetterForm';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Download,
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
  useEffect(() => {
    document.title = 'Resume Builder - ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Create your resume with 20 ATS-friendly templates, drag-and-drop sections, and AI-powered writing. Export as PDF, DOCX, or HTML.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Create your resume with 20 ATS-friendly templates, drag-and-drop sections, and AI-powered writing. Export as PDF, DOCX, or HTML.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Resume Builder - ResumeForge');
  }, []);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'templates' | 'ats' | 'ai'>('edit');
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [isDark, setIsDark] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.8);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showReorder, setShowReorder] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const { importData, resetData, addCustomSection, resumeData } = useResumeStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [pdfRemaining, setPdfRemaining] = useState(() => getUsage('pdf').remaining);
  const { showToast } = useToast();
  const { user, profile, isPro } = useAuth();

  // Touch swipe handler for mobile tabs
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    const tabOrder: typeof activeTab[] = ['edit', 'preview', 'templates', 'ats', 'ai'];
    const currentIdx = tabOrder.indexOf(activeTab);

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0 && currentIdx < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIdx + 1]);
      } else if (diff < 0 && currentIdx > 0) {
        setActiveTab(tabOrder[currentIdx - 1]);
      }
    }
  };

  // Welcome back state
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [lastEditTime, setLastEditTime] = useState('');

  const sectionFilled: Record<string, boolean> = {
    personalInfo: !!resumeData.personalInfo.fullName,
    summary: resumeData.summary.length > 0,
    experience: resumeData.experience.length > 0,
    education: resumeData.education.length > 0,
    skills: resumeData.skills.length > 0,
    projects: resumeData.projects.length > 0,
    certifications: resumeData.certifications.length > 0,
    languages: resumeData.languages.length > 0,
    coverLetter: resumeData.coverLetter.length > 0,
  };

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

  // Resume completion score
  const completionScore = useMemo(() => {
    const checks = [
      resumeData.personalInfo.fullName.length > 0,
      resumeData.personalInfo.email.length > 0,
      resumeData.personalInfo.phone.length > 0,
      resumeData.personalInfo.location.length > 0,
      resumeData.summary.length > 20,
      resumeData.experience.length > 0,
      resumeData.experience.some(e => e.highlights.length > 0),
      resumeData.education.length > 0,
      resumeData.skills.length > 0,
      resumeData.skills.some(s => s.items.length >= 3),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resumeData]);

  useEffect(() => {
    setMounted(true);

    // Welcome back check
    try {
      const lastVisit = localStorage.getItem('resumeforge-last-visit');
      const hasData = localStorage.getItem('resumeforge-storage');
      if (lastVisit && hasData) {
        const timestamp = parseInt(lastVisit, 10);
        if (!isNaN(timestamp)) {
          const elapsed = Date.now() - timestamp;
          if (elapsed > 60 * 60 * 1000) { // more than 1 hour
            const date = new Date(timestamp);
            setLastEditTime(date.toLocaleString());
            setShowWelcomeBack(true);
          }
        }
      } else if (!lastVisit) {
        // First-time visitor
        setTimeout(() => showToast('Welcome! Start by filling in your info on the left.', 'info', 5000), 1500);
      }
      localStorage.setItem('resumeforge-last-visit', Date.now().toString());
    } catch {
      // localStorage unavailable
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth-aware toasts
  useEffect(() => {
    if (!mounted) return;
    if (user && profile) {
      if (isPro()) {
        showToast(`Welcome back, ${profile.full_name || 'Pro member'}! Unlimited access active.`, 'pro', 4000);
      } else {
        const pdfLeft = getUsage('pdf').remaining;
        const aiLeft = getUsage('ai').remaining;
        if (pdfLeft === 0 || aiLeft === 0) {
          showToast('Daily free limit reached. Upgrade to Pro for unlimited access.', 'warning', 5000);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, mounted]);

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
    setIsExporting(true);
    setExportingType('docx');
    try {
      const { resumeData, primaryColor } = useResumeStore.getState();
      await downloadDocx(resumeData, primaryColor);
    } finally {
      setTimeout(() => { setIsExporting(false); setExportingType(null); }, 500);
    }
    setShowExportMenu(false);
  };

  const handleExportHtml = () => {
    setIsExporting(true);
    setExportingType('html');
    const { resumeData, primaryColor } = useResumeStore.getState();
    downloadHtml(resumeData, primaryColor);
    setTimeout(() => { setIsExporting(false); setExportingType(null); }, 500);
    setShowExportMenu(false);
  };

  const handleExportPdf = () => {
    if (!canUse('pdf', isPro())) {
      setShowUpgradeModal(true);
      return;
    }
    setIsExporting(true);
    setExportingType('pdf');
    handlePrint();
    incrementUsage('pdf');
    const remaining = getUsage('pdf').remaining;
    setPdfRemaining(remaining);
    if (remaining > 0) {
      showToast(`PDF exported! ${remaining} free export${remaining !== 1 ? 's' : ''} left today.`, 'success');
    } else {
      showToast('Last free PDF export used today. Upgrade for unlimited.', 'warning', 5000);
    }
    setTimeout(() => { setIsExporting(false); setExportingType(null); }, 500);
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
        handleExportPdf();
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
      <WhatsNew />
      {/* Navbar */}
      <header className="h-14 border-b border-gray-800 bg-gray-900 shrink-0 sticky top-0 z-30">
        <div className="h-full flex items-center justify-between px-5">
          {/* Logo + Back */}
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors" title="Back to home">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight leading-none text-white">
                  Resume<span className="text-blue-400">Forge</span>
                </h1>
                <span className="text-[11px] text-gray-400 leading-none">Resume Builder</span>
              </div>
            </Link>
          </div>

          {/* Center - User info + last edited */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/50">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 truncate max-w-[120px] hidden sm:inline">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
            )}
            {lastEditTime && (
              <span className="hidden lg:inline text-xs text-gray-500" title={`Last edited: ${lastEditTime}`}>
                Saved
              </span>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1.5">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-1">
              {/* Download dropdown */}
              <div className="relative">
                <Button variant="default" size="sm" onClick={() => setShowExportMenu(!showExportMenu)} className="gap-1.5 shadow-sm bg-blue-500 hover:bg-blue-600 text-white">
                  <Download className="h-3.5 w-3.5" /> Export <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-50 bg-background border rounded-xl shadow-xl py-1.5 w-48 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button onClick={() => { handleExportPdf(); setShowExportMenu(false); }} disabled={isExporting} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <Download className="h-4 w-4 text-muted-foreground" /> {exportingType === 'pdf' ? 'Exporting...' : 'PDF'} <span className="text-[11px] text-muted-foreground ml-auto">{pdfRemaining} left today</span>
                      </button>
                      <button onClick={handleExportDocx} disabled={isExporting} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <FileType className="h-4 w-4 text-muted-foreground" /> {exportingType === 'docx' ? 'Exporting...' : 'DOCX'} <span className="text-[11px] text-muted-foreground ml-auto">Word</span>
                      </button>
                      <button onClick={handleExportHtml} disabled={isExporting} className="w-full px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-muted text-left rounded-lg mx-0.5 transition-colors" style={{ width: 'calc(100% - 4px)' }}>
                        <Code className="h-4 w-4 text-muted-foreground" /> {exportingType === 'html' ? 'Exporting...' : 'HTML'} <span className="text-[11px] text-muted-foreground ml-auto">Web</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="w-px h-6 bg-gray-600 mx-1" />
              <Button variant="secondary" size="sm" className="gap-1.5 shadow-sm bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hidden lg:flex" onClick={handleImportFile} title="Import Resume (PDF, DOCX, TXT, HTML, MD)">
                <Upload className="h-3.5 w-3.5" /> Import
              </Button>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 lg:hidden" onClick={handleImportFile} title="Import">
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" className="gap-1.5 shadow-sm bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hidden lg:flex" onClick={handleReset} title="Reset all data">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 lg:hidden" onClick={handleReset} title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <ResumeProfileManager />
              <HelpDialog />
            </div>

            <div className="w-px h-6 bg-gray-600 mx-0.5 hidden md:block" />

            <Button variant="secondary" size="sm" className="gap-1.5 shadow-sm bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hidden lg:flex" onClick={toggleDarkMode} title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {isDark ? 'Light' : 'Dark'}
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 lg:hidden" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile tab bar - separate row */}
      <div className="md:hidden flex border-b border-gray-800 bg-gray-900 shrink-0">
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
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-all ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Completion progress bar */}
      <div className="h-1.5 md:h-1 bg-gray-800 shrink-0">
        <div
          className={`h-full transition-all duration-500 ${completionScore >= 80 ? 'bg-green-500' : completionScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${completionScore}%` }}
        />
      </div>

      {/* Welcome back banner */}
      {showWelcomeBack && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between shrink-0 animate-fade-in">
          <span className="text-xs text-blue-400">
            Welcome back! Last edited: {lastEditTime}
          </span>
          <button onClick={() => setShowWelcomeBack(false)} className="text-xs text-blue-400 hover:text-blue-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Panel */}
        <div className={`hidden md:flex flex-col border-r bg-background transition-all duration-200 shrink-0 overflow-hidden ${sidebarCollapsed ? 'w-[52px]' : 'w-[320px] lg:w-[400px] xl:w-[460px]'}`}>
          {/* Section header - sticky */}
          <div className="flex items-center border-b bg-muted/30 sticky top-0 z-10 shrink-0">
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
              <div className="flex-1 flex items-center gap-3 px-4 py-2 relative">
                {(() => {
                  const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                  const current = FORM_SECTIONS[idx];
                  return (
                    <>
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {current && <current.icon className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                          className="flex items-center gap-1.5 text-base font-semibold hover:text-primary transition-colors w-full text-left"
                        >
                          <span className="truncate">{current?.label}</span>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${showSectionDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">Step {idx + 1} of {FORM_SECTIONS.length}</p>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${completionScore >= 80 ? 'bg-green-500/20 text-green-400' : completionScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                            {completionScore}% complete
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {FORM_SECTIONS.map((s, i) => (
                          <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === idx ? 'w-4 bg-primary' : i < idx ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-muted-foreground/20'
                            }`}
                            title={s.label}
                          />
                        ))}
                      </div>
                      {showSectionDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowSectionDropdown(false)} />
                          <div className="absolute left-4 top-full mt-1 z-50 bg-background border rounded-xl shadow-xl py-1 w-64 animate-in fade-in slide-in-from-top-1 duration-150">
                            {FORM_SECTIONS.map((s, i) => (
                              <button
                                key={s.id}
                                onClick={() => { setActiveSection(s.id); setShowSectionDropdown(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                                  activeSection === s.id
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-muted text-foreground'
                                }`}
                              >
                                <span className={`h-2 w-2 rounded-full shrink-0 ${sectionFilled[s.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <s.icon className={`h-4 w-4 shrink-0 ${activeSection === s.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="flex-1 text-left">{s.label}</span>
                                <span className="text-xs text-muted-foreground">{i + 1}/{FORM_SECTIONS.length}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="px-1.5 hover:bg-muted border-l transition-colors shrink-0 self-stretch"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {!sidebarCollapsed && (
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 pb-8">
                {showReorder ? (
                  <div>
                    <SectionReorder />
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setShowReorder(false)}>
                      Done Reordering
                    </Button>
                  </div>
                ) : (
                  <>
                    <div key={activeSection} className="animate-fade-in">
                      {renderForm()}
                    </div>

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
                      <span className="text-xs text-muted-foreground font-medium">
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowReorder(true)}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                      >
                        <Layers className="h-4 w-4" /> Reorder Sections
                      </button>
                      <button
                        onClick={handleAddCustomSection}
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Add Section
                      </button>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Mobile view */}
        <div className="flex-1 md:hidden overflow-x-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {activeTab === 'edit' && (
            <ScrollArea className="h-full">
              <div className="px-5 py-4 pb-20">
                {/* Section picker */}
                {(() => {
                  const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                  const current = FORM_SECTIONS[idx];
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {current && <current.icon className="h-4 w-4 text-primary" />}
                        </div>
                        <button
                          onClick={() => setShowMobileSheet(true)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="text-sm font-semibold truncate flex items-center gap-1">
                            {current?.label} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          </p>
                          <p className="text-[10px] text-muted-foreground">Step {idx + 1} of {FORM_SECTIONS.length} · Tap to switch</p>
                        </button>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${completionScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : completionScore >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {completionScore}%
                        </span>
                      </div>

                      {/* Bottom sheet */}
                      {showMobileSheet && (
                        <>
                          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowMobileSheet(false)} />
                          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl animate-slide-up max-h-[70vh] overflow-y-auto">
                            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />
                            <div className="px-4 pb-2">
                              <h3 className="text-sm font-semibold mb-3">Resume Sections</h3>
                            </div>
                            <div className="px-2 pb-6">
                              {FORM_SECTIONS.map((s, i) => {
                                const filled = sectionFilled[s.id as keyof typeof sectionFilled];
                                return (
                                  <button
                                    key={s.id}
                                    onClick={() => { setActiveSection(s.id); setShowMobileSheet(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                      activeSection === s.id ? 'bg-primary/10' : 'hover:bg-muted'
                                    }`}
                                  >
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${activeSection === s.id ? 'bg-primary/20' : 'bg-muted'}`}>
                                      <s.icon className={`h-4 w-4 ${activeSection === s.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className={`text-sm font-medium ${activeSection === s.id ? 'text-primary' : ''}`}>{s.label}</p>
                                      <p className="text-[10px] text-muted-foreground">Step {i + 1}</p>
                                    </div>
                                    <span className={`h-2.5 w-2.5 rounded-full ${filled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}

                <div key={activeSection} className="animate-fade-in">
                  {renderForm()}
                </div>

                {/* Step navigation */}
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                      if (idx > 0) setActiveSection(FORM_SECTIONS[idx - 1].id);
                    }}
                    disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === 0}
                    className="gap-1 h-10 px-4"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <span className="text-xs text-muted-foreground font-medium">
                    {FORM_SECTIONS.findIndex(s => s.id === activeSection) + 1} / {FORM_SECTIONS.length}
                  </span>
                  <Button
                    variant="default"
                    onClick={() => {
                      const idx = FORM_SECTIONS.findIndex(s => s.id === activeSection);
                      if (idx < FORM_SECTIONS.length - 1) setActiveSection(FORM_SECTIONS[idx + 1].id);
                    }}
                    disabled={FORM_SECTIONS.findIndex(s => s.id === activeSection) === FORM_SECTIONS.length - 1}
                    className="gap-1 h-10 px-4"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
          {activeTab === 'preview' && (() => {
            const mobileScale = typeof window !== 'undefined' ? Math.min(previewScale, (window.innerWidth - 16) / 793) : 0.45;
            return (
              <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900 p-2">
                <div className="mx-auto" style={{ width: `${793 * mobileScale}px` }}>
                  <div style={{
                    transform: `scale(${mobileScale})`,
                    transformOrigin: 'top left',
                    width: '210mm',
                  }}>
                    <ResumePreview ref={resumeRef} />
                  </div>
                </div>
              </div>
            );
          })()}
          {activeTab === 'templates' && (
            <ScrollArea className="h-full">
              <div className="px-3 py-4 sm:px-4 overflow-hidden"><TemplateSelector /></div>
            </ScrollArea>
          )}
          {activeTab === 'ats' && (
            <ScrollArea className="h-full">
              <div className="px-3 py-4 sm:px-4 overflow-hidden"><ATSScoreChecker /></div>
            </ScrollArea>
          )}
          {activeTab === 'ai' && (
            <ScrollArea className="h-full">
              <div className="px-3 py-4 sm:px-4 overflow-hidden"><AISuggestions /></div>
            </ScrollArea>
          )}
        </div>

        {/* Desktop Right Panel - Preview */}
        <div className={`hidden md:flex flex-col flex-1 min-w-0 ${isFullPreview ? 'absolute inset-0 z-50 bg-background' : ''}`}>
          {/* Preview toolbar */}
          <div className="h-11 border-b flex items-center justify-between px-4 shrink-0 bg-muted/30">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Live Preview</span>
              <span className="text-xs text-muted-foreground ml-2">~{estimatedPages} page{estimatedPages > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewScale(Math.max(0.3, previewScale - 0.1))} className="text-sm px-2 py-0.5 rounded hover:bg-muted transition-colors">-</button>
              <span className="text-xs text-muted-foreground w-12 text-center font-mono">{Math.round(previewScale * 100)}%</span>
              <button onClick={() => setPreviewScale(Math.min(1, previewScale + 0.1))} className="text-sm px-2 py-0.5 rounded hover:bg-muted transition-colors">+</button>
              <div className="w-px h-4 bg-border mx-1" />

              <button
                onClick={() => setActiveTab(activeTab === 'templates' ? 'edit' : 'templates')}
                className={`text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all ${activeTab === 'templates' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <Settings2 className="h-3.5 w-3.5" /> Style
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'ats' ? 'edit' : 'ats')}
                className={`text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all ${activeTab === 'ats' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <BarChart3 className="h-3.5 w-3.5" /> ATS
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'ai' ? 'edit' : 'ai')}
                className={`text-sm px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-all ${activeTab === 'ai' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
              >
                <Sparkles className="h-3.5 w-3.5" /> AI
              </button>

              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullPreview(!isFullPreview)}>
                {isFullPreview ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 min-w-0 overflow-auto bg-gray-100 dark:bg-gray-900 resume-preview-container">
              <div className="flex justify-center p-4 pb-16">
                <div style={{ width: `calc(210mm * ${previewScale})`, flexShrink: 0 }}>
                  <div
                    className="resume-preview-scaled shadow-xl rounded-sm origin-top-left"
                    style={{
                      transform: `scale(${previewScale})`,
                      width: '210mm',
                    }}
                  >
                    <ResumePreview ref={resumeRef} />
                  </div>
                </div>
              </div>
            </div>

            {(activeTab === 'templates' || activeTab === 'ats' || activeTab === 'ai') && (
              <div className="w-[300px] xl:w-[340px] border-l overflow-y-auto bg-background shrink-0 animate-slide-in-right">
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
      <div className="md:hidden border-t bg-background/95 backdrop-blur-sm px-3 py-2 flex justify-around items-center gap-1 shrink-0">
        <button onClick={() => !isExporting && handleExportPdf()} disabled={isExporting} className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px]">
          <Download className="h-5 w-5" />
          <span className="text-xs">{isExporting && exportingType === 'pdf' ? 'Saving...' : 'PDF'}</span>
        </button>
        <button onClick={() => !isExporting && handleExportDocx()} disabled={isExporting} className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px]">
          <FileType className="h-5 w-5" />
          <span className="text-xs">{isExporting && exportingType === 'docx' ? 'Saving...' : 'DOCX'}</span>
        </button>
        <button onClick={handleImportFile} className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px]">
          <Upload className="h-5 w-5" />
          <span className="text-xs">Import</span>
        </button>
        <button onClick={handleReset} className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-muted transition-colors min-h-[48px]">
          <RotateCcw className="h-5 w-5" />
          <span className="text-xs">Reset</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-gray-800 bg-gray-900 flex items-center justify-between px-5 shrink-0">
        <Link href="/" className="text-xs text-gray-400 hover:text-white hidden sm:inline transition-colors">
          ResumeForge
        </Link>
        <div className="flex items-center gap-4 mx-auto md:mx-0">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Designed with <span className="text-red-500">&#10084;</span> by Surya L &copy; {new Date().getFullYear()}
          </span>
          <a href="https://github.com/Surya8991" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            GitHub
          </a>
        </div>
      </footer>

      <UpgradeModal feature="pdf" open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
    </ErrorBoundary>
  );
}
