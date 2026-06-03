import type { Screen } from '../../App'

interface Props {
  current: Screen
  navigate: (s: Screen) => void
}

const tabs: { key: Screen; label: string; icon: string }[] = [
  { key: 'home',     label: 'Home',     icon: '⌂' },
  { key: 'intake',   label: 'Compose',  icon: '✦' },
  { key: 'draft',    label: 'Draft',    icon: '✎' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function BottomNav({ current, navigate }: Props) {
  return (
    <nav
      className="flex items-center justify-around safe-bottom"
      style={{
        background: 'var(--color-brown)',
        paddingTop: '10px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--color-brown-light)',
      }}>
      {tabs.map(tab => {
        const active = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.key)}
            className="flex flex-col items-center gap-1 px-4 transition-opacity active:opacity-60"
            style={{ opacity: active ? 1 : 0.45 }}>
            <span className="text-lg" style={{ color: active ? 'var(--color-gold)' : 'var(--color-ivory)' }}>
              {tab.icon}
            </span>
            <span
              className="text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: active ? 'var(--color-gold)' : 'var(--color-ivory)' }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
