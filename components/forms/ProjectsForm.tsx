'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Project } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextarea from '@/components/ui/rich-textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function ProjectEntry({ project, onUpdate, onRemove }: {
  project: Project;
  onUpdate: (data: Partial<Project>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium flex-1 text-left">
          {project.name || 'New Project'}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label className="text-sm">Project Name</Label>
              <Input placeholder="E-commerce Platform" value={project.name} onChange={(e) => onUpdate({ name: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm">Link (optional)</Label>
              <Input placeholder="https://github.com/..." value={project.link} onChange={(e) => onUpdate({ link: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label className="text-sm">Start Date</Label>
                <Input placeholder="Jan 2023" value={project.startDate} onChange={(e) => onUpdate({ startDate: e.target.value })} />
              </div>
              <div className="flex-1">
                <Label className="text-sm">End Date</Label>
                <Input placeholder="Mar 2023" value={project.endDate} onChange={(e) => onUpdate({ endDate: e.target.value })} />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm">Technologies (comma-separated)</Label>
              <Input
                placeholder="React, Node.js, PostgreSQL"
                value={project.technologies.join(', ')}
                onChange={(e) => onUpdate({ technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm">Key Points (one per line — bullets added automatically)</Label>
            <RichTextarea
              placeholder="Built a full-stack e-commerce platform&#10;Implemented payment processing with Stripe"
              value={project.highlights.join('\n')}
              onChange={(v) => onUpdate({ highlights: v.split('\n').filter((h) => h.trim()) })}
              rows={4}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();

  const handleAdd = () => {
    addProject({
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
      highlights: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {resumeData.projects.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No projects added yet. Click &quot;Add&quot; to get started.
        </p>
      )}

      <div className="space-y-3">
        {resumeData.projects.map((project) => (
          <ProjectEntry
            key={project.id}
            project={project}
            onUpdate={(data) => updateProject(project.id, data)}
            onRemove={() => removeProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
