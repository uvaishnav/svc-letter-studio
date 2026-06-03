import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

export default function PreviewScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full" style={{ background: '#1a1a1a' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4"
           style={{ background: 'var(--color-brown)' }}>
        <button onClick={() => navigate('draft')}
                className="text-sm font-medium"
                style={{ color: 'var(--color-gold)' }}>
          ‹ Back
        </button>
        <span className="text-sm font-semibold tracking-wide"
              style={{ color: 'var(--color-ivory)' }}>Preview</span>
        <button className="text-sm font-semibold"
                style={{ color: 'var(--color-gold)' }}>
          Export
        </button>
      </div>

      {/* PDF preview area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm aspect-[210/297] rounded-lg shadow-2xl flex items-center justify-center"
             style={{ background: 'var(--color-ivory)' }}>
          <p className="text-sm text-center px-8" style={{ color: 'var(--color-brown-muted)' }}>
            PDF preview coming in Phase 8.
            <br /><br />
            Letterhead PDF will render here.
          </p>
        </div>
      </div>
    </div>
  )
}
