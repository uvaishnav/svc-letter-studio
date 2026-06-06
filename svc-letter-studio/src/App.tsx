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
    draft,
    setDraft,
    setRawInput,
    setPipelineCtx,
    updateBlock,
    updateEnvelope,
  } = useSessionStore()

  const navigate = (s: Screen) => setScreen(s)

  const isPreview  = screen === 'preview'
  const isIntake   = screen === 'intake'
  const isUpload   = screen === 'upload'
  const isDraft    = screen === 'draft'

  // Dark background only on preview
  const rootBg = isPreview ? '#1C1C1E' : '#F5F1E8'

  // Hide BottomNav on full-screen flow screens
  const hideNav = isIntake || isUpload || isDraft || isPreview

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: rootBg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {screen === 'home' && (
          <HomeScreen navigate={navigate} />
        )}

        {screen === 'intake' && (
          <IntakeScreen
            navigate={navigate}
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

        {screen === 'draft' && draft && (
          <DraftScreen
            draft={draft}
            navigate={navigate}
            updateBlock={updateBlock}
            updateEnvelope={updateEnvelope}
          />
        )}

        {screen === 'preview' && draft && (
          <PreviewScreen
            draft={draft}
            navigate={navigate}
          />
        )}

        {screen === 'settings' && (
          <SettingsScreen navigate={navigate} />
        )}
      </div>

      {!hideNav && (
        <BottomNav screen={screen} navigate={navigate} />
      )}
    </div>
  )
}
