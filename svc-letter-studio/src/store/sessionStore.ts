import { useState, useCallback } from 'react';
import type { LetterDraft, ContentBlock, DocumentEnvelope } from '../types/document';
import type { PipelineContext } from '../ai/types';
import { DEFAULT_SIGNATORY } from '../constants/defaults';

export interface SessionState {
  draft:           LetterDraft | null;
  rawUserInput:    string;
  uploadedContent: string;
  aiProvider:      'gemini' | 'groq' | null;
  pipelineCtx:     PipelineContext | null;
}

function initialState(): SessionState {
  return {
    draft:           null,
    rawUserInput:    '',
    uploadedContent: '',
    aiProvider:      null,
    pipelineCtx:     null,
  };
}

export function createEmptyDraft(): LetterDraft {
  return {
    envelope: {
      documentType: 'letter',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      refNumber: undefined,
      subject: '',
      signatory: { ...DEFAULT_SIGNATORY },
    },
    blocks: [],
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

  // Replace a single block by index — used by per-block AI improve and manual edit
  const updateBlock = useCallback((index: number, updated: ContentBlock) => {
    setState(s => {
      if (!s.draft) return s;
      const blocks = [...s.draft.blocks];
      blocks[index] = updated;
      return { ...s, draft: { ...s.draft, blocks } };
    });
  }, []);

  // Merge partial envelope fields — used by EnvelopeFields editor
  const updateEnvelope = useCallback((partial: Partial<DocumentEnvelope>) => {
    setState(s => {
      if (!s.draft) return s;
      return {
        ...s,
        draft: {
          ...s.draft,
          envelope: { ...s.draft.envelope, ...partial },
        },
      };
    });
  }, []);

  const reset = useCallback(() => setState(initialState()), []);

  return { state, setDraft, setRawInput, setPipelineCtx, updateBlock, updateEnvelope, reset };
}
