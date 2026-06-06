import { useState } from 'react'
import BottomNav from './components/ui/BottomNav'
import HomeScreen from './screens/HomeScreen'
import IntakeScreen from './screens/IntakeScreen'
import PreviewScreen from './screens/PreviewScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useSessionStore } from './store/sessionStore'

export type Screen = 'home' | 'intake' | 'draft' | 'preview' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const { state, setDraft, setRawInput, setPipelineCtx } = useSessionStore()

  const navigate = (s: Screen) => setScreen(s)

  const isPreview  = screen === 'preview'
  const isIntake   = screen === 'intake'
  // Hide BottomNav on preview and intake (full-screen flow screens)
  const showNav    = !isPreview && !isIntake

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: isPreview ? '#1C1C1E' : 'var(--color-ivory)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Screen Router ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {screen === 'home' && (
          <HomeScreen navigate={navigate} />
        )}

        {screen === 'intake' && (
          <IntakeScreen
            navigate={navigate}
            state={state}
            setDraft={setDraft}
            setRawInput={setRawInput}
            setPipelineCtx={setPipelineCtx}
          />
        )}

        {screen === 'preview' && (
          <PreviewScreen
            navigate={navigate}
            state={state}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen navigate={navigate} />
        )}

      </div>

      {/* ── Bottom Nav (hidden on preview + intake) ──────────────────────── */}
      {showNav && (
        <BottomNav current={screen} navigate={navigate} />
      )}
    </div>
  )
}
