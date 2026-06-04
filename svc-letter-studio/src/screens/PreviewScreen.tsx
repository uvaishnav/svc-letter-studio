// PreviewScreen — Phase 2
//
// Architecture: Single BlobProvider renders the PDF exactly ONCE.
// Both the inline preview (<object>) and the download button share the same blob URL.
// This avoids the @react-pdf/renderer v4 crash that occurs when multiple
// PDF instances (e.g. BlobProvider + PDFDownloadLink) render simultaneously.
import { useState, useEffect } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'

interface Props {
  navigate: (s: Screen) => void
  state: SessionState
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export default function PreviewScreen({ navigate, state }: Props) {
  const [mobile, setMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => { setMobile(isMobile()) }, [])

  const doc = (
    <LetterheadDocument
      content={state.draftContent}
      watermarkEnabled={state.pdfSettings.watermarkEnabled}
      signatoryName={state.signatoryName}
      signatoryDesignation={state.signatoryDesignation}
      showSignatory
    />
  )

  return (
    // Single BlobProvider — ONE render, shared blob for preview + download
    <BlobProvider document={doc}>
      {({ blob, url, loading, error }) => {

        // Derive a download handler from the blob
        const handleDownload = () => {
          if (!blob) return
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'svc-letter.pdf'
          a.click()
        }

        return (
          <div className="flex flex-col min-h-full" style={{ background: '#1C1C1E' }}>

            {/* ── Top bar ── */}
            <div
              className="flex items-center justify-between px-5 pb-4"
              style={{
                background: 'var(--color-brown)',
                paddingTop: 'max(env(safe-area-inset-top), 48px)',
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
                className="text-sm font-semibold tracking-wide"
                style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-body)' }}
              >
                Preview
              </span>
              <button
                onClick={handleDownload}
                disabled={loading || !!error || !blob}
                className="text-sm font-semibold w-16 text-right"
                style={{
                  color: loading || error ? 'var(--color-brown-muted)' : 'var(--color-gold)',
                  fontFamily: 'var(--font-body)',
                  cursor: loading || error ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Wait…' : error ? 'Error' : 'Export'}
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 flex flex-col items-center px-4 pt-4 pb-6">

              {/* Status pill */}
              {loading && (
                <div
                  className="mb-3 text-xs px-4 py-1.5 rounded-full"
                  style={{ background: 'var(--color-brown)', color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
                >
                  Generating PDF…
                </div>
              )}

              {/* Toggle (desktop only) */}
              {!mobile && !loading && !error && url && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowPreview(v => !v)}
                    className="text-xs px-4 py-1.5 rounded-full border transition-colors"
                    style={{
                      color: showPreview ? 'var(--color-brown)' : 'var(--color-gold)',
                      borderColor: 'var(--color-gold)',
                      background: showPreview ? 'var(--color-gold)' : 'transparent',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
              )}

              {/* ── Error state ── */}
              {error && (
                <div
                  className="w-full max-w-sm rounded-2xl p-8 text-center"
                  style={{ background: 'var(--color-ivory)' }}
                >
                  <p className="text-sm mb-2" style={{ color: '#C0392B', fontFamily: 'var(--font-body)' }}>
                    PDF generation failed.
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                    {String(error)}
                  </p>
                </div>
              )}

              {/* ── Mobile: download card ── */}
              {!error && mobile && (
                <div
                  className="w-full max-w-sm rounded-2xl shadow-xl flex flex-col items-center gap-6 py-10 px-8"
                  style={{ background: 'var(--color-ivory)' }}
                >
                  <div className="text-center">
                    <p
                      className="text-base font-semibold mb-2"
                      style={{ color: 'var(--color-brown)', fontFamily: 'var(--font-body)' }}
                    >
                      {loading ? 'Generating…' : 'Your letter is ready'}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                      Tap below to download the PDF.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={loading || !blob}
                    className="w-full text-center text-sm font-semibold py-3 rounded-xl"
                    style={{
                      background: loading ? 'var(--color-brown-muted)' : 'var(--color-brown)',
                      color: 'var(--color-gold)',
                      fontFamily: 'var(--font-body)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Preparing PDF…' : '↓  Download PDF'}
                  </button>
                </div>
              )}

              {/* ── Desktop: inline object preview ── */}
              {!error && !mobile && url && showPreview && (
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
                    {/* Fallback if <object> is not supported */}
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-4 p-6"
                      style={{ background: 'var(--color-ivory)' }}
                    >
                      <p className="text-sm text-center" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                        Inline preview not available.
                      </p>
                      <button
                        onClick={handleDownload}
                        className="text-sm font-semibold px-6 py-2 rounded-lg"
                        style={{ background: 'var(--color-brown)', color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
                      >
                        Download PDF
                      </button>
                    </div>
                  </object>
                </div>
              )}

            </div>
          </div>
        )
      }}
    </BlobProvider>
  )
}
