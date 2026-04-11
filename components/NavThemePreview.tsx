'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X, User, FileText, Briefcase, GraduationCap, Wrench, FolderOpen, Award, Globe, Mail, Plus } from 'lucide-react';

const SECTIONS = [
  { id: 'personalInfo', label: 'Personal Info', shortLabel: 'Info', icon: User },
  { id: 'summary', label: 'Summary', shortLabel: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', shortLabel: 'Exp.', icon: Briefcase },
  { id: 'education', label: 'Education', shortLabel: 'Edu.', icon: GraduationCap },
  { id: 'skills', label: 'Skills', shortLabel: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', icon: Award },
  { id: 'languages', label: 'Languages', shortLabel: 'Langs', icon: Globe },
  { id: 'coverLetter', label: 'Cover Letter', shortLabel: 'Letter', icon: Mail },
];

function Theme1({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <div className="text-[10px] font-semibold px-3 py-1.5 bg-muted/50 text-muted-foreground">Option 1: Pill Chips (Current)</div>
      <div className="p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                active === s.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background hover:bg-muted text-muted-foreground border'
              }`}>
              <s.icon className="h-3 w-3" />{s.label}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-primary/40 text-primary">
            <Plus className="h-3 w-3" />Add
          </button>
        </div>
      </div>
    </div>
  );
}

function Theme2({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <div className="text-[10px] font-semibold px-3 py-1.5 bg-muted/50 text-muted-foreground">Option 2: Underline Tabs</div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max border-b">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                active === s.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}>
              <s.icon className="h-3 w-3" />{s.label}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-primary/60 hover:text-primary border-b-2 border-transparent -mb-px">
            <Plus className="h-3 w-3" />Add
          </button>
        </div>
      </div>
    </div>
  );
}

function Theme3({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <div className="text-[10px] font-semibold px-3 py-1.5 bg-muted/50 text-muted-foreground">Option 3: Vertical Sidebar List</div>
      <div className="p-1.5 max-h-[220px] overflow-y-auto">
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => setActive(s.id)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              active === s.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent'
            }`}>
            <s.icon className="h-3.5 w-3.5 shrink-0" />{s.label}
          </button>
        ))}
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-primary/60 hover:text-primary hover:bg-primary/5 border-l-2 border-transparent">
          <Plus className="h-3.5 w-3.5" />Add Section
        </button>
      </div>
    </div>
  );
}

function Theme4({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      <div className="text-[10px] font-semibold px-3 py-1.5 bg-muted/50 text-muted-foreground">Option 4: Compact Grid</div>
      <div className="p-2">
        <div className="grid grid-cols-4 gap-1">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                active === s.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}>
              <s.icon className="h-4 w-4" />
              <span className="truncate w-full text-center">{s.shortLabel}</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-[10px] font-medium border border-dashed border-primary/30 text-primary/60 hover:text-primary hover:bg-primary/5">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NavThemePreview({ onClose, onSelect }: { onClose: () => void; onSelect: (theme: number) => void }) {
  const [active, setActive] = useState('personalInfo');

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}>

        <div className="sticky top-0 bg-background border-b px-5 py-3 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold">Pick a Navigation Theme</h2>
            <p className="text-[10px] text-muted-foreground">Click sections to preview interaction. Click &quot;Use This&quot; to apply.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Theme1 active={active} setActive={setActive} />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => onSelect(1)}>Use This</Button>
            </div>
          </div>
          <div>
            <Theme2 active={active} setActive={setActive} />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => onSelect(2)}>Use This</Button>
            </div>
          </div>
          <div>
            <Theme3 active={active} setActive={setActive} />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => onSelect(3)}>Use This</Button>
            </div>
          </div>
          <div>
            <Theme4 active={active} setActive={setActive} />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => onSelect(4)}>Use This</Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
