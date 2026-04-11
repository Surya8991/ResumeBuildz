'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { CustomSection, CustomSectionItem } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function generateId() { return Math.random().toString(36).substring(2, 9); }

function ItemEntry({ item, onUpdate, onRemove }: {
  item: CustomSectionItem;
  onUpdate: (data: Partial<CustomSectionItem>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-sm font-medium">{item.title || 'New Item'}</span>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 hover:bg-destructive/10 rounded text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>
      {open && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={item.title} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="e.g. Volunteer Coordinator" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Subtitle</Label>
              <Input value={item.subtitle} onChange={(e) => onUpdate({ subtitle: e.target.value })} placeholder="e.g. Organization" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Date</Label>
              <Input value={item.date} onChange={(e) => onUpdate({ date: e.target.value })} placeholder="e.g. 2023 - Present" className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={item.description} onChange={(e) => onUpdate({ description: e.target.value })} placeholder="Description..." rows={2} className="mt-1" />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function CustomSectionForm({ sectionId }: { sectionId: string }) {
  const { resumeData, updateCustomSection, removeCustomSection } = useResumeStore();
  const section = resumeData.customSections.find(s => s.id === sectionId);

  if (!section) return <p className="text-sm text-muted-foreground">Section not found.</p>;

  const updateItem = (itemId: string, data: Partial<CustomSectionItem>) => {
    updateCustomSection(sectionId, {
      items: section.items.map(i => i.id === itemId ? { ...i, ...data } : i),
    });
  };

  const addItem = () => {
    updateCustomSection(sectionId, {
      items: [...section.items, { id: generateId(), title: '', subtitle: '', date: '', description: '' }],
    });
  };

  const removeItem = (itemId: string) => {
    updateCustomSection(sectionId, {
      items: section.items.filter(i => i.id !== itemId),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-2">
          <Label className="text-xs">Section Title</Label>
          <Input
            value={section.title}
            onChange={(e) => updateCustomSection(sectionId, { title: e.target.value })}
            placeholder="e.g. Volunteer Work, Publications, Awards"
            className="mt-1"
          />
        </div>
        <Button variant="destructive" size="sm" onClick={() => removeCustomSection(sectionId)} className="mt-5">
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
        </Button>
      </div>

      <div className="space-y-2">
        {section.items.map(item => (
          <ItemEntry key={item.id} item={item} onUpdate={(data) => updateItem(item.id, data)} onRemove={() => removeItem(item.id)} />
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addItem} className="w-full gap-1">
        <Plus className="h-3.5 w-3.5" /> Add Item
      </Button>
    </div>
  );
}
