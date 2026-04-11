'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, RotateCcw } from 'lucide-react';
import { resetOnboarding } from '@/components/OnboardingGuide';

export default function HelpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const dialog = isOpen && mounted ? createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold">How to Use ResumeForge</h2>
            <p className="text-[10px] text-muted-foreground">Created by Surya L</p>
          </div>
          <button
            onClick={close}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label="Close help dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-5 text-sm">
          <section>
            <h3 className="font-semibold text-base mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
              <li><strong className="text-foreground">Edit the sample resume</strong> — Replace the pre-loaded sample with your own details, or click Reset to start blank.</li>
              <li><strong className="text-foreground">Upload a photo</strong> — Add an optional profile photo in Personal Info (max 2MB).</li>
              <li><strong className="text-foreground">Choose a template</strong> — Click &quot;Style&quot; to browse 20 ATS-friendly designs with live previews.</li>
              <li><strong className="text-foreground">Customize appearance</strong> — Adjust font, accent color, font size, line spacing, and margins.</li>
              <li><strong className="text-foreground">Add custom sections</strong> — Click &quot;Add Section&quot; for Volunteer Work, Publications, Awards, etc.</li>
              <li><strong className="text-foreground">Reorder sections</strong> — Click &quot;Reorder Sections&quot; at the bottom of any form to drag-and-drop.</li>
              <li><strong className="text-foreground">Write a cover letter</strong> — Use the Cover Letter tab with optional AI generation.</li>
              <li><strong className="text-foreground">Check ATS score</strong> — Click &quot;ATS&quot; to analyze compatibility and match keywords from a job description.</li>
              <li><strong className="text-foreground">Use AI suggestions</strong> — Click &quot;AI&quot; to generate summaries, bullet points, and skills (bring your own free Groq API key).</li>
              <li><strong className="text-foreground">Import existing resume</strong> — Upload a DOCX, TXT, HTML, or MD file to auto-fill the form.</li>
              <li><strong className="text-foreground">Navigate sections</strong> — Use Previous/Next buttons at the bottom, or click any progress dot at the top.</li>
              <li><strong className="text-foreground">Download</strong> — Export as PDF (best for ATS), DOCX, HTML, or JSON.</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">Resume Sections</h3>
            <div className="space-y-1.5 text-muted-foreground text-xs">
              <div><strong className="text-foreground">Personal Info:</strong> Name, title, email, phone, location, LinkedIn, website, GitHub, photo.</div>
              <div><strong className="text-foreground">Summary:</strong> 2-4 sentence professional overview. Use the rich text toolbar for bold/italic.</div>
              <div><strong className="text-foreground">Experience:</strong> Work positions with bullet points. Rich text toolbar available (Ctrl+B for bold, Ctrl+I for italic).</div>
              <div><strong className="text-foreground">Education:</strong> Degrees, institutions, dates, GPA, and achievements.</div>
              <div><strong className="text-foreground">Skills:</strong> Organize by category (e.g., Programming, Frameworks). Type and press Enter to add.</div>
              <div><strong className="text-foreground">Projects:</strong> Personal or professional projects with tech stacks. Rich text toolbar available.</div>
              <div><strong className="text-foreground">Certifications:</strong> Professional certifications with issuer, date, and credential ID.</div>
              <div><strong className="text-foreground">Languages:</strong> Spoken languages with proficiency levels (Native to Basic).</div>
              <div><strong className="text-foreground">Cover Letter:</strong> Write or AI-generate a tailored cover letter for each job application.</div>
              <div><strong className="text-foreground">Custom Sections:</strong> Add unlimited custom sections with title, subtitle, date, and description fields.</div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">20 Templates</h3>
            <div className="grid grid-cols-4 gap-1.5 text-muted-foreground text-[11px]">
              <div><strong className="text-foreground">Classic</strong> — Serif</div>
              <div><strong className="text-foreground">Modern</strong> — Sidebar</div>
              <div><strong className="text-foreground">Minimalist</strong> — Clean</div>
              <div><strong className="text-foreground">Professional</strong> — Bold</div>
              <div><strong className="text-foreground">Executive</strong> — Elegant</div>
              <div><strong className="text-foreground">Creative</strong> — Colorful</div>
              <div><strong className="text-foreground">Compact</strong> — Dense</div>
              <div><strong className="text-foreground">Tech</strong> — Dark code</div>
              <div><strong className="text-foreground">Elegant</strong> — Refined</div>
              <div><strong className="text-foreground">Bold</strong> — Heavy type</div>
              <div><strong className="text-foreground">Academic</strong> — Research</div>
              <div><strong className="text-foreground">Corporate</strong> — Formal</div>
              <div><strong className="text-foreground">Nordic</strong> — Airy</div>
              <div><strong className="text-foreground">Gradient</strong> — Modern</div>
              <div><strong className="text-foreground">Timeline</strong> — Vertical</div>
              <div><strong className="text-foreground">Sidebar</strong> — Right panel</div>
              <div><strong className="text-foreground">Infographic</strong> — Visual</div>
              <div><strong className="text-foreground">Federal</strong> — Government</div>
              <div><strong className="text-foreground">Startup</strong> — Tech-forward</div>
              <div><strong className="text-foreground">Monochrome</strong> — B&amp;W</div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">Import & Export</h3>
            <div className="space-y-1.5 text-muted-foreground text-xs">
              <div><strong className="text-foreground">Import:</strong> DOCX, TXT, HTML, MD. AI-powered parsing available with your own Groq API key (free).</div>
              <div><strong className="text-foreground">PDF Export:</strong> Best for ATS. Uses browser print for pixel-perfect output.</div>
              <div><strong className="text-foreground">DOCX Export:</strong> Microsoft Word format. Use when employers require .docx.</div>
              <div><strong className="text-foreground">HTML Export:</strong> Web-ready format. Can be hosted online as a resume page.</div>
              <div><strong className="text-foreground">JSON Export:</strong> Save your resume data. Import on any device to restore.</div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">AI Features (Free)</h3>
            <div className="space-y-1.5 text-muted-foreground text-xs">
              <div><strong className="text-foreground">Setup:</strong> No key is included. Get your own free key at <span className="text-primary">console.groq.com/keys</span>, paste it in the AI tab.</div>
              <div><strong className="text-foreground">Writing Assistant:</strong> Generate professional summaries, bullet points, skills, or custom prompts.</div>
              <div><strong className="text-foreground">Cover Letter:</strong> AI-generate cover letters with job title and company context.</div>
              <div><strong className="text-foreground">Smart Import:</strong> AI parses uploaded resumes more accurately than heuristic parsing.</div>
              <div><strong className="text-foreground">Privacy:</strong> Your API key stays in your browser only. Never sent to our servers.</div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
              <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+P</kbd> Export as PDF</div>
              <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+S</kbd> Save as JSON</div>
              <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+B</kbd> Bold text (in editor)</div>
              <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+I</kbd> Italic text (in editor)</div>
              <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Esc</kbd> Close dialogs</div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">ATS Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
              <li>Use keywords from the job description in your resume</li>
              <li>Start bullets with action verbs (Led, Developed, Managed, Implemented)</li>
              <li>Quantify achievements with numbers (e.g., &quot;Increased sales by 25%&quot;)</li>
              <li>Use the JD Matcher to check keyword coverage for each application</li>
              <li>Submit as PDF unless the employer specifically asks for DOCX</li>
              <li>Aim for 80+ ATS score and 70%+ keyword match</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">FAQ</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div><strong className="text-foreground">Where is my data stored?</strong> Locally in your browser (localStorage). Nothing is sent to any server.</div>
              <div><strong className="text-foreground">How do I transfer my resume to another device?</strong> Export as JSON, then import the JSON file on the other device.</div>
              <div><strong className="text-foreground">Why is the preview blank?</strong> Fill in at least your name and one section. The preview updates in real-time.</div>
              <div><strong className="text-foreground">Can I have multiple resumes?</strong> Export each version as JSON. Import the one you want to edit.</div>
              <div><strong className="text-foreground">How do I navigate between sections?</strong> Use the Previous/Next buttons at the bottom of each form, or click any progress dot at the top.</div>
              <div><strong className="text-foreground">Is this free?</strong> Yes, completely free. AI features require your own Groq API key (also free at console.groq.com).</div>
            </div>
          </section>
        </div>

        <div className="border-t px-6 py-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => { close(); resetOnboarding(); }} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Restart Tour
          </Button>
          <Button onClick={close} size="sm">Got it!</Button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)} title="Help & Guide">
        <HelpCircle className="h-4 w-4" />
      </Button>
      {dialog}
    </>
  );
}
