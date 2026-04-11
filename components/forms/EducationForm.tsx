'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function EducationEntry({ edu, onUpdate, onRemove }: {
  edu: Education;
  onUpdate: (data: Partial<Education>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium flex-1 text-left">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          {edu.degree || edu.institution ? `${edu.degree}${edu.institution ? ` - ${edu.institution}` : ''}` : 'New Education'}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Institution</Label>
              <Input placeholder="Stanford University" value={edu.institution} onChange={(e) => onUpdate({ institution: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm">Degree</Label>
              <Input placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => onUpdate({ degree: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm">Field of Study</Label>
              <Input placeholder="Computer Science" value={edu.field} onChange={(e) => onUpdate({ field: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm">Location</Label>
              <Input placeholder="Stanford, CA" value={edu.location} onChange={(e) => onUpdate({ location: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-sm">Start Date</Label>
                <Input placeholder="Aug 2016" value={edu.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
              </div>
              <div className="flex-1">
                <Label className="text-sm">End Date</Label>
                <Input placeholder="May 2020" value={edu.endDate} onChange={(e) => onUpdate({ endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-sm">GPA (optional)</Label>
              <Input placeholder="3.9/4.0" value={edu.gpa} onChange={(e) => onUpdate({ gpa: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="text-sm">Achievements / Activities (one per line)</Label>
            <Textarea
              placeholder="• Dean's List, 2016-2020&#10;• President of CS Club"
              value={edu.highlights.join('\n')}
              onChange={(e) => onUpdate({ highlights: e.target.value.split('\n').filter((h) => h.trim()) })}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();

  const handleAdd = () => {
    addEducation({
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {resumeData.education.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No education added yet. Click &quot;Add&quot; to get started.
        </p>
      )}

      <div className="space-y-3">
        {resumeData.education.map((edu) => (
          <EducationEntry
            key={edu.id}
            edu={edu}
            onUpdate={(data) => updateEducation(edu.id, data)}
            onRemove={() => removeEducation(edu.id)}
          />
        ))}
      </div>
    </div>
  );
}
