'use client';

import { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
import { History, Trash2, RotateCcw, Save, Clock, Bot } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import {
  listVersions,
  saveVersion,
  deleteVersion,
  renameVersion,
  getVersion,
  type ResumeVersion,
} from '@/lib/versionHistory';
import { useToast } from '@/components/Toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatRelative(t: number): string {
  const diff = Date.now() - t;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return `${Math.round(diff / 86_400_000)}d ago`;
}

export default function VersionHistoryDialog({ open, onOpenChange }: Props) {
  "use no memo";
  const { resumeData, importData } = useResumeStore();
  const { showToast } = useToast();
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // The "use no memo" directive at the top of this component already opts us
  // out of React Compiler's auto-memoization for this hook. The lint rule
  // can't read the directive, so silence it explicitly at the call site.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: versions.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  useEffect(() => {
    // Refresh list from localStorage every time the dialog opens.
    if (open) setVersions(listVersions());
  }, [open]);

  const handleSave = () => {
    const label = newLabel.trim() || `Snapshot ${new Date().toLocaleString()}`;
    saveVersion(resumeData, label);
    setVersions(listVersions());
    setNewLabel('');
    showToast('Version saved.', 'success');
  };

  const handleRestore = (id: string) => {
    const v = getVersion(id);
    if (!v) return;
    // Snapshot current BEFORE restoring so restore itself is reversible.
    saveVersion(resumeData, `Before restoring "${v.label}"`);
    importData(v.data);
    setVersions(listVersions());
    showToast(`Restored "${v.label}". Current version backed up.`, 'success');
    onOpenChange(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this version? Cannot be undone.')) return;
    deleteVersion(id);
    setVersions(listVersions());
  };

  const handleRename = (id: string, oldLabel: string) => {
    const next = prompt('New name:', oldLabel);
    if (!next || next === oldLabel) return;
    renameVersion(id, next);
    setVersions(listVersions());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Named snapshots that survive browser refresh. Max 30 versions.
          </DialogDescription>
        </DialogHeader>

        {/* Save new */}
        <div className="flex gap-2 pt-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Version name (e.g. v2 — after JD tailor)"
            className="flex-1 text-sm px-3 py-2 border rounded-md bg-background"
            maxLength={80}
          />
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>

        {/* List */}
        <div ref={listRef} className="flex-1 overflow-y-auto -mx-6 px-6">
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No versions yet. Save your first snapshot above.
            </p>
          ) : (
            <ul
              style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                const v = versions[vItem.index];
                return (
                  <li
                    key={v.id}
                    style={{ position: 'absolute', top: 0, transform: `translateY(${vItem.start}px)`, width: '100%' }}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRename(v.id, v.label)}
                          className="text-sm font-medium text-left truncate hover:underline"
                          title="Click to rename"
                        >
                          {v.label}
                        </button>
                        {v.auto && <Bot className="h-3 w-3 text-muted-foreground shrink-0" aria-label="Auto-saved" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelative(v.createdAt)}
                        <span>·</span>
                        <span>{v.data.personalInfo.fullName || 'Unnamed'}</span>
                        <span>·</span>
                        <span>{v.data.experience.length} exp, {v.data.skills.reduce((s, g) => s + g.items.length, 0)} skills</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleRestore(v.id)}
                        className="p-1.5 rounded hover:bg-background text-primary"
                        title="Restore this version"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 rounded hover:bg-background text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
