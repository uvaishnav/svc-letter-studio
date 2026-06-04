// PreviewScreen — Phase 2
// PDFViewer uses an iframe which is broken on iOS Safari and many mobile browsers.
// Instead we use BlobProvider to get a blob URL and render it in an <object> tag,
// which works cross-browser. On mobile we skip the inline preview entirely and
// offer only the download link (most reliable approach for PWA on iPhone).
import { useState, useEffect } from 'react'
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'

interface Props {
  navigate: (s: Screen) => void
  state: SessionState
}

function isMobileBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export default function PreviewScreen({ navigate, state }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    setIsMobile(isMobileBrowser())
  }, [])

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
          style={{ color: 'var(--color-gold)' }}
        >
          ‹ Back
        </button>
        <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-ivory)' }}>
          Preview
        </span>
        <PDFDownloadLink
          document={doc}
          fileName="svc-letter.pdf"
          className="text-sm font-semibold w-16 text-right"
          style={{ color: 'var(--color-gold)' }}
        >
          {({ loading }) => (loading ? 'Wait…' : 'Export')}
        </PDFDownloadLink>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col items-center px-4 pt-4 pb-6">

        {isMobile ? (
          // ── Mobile: no inline viewer, just a prominent download card ──
          <div
            className="w-full max-w-sm rounded-2xl shadow-xl flex flex-col items-center justify-center gap-6 py-12 px-8"
            style={{ background: 'var(--color-ivory)' }}
          >
            <div className="text-center">
              <p className="text-base font-semibold mb-1" style={{ color: 'var(--color-brown)', fontFamily: 'var(--font-body)' }}>
                Your letter is ready
              </p>
              <p className="text-sm" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                Inline preview is not supported on mobile. Download the PDF to view it.
              </p>
            </div>
            <PDFDownloadLink
              document={doc}
              fileName="svc-letter.pdf"
              className="w-full text-center text-sm font-semibold py-3 rounded-xl"
              style={{
                background: 'var(--color-brown)',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {({ loading }) => (loading ? 'Preparing PDF…' : '↓  Download PDF')}
            </PDFDownloadLink>
          </div>
        ) : (
          // ── Desktop: BlobProvider + <object> inline preview ──
          <>
            {/* Toggle button */}
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

            {showPreview && (
              <BlobProvider document={doc}>
                {({ blob, url, loading, error }) => {
                  if (loading) {
                    return (
                      <div
                        className="w-full max-w-sm flex items-center justify-center rounded-xl shadow-xl"
                        style={{ aspectRatio: '210/297', background: 'var(--color-ivory)' }}
                      >
                        <p className="text-sm" style={{ color: 'var(--color-brown-muted)', fontFamily: 'var(--font-body)' }}>
                          Generating PDF…
                        </p>
                      </div>
                    )
                  }
                  if (error || !url) {
                    return (
                      <div
                        className="w-full max-w-sm flex items-center justify-center rounded-xl shadow-xl"
                        style={{ aspectRatio: '210/297', background: 'var(--color-ivory)' }}
                      >
                        <p className="text-sm text-center px-6" style={{ color: '#C0392B', fontFamily: 'var(--font-body)' }}>
                          Could not render preview.{' '}
                          <br />Use Export to download.
                        </p>
                      </div>
                    )
                  }
                  return (
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
                        <p className="p-4 text-sm" style={{ color: 'var(--color-brown-muted)' }}>
                          PDF preview not supported in this browser.{' '}
                          <a href={url} download="svc-letter.pdf" style={{ color: 'var(--color-gold)' }}>Download instead</a>
                        </p>
                      </object>
                    </div>
                  )
                }}
              </BlobProvider>
            )}
          </>
        )}
      </div>
    </div>
  )
}
