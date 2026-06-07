import type { Screen } from '../../App'

interface Props {
  current: Screen
  navigate: (s: Screen) => void
}

function IconHome({ active }: { active: boolean }) {
  const c = active ? '#C8A96A' : 'rgba(245,241,232,0.5)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(200,169,106,0.15)' : 'none'}
      />
    </svg>
  )
}

function IconCompose({ active }: { active: boolean }) {
  const c = active ? '#C8A96A' : 'rgba(245,241,232,0.5)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill={c} />
      <path d="M19 15L19.54 17.73L22 18L19.54 18.27L19 21L18.46 18.27L16 18L18.46 17.73L19 15Z" fill={c} opacity="0.6" />
      <path d="M5 3.5L5.27 4.87L6.5 5L5.27 5.13L5 6.5L4.73 5.13L3.5 5L4.73 4.87L5 3.5Z" fill={c} opacity="0.45" />
    </svg>
  )
}

function IconDraft({ active }: { active: boolean }) {
  const c = active ? '#C8A96A' : 'rgba(245,241,232,0.5)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill={active ? 'rgba(200,169,106,0.12)' : 'none'}
      />
      <line x1="8" y1="13" x2="16" y2="13" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="17" x2="12" y2="17" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="14 2 14 8 20 8" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSettings({ active }: { active: boolean }) {
  const c = active ? '#C8A96A' : 'rgba(245,241,232,0.5)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"
        fill={active ? 'rgba(200,169,106,0.15)' : 'none'}
      />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

const tabs: { key: Screen; label: string }[] = [
  { key: 'home',     label: 'Home'     },
  { key: 'intake',   label: 'Compose'  },
  { key: 'draft',    label: 'Draft'    },
  { key: 'settings', label: 'Settings' },
]

function TabIcon({ tabKey, active }: { tabKey: Screen; active: boolean }) {
  if (tabKey === 'home')     return <IconHome     active={active} />
  if (tabKey === 'intake')   return <IconCompose  active={active} />
  if (tabKey === 'draft')    return <IconDraft    active={active} />
  if (tabKey === 'settings') return <IconSettings active={active} />
  return null
}

export default function BottomNav({ current, navigate }: Props) {
  return (
    <nav
      style={{
        background: '#2C1F16',
        paddingTop: '8px',
        // BottomNav owns the bottom safe-area inset (home indicator zone on iPhone)
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid rgba(200,169,106,0.2)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
      }}
    >
      {tabs.map(tab => {
        const active = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.key)}
            className="flex flex-col items-center gap-[5px] px-4 transition-all active:scale-90"
            style={{ paddingTop: 4 }}
          >
            <div
              style={{
                width: active ? 20 : 0,
                height: 2.5,
                background: '#C8A96A',
                borderRadius: 99,
                marginBottom: 4,
                transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
              }}
            />
            <TabIcon tabKey={tab.key} active={active} />
            <span
              className="text-[9.5px] font-semibold tracking-wider uppercase"
              style={{
                color: active ? '#C8A96A' : 'rgba(245,241,232,0.45)',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'color 0.2s',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
