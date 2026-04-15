'use client';

// Global page-transition loading indicator — Option 4 from /loader-preview.
//
// Visual: a centered skeletal "resume building" card on top of an 85% white
// backdrop. Mirrors the homepage Fill7_Ultimate hero aesthetic so every
// page transition reinforces the resume-building brand metaphor.
//
// Behavior:
// - Triggers on every internal <a> click and on browser back/forward.
// - 150ms grace period before showing — quick navigations that complete in
//   under 150ms never flash the loader.
// - 8000ms safety timeout — if a navigation never completes (cancelled,
//   network failure, hard crash), the loader auto-hides so the user is not
//   stuck staring at a frozen overlay.
// - Hides when usePathname() reports the new route mounted.
// - Filters: external links, mailto/tel, anchor jumps, modifier-key clicks,
//   target=_blank, downloads, same-pathname clicks, SVG anchors.
// - Respects prefers-reduced-motion (renders a static skeleton with no
//   pulse animation).
// - aria-live="polite" announces "Loading page" to screen readers exactly
//   once per navigation.

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoaderCard from './LoaderCard';

const SHOW_DELAY_MS = 150;
const SAFETY_TIMEOUT_MS = 8000;

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathnameRef = useRef(pathname);

  const stopLoading = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    setVisible(false);
  }, []);

  const startLoading = useCallback(() => {
    // Cancel any prior timers (rapid double-click, prefetch, etc.)
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    // Wait SHOW_DELAY_MS before actually rendering, so a fast same-route
    // recompile or instant client-side nav never causes the loader to flash.
    showTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY_MS);

    // Safety net: if navigation never completes (cancelled / failed / crashed),
    // hide the loader after SAFETY_TIMEOUT_MS so the user can recover without
    // a page refresh.
    safetyTimerRef.current = setTimeout(() => {
      stopLoading();
    }, SAFETY_TIMEOUT_MS);
  }, [stopLoading]);

  // Detect navigation start by intercepting <a> clicks anywhere in the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Modifier keys = open in new tab, ignore.
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const closest = (e.target as HTMLElement | null)?.closest('a');
      // Type guard: SVG <a> elements are SVGAElement, not HTMLAnchorElement,
      // and don't have .target / .rel / .hasAttribute('download') reliably.
      if (!(closest instanceof HTMLAnchorElement)) return;
      const anchor: HTMLAnchorElement = closest;

      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (anchor.getAttribute('rel')?.includes('external')) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // Resolve relative URLs against the current location so we correctly
      // compare same-page links like <a href="about"> when on /something/about.
      let targetUrl: URL;
      try {
        targetUrl = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Cross-origin? Skip — the browser will navigate away and our loader
      // would be stuck on screen.
      if (targetUrl.origin !== window.location.origin) return;

      // Same pathname = anchor jump or query-only change, no full nav.
      if (targetUrl.pathname === window.location.pathname) return;

      startLoading();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [startLoading]);

  // Browser back/forward
  useEffect(() => {
    const onPopState = () => startLoading();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [startLoading]);

  // When the pathname actually changes, hide the loader. queueMicrotask
  // defers the setState out of the effect body to avoid the cascading-
  // renders lint warning.
  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      queueMicrotask(stopLoading);
    }
  }, [pathname, stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/85 backdrop-blur-sm pointer-events-none animate-fade-in"
    >
      {/* Visually-hidden announcement for screen readers */}
      <span className="sr-only">Loading page</span>
      <LoaderCard />
    </div>
  );
}
