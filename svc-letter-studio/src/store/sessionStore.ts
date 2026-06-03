// In-memory session state — no localStorage, no persistence
import { useState } from 'react'
import type { Screen } from '../App'
import type { DEFAULT_SIGNATORY, DEFAULT_PDF_SETTINGS } from '../constants/defaults'

export interface DocumentContext {
  type: string
  rawBrief: string
  fields: Record<string, string>
  conversationHistory: { role: 'user' | 'ai'; content: string }[]
}

export interface PDFSettings {
  watermarkEnabled: boolean
  paperSize: 'A4'
  marginMm: number
}

export interface SessionState {
  screen: Screen
  documentContext: DocumentContext
  draftContent: string
  pdfSettings: PDFSettings
  signatoryName: string
  signatoryDesignation: string
}

export const initialState: SessionState = {
  screen: 'home',
  documentContext: {
    type: '',
    rawBrief: '',
    fields: {},
    conversationHistory: [],
  },
  draftContent: '',
  pdfSettings: {
    watermarkEnabled: true,
    paperSize: 'A4',
    marginMm: 20,
  },
  signatoryName:        'UPPALAPATI SUREKHA',
  signatoryDesignation: 'Proprietor',
}

export function useSessionStore() {
  const [state, setState] = useState<SessionState>(initialState)

  const update = (partial: Partial<SessionState>) =>
    setState(prev => ({ ...prev, ...partial }))

  return { state, update }
}
