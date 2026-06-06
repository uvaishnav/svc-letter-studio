import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

const QUICK_TYPES = [
  { label: 'Quotation',          emoji: '📋', hint: 'Price estimate for a project' },
  { label: 'Work Order',         emoji: '🔨', hint: 'Instruction to begin work' },
  { label: 'Invoice',            emoji: '🧾', hint: 'Bill for completed work' },
  { label: 'Experience Letter',  emoji: '📄', hint: 'For outgoing employees' },
]

export default function HomeScreen({ navigate }: Props) {
  return (
    <div
      className="flex flex-col min-h-full px-5 pt-14 pb-6"
      style={{ background: 'var(--color-ivory)' }}
    >

      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <p
          className="font-montserrat text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-gold)' }}
        >
          Sri Vaishnav Constructions
        </p>
        <h1
          className="font-montserrat font-bold text-3xl leading-tight"
          style={{ color: 'var(--color-dark-brown)' }}
        >
          Letter Studio
        </h1>
        <p
          className="font-montserrat text-sm mt-2"
          style={{ color: 'var(--color-dark-brown)', opacity: 0.55 }}
        >
          Generate branded documents in seconds.
        </p>
      </div>

      {/* ── Gold divider ───────────────────────────────────────────────────── */}
      <div style={{ height: '1px', background: 'var(--color-gold)', marginBottom: '28px', opacity: 0.5 }} />

      {/* ── Primary CTA ───────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('intake')}
        className="w-full py-5 rounded-2xl font-montserrat font-bold text-base flex items-center justify-center gap-3"
        style={{
          background: 'var(--color-dark-brown)',
          color: 'var(--color-ivory)',
          boxShadow: '0 4px 20px rgba(59,42,31,0.18)',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>✦</span>
        New Document
      </button>

      <p
        className="text-center font-montserrat text-xs mt-3 mb-8"
        style={{ color: 'var(--color-dark-brown)', opacity: 0.4 }}
      >
        Describe what you need — AI does the rest
      </p>

      {/* ── Quick-type cards ──────────────────────────────────────────────── */}
      <p
        className="font-montserrat font-semibold text-xs uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-dark-brown)', opacity: 0.45 }}
      >
        Quick Start
      </p>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_TYPES.map(({ label, emoji, hint }) => (
          <button
            key={label}
            onClick={() => navigate('intake')}
            className="flex flex-col items-start p-4 rounded-2xl text-left"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(200,169,106,0.25)',
              boxShadow: '0 2px 10px rgba(59,42,31,0.05)',
            }}
          >
            <span className="text-xl mb-2">{emoji}</span>
            <p
              className="font-montserrat font-semibold text-sm"
              style={{ color: 'var(--color-dark-brown)' }}
            >
              {label}
            </p>
            <p
              className="font-montserrat text-xs mt-0.5"
              style={{ color: 'var(--color-dark-brown)', opacity: 0.45 }}
            >
              {hint}
            </p>
          </button>
        ))}
      </div>

    </div>
  )
}
