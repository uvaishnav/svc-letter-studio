/**
 * HomeScreen.tsx
 * Hero-style brand header: centred large logo, espresso company name,
 * gold ornamental divider, then action cards.
 *
 * NOTE: App.tsx root already applies env(safe-area-inset-top) as paddingTop.
 * This screen must NOT add env(safe-area-inset-top) again — only a fixed
 * visual top spacing (pt-12) to breathe below the status bar.
 */

import type { Screen } from '../App';

interface Props {
  navigate: (s: Screen) => void;
}

export default function HomeScreen({ navigate }: Props) {
  return (
    <div
      className="flex flex-col min-h-full pb-10"
      style={{ background: '#F5F1E8' }}
    >

      {/* ── HERO BRAND SECTION ──────────────────────────── */}
      <div
        className="flex flex-col items-center text-center px-6"
        style={{
          paddingTop: 48,
          paddingBottom: 36,
          background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(200,169,106,0.13) 0%, transparent 70%), #F5F1E8',
        }}
      >
        <img
          src="/logo/logo.svg"
          alt="Sri Vaishnav Constructions logo"
          style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 20 }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = '/logo/logo.png';
          }}
        />

        <h1
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            color: '#3B2A1F',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          Sri Vaishnav Constructions
        </h1>

        {/* Gold ornament */}
        <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          <div style={{ width: 28, height: 1, background: '#C8A96A', opacity: 0.6 }} />
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <rect x="3.5" y="0.5" width="4.24" height="4.24" transform="rotate(45 3.5 0.5)" fill="#C8A96A" opacity="0.85"/>
          </svg>
          <div style={{ width: 28, height: 1, background: '#C8A96A', opacity: 0.6 }} />
        </div>

        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#C8A96A',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Letter Studio
        </p>
        <p
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 12,
            color: '#9A8878',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
          }}
        >
          Professional branded documents — in seconds.
        </p>
      </div>

      {/* ── ACTION CARDS ─────────────────────────────── */}
      <div className="flex flex-col gap-3 px-5">

        {/* 1. Create with AI */}
        <button
          className="w-full rounded-2xl px-5 py-5 text-left transition-all active:scale-[0.98] active:opacity-90"
          style={{ background: '#3B2A1F', boxShadow: '0 6px 24px rgba(59,42,31,0.28)' }}
          onClick={() => navigate('intake')}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-xl"
              style={{ width: 46, height: 46, background: 'rgba(200,169,106,0.18)', flexShrink: 0 }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="#C8A96A"/>
                <path d="M19 15L19.54 17.73L22 18L19.54 18.27L19 21L18.46 18.27L16 18L18.46 17.73L19 15Z" fill="#C8A96A" opacity="0.7"/>
                <path d="M5 3L5.36 4.82L7 5L5.36 5.18L5 7L4.64 5.18L3 5L4.64 4.82L5 3Z" fill="#C8A96A" opacity="0.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 600, color: '#F5F1E8' }}>
                Create with AI
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: 'rgba(245,241,232,0.55)', marginTop: 3, lineHeight: 1.4 }}>
                Describe your need — AI drafts a complete formal letter.
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45, flexShrink: 0 }}>
              <path d="M9 18L15 12L9 6" stroke="#F5F1E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* 2 & 3 side-by-side */}
        <div className="flex gap-3">
          <button
            className="flex-1 rounded-2xl px-4 py-5 text-left transition-all active:scale-[0.97] active:opacity-90"
            style={{ background: '#FFFDF8', border: '1.5px solid #C8A96A', boxShadow: '0 2px 12px rgba(200,169,106,0.14)' }}
            onClick={() => navigate('upload')}
          >
            <div className="flex items-center justify-center rounded-xl mb-3"
              style={{ width: 42, height: 42, background: 'rgba(200,169,106,0.12)' }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="#C8A96A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="#C8A96A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="#C8A96A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#3B2A1F', lineHeight: 1.3 }}>
              Upload &amp; Convert
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#8A7A6A', marginTop: 4, lineHeight: 1.4 }}>
              .docx or PDF → branded letterhead
            </p>
          </button>

          <button
            className="flex-1 rounded-2xl px-4 py-5 text-left transition-all active:scale-[0.97] active:opacity-90"
            style={{ background: '#FFFDF8', border: '1.5px solid rgba(200,169,106,0.35)', boxShadow: '0 2px 8px rgba(59,42,31,0.05)' }}
            onClick={() => navigate('blank')}
          >
            <div className="flex items-center justify-center rounded-xl mb-3"
              style={{ width: 42, height: 42, background: 'rgba(59,42,31,0.06)' }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                  stroke="#3B2A1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
                <polyline points="14 2 14 8 20 8" stroke="#3B2A1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
                <line x1="8" y1="13" x2="16" y2="13" stroke="#3B2A1F" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
                <line x1="8" y1="17" x2="12" y2="17" stroke="#3B2A1F" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: '#3B2A1F', lineHeight: 1.3 }}>
              Blank Letterhead
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: '#8A7A6A', marginTop: 4, lineHeight: 1.4 }}>
              Empty PDF download, instantly
            </p>
          </button>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────── */}
      <div className="mt-auto pt-10 pb-2">
        <p
          className="text-center text-[10.5px]"
          style={{ color: 'rgba(122,106,90,0.4)', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.06em' }}
        >
          Sri Vaishnav Constructions · Letter Studio
        </p>
      </div>
    </div>
  );
}
