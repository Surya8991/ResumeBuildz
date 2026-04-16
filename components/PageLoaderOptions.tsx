'use client';

// 10 page-transition loader treatments for ResumeBuildz.
// Each is a self-contained component that renders a constantly-animating
// "loading" state. Used for the /loader-preview gallery so the user can
// pick one to wire into the global PageLoader.
//
// All loaders are styled to work on top of any background (light or dark).
// None depend on libraries beyond Tailwind + React + Lucide icons.
//
// Animation keyframes used here are defined in app/globals.css with a
// `loader-` prefix so they don't collide with other CSS on the page. The
// shared centered skeleton card lives in components/LoaderCard.tsx and is
// also used by the production PageLoader.
//
// Inspired by: Stripe, Vercel, Spotify, Notion, LinkedIn, Apple, GitHub,
// Figma, Linear, Discord, Material Design.

import { useEffect, useRef, useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import LoaderCard from './LoaderCard';

// ───────────────────────────────────────────────────────────
// Option 1 — Centered Brand Spinner (Stripe / Vercel)
// ───────────────────────────────────────────────────────────
export function Loader1_CenteredSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-[3px] border-blue-500/20" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 2 — Pulsing Logo Splash (Apple / Spotify)
// ───────────────────────────────────────────────────────────
export function Loader2_LogoPulse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-loader-pulse-scale">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <p className="text-xs font-semibold text-gray-600 tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 3 — 3-Dot Bounce (Apple iMessage / ChatGPT)
// ───────────────────────────────────────────────────────────
export function Loader3_ThreeDotBounce() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm z-50">
      <div className="flex items-end gap-2 h-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-blue-500 animate-loader-dot-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 4 — Centered Skeleton Resume Card (LinkedIn / GitHub)
// THIS IS THE SHIPPED OPTION — uses the shared LoaderCard component so the
// production PageLoader and the preview gallery render identical visuals.
// ───────────────────────────────────────────────────────────
export function Loader4_SkeletonCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm z-50">
      <LoaderCard />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 5 — Pulse Ring Expand (Material Design / Google)
// ───────────────────────────────────────────────────────────
export function Loader5_PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm z-50">
      <div className="relative h-20 w-20 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute h-20 w-20 rounded-full border-2 border-blue-500 animate-loader-pulse-ring"
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}
        <div className="relative h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 6 — Equalizer Bars (Spotify play state)
// ───────────────────────────────────────────────────────────
export function Loader6_EqualizerBars() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-sm z-50">
      <div className="flex items-end gap-1.5 h-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full animate-loader-eq-bar"
            style={{
              animationDelay: `${i * 0.12}s`,
              height: '12px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 7 — Bottom-right Floating Mini Card
// ───────────────────────────────────────────────────────────
export function Loader7_BottomRightCard() {
  return (
    <div className="absolute bottom-4 right-4 z-50">
      <LoaderCard size="sm" />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 8 — Backdrop Blur with Center Spinner (Notion)
// ───────────────────────────────────────────────────────────
export function Loader8_BackdropBlur() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-md z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-6 py-5 flex items-center gap-3">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold text-gray-900">Loading</p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 9 — Aurora Sweep Top Bar
// ───────────────────────────────────────────────────────────
export function Loader9_AuroraSweep() {
  return (
    <div className="absolute top-0 left-0 right-0 h-1 z-50 overflow-hidden">
      <div
        className="h-full animate-loader-aurora-sweep"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #3b82f6 25%, #a855f7 50%, #ec4899 75%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Option 10 — Sparkle Cursor Pill (Linear / modern AI tools)
// NOTE: This loader tracks mousemove on its parentElement. If the parent has
// pointer-events:none (like the production PageLoader overlay), the listener
// will never fire and the pill stays at center. Only suitable for contexts
// where the container is interactive (e.g., the /loader-preview gallery).
// ───────────────────────────────────────────────────────────
export function Loader10_SparkleCursor() {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy initializer: read the parent's center on first mount instead of
  // calling setPos inside the effect body (which trips the cascading-renders
  // lint rule). The parent isn't available during this initial call so we
  // fall back to (0, 0); the effect below corrects it on first mousemove.
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container) return;
    const handler = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    container.addEventListener('mousemove', handler);
    // Defer the initial center positioning to a microtask so it doesn't fire
    // synchronously inside the effect body.
    const rect = container.getBoundingClientRect();
    queueMicrotask(() => setPos({ x: rect.width / 2, y: rect.height / 2 }));
    return () => container.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-50 pointer-events-none">
      <div
        className="absolute bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${pos.x + 16}px, ${pos.y + 16}px)` }}
      >
        <Sparkles className="h-3 w-3 text-blue-400 animate-spin" style={{ animationDuration: '2s' }} />
        Loading
      </div>
    </div>
  );
}
