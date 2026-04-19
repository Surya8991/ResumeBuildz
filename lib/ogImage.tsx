import { ImageResponse } from 'next/og';

// Shared Open Graph image factory.
//
// Why centralise:
//   Each route that wants a unique OG image (/pricing, /builder, etc)
//   would otherwise duplicate the same 60-line JSX layout. One factory
//   keeps brand consistency and makes swapping the visual later a
//   single-file edit.
//
// Usage:
//   // app/<route>/opengraph-image.tsx
//   import { ogImage } from '@/lib/ogImage';
//   export const runtime = 'edge';
//   export const alt = 'Pricing - ResumeBuildz';
//   export const size = { width: 1200, height: 630 };
//   export const contentType = 'image/png';
//   export default function OG() {
//     return ogImage({ title: 'Pricing', subtitle: 'Free forever. Pro when you are serious.' });
//   }

export interface OgParams {
  title: string;
  subtitle?: string;
  badge?: string; // small eyebrow label, e.g. "GUIDE" or "PRICING"
}

export function ogImage({ title, subtitle, badge }: OgParams) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #111827 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative gradient blob (purely visual) */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)',
          }}
        />

        {/* Top: brand strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            R
          </div>
          <span style={{ color: 'white', fontSize: '26px', fontWeight: 700 }}>
            Resume<span style={{ color: '#60a5fa' }}>Buildz</span>
          </span>
        </div>

        {/* Middle: title block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            marginTop: '-24px',
          }}
        >
          {badge && (
            <span
              style={{
                color: '#60a5fa',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {badge}
            </span>
          )}
          <span
            style={{
              color: 'white',
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: '960px',
              letterSpacing: '-1px',
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                color: '#94a3b8',
                fontSize: '26px',
                marginTop: '24px',
                maxWidth: '880px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Bottom: domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#475569',
            fontSize: '18px',
          }}
        >
          <span>resumebuildz.tech</span>
          <span>·</span>
          <span>Free to start, no sign-up</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
