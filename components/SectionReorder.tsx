'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  coverLetter: 'Cover Letter',
};

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { resumeData } = useResumeStore();

  let label = SECTION_LABELS[id] || '';
  if (id.startsWith('custom-')) {
    const customId = id.replace('custom-', '');
    const section = resumeData.customSections.find(s => s.id === customId);
    label = section?.title || 'Custom Section';
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 px-3 py-2 bg-background border rounded-lg cursor-grab active:cursor-grabbing">
      <div {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
    </div>
  );
}

export default function SectionReorder() {
  const { resumeData, updateSectionOrder } = useResumeStore();
  const { sectionOrder } = resumeData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      updateSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold mb-1">Reorder Sections</h4>
        <p className="text-[10px] text-muted-foreground">Drag to reorder how sections appear on your resume.</p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {sectionOrder.map(id => <SortableItem key={id} id={id} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
