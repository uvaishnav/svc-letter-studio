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
        height: '100dvh',
        background: rootBg,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/* Scrollable screen content.
          For preview: overflow must be 'auto' on the OUTER page scroll so the
          tall iframe (1684px) is reachable. The inner wrapper is removed from
          PreviewScreen so there is only one scroll container.
          For all other screens: same behaviour as before. */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          // On preview the root div must be able to grow beyond 100dvh so the
          // scroll container here can actually scroll down to page 2.
          ...(isPreview ? { height: 'auto' } : {}),
        }}
      >

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

      {/* BottomNav sits outside the scroll area — pinned to bottom */}
      {!hideNav && (
        <BottomNav current={screen} navigate={navigate} />
      )}
    </div>
  )
}
