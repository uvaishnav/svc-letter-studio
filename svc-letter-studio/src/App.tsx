import { useState } from 'react'
import BottomNav from './components/ui/BottomNav'
import HomeScreen from './screens/HomeScreen'
import IntakeScreen from './screens/IntakeScreen'
import UploadScreen from './screens/UploadScreen'
import BlankScreen from './screens/BlankScreen'
import DraftScreen from './screens/DraftScreen'
import PreviewScreen from './screens/PreviewScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useSessionStore } from './store/sessionStore'

export type Screen = 'home' | 'intake' | 'upload' | 'blank' | 'draft' | 'preview' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  const {
    state,
    setDraft,
    setRawInput,
    setPipelineCtx,
    updateBlock,
    updateEnvelope,
  } = useSessionStore()

  const navigate = (s: Screen) => setScreen(s)

  const isPreview = screen === 'preview'
  const isDraft   = screen === 'draft'

  const rootBg  = isPreview ? '#1C1C1E' : '#F5F1E8'
  const hideNav = isPreview || isDraft

  return (
    <div
      style={{
        // Use 100dvh so the root exactly matches the visual viewport on iOS Safari/PWA.
        // Do NOT add paddingTop here — each screen handles its own safe-area-inset-top
        // so we avoid double-counting the status bar height.
        height: '100dvh',
        background: rootBg,
        display: 'flex',
        flexDirection: 'column',
        // Reserve the home-indicator strip at the bottom so the nav truly hugs the edge.
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Scrollable screen content — takes all remaining space above the nav */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

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

        {screen === 'upload' && (
          <UploadScreen
            navigate={navigate}
            setDraft={setDraft}
            setRawInput={setRawInput}
            setPipelineCtx={setPipelineCtx}
          />
        )}

        {screen === 'blank' && (
          <BlankScreen navigate={navigate} />
        )}

        {screen === 'draft' && (
          <DraftScreen
            navigate={navigate}
            state={state}
            updateBlock={updateBlock}
            updateEnvelope={updateEnvelope}
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

      {/* BottomNav sits outside the scroll area — always pinned to bottom of root */}
      {!hideNav && (
        <BottomNav current={screen} navigate={navigate} />
      )}
    </div>
  )
}
