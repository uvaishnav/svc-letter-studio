// Buffer polyfill — @react-pdf/renderer uses Node's Buffer internally.
// Vite does not polyfill it by default. This must be the very first import.
import { Buffer } from 'buffer'
if (typeof window !== 'undefined') {
  // @ts-expect-error polyfill
  window.Buffer = Buffer
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
