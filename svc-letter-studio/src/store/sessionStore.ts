import { useState } from 'react'
import type { LetterDraft, DocumentType } from '../types/document'

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_SIGNATORY = {
  name: 'UPPALAPATI SUREKHA',
  designation: 'Proprietor',
}

export const DEFAULT_PDF_SETTINGS = {
  watermarkEnabled: true,
}

export function createEmptyDraft(type: DocumentType = 'letter'): LetterDraft {
  return {
    envelope: {
      documentType: type,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      signatory: { ...DEFAULT_SIGNATORY },
    },
    blocks: [],
  }
}

// ─── Session State ────────────────────────────────────────────────────────────
// In-memory only — no localStorage (D004)

export interface SessionState {
  draft: LetterDraft | null
  rawUserInput: string        // freeform text from IntakeScreen
  uploadedContent: string     // parsed text from .docx/.pdf upload
  isGenerating: boolean
  watermarkEnabled: boolean
  aiProvider: 'gemini' | 'groq' | null  // which provider generated the current draft
}

export const initialSessionState: SessionState = {
  draft: null,
  rawUserInput: '',
  uploadedContent: '',
  isGenerating: false,
  watermarkEnabled: DEFAULT_PDF_SETTINGS.watermarkEnabled,
  aiProvider: null,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSessionStore() {
  const [state, setState] = useState<SessionState>(initialSessionState)
  const update = (partial: Partial<SessionState>) =>
    setState(prev => ({ ...prev, ...partial }))
  return { state, update }
}
