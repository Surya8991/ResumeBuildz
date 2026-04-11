'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '@/components/ui/label';
import RichTextarea from '@/components/ui/rich-textarea';

export default function SummaryForm() {
  const { resumeData, updateSummary } = useResumeStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Professional Summary</h3>
      <div>
        <Label htmlFor="summary" className="text-sm font-medium mb-1.5">
          Write a brief professional summary (2-4 sentences)
        </Label>
        <RichTextarea
          value={resumeData.summary}
          onChange={(v) => updateSummary(v)}
          placeholder="Results-driven software engineer with 5+ years of experience..."
          rows={5}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {resumeData.summary.length}/500 characters
        </p>
      </div>
    </div>
  );
}
