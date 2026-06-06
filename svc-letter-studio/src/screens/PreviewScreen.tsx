import { usePDF } from '@react-pdf/renderer'
import { useState } from 'react'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import LetterheadDocument from '../components/pdf/LetterheadDocument'
import { createEmptyDraft } from '../store/sessionStore'

// ── Helpers ────────────────────────────────────────────────────────────────

/** True when the browser supports Web Share API with file sharing (iOS Safari 15.1+) */
function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) return false
  if (!navigator.canShare) return false
  try {
    return navigator.canShare({ files: [new File([''], 'test.pdf', { type: 'application/pdf' })] })
  } catch {
    return false
  }
}

async function shareOrDownload(url: string, filename: string) {
  if (canShareFiles()) {
    try {
      const res  = await fetch(url)
      const blob = await res.blob()
      const file = new File([blob], filename, { type: 'application/pdf' })
      await navigator.share({ files: [file], title: filename })
      return
    } catch (err) {
      // User cancelled or share failed — fall through to direct download
      if ((err as DOMException).name === 'AbortError') return
    }
  }
  // Fallback: anchor download
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
}

async function printPDF(url: string, filename: string) {
  // On iOS: share sheet includes Print — reuse shareOrDownload
  if (canShareFiles()) {
    await shareOrDownload(url, filename)
    return
  }
  // Desktop: open blob URL in hidden iframe and call print()
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0'
  iframe.src            = url
  document.body.appendChild(iframe)
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } finally {
      setTimeout(() => document.body.removeChild(iframe), 60_000)
    }
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

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

// ── Main Screen ────────────────────────────────────────────────────────────

interface Props {
  navigate: (s: Screen) => void
  state:    SessionState
}

export default function PreviewScreen({ navigate, state }: Props) {
  const draft = state.draft ?? createEmptyDraft()
  const [sharing, setSharing]  = useState(false)
  const [printing, setPrinting] = useState(false)

  const [instance] = usePDF({
    document: <LetterheadDocument draft={draft} />,
  })

  const docType  = draft.envelope.documentType?.replace(/_/g, '-') ?? 'document'
  const dateStr  = new Date().toISOString().slice(0, 10)
  const filename = `SVC-${docType}-${dateStr}.pdf`

  const ready = !!instance.url && !instance.error && !instance.loading

  async function handleShare() {
    if (!instance.url) return
    setSharing(true)
    try { await shareOrDownload(instance.url, filename) }
    finally { setSharing(false) }
  }

  async function handlePrint() {
    if (!instance.url) return
    setPrinting(true)
    try { await printPDF(instance.url, filename) }
    finally { setPrinting(false) }
  }

  const backTarget: Screen = state.draft ? 'draft' : 'intake'
  const isIOS = canShareFiles()

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', background: '#1C1C1E' }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center gap-2 px-4 pt-12 pb-3"
        style={{ background: '#1C1C1E' }}
      >
        {/* Edit toggle — left */}
        <button
          onClick={() => navigate(backTarget)}
          className="font-montserrat text-sm font-bold px-3 py-2 rounded-xl"
          style={{
            background: 'rgba(200,169,106,0.15)',
            color:      '#C8A96A',
            border:     '1.5px solid rgba(200,169,106,0.4)',
            flexShrink: 0,
          }}
        >
          ✏️ Edit
        </button>

        {/* Badge — centre (auto-fills remaining space) */}
        <div className="flex-1 flex justify-center">
          <ProviderBadge provider={state.aiProvider} />
        </div>

        {/* Print icon button — right of badge */}
        <button
          onClick={handlePrint}
          disabled={!ready || printing}
          title="Print"
          className="font-montserrat text-sm font-bold px-3 py-2 rounded-xl"
          style={{
            background: ready ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
            color:      ready ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
            border:     '1.5px solid rgba(255,255,255,0.12)',
            flexShrink: 0,
          }}
        >
          {printing ? '…' : '🖨️'}
        </button>

        {/* Share / Download — rightmost */}
        <button
          onClick={handleShare}
          disabled={!ready || sharing}
          className="font-montserrat text-sm font-bold px-4 py-2 rounded-xl"
          style={{
            background: ready ? 'var(--color-gold)' : 'rgba(200,169,106,0.3)',
            color:      '#fff',
            flexShrink: 0,
          }}
        >
          {sharing
            ? '…'
            : instance.loading
              ? 'Building…'
              : isIOS ? '⬆ Share' : '⬇ Download'}
        </button>
      </div>

      {/* ── PDF Preview area ── */}
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

        {instance.url && !instance.error && (
          <p
            className="text-center font-montserrat text-xs mt-3"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {isIOS
              ? 'Tap Share to AirDrop, save to Files, or print.'
              : 'Use Download to save, or Print to send to your printer.'}
          </p>
        )}
      </div>
    </div>
  )
}
