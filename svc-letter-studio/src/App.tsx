import { useState } from 'react'
import { useSessionStore } from './store/sessionStore'
import BottomNav from './components/ui/BottomNav'
import HomeScreen from './screens/HomeScreen'
import IntakeScreen from './screens/IntakeScreen'
import DraftScreen from './screens/DraftScreen'
import PreviewScreen from './screens/PreviewScreen'
import SettingsScreen from './screens/SettingsScreen'

export type Screen = 'home' | 'intake' | 'draft' | 'preview' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const { state, update } = useSessionStore()

  const navigate = (s: Screen) => setScreen(s)

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: 'var(--color-ivory)' }}>
      <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {screen === 'home'     && <HomeScreen     navigate={navigate} />}
        {screen === 'intake'   && <IntakeScreen   navigate={navigate} />}
        {screen === 'draft'    && <DraftScreen    navigate={navigate} />}
        {screen === 'preview'  && <PreviewScreen  navigate={navigate} state={state} />}
        {screen === 'settings' && <SettingsScreen navigate={navigate} />}
      </main>
      {screen !== 'preview' && <BottomNav current={screen} navigate={navigate} />}
    </div>
  )
}
