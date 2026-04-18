'use client';

// Cmd+K / Ctrl+K command palette for the builder. Fuzzy-matches commands
// by label, runs the one the user confirms (Enter or click). Keyboard-only
// users get the same affordances as power users.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export interface Command {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  run: () => void;
}

export default function CommandPalette({
  commands,
  open,
  onClose,
}: {
  commands: Command[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      // Autofocus after the dialog paints
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group?.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => { setCursor(0); }, [query]);

  const runCommand = useCallback(
    (c: Command) => {
      c.run();
      onClose();
    },
    [onClose],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); const c = filtered[cursor]; if (c) runCommand(c); }
  }

  if (!open) return null;

  // Group sort: preserve insertion order so groups appear where the caller listed them
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, c) => {
    const g = c.group || 'Actions';
    (acc[g] ??= []).push(c);
    return acc;
  }, {});

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Search className="h-4 w-4 text-gray-400 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
            aria-label="Command search"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No commands match &quot;{query}&quot;.</p>
          ) : (
            Object.entries(grouped).map(([group, list]) => (
              <div key={group}>
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{group}</p>
                {list.map((c) => {
                  runningIndex += 1;
                  const isActive = runningIndex === cursor;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onMouseEnter={() => setCursor(runningIndex)}
                      onClick={() => runCommand(c)}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between gap-3 text-sm transition-colors ${
                        isActive ? 'bg-indigo-50 text-indigo-900' : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{c.label}</span>
                      {c.hint && <span className="text-[11px] text-gray-500 shrink-0">{c.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-[11px] text-gray-500">
          <span><kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd> to navigate</span>
          <span><kbd className="font-mono">Enter</kbd> to run . <kbd className="font-mono">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
