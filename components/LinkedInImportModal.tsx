'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { parseLinkedInJson } from '@/lib/importLinkedIn';
import { confirmImport } from '@/lib/importResume';
import { useResumeStore } from '@/store/useResumeStore';
import { saveVersion } from '@/lib/versionHistory';
import { useToast } from '@/components/Toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LinkedInImportModal({ open, onOpenChange }: Props) {
  const { resumeData, importData } = useResumeStore();
  const { showToast } = useToast();
  const [json, setJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = () => {
    setLoading(true);
    setError('');
    // Snapshot current so user can undo via version history if import goes sideways.
    saveVersion(resumeData, `Before LinkedIn import ${new Date().toLocaleString()}`);
    const res = parseLinkedInJson(json);
    setLoading(false);
    if (!res.success || !res.data) {
      setError(res.error || 'Unknown error');
      return;
    }
    if (!confirmImport(res.data, 'LinkedIn profile')) return;
    importData(res.data);
    showToast('LinkedIn data imported. Prior resume saved to version history.', 'success');
    setJson('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#0077b5]" />
            Import from LinkedIn
          </DialogTitle>
          <DialogDescription>
            Paste your LinkedIn data as JSON. We auto-detect LinkedIn Data Export, Voyager API, and JSON Resume formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 space-y-2">
            <p className="font-semibold">How to get LinkedIn JSON</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
              <li>Open <a href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noopener noreferrer" className="underline">LinkedIn Data Export</a> → request archive.</li>
              <li>Or install a browser extension like &quot;LinkedIn Profile to JSON&quot;.</li>
              <li>Or paste a <code className="bg-white px-1 rounded">jsonresume.org</code>-format JSON file.</li>
            </ol>
          </div>

          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder={`{\n  "profile": { "fullName": "...", "headline": "..." },\n  "positions": [...],\n  "educations": [...],\n  "skills": [...]\n}`}
            className="w-full h-64 p-3 border rounded-lg text-xs font-mono bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />

          <p className="text-[10px] text-muted-foreground">
            {json.length} characters · Photos are never imported (security policy).
          </p>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>Cancel</DialogClose>
          <Button size="sm" onClick={run} disabled={loading || !json.trim()} className="gap-1.5">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            {loading ? 'Parsing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
