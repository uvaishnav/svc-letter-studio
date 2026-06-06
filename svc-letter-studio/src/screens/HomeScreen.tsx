/**
 * HomeScreen.tsx
 * The app's entry point — three clear paths:
 *   1. Blank Letterhead   → instant blank PDF download
 *   2. Create with AI     → navigate to intake
 *   3. Upload & Convert   → navigate to upload
 */

import type { Screen } from '../App';

interface Props {
  navigate: (s: Screen) => void;
}

export default function HomeScreen({ navigate }: Props) {
  return (
    <div
      className="flex flex-col min-h-full px-5 pt-14 pb-10"
      style={{ background: '#F5F1E8' }}
    >
      {/* Brand Header */}
      <div className="mb-10">
        {/* Logo placeholder — replace with actual <img src="/logo.png"> when available */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: '#3B2A1F' }}
        >
          <span className="text-2xl">🏗️</span>
        </div>

        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-0.5"
            style={{ color: '#C8A96A', fontFamily: 'Montserrat, sans-serif' }}
          >
            Sri Vaishnav Constructions
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ color: '#3B2A1F', fontFamily: 'Montserrat, sans-serif' }}
          >
            Letter Studio
          </h1>
          <p className="text-sm mt-2" style={{ color: '#7A6A5A', fontFamily: 'Montserrat, sans-serif' }}>
            Professional branded documents — in seconds.
          </p>
        </div>
      </div>

      {/* Gold divider */}
      <div className="w-full h-px mb-8" style={{ background: 'rgba(200,169,106,0.35)' }} />

      {/* Three entry cards */}
      <div className="flex flex-col gap-4">

        {/* 1. Create with AI — primary action */}
        <button
          className="w-full rounded-2xl px-5 py-5 text-left transition-opacity active:opacity-80"
          style={{ background: '#3B2A1F' }}
          onClick={() => navigate('intake')}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl mt-0.5">✍️</span>
            <div>
              <p className="text-base font-semibold" style={{ color: '#F5F1E8', fontFamily: 'Montserrat, sans-serif' }}>
                Create with AI
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(245,241,232,0.65)', fontFamily: 'Montserrat, sans-serif' }}>
                Describe what you need — AI drafts a complete formal letter.
              </p>
            </div>
          </div>
        </button>

        {/* 2. Upload & Convert */}
        <button
          className="w-full rounded-2xl px-5 py-5 text-left transition-opacity active:opacity-80"
          style={{ background: '#FBF8F2', border: '1.5px solid #C8A96A' }}
          onClick={() => navigate('upload')}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl mt-0.5">📂</span>
            <div>
              <p className="text-base font-semibold" style={{ color: '#3B2A1F', fontFamily: 'Montserrat, sans-serif' }}>
                Upload &amp; Convert
              </p>
              <p className="text-xs mt-1" style={{ color: '#7A6A5A', fontFamily: 'Montserrat, sans-serif' }}>
                Upload a .docx or PDF — AI restructures it onto branded letterhead.
              </p>
            </div>
          </div>
        </button>

        {/* 3. Blank Letterhead */}
        <button
          className="w-full rounded-2xl px-5 py-5 text-left transition-opacity active:opacity-80"
          style={{ background: '#FBF8F2', border: '1.5px solid rgba(200,169,106,0.4)' }}
          onClick={() => navigate('blank')}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl mt-0.5">📄</span>
            <div>
              <p className="text-base font-semibold" style={{ color: '#3B2A1F', fontFamily: 'Montserrat, sans-serif' }}>
                Blank Letterhead
              </p>
              <p className="text-xs mt-1" style={{ color: '#7A6A5A', fontFamily: 'Montserrat, sans-serif' }}>
                Download an empty branded letterhead PDF instantly.
              </p>
            </div>
          </div>
        </button>

      </div>

      {/* Footer note */}
      <div className="mt-auto pt-10">
        <p className="text-center text-xs" style={{ color: 'rgba(122,106,90,0.6)', fontFamily: 'Montserrat, sans-serif' }}>
          Sri Vaishnav Constructions · Letter Studio
        </p>
      </div>
    </div>
  );
}
