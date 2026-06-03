import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import IntakeScreen from './screens/IntakeScreen'
import DraftScreen from './screens/DraftScreen'
import PreviewScreen from './screens/PreviewScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/ui/BottomNav'

export type Screen = 'home' | 'intake' | 'draft' | 'preview' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  const navigate = (s: Screen) => setScreen(s)

  const renderScreen = () => {
    switch (screen) {
      case 'home':     return <HomeScreen navigate={navigate} />
      case 'intake':   return <IntakeScreen navigate={navigate} />
      case 'draft':    return <DraftScreen navigate={navigate} />
      case 'preview':  return <PreviewScreen navigate={navigate} />
      case 'settings': return <SettingsScreen navigate={navigate} />
      default:         return <HomeScreen navigate={navigate} />
    }
  }

  const showNav = screen !== 'preview'

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-ivory)' }}>
      <main className="flex-1 overflow-y-auto">
        {renderScreen()}
      </main>
      {showNav && <BottomNav current={screen} navigate={navigate} />}
    </div>
  )
}
