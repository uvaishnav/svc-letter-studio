/**
 * BlankScreen.tsx
 * Instantly renders a blank letterhead PDF for download.
 * Uses the existing BlobProvider + LetterheadDocument with an empty draft.
 */

import { BlobProvider } from '@react-pdf/renderer';
import { LetterheadDocument } from '../components/pdf/LetterheadDocument';
import { createEmptyDraft } from '../store/sessionStore';
import type { Screen } from '../App';

interface Props {
  navigate: (s: Screen) => void;
}

export default function BlankScreen({ navigate }: Props) {
  const blankDraft = createEmptyDraft();

  return (
    <div
      className="flex flex-col min-h-full px-5 pt-14 pb-8 items-center justify-center"
      style={{ background: '#F5F1E8' }}
    >
      <button
        onClick={() => navigate('home')}
        className="self-start text-sm font-medium mb-8 flex items-center gap-1"
        style={{ color: '#C8A96A' }}
      >
        ← Back
      </button>

      <div className="text-5xl mb-6">📄</div>
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: '#3B2A1F', fontFamily: 'Montserrat, sans-serif' }}
      >
        Blank Letterhead
      </h1>
      <p
        className="text-sm text-center mb-10"
        style={{ color: '#7A6A5A', fontFamily: 'Montserrat, sans-serif' }}
      >
        Your branded letterhead is ready. Tap below to download.
      </p>

      <BlobProvider document={<LetterheadDocument draft={blankDraft} />}>
        {({ url, loading, error }) => {
          if (loading) {
            return (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#C8A96A', borderTopColor: 'transparent' }}
                />
                <p className="text-sm" style={{ color: '#3B2A1F' }}>Preparing PDF…</p>
              </div>
            );
          }
          if (error || !url) {
            return (
              <p className="text-sm text-center" style={{ color: '#8B1A1A' }}>
                Failed to generate PDF. Please try again.
              </p>
            );
          }
          return (
            <a
              href={url}
              download={`SVC-Blank-Letterhead-${new Date().toISOString().slice(0, 10)}.pdf`}
              className="w-full"
            >
              <button
                className="w-full py-4 rounded-2xl text-sm font-semibold"
                style={{ background: '#3B2A1F', color: '#F5F1E8', fontFamily: 'Montserrat, sans-serif' }}
              >
                ⬇ Download PDF
              </button>
            </a>
          );
        }}
      </BlobProvider>
    </div>
  );
}
