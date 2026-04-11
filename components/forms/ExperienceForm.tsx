'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Experience } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextarea from '@/components/ui/rich-textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function ExperienceEntry({ exp, onUpdate, onRemove }: {
  exp: Experience;
  onUpdate: (data: Partial<Experience>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const title = exp.position || 'New Position';
  const subtitle = exp.company || '';

  return (
    <Card className="overflow-hidden">
      {/* Header - always visible */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {exp.current && <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">Current</span>}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Body - collapsible */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t">
          {/* Row 1: Position & Company - full width stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Position / Job Title</Label>
              <Input placeholder="e.g. Software Engineer" value={exp.position} onChange={(e) => onUpdate({ position: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input placeholder="e.g. Google" value={exp.company} onChange={(e) => onUpdate({ company: e.target.value })} className="mt-1" />
            </div>
          </div>

          {/* Row 2: Location - full width */}
          <div>
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Input placeholder="e.g. Mountain View, CA" value={exp.location} onChange={(e) => onUpdate({ location: e.target.value })} className="mt-1" />
          </div>

          {/* Row 3: Currently working toggle FIRST, then dates */}
          <div className="flex items-center gap-2 py-1">
            <Switch checked={exp.current} onCheckedChange={(checked) => onUpdate({ current: checked, endDate: checked ? '' : exp.endDate })} />
            <Label className="text-xs">Currently working here</Label>
          </div>

          {/* Row 4: Dates - side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <Input placeholder="e.g. Jan 2020" value={exp.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">End Date</Label>
              <Input
                placeholder={exp.current ? 'Present' : 'e.g. Dec 2023'}
                value={exp.current ? 'Present' : exp.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                disabled={exp.current}
                className={`mt-1 ${exp.current ? 'opacity-50' : ''}`}
              />
            </div>
          </div>

          {/* Row 5: Achievements */}
          <div>
            <Label className="text-xs text-muted-foreground">Achievements (one per line — bullets added automatically)</Label>
            <div className="mt-1">
              <RichTextarea
                placeholder="Led a team of 5 engineers to deliver a new feature&#10;Increased system performance by 40%&#10;Mentored 3 junior developers"
                value={exp.highlights.join('\n')}
                onChange={(v) => onUpdate({ highlights: v.split('\n').filter((h) => h.trim()) })}
                rows={4}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResumeStore();

  const handleAdd = () => {
    addExperience({
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={handleAdd} size="sm" variant="outline" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Position
        </Button>
      </div>

      {resumeData.experience.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No experience added yet.</p>
          <Button onClick={handleAdd} size="sm" variant="outline" className="mt-3 gap-1.5">
            <Plus className="h-4 w-4" /> Add Your First Position
          </Button>
        </Card>
      )}

      <div className="space-y-3">
        {resumeData.experience.map((exp) => (
          <ExperienceEntry
            key={exp.id}
            exp={exp}
            onUpdate={(data) => updateExperience(exp.id, data)}
            onRemove={() => removeExperience(exp.id)}
          />
        ))}
      </div>
    </div>
  );
}
