import type { DocumentType, DocumentEnvelope, LetterDraft } from '../types/document';

// ─── Task Tiers ───────────────────────────────────────────────────────────────
// Tier 1 (lightweight): intent classification, clarification question generation
// Tier 2 (standard):    restructuring uploaded content, summarising context
// Tier 3 (premium):     full draft generation, AI improve actions
export type TaskTier = 'lightweight' | 'standard' | 'premium';

// ─── Pipeline Context ─────────────────────────────────────────────────────────
// Travels through all pipeline stages. Each stage appends to it — never discards.
export interface PipelineContext {
  rawInput: string;
  documentType?: DocumentType;
  detectedFields?: Partial<DocumentEnvelope>;
  missingFields?: string[];
  clarificationQuestion?: string;
  clarificationAnswer?: string;
}

// ─── Legacy single-call types (kept for backward compat) ──────────────────────
export interface AIInput {
  userText: string;
  documentType?: DocumentType;
  clarifications?: Record<string, string>;
}

export interface AIOutput {
  draft: LetterDraft;
  provider: 'gemini' | 'groq';
}

export interface AIProvider {
  generateDraft(input: AIInput): Promise<LetterDraft>;
}
