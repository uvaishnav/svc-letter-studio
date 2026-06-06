import { useState, useCallback } from 'react';
import type { LetterDraft } from '../types/document';
import type { PipelineContext } from '../ai/types';

// ─── Session State ────────────────────────────────────────────────────────────
// In-memory only — no localStorage (D004)

export interface SessionState {
  draft: LetterDraft | null;
  rawUserInput: string;
  uploadedContent: string;
  aiProvider: 'gemini' | 'groq' | null;
  pipelineCtx: PipelineContext | null;   // enriched context travels with session
}

function initialState(): SessionState {
  return {
    draft:          null,
    rawUserInput:   '',
    uploadedContent: '',
    aiProvider:     null,
    pipelineCtx:    null,
  };
}

export function createEmptyDraft(): LetterDraft {
  return {
    envelope: {
      documentType:          'general_letter',
      date:                  new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      refNumber:             null,
      recipientName:         '',
      recipientAddress:      '',
      subject:               '',
      signatoryName:         'UPPALAPATI SUREKHA',
      signatoryDesignation:  'Proprietor',
    },
    body: [],
  };
}

export function useSessionStore() {
  const [state, setState] = useState<SessionState>(initialState);

  const setDraft = useCallback((draft: LetterDraft, provider: 'gemini' | 'groq') => {
    setState(s => ({ ...s, draft, aiProvider: provider }));
  }, []);

  const setRawInput = useCallback((rawUserInput: string) => {
    setState(s => ({ ...s, rawUserInput }));
  }, []);

  const setPipelineCtx = useCallback((pipelineCtx: PipelineContext) => {
    setState(s => ({ ...s, pipelineCtx }));
  }, []);

  const reset = useCallback(() => setState(initialState()), []);

  return { state, setDraft, setRawInput, setPipelineCtx, reset };
}
