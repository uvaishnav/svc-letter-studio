import type { DocumentType, LetterDraft } from '../types/document';

export interface AIInput {
  /** Raw freeform text from the user describing what they want */
  userText: string;
  /** Hint for document type — AI may override based on content */
  documentType?: DocumentType;
  /** Any clarification answers collected before this call */
  clarifications?: Record<string, string>;
}

export interface AIOutput {
  draft: LetterDraft;
  /** Which provider actually produced this output */
  provider: 'gemini' | 'groq';
}

export interface AIProvider {
  generateDraft(input: AIInput): Promise<LetterDraft>;
}
