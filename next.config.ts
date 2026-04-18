import type { NextConfig } from "next";

// Content-Security-Policy built as a single string.
//
// Why these directives:
//   - default-src 'self'       → block everything except same-origin by default
//   - script-src   adds 'unsafe-inline' + 'unsafe-eval' because Next.js + Turbopack
//                  rely on inline bootstrap scripts. We cannot use nonces without
//                  reworking every <script dangerouslySetInnerHTML> site. Revisit
//                  once we migrate marketing pages to server components + nonces.
//   - connect-src  allows Supabase + Groq + Vercel Analytics (the only outbound
//                  endpoints the app actually hits).
//   - img-src      data: for user-uploaded photos (data URLs only per our policy),
//                  blob: for in-memory previews.
//   - frame-ancestors 'none' defeats clickjacking (stricter than X-Frame-Options).
//   - object-src 'none' blocks <object>/<embed>/Flash relics.
//
// `upgrade-insecure-requests` auto-promotes http: to https: in case any template
// or user-entered URL slips through.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig: NextConfig = {
  images: {
    // Image optimization is disabled because the bulk of images in this app
    // are user-controlled resume content rendered in the print preview, where
    // Vercel's image optimizer cannot help (it would re-encode and lose pixel
    // accuracy). Template thumbnails on the homepage are also small and
    // already pre-optimized PNGs. Resume templates use plain <img>; the
    // `@next/next/no-img-element` rule is silenced for them in eslint.config.mjs.
    unoptimized: true,
  },
  async redirects() {
    // Company guides moved from /resume-for to /blog/company-guides so all
    // resume content lives under the blog section. 301s preserve inbound SEO.
    return [
      { source: '/resume-for', destination: '/blog/company-guides', permanent: true },
      { source: '/resume-for/:company', destination: '/blog/company-guides/:company', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
      {
        // Shared resume page encodes ALL data in the URL fragment. Browsers
        // never send fragments in Referer, but we also block any referer
        // for links clicked from the shared view so that resume content
        // never leaks to third parties via logs.
        source: '/r/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
      {
        source: '/pdfjs/:file*',
        headers: [
          // pdfjs ships an ESM worker with .mjs extension — some hosts serve
          // it as application/octet-stream and the worker import then fails.
          { key: 'Content-Type', value: 'text/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
