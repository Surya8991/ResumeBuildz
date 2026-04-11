'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Language } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const;

export default function LanguagesForm() {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  const handleAdd = () => {
    addLanguage({
      id: generateId(),
      name: '',
      proficiency: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Languages</h3>
        <Button onClick={handleAdd} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {resumeData.languages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No languages added yet. Click &quot;Add&quot; to get started.
        </p>
      )}

      <div className="space-y-3">
        {resumeData.languages.map((lang) => (
          <Card key={lang.id} className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label className="text-sm">Language</Label>
                <Input
                  placeholder="English"
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm">Proficiency</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as Language['proficiency'] })}
                >
                  <option value="">Select level</option>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)} className="h-9 w-9 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
