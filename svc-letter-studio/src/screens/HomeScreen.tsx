import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

export default function HomeScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full px-5 pt-14 pb-6"
         style={{ background: 'var(--color-ivory)' }}>

      {/* Brand header */}
      <div className="text-center mb-10">
        <img
          src="/logo/logo.svg"
          alt="SVC"
          className="w-16 mx-auto mb-4 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <h1 className="text-2xl font-semibold tracking-widest uppercase mb-1"
            style={{ fontFamily: 'var(--font-brand)', color: 'var(--color-brown)' }}>
          Sri Vaishnav
        </h1>
        <p className="text-xs tracking-[0.25em] uppercase"
           style={{ color: 'var(--color-brown-muted)' }}>
          Letter Studio
        </p>
      </div>

      {/* Primary action */}
      <button
        onClick={() => navigate('intake')}
        className="w-full py-4 rounded-2xl text-sm font-semibold tracking-wider uppercase mb-4 transition-opacity active:opacity-80"
        style={{ background: 'var(--color-brown)', color: 'var(--color-ivory)' }}>
        ✦ Compose New Letter
      </button>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => navigate('intake')}
          className="py-4 rounded-2xl text-sm font-medium border transition-opacity active:opacity-70"
          style={{ borderColor: 'var(--color-gold)', color: 'var(--color-brown)' }}>
          📄 Upload Document
        </button>
        <button
          onClick={() => navigate('settings')}
          className="py-4 rounded-2xl text-sm font-medium border transition-opacity active:opacity-70"
          style={{ borderColor: 'var(--color-gold)', color: 'var(--color-brown)' }}>
          ⚙️ Settings
        </button>
      </div>

      {/* Recent (placeholder) */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--color-ivoryDark)', border: '1px solid var(--color-gold-light)' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3"
           style={{ color: 'var(--color-brown-muted)' }}>Recent Letters</p>
        <p className="text-sm text-center py-6" style={{ color: 'var(--color-brown-muted)' }}>
          No letters yet. Compose your first one.
        </p>
      </div>
    </div>
  )
}
