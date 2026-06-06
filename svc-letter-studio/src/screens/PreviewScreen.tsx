// PreviewScreen — Phase 3 + Phase 4 (provider badge)
// Single BlobProvider renders the PDF exactly ONCE.
// Both the inline <object> preview and the download button share that blob.
// No PDFDownloadLink — avoids double-render crash in @react-pdf/renderer v4 (D010).
import { useState } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'

interface Props {
  navigate: (s: Screen) => void
  state: SessionState
}

// ─── Provider Badge ───────────────────────────────────────────────────────────
function ProviderBadge({ provider }: { provider: SessionState['aiProvider'] }) {
  if (!provider) return null

  const isGemini = provider === 'gemini'
  const label = isGemini ? '✦ Gemini 3.5 Flash' : '⬡ Groq · Llama 3.3'
  const bg = isGemini ? '#1A1A2E' : '#0F1923'
  const accent = isGemini ? '#8AB4F8' : '#00D1B2'

  return (
    <div
      className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: bg,
        color: accent,
        fontFamily: 'var(--font-body)',
        border: `1px solid ${accent}`,
        letterSpacing: '0.04em',
        opacity: 0.92,
      }}
    >
      {label}
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PreviewScreen({ navigate, state }: Props) {
  const [showPreview, setShowPreview] = useState(true)

  const doc = (
    <LetterheadDocument
      draft={state.draft}
      watermarkEnabled={state.watermarkEnabled}
    />
  )

  const handleDownload = (blob: Blob | null) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const docType = state.draft?.envelope?.documentType ?? 'letter'
    const date = state.draft?.envelope?.date?.replace(/\s/g, '-') ?? 'draft'
    a.download = `svc-${docType}-${date}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <BlobProvider document={doc}>
      {({ blob, url, loading, error }) => (
        <div className="flex flex-col min-h-full" style={{ background: '#1C1C1E' }}>

          {/* Top bar */}
          <div
            className="flex items-center justify-between px-5 pb-4"
            style={{
              background: 'var(--color-brown)',
              paddingTop: 'max(env(safe-area-inset-top), 48px)',
              borderBottom: '2px solid var(--color-gold)',
            }}
          >
            <button
              onClick={() => navigate('draft')}
              className="text-sm font-medium w-16"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
            >
              ‹ Back
            </button>
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-body)', letterSpacing: '0.15em' }}
            >
              Preview
            </span>
            <button
              onClick={() => handleDownload(blob)}
              disabled={loading || !!error || !blob}
              className="text-sm font-semibold w-16 text-right"
              style={{
                color: (loading || !!error || !blob) ? 'var(--color-brown-muted)' : 'var(--color-gold)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {loading ? 'Wait…' : error ? 'Error' : 'Export'}
            </button>
          </div>

          {/* Provider badge — sits just below the top bar */}
          {state.aiProvider && (
            <div className="flex justify-center pt-3 pb-1">
              <ProviderBadge provider={state.aiProvider} />
            </div>
          )}

          {/* Body */}
          <div className="flex-1 flex flex-col items-center px-4 pt-4 pb-8">

            {loading && (
              <div
                className="mb-4 text-xs px-5 py-2 rounded-full"
                style={{
                  background: 'var(--color-brown)',
                  color: 'var(--color-gold)',
                  fontFamily: 'var(--font-body)',
                  border: '1px solid var(--color-gold)',
                }}
              >
                Generating letterhead…
              </div>
            )}

            {error && (
              <div
                className="w-full max-w-sm rounded-2xl p-8 text-center"
                style={{ background: 'var(--color-ivory)' }}
              >
                <p className="text-sm font-semibold mb-2" style={{ color: '#C0392B', fontFamily: 'var(--font-body)' }}>
                  PDF generation failed
                </p>
                <p className="text-xs mb-6" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                  {String(error)}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                  Make sure font files exist in <code>public/fonts/</code>.
                  See <strong>docs/FONTS.md</strong> for instructions.
                </p>
              </div>
            )}

            {!error && url && blob && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setShowPreview(v => !v)}
                    className="text-xs px-4 py-1.5 rounded-full border"
                    style={{
                      color: showPreview ? 'var(--color-brown)' : 'var(--color-gold)',
                      borderColor: 'var(--color-gold)',
                      background: showPreview ? 'var(--color-gold)' : 'transparent',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <button
                    onClick={() => handleDownload(blob)}
                    className="text-xs px-4 py-1.5 rounded-full"
                    style={{
                      background: 'var(--color-brown)',
                      color: 'var(--color-gold)',
                      fontFamily: 'var(--font-body)',
                      border: '1px solid var(--color-gold)',
                    }}
                  >
                    ↓ Download PDF
                  </button>
                </div>

                {showPreview && (
                  <div
                    className="w-full max-w-sm rounded-xl shadow-2xl overflow-hidden"
                    style={{ aspectRatio: '210/297' }}
                  >
                    <object
                      data={url}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      style={{ display: 'block', background: '#fff' }}
                    >
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-5 p-8"
                        style={{ background: 'var(--color-ivory)' }}
                      >
                        <p
                          className="text-sm text-center"
                          style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}
                        >
                          PDF preview not available in this browser.
                        </p>
                        <button
                          onClick={() => handleDownload(blob)}
                          className="text-sm font-semibold px-6 py-3 rounded-xl"
                          style={{
                            background: 'var(--color-brown)',
                            color: 'var(--color-gold)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          ↓ Download PDF
                        </button>
                      </div>
                    </object>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </BlobProvider>
  )
}
