'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  PenLine,
  Eye,
  Settings2,
  BarChart3,
  Sparkles,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  Camera,
  Layers,
  Mail,
} from 'lucide-react';

const STORAGE_KEY = 'resumeforge-onboarding-done';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
}

const STEPS: Step[] = [
  {
    title: 'Welcome to ResumeForge!',
    description: 'Create professional, ATS-optimized resumes in minutes. This quick tour will show you the key features.',
    icon: <FileText className="h-8 w-8" />,
    tip: 'You can restart this tour anytime from the Help menu.',
  },
  {
    title: 'Edit Your Resume',
    description: 'Use the Edit tab to fill in your details — Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, and Languages.',
    icon: <PenLine className="h-8 w-8" />,
    tip: 'Required fields are marked with a red asterisk (*). A sample resume is pre-loaded to help you get started.',
  },
  {
    title: 'Upload a Photo',
    description: 'Add an optional profile photo in the Personal Info section. It will appear on your resume header across all templates.',
    icon: <Camera className="h-8 w-8" />,
    tip: 'Photos are optional. Some industries prefer resumes without photos.',
  },
  {
    title: 'Live Preview',
    description: 'See your resume update in real-time as you type. Use the zoom controls to adjust the preview size.',
    icon: <Eye className="h-8 w-8" />,
    tip: 'The preview shows an estimated page count. Use Ctrl+P to quickly export as PDF.',
  },
  {
    title: '20 Templates & Styling',
    description: 'Choose from 20 unique templates in the Style panel. Customize fonts, colors, spacing, and margins to match your style.',
    icon: <Settings2 className="h-8 w-8" />,
    tip: 'Try the "Compact" preset to fit more content on one page, or "Comfortable" for better readability.',
  },
  {
    title: 'Custom Sections & Reordering',
    description: 'Add custom sections like Volunteer Work, Publications, or Awards. Drag and drop to reorder how sections appear on your resume.',
    icon: <Layers className="h-8 w-8" />,
    tip: 'Click "Add Section" in the sidebar, and "Reorder Sections" at the bottom of any form.',
  },
  {
    title: 'Cover Letter Builder',
    description: 'Write a cover letter or generate one with AI. Just enter the job title and company name, and AI does the rest.',
    icon: <Mail className="h-8 w-8" />,
    tip: 'Find the Cover Letter tab in the sidebar section navigation.',
  },
  {
    title: 'ATS Score & JD Matcher',
    description: 'Check your resume\'s ATS compatibility score. Paste a job description to see which keywords you\'re missing.',
    icon: <BarChart3 className="h-8 w-8" />,
    tip: 'Aim for 80+ ATS score and 70%+ keyword match for best results.',
  },
  {
    title: 'AI Writing Assistant',
    description: 'Get AI-powered suggestions for your summary, bullet points, and skills. Requires your own Groq API key (free) — no key is included with the app.',
    icon: <Sparkles className="h-8 w-8" />,
    tip: 'Bring your own key from console.groq.com/keys (free, takes 1 minute). Stored in your browser only.',
  },
  {
    title: 'Import & Export',
    description: 'Import existing resumes from DOCX, TXT, MD, or JSON files. Export as PDF (best for ATS), DOCX, HTML, or JSON.',
    icon: <div className="flex gap-2"><Upload className="h-8 w-8" /><Download className="h-8 w-8" /></div>,
    tip: 'Use JSON export to backup your resume and transfer it between devices.',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start editing the sample resume or clear it and start fresh. Your data auto-saves to your browser. Happy job hunting!',
    icon: <span className="text-4xl">🎉</span>,
    tip: 'Keyboard shortcuts: Ctrl+S to save JSON, Ctrl+P to print PDF.',
  },
];

export default function OnboardingGuide() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay so the app renders first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else close();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!mounted || !show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;
  const progress = ((step + 1) / STEPS.length) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={close}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close tour"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="px-8 pt-8 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {current.icon}
            </div>
          </div>

          {/* Text */}
          <h2 className="text-lg font-bold text-center mb-2">{current.title}</h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mb-4">
            {current.description}
          </p>

          {/* Tip */}
          {current.tip && (
            <div className="bg-muted/50 rounded-lg px-4 py-2.5 mb-5">
              <p className="text-[11px] text-muted-foreground text-center">
                <span className="font-semibold text-foreground">Tip:</span> {current.tip}
              </p>
            </div>
          )}

          {/* Step dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all ${
                  i === step ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {!isFirst && (
                <Button variant="ghost" size="sm" onClick={prev} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {!isLast && (
                <Button variant="ghost" size="sm" onClick={close} className="text-muted-foreground text-xs">
                  Skip
                </Button>
              )}
            </div>

            <div className="text-[10px] text-muted-foreground">
              {step + 1} / {STEPS.length}
            </div>

            <Button size="sm" onClick={next} className="gap-1">
              {isLast ? 'Get Started' : 'Next'} {!isLast && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Call this to restart the tour manually */
export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
