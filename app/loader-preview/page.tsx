'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import {
  Loader1_CenteredSpinner,
  Loader2_LogoPulse,
  Loader3_ThreeDotBounce,
  Loader4_SkeletonCard,
  Loader5_PulseRing,
  Loader6_EqualizerBars,
  Loader7_BottomRightCard,
  Loader8_BackdropBlur,
  Loader9_AuroraSweep,
  Loader10_SparkleCursor,
} from '@/components/PageLoaderOptions';

interface OptionMeta {
  id: number;
  name: string;
  component: React.ComponentType;
  inspiration: string;
  description: string;
  visibility: 'High' | 'Medium' | 'Low';
  blocking: 'Full overlay' | 'Soft overlay' | 'Non-blocking';
  vibe: string[];
}

const OPTIONS: OptionMeta[] = [
  {
    id: 1,
    name: 'Centered Brand Spinner',
    component: Loader1_CenteredSpinner,
    inspiration: 'Stripe, Vercel, Linear',
    description:
      'Classic circular spinner in the center of the viewport with a soft white backdrop. The most universally recognised loading indicator. Works for every length of navigation.',
    visibility: 'Medium',
    blocking: 'Soft overlay',
    vibe: ['Classic', 'Universally understood', 'Reliable'],
  },
  {
    id: 2,
    name: 'Pulsing Logo Splash',
    component: Loader2_LogoPulse,
    inspiration: 'Apple, Spotify, Discord',
    description:
      'Brand logo (the blue square + FileText icon) in the center, scaling up and down with a gentle pulse. Reinforces brand recognition during transitions and adds a "LOADING" label below.',
    visibility: 'High',
    blocking: 'Soft overlay',
    vibe: ['Brand-forward', 'Premium', 'On-brand'],
  },
  {
    id: 3,
    name: '3-Dot Bounce',
    component: Loader3_ThreeDotBounce,
    inspiration: 'Apple iMessage, ChatGPT, WhatsApp',
    description:
      'Three blue dots in the center, each bouncing in sequence with a 0.15s stagger. The most playful and minimal indicator — feels like the system is "thinking."',
    visibility: 'Medium',
    blocking: 'Soft overlay',
    vibe: ['Playful', 'Minimal', 'Familiar'],
  },
  {
    id: 4,
    name: 'Centered Skeleton Card',
    component: Loader4_SkeletonCard,
    inspiration: 'LinkedIn, GitHub, Facebook',
    description:
      'A small white card in the center showing skeletal resume bars filling in (mirrors the homepage Fill7_Ultimate hero aesthetic). Tells the user "we are loading your next page" by previewing what is coming.',
    visibility: 'High',
    blocking: 'Soft overlay',
    vibe: ['On-brand', 'Resume metaphor', 'Informative'],
  },
  {
    id: 5,
    name: 'Pulse Ring Expand',
    component: Loader5_PulseRing,
    inspiration: 'Material Design, Google Maps',
    description:
      'A central icon with multiple expanding ring waves emanating outward. Three staggered rings create a continuous ripple effect, with the brand FileText icon at the center.',
    visibility: 'Medium',
    blocking: 'Soft overlay',
    vibe: ['Energetic', 'Material', 'Animated'],
  },
  {
    id: 6,
    name: 'Equalizer Bars',
    component: Loader6_EqualizerBars,
    inspiration: 'Spotify play state, audio apps',
    description:
      '5 vertical bars in the center, each animating its height independently with a 0.12s stagger. Looks like an audio equalizer playing — energetic, modern, distinctive.',
    visibility: 'Medium',
    blocking: 'Soft overlay',
    vibe: ['Modern', 'Energetic', 'Distinctive'],
  },
  {
    id: 7,
    name: 'Bottom-Right Floating Card',
    component: Loader7_BottomRightCard,
    inspiration: 'GitHub Actions, Notion',
    description:
      'A small floating card in the bottom-right corner with skeletal resume bars filling in. Non-blocking — does not cover the page content. The current PageLoader card style without the top progress bar.',
    visibility: 'Low',
    blocking: 'Non-blocking',
    vibe: ['Subtle', 'Non-intrusive', 'Out of the way'],
  },
  {
    id: 8,
    name: 'Backdrop Blur + Pill',
    component: Loader8_BackdropBlur,
    inspiration: 'Notion, Linear modal transitions',
    description:
      'Heavy backdrop blur on the entire viewport with a centered white pill containing a small spinner + "Loading" text. Most visible / unmistakable indication of loading. Best for slower routes where you want the user to wait patiently.',
    visibility: 'High',
    blocking: 'Full overlay',
    vibe: ['Premium', 'Unmistakable', 'Modern'],
  },
  {
    id: 9,
    name: 'Aurora Sweep Top Bar',
    component: Loader9_AuroraSweep,
    inspiration: 'Vercel AI demos, holographic UI',
    description:
      'A single horizontal aurora gradient ribbon (blue → purple → pink) that sweeps across the top of the viewport. Like a top progress bar but with a holographic gradient instead of a flat blue line. Note: this IS at the top of the page — included only because it has a different visual feel from the original top bar.',
    visibility: 'Low',
    blocking: 'Non-blocking',
    vibe: ['Holographic', 'Subtle', 'Modern AI'],
  },
  {
    id: 10,
    name: 'Sparkle Cursor Pill',
    component: Loader10_SparkleCursor,
    inspiration: 'Linear, Framer, modern AI tools',
    description:
      'A small dark pill with a spinning sparkle icon and "Loading" text that follows the cursor. Discreet, on-cursor, completely non-blocking. Move your cursor over this preview to see it follow.',
    visibility: 'Low',
    blocking: 'Non-blocking',
    vibe: ['Discreet', 'Cursor-aware', 'Modern'],
  },
];

export default function LoaderPreviewPage() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Loader Preview Gallery (internal) - ResumeBuildz';
    // Prevent search engines from indexing this internal selection tool
    let robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.name = 'robots';
      document.head.appendChild(robotsTag);
    }
    const previousContent = robotsTag.getAttribute('content');
    robotsTag.setAttribute('content', 'noindex,nofollow');
    return () => {
      // Restore previous robots tag value when leaving the page
      if (previousContent) robotsTag?.setAttribute('content', previousContent);
      else robotsTag?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <SiteNavbar />

      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition">
            <ArrowLeft className="h-4 w-4" /> Back to homepage
          </Link>
          <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
            Internal preview — pick one
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">10 Page Loader Animations</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Each preview below shows what the loader looks like during a page transition. They animate continuously here so you can see the full motion. Inspired by Stripe, Vercel, Spotify, Apple, GitHub, Linear, Notion, and Material Design.
          </p>
          {selected !== null && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-sm font-semibold px-4 py-2 rounded-full border border-green-500/30">
              <Check className="h-4 w-4" /> Selected: Option {selected} — {OPTIONS.find((o) => o.id === selected)?.name}
            </div>
          )}
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {OPTIONS.map((opt) => {
            const Comp = opt.component;
            const isSelected = selected === opt.id;
            return (
              <div
                key={opt.id}
                id={`loader-${opt.id}`}
                className={`bg-white rounded-3xl overflow-hidden shadow-2xl ${isSelected ? 'ring-4 ring-green-400' : ''}`}
              >
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-0">
                  {/* Info panel */}
                  <div className="p-8 md:p-10 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl font-black text-gray-200">{String(opt.id).padStart(2, '0')}</span>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{opt.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">Inspired by: {opt.inspiration}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-5 leading-relaxed text-sm">{opt.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                          opt.visibility === 'High'
                            ? 'bg-red-100 text-red-700'
                            : opt.visibility === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {opt.visibility} visibility
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                          opt.blocking === 'Full overlay'
                            ? 'bg-purple-100 text-purple-700'
                            : opt.blocking === 'Soft overlay'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {opt.blocking}
                      </span>
                      {opt.vibe.map((v) => (
                        <span key={v} className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {v}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelected(opt.id)}
                      className={`mt-auto w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition inline-flex items-center justify-center gap-2 ${
                        isSelected ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4" /> Selected
                        </>
                      ) : (
                        <>Select Option {opt.id}</>
                      )}
                    </button>
                  </div>

                  {/* Preview stage */}
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 min-h-[400px] overflow-hidden">
                    {/* Mock page content (a faded resume) so the loader has something to overlay */}
                    <div className="absolute inset-0 p-8 opacity-30 pointer-events-none">
                      <div className="space-y-2 mb-4">
                        <div className="h-5 bg-gray-900 rounded w-40" />
                        <div className="h-3 bg-gray-400 rounded w-56" />
                      </div>
                      <div className="space-y-1.5 mb-4">
                        <div className="h-2.5 bg-gray-300 rounded w-full" />
                        <div className="h-2.5 bg-gray-300 rounded w-[88%]" />
                        <div className="h-2.5 bg-gray-300 rounded w-[72%]" />
                      </div>
                      <div className="h-3 bg-blue-500 rounded w-24 mb-2" />
                      <div className="space-y-3">
                        {[0, 1].map((i) => (
                          <div key={i} className="space-y-1">
                            <div className="h-2.5 bg-gray-800 rounded w-40" />
                            <div className="h-2 bg-gray-300 rounded w-full" />
                            <div className="h-2 bg-gray-300 rounded w-[80%]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* The actual loader */}
                    <Comp />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick jump */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick jump</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={`#loader-${opt.id}`}
                  className={`text-xs p-3 rounded-lg border transition ${
                    selected === opt.id
                      ? 'bg-green-50 border-green-300 text-green-700 font-semibold'
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="block font-bold">#{opt.id}</span>
                  <span className="block">{opt.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
