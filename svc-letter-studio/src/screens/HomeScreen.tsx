import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

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
        className="text-center font-montserrat text-xs mt-3"
        style={{ color: 'var(--color-dark-brown)', opacity: 0.4 }}
      >
        Describe what you need — AI does the rest
      </p>

    </div>
  )
}
