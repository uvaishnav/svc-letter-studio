/**
 * BlankScreen.tsx
 * Instantly renders a blank letterhead PDF for download.
 */

import { BlobProvider } from '@react-pdf/renderer';
import LetterheadDocument from '../components/pdf/LetterheadDocument';
import { createEmptyDraft } from '../store/sessionStore';
import type { Screen } from '../App';

interface Props {
  navigate: (s: Screen) => void;
}

export default function BlankScreen({ navigate }: Props) {
  const blankDraft = createEmptyDraft();

  return (
    <div
      className="flex flex-col min-h-full px-5 pt-12 pb-8"
      style={{ background: 'var(--color-ivory, #F5F1E8)' }}
    >
      <button
        onClick={() => navigate('home')}
        className="font-montserrat text-sm font-medium mb-8 flex items-center gap-1"
        style={{ color: 'var(--color-gold, #C8A96A)' }}
      >
        ← Back
      </button>

      <div className="flex flex-col items-center justify-center flex-1 pt-8">
        <div className="text-5xl mb-6">📄</div>
        <h1
          className="font-montserrat font-bold text-2xl mb-2"
          style={{ color: 'var(--color-dark-brown, #3B2A1F)' }}
        >
          Blank Letterhead
        </h1>
        <p
          className="font-montserrat text-sm text-center mb-10"
          style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.6 }}
        >
          Your branded letterhead is ready. Tap below to download.
        </p>

        <BlobProvider document={<LetterheadDocument draft={blankDraft} />}>
          {({ url, loading, error }) => {
            if (loading) {
              return (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--color-gold, #C8A96A)', borderTopColor: 'transparent' }}
                  />
                  <p className="font-montserrat text-sm" style={{ color: 'var(--color-dark-brown, #3B2A1F)', opacity: 0.7 }}>
                    Preparing PDF…
                  </p>
                </div>
              );
            }
            if (error || !url) {
              return (
                <p className="font-montserrat text-sm text-center" style={{ color: '#8B1A1A' }}>
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
                  className="w-full py-4 rounded-2xl font-montserrat font-bold text-sm"
                  style={{ background: 'var(--color-dark-brown, #3B2A1F)', color: '#F5F1E8' }}
                >
                  ⬇ Download PDF
                </button>
              </a>
            );
          }}
        </BlobProvider>
      </div>
    </div>
  );
}
