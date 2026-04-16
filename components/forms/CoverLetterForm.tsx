'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy, Check } from 'lucide-react';
import { callGroqAI } from '@/components/ats/utils/groqAI';

export default function CoverLetterForm() {
  const { resumeData, updateCoverLetter } = useResumeStore();
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!jobTitle && resumeData.personalInfo.jobTitle) {
      setJobTitle(resumeData.personalInfo.jobTitle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCoverLetter = async () => {
    const apiKey = localStorage.getItem('groq-api-key');
    if (!apiKey) {
      alert('Set up your Groq API key in the AI tab first.');
      return;
    }

    const { personalInfo, summary, experience, skills } = resumeData;
    const context = [
      `Name: ${personalInfo.fullName}`,
      `Title: ${personalInfo.jobTitle}`,
      `Summary: ${summary}`,
      experience.length > 0 ? `Recent role: ${experience[0].position} at ${experience[0].company}` : '',
      skills.length > 0 ? `Skills: ${skills.flatMap(s => s.items).slice(0, 15).join(', ')}` : '',
    ].filter(Boolean).join('\n');

    setLoading(true);
    const res = await callGroqAI(
      'Write a professional cover letter. Be concise (250-350 words). No placeholders  -  use the provided details. Return only the letter text.',
      `Write a cover letter for ${jobTitle || 'a role'} at ${company || 'a company'}.\n\nCandidate info:\n${context}`,
      800,
      0.7,
    );
    setLoading(false);
    if (!res.success) { alert(res.error || 'AI generation failed.'); return; }
    if (res.content) updateCoverLetter(res.content);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy — try selecting the text manually.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cover Letter</h3>

      {/* AI Generation */}
      <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
        <p className="text-xs font-medium flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Generate with AI
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">Job Title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Marketing Manager" className="mt-0.5 h-8 text-xs" />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" className="mt-0.5 h-8 text-xs" />
          </div>
        </div>
        <Button size="sm" onClick={generateCoverLetter} disabled={loading} className="w-full gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> {loading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>
      </div>

      {/* Editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-sm">Letter Content</Label>
          {resumeData.coverLetter && (
            <button onClick={copyToClipboard} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        <Textarea
          value={resumeData.coverLetter}
          onChange={(e) => updateCoverLetter(e.target.value)}
          placeholder="Write your cover letter here, or use AI to generate one..."
          rows={15}
          className="text-sm leading-relaxed"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          {resumeData.coverLetter.length} characters | ~{Math.round(resumeData.coverLetter.split(/\s+/).filter(Boolean).length)} words
        </p>
      </div>
    </div>
  );
}
