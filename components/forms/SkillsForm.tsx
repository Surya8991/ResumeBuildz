'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const handleAdd = () => {
    addSkill({
      id: generateId(),
      category: '',
      items: [],
    });
  };

  const addSkillItem = (skillId: string) => {
    const value = newSkillInput[skillId]?.trim();
    if (!value) return;
    const skill = resumeData.skills.find((s) => s.id === skillId);
    if (skill) {
      updateSkill(skillId, { items: [...skill.items, value] });
      setNewSkillInput((prev) => ({ ...prev, [skillId]: '' }));
    }
  };

  const removeSkillItem = (skillId: string, index: number) => {
    const skill = resumeData.skills.find((s) => s.id === skillId);
    if (skill) {
      updateSkill(skillId, { items: skill.items.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {resumeData.skills.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No skills added yet. Click &quot;Add Category&quot; to organize your skills.
        </p>
      )}

      <div className="space-y-3">
        {resumeData.skills.map((skill) => (
          <Card key={skill.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <Label className="text-sm">Category</Label>
                <Input
                  placeholder="Programming Languages"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="h-8 w-8 text-destructive mt-5">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {skill.items.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-md text-sm"
                >
                  {item}
                  <button onClick={() => removeSkillItem(skill.id, index)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={newSkillInput[skill.id] || ''}
                onChange={(e) => setNewSkillInput((prev) => ({ ...prev, [skill.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillItem(skill.id);
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={() => addSkillItem(skill.id)}>
                Add
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
