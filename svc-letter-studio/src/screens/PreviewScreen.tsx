import { usePDF } from '@react-pdf/renderer'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'
import { createEmptyDraft } from '../store/sessionStore'

// ─── Provider Badge ────────────────────────────────────────────────────────
function ProviderBadge({ provider }: { provider: SessionState['aiProvider'] }) {
  if (!provider) return null
  const isGemini = provider === 'gemini'
  return (
    <div
      className="px-3 py-1 rounded-full text-xs font-montserrat font-medium"
      style={{
        background: isGemini ? 'rgba(66,133,244,0.12)' : 'rgba(249,115,22,0.12)',
        color:      isGemini ? '#4285F4'               : '#F97316',
        border:     `1px solid ${isGemini ? 'rgba(66,133,244,0.3)' : 'rgba(249,115,22,0.3)'}`,
      }}
    >
      {isGemini ? 'Gemini 3.5 Flash' : 'Groq · Llama 3.3'}
    </div>
  )
}

// ─── PDF Hook wrapper ─────────────────────────────────────────────────────
interface Props {
  navigate: (s: Screen) => void
  state: SessionState
}

export default function PreviewScreen({ navigate, state }: Props) {
  const draft = state.draft ?? createEmptyDraft()

  const [instance] = usePDF({
    document: <LetterheadDocument draft={draft} />,
  })

  // ─ filename
  const docType = draft.envelope.documentType?.replace(/_/g, '-') ?? 'document'
  const dateStr  = new Date().toISOString().slice(0, 10)
  const filename = `SVC-${docType}-${dateStr}.pdf`

  // ─ download handler — uses the same blob, no cross-partition issue
  function handleDownload() {
    if (!instance.url) return
    const a = document.createElement('a')
    a.href     = instance.url
    a.download = filename
    a.click()
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', background: '#1C1C1E' }}
    >

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 pt-12 pb-3"
        style={{ background: '#1C1C1E' }}
      >
        <button
          onClick={() => navigate('intake')}
          className="font-montserrat text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          ← Back
        </button>

        <ProviderBadge provider={state.aiProvider} />

        <button
          onClick={handleDownload}
          disabled={!instance.url || !!instance.error}
          className="font-montserrat text-sm font-bold px-4 py-2 rounded-xl"
          style={{
            background: instance.url ? 'var(--color-gold)' : 'rgba(200,169,106,0.3)',
            color: '#fff',
          }}
        >
          {instance.loading ? 'Building…' : 'Download'}
        </button>
      </div>

      {/* ── PDF Preview area ─────────────────────────────────────────── */}
      <div className="flex-1 px-3 pb-6">
        {instance.loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
            />
            <p className="font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Rendering PDF…
            </p>
          </div>
        )}

        {instance.error && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-6">
            <span className="text-3xl">⚠️</span>
            <p className="font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              PDF rendering failed
            </p>
            <p className="font-montserrat text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {String(instance.error)}
            </p>
            <p className="font-montserrat text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Make sure font files exist in public/fonts/. See docs/FONTS.md for instructions.
            </p>
          </div>
        )}

        {/* iframe is immune to Blob URL cross-partition Chrome policy */}
        {instance.url && !instance.error && (
          <iframe
            src={instance.url}
            title="Letter Preview"
            style={{
              width:        '100%',
              height:       'calc(100dvh - 100px)',
              border:       'none',
              borderRadius: '12px',
              background:   '#fff',
            }}
          />
        )}

        {/* iOS Safari fallback: if iframe fails to show PDF inline, offer download */}
        {instance.url && !instance.error && (
          <p
            className="text-center font-montserrat text-xs mt-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            On iOS Safari? Use the Download button above to open the PDF.
          </p>
        )}
      </div>
    </div>
  )
}
