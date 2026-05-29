'use client';

import { useState, useEffect } from 'react';
import { ClipboardPaste, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { importResumeFromText, confirmImport } from '@/lib/importResume';
import { useResumeStore } from '@/store/useResumeStore';
import { useToast } from '@/components/Toast';

interface PasteImportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PasteImportModal({ open, onClose }: PasteImportModalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { importData } = useResumeStore();
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleImport = async () => {
    if (!text.trim()) {
      showToast('Please paste some text first.', 'warning');
      return;
    }
    setLoading(true);
    // Backup current resume in case import goes wrong
    const backup = JSON.parse(JSON.stringify(useResumeStore.getState().resumeData));
    try {
      const result = await importResumeFromText(text);
      if (result.success && result.data) {
        if (!confirmImport(result.data, 'pasted resume')) {
          setLoading(false);
          return;
        }
        importData(result.data);
        showToast('Resume imported. Review and edit the extracted data.', 'success', 5000);
        setText('');
        onClose();
      } else {
        showToast(result.error || 'Failed to parse text.', 'warning', 5000);
      }
    } catch {
      importData(backup);
      showToast('Import failed. Previous resume restored.', 'warning', 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-label="Paste resume text"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <ClipboardPaste className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paste from LinkedIn or anywhere</h2>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Copy your LinkedIn profile text (or any plain resume text) and paste it below. We&apos;ll extract sections automatically.
        </p>

        <details className="mb-4">
          <summary className="text-xs text-blue-500 cursor-pointer hover:underline">
            How to copy from LinkedIn
          </summary>
          <ol className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside ml-2">
            <li>Open your LinkedIn profile</li>
            <li>Click the <strong>More</strong> button under your profile photo</li>
            <li>Choose <strong>Save to PDF</strong> for best results, or select all text on the page (Ctrl+A)</li>
            <li>If you saved a PDF, use the regular Import button instead</li>
            <li>Otherwise, copy the selected text and paste below</li>
          </ol>
        </details>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your LinkedIn profile, plain text resume, or any career summary here..."
          className="w-full h-64 p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          autoFocus
        />

        <p className="text-xs text-gray-400 mt-2">
          {text.length} characters {text.length > 100000 && <span className="text-red-500">(exceeds 100k limit)</span>}
        </p>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading || !text.trim() || text.length > 100000} className="bg-blue-500 hover:bg-blue-600 text-white">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Parsing...
              </>
            ) : (
              'Import Text'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
