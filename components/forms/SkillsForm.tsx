'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { INDUSTRIES } from '@/components/ats/data/industryKeywords';
import { generateId } from '@/lib/ids';

export default function SkillsForm() {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});

  const jobTitle = resumeData.personalInfo.jobTitle;
  const allExistingSkills = resumeData.skills.flatMap((s) => s.items.map((i) => i.toLowerCase()));

  const suggestedSkills = useMemo(() => {
    if (!jobTitle || jobTitle.trim().length < 3) return [];
    const title = jobTitle.toLowerCase().trim();
    // Remove common prefixes to get the core role
    const coreTitle = title.replace(/^(senior|junior|lead|principal|staff|chief|head of|vp of|director of|associate|intern)\s+/i, '').trim();
    const titleWords = coreTitle.split(/\s+/).filter(w => w.length > 2);

    // Score each role by match quality
    const scored: { keywords: string[]; score: number }[] = [];
    for (const industry of INDUSTRIES) {
      for (const role of industry.roles) {
        const roleName = role.role.toLowerCase();
        const coreRole = roleName.replace(/^(senior|junior|lead|principal|staff|chief|head of|vp of|director of|associate|intern)\s+/i, '').trim();

        // Exact match (highest priority)
        if (coreRole === coreTitle || roleName === title) {
          scored.push({ keywords: role.keywords, score: 100 });
        }
        // Core role contained in title or vice versa
        else if (coreRole.includes(coreTitle) || coreTitle.includes(coreRole)) {
          scored.push({ keywords: role.keywords, score: 80 });
        }
        // Significant word overlap (at least 2 matching words or 1 long word)
        else {
          const roleWords = coreRole.split(/\s+/).filter(w => w.length > 2);
          const matchCount = titleWords.filter(tw => roleWords.some(rw => rw === tw || (tw.length > 4 && rw.includes(tw)))).length;
          if (matchCount >= 2 || (matchCount === 1 && titleWords.length <= 2)) {
            scored.push({ keywords: role.keywords, score: 40 + matchCount * 15 });
          }
        }
      }
    }

    // Sort by score, take best matches
    scored.sort((a, b) => b.score - a.score);
    const topKeywords: string[] = [];
    for (const s of scored.slice(0, 3)) {
      topKeywords.push(...s.keywords);
    }

    const unique = [...new Set(topKeywords)];
    return unique
      .filter((kw) => !allExistingSkills.includes(kw.toLowerCase()))
      .slice(0, 20);
  }, [jobTitle, allExistingSkills]);

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

      {suggestedSkills.length > 0 && (
        <div className="p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 space-y-2">
          <p className="text-xs font-medium flex items-center gap-1.5 text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Suggested skills for &quot;{jobTitle}&quot;
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const firstCategory = resumeData.skills[0];
                  if (firstCategory) {
                    updateSkill(firstCategory.id, { items: [...firstCategory.items, skill] });
                  } else {
                    const id = generateId();
                    addSkill({ id, category: 'Skills', items: [skill] });
                  }
                }}
                className="text-xs px-2 py-1 rounded-full border border-dashed border-primary/40 text-primary hover:bg-primary/10 cursor-pointer transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {resumeData.skills.map((skill) => (
          <Card key={skill.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <Label className="text-sm">Category {!skill.category && <span className="text-amber-500 text-xs ml-1">(required)</span>}</Label>
                <Input
                  placeholder="Programming Languages"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                  required
                  aria-invalid={!skill.category}
                  className={!skill.category ? 'border-amber-300' : ''}
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
