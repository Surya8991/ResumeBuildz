'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Project } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextarea from '@/components/ui/rich-textarea';
import BulletScoreList from '@/components/forms/BulletScoreList';
import { toMonthInput, fromMonthInput } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateId } from '@/lib/ids';

function SortableProjectEntry({ project, onUpdate, onRemove }: {
  project: Project;
  onUpdate: (data: Partial<Project>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card className="p-4" ref={setNodeRef} style={style}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="p-2 -ml-2 touch-action-none cursor-grab active:cursor-grabbing shrink-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium flex-1 text-left min-w-0">
            <span className="truncate">{project.name || 'New Project'}</span>
            {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
          </button>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive shrink-0">
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
            <div className="md:col-span-2">
              <Label className="text-sm">Link (optional)</Label>
              <Input type="url" placeholder="https://github.com/..." value={project.link} onChange={(e) => onUpdate({ link: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm">Start Date</Label>
              <Input type="month" value={toMonthInput(project.startDate)} onChange={(e) => onUpdate({ startDate: fromMonthInput(e.target.value) })} />
            </div>
            <div>
              <Label className="text-sm">End Date</Label>
              <Input type="month" value={toMonthInput(project.endDate)} onChange={(e) => onUpdate({ endDate: fromMonthInput(e.target.value) })} />
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
            <Label className="text-sm">Key Points (one per line  -  bullets added automatically)</Label>
            <RichTextarea
              placeholder="Built a full-stack e-commerce platform&#10;Implemented payment processing with Stripe"
              value={project.highlights.join('\n')}
              onChange={(v) => onUpdate({ highlights: v.split('\n').filter((h) => h.trim()) })}
              rows={4}
            />
            <BulletScoreList
              bullets={project.highlights}
              onReplace={(idx, next) => {
                const copy = [...project.highlights];
                copy[idx] = next;
                onUpdate({ highlights: copy });
              }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = resumeData.projects.findIndex((p) => p.id === active.id);
    const newIndex = resumeData.projects.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderProjects(arrayMove(resumeData.projects, oldIndex, newIndex));
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={resumeData.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resumeData.projects.map((project) => (
              <SortableProjectEntry
                key={project.id}
                project={project}
                onUpdate={(data) => updateProject(project.id, data)}
                onRemove={() => removeProject(project.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
