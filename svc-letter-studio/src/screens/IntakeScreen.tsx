import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

export default function IntakeScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full px-5 pt-12 pb-6"
         style={{ background: 'var(--color-ivory)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('home')}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-ivoryDark)' }}>
          ‹
        </button>
        <h2 className="text-base font-semibold tracking-wide"
            style={{ color: 'var(--color-brown)' }}>New Letter</h2>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 rounded-2xl flex items-center justify-center"
           style={{ border: '1.5px dashed var(--color-gold)' }}>
        <p className="text-sm text-center px-8" style={{ color: 'var(--color-brown-muted)' }}>
          AI intake form coming in Phase 5.
          <br /><br />
          You'll describe your letter here and AI will draft it.
        </p>
      </div>

      <button
        onClick={() => navigate('draft')}
        className="mt-5 w-full py-4 rounded-2xl text-sm font-semibold tracking-wider uppercase transition-opacity active:opacity-80"
        style={{ background: 'var(--color-brown)', color: 'var(--color-ivory)' }}>
        Continue →
      </button>
    </div>
  )
}
