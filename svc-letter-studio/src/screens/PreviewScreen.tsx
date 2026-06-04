import { useState } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'

interface Props {
  navigate: (s: Screen) => void
  state: SessionState
}

export default function PreviewScreen({ navigate, state }: Props) {
  const [showViewer, setShowViewer] = useState(true)

  const docProps = {
    content: state.draftContent,
    watermarkEnabled: state.pdfSettings.watermarkEnabled,
    signatoryName: state.signatoryName,
    signatoryDesignation: state.signatoryDesignation,
    showSignatory: true,
  }

  return (
    <div className="flex flex-col min-h-full" style={{ background: '#1a1a1a' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 pt-12 pb-4"
        style={{ background: 'var(--color-brown)' }}
      >
        <button
          onClick={() => navigate('draft')}
          className="text-sm font-medium"
          style={{ color: 'var(--color-gold)' }}
        >
          ‹ Back
        </button>
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: 'var(--color-ivory)' }}
        >
          Preview
        </span>
        <PDFDownloadLink
          document={<LetterheadDocument {...docProps} />}
          fileName="svc-letter.pdf"
          className="text-sm font-semibold"
          style={{ color: 'var(--color-gold)' }}
        >
          {({ loading }) => (loading ? 'Preparing…' : 'Export')}
        </PDFDownloadLink>
      </div>

      {/* Toggle viewer / hide on slow devices */}
      <div className="flex justify-center pt-3 pb-1 gap-3">
        <button
          onClick={() => setShowViewer(v => !v)}
          className="text-xs px-3 py-1 rounded-full border"
          style={{
            color: showViewer ? 'var(--color-brown)' : 'var(--color-gold)',
            borderColor: 'var(--color-gold)',
            background: showViewer ? 'var(--color-gold)' : 'transparent',
          }}
        >
          {showViewer ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* PDF preview area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {showViewer ? (
          <div
            className="w-full max-w-sm shadow-2xl rounded overflow-hidden"
            style={{ aspectRatio: '210/297' }}
          >
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <LetterheadDocument {...docProps} />
            </PDFViewer>
          </div>
        ) : (
          <div
            className="w-full max-w-sm aspect-[210/297] rounded-lg shadow-2xl flex flex-col items-center justify-center gap-4"
            style={{ background: 'var(--color-ivory)' }}
          >
            <p
              className="text-sm text-center px-8"
              style={{ color: 'var(--color-brown-muted)' }}
            >
              Preview hidden. Use Export to download.
            </p>
            <PDFDownloadLink
              document={<LetterheadDocument {...docProps} />}
              fileName="svc-letter.pdf"
              className="text-sm font-semibold px-6 py-2 rounded"
              style={{
                background: 'var(--color-brown)',
                color: 'var(--color-gold)',
              }}
            >
              {({ loading }) => (loading ? 'Preparing…' : 'Download PDF')}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  )
}
