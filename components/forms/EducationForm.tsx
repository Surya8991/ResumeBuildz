'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toMonthInput, fromMonthInput } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateId } from '@/lib/ids';

function SortableEducationEntry({ edu, onUpdate, onRemove }: {
  edu: Education;
  onUpdate: (data: Partial<Education>) => void;
  onRemove: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: edu.id });

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
            <span className="truncate">
              {edu.degree || edu.institution ? `${edu.degree}${edu.institution ? ` - ${edu.institution}` : ''}` : 'New Education'}
            </span>
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
            <div>
              <Label className="text-sm">Start Date</Label>
              <Input type="month" value={toMonthInput(edu.startDate)} onChange={(e) => onUpdate({ startDate: fromMonthInput(e.target.value) })} />
            </div>
            <div>
              <Label className="text-sm">End Date</Label>
              <Input type="month" value={toMonthInput(edu.endDate)} onChange={(e) => onUpdate({ endDate: fromMonthInput(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
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
  const { resumeData, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = resumeData.education.findIndex((e) => e.id === active.id);
    const newIndex = resumeData.education.findIndex((e) => e.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderEducation(arrayMove(resumeData.education, oldIndex, newIndex));
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={resumeData.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resumeData.education.map((edu) => (
              <SortableEducationEntry
                key={edu.id}
                edu={edu}
                onUpdate={(data) => updateEducation(edu.id, data)}
                onRemove={() => removeEducation(edu.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
