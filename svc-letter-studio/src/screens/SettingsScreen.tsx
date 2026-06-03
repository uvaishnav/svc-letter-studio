import type { Screen } from '../App'

interface Props {
  navigate: (s: Screen) => void
}

export default function SettingsScreen({ navigate }: Props) {
  return (
    <div className="flex flex-col min-h-full px-5 pt-12 pb-6"
         style={{ background: 'var(--color-ivory)' }}>
      <h2 className="text-base font-semibold tracking-wide mb-8"
          style={{ color: 'var(--color-brown)' }}>Settings</h2>

      <div className="space-y-3">
        {/* Signatory */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-ivoryDark)', border: '1px solid var(--color-gold-light)' }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1"
             style={{ color: 'var(--color-brown-muted)' }}>Default Signatory</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-brown)' }}>UPPALAPATI SUREKHA</p>
          <p className="text-xs" style={{ color: 'var(--color-brown-muted)' }}>Proprietor</p>
        </div>

        {/* Watermark */}
        <div className="rounded-2xl p-4 flex items-center justify-between"
             style={{ background: 'var(--color-ivoryDark)', border: '1px solid var(--color-gold-light)' }}>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1"
               style={{ color: 'var(--color-brown-muted)' }}>Watermark</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-brown)' }}>Enabled</p>
          </div>
          <div className="w-11 h-6 rounded-full flex items-center px-1"
               style={{ background: 'var(--color-gold)' }}>
            <div className="w-4 h-4 rounded-full ml-auto" style={{ background: 'white' }} />
          </div>
        </div>

        <p className="text-xs text-center pt-4" style={{ color: 'var(--color-brown-muted)' }}>
          Full settings editor coming in Phase 9.
        </p>
      </div>
    </div>
  )
}
