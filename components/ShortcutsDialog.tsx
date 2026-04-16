'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Detect platform for Cmd vs Ctrl label. Safe on SSR (returns 'Ctrl').
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const Mod = isMac ? '⌘' : 'Ctrl';

const SECTIONS: { title: string; items: { keys: string[]; desc: string }[] }[] = [
  {
    title: 'Navigation',
    items: [
      { keys: [Mod, '1'], desc: 'Edit tab' },
      { keys: [Mod, '2'], desc: 'Preview tab' },
      { keys: [Mod, '3'], desc: 'Templates tab' },
      { keys: [Mod, '4'], desc: 'ATS tab' },
      { keys: [Mod, '5'], desc: 'AI tab' },
    ],
  },
  {
    title: 'Edit',
    items: [
      { keys: [Mod, 'Z'], desc: 'Undo' },
      { keys: [Mod, 'Shift', 'Z'], desc: 'Redo' },
      { keys: [Mod, 'Y'], desc: 'Redo (alt)' },
    ],
  },
  {
    title: 'Export',
    items: [
      { keys: [Mod, 'P'], desc: 'Export PDF' },
      { keys: [Mod, 'S'], desc: 'Export JSON backup' },
    ],
  },
  {
    title: 'Help',
    items: [
      { keys: [Mod, '/'], desc: 'Show / hide shortcuts' },
      { keys: ['?'], desc: 'Show shortcuts (anywhere)' },
    ],
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-gray-300 bg-gray-50 text-[10px] font-mono font-semibold text-gray-700 shadow-sm">
      {children}
    </kbd>
  );
}

export default function ShortcutsDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster. Press <Kbd>?</Kbd> or <Kbd>{Mod}</Kbd>+<Kbd>/</Kbd> anytime to reopen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {sec.title}
              </p>
              <ul className="space-y-1.5">
                {sec.items.map((it) => (
                  <li key={it.desc} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-foreground">{it.desc}</span>
                    <span className="flex items-center gap-1">
                      {it.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <Kbd>{k}</Kbd>
                          {i < it.keys.length - 1 && <span className="text-gray-400 text-[10px]">+</span>}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
