// Inline Buffer shim — must be first, before any @react-pdf/renderer code loads.
// Vite externalizes the bare 'buffer' package, so we cannot import it directly.
// Instead we install a minimal shim on globalThis that satisfies what
// @react-pdf/renderer (pdfkit) needs: Buffer.from, Buffer.alloc, Buffer.isBuffer.
;(function installBufferShim() {
  if (typeof (globalThis as any).Buffer !== 'undefined') return
  // Use the TextEncoder/Uint8Array-based approach
  const BufferShim = {
    from(data: string | ArrayBuffer | number[]): Uint8Array {
      if (typeof data === 'string') {
        const enc = new TextEncoder()
        return enc.encode(data)
      }
      if (data instanceof ArrayBuffer) return new Uint8Array(data)
      return new Uint8Array(data as number[])
    },
    alloc(size: number, fill = 0): Uint8Array {
      return new Uint8Array(size).fill(fill)
    },
    allocUnsafe(size: number): Uint8Array {
      return new Uint8Array(size)
    },
    isBuffer(obj: unknown): boolean {
      return obj instanceof Uint8Array
    },
    concat(list: Uint8Array[], totalLength?: number): Uint8Array {
      const len = totalLength ?? list.reduce((a, b) => a + b.length, 0)
      const result = new Uint8Array(len)
      let offset = 0
      for (const buf of list) {
        result.set(buf, offset)
        offset += buf.length
      }
      return result
    },
  }
  // @ts-expect-error polyfill
  globalThis.Buffer = BufferShim
})()

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
