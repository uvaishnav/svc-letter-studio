// Tier 1 — lightweight model
// Classifies user intent: document type + detected fields + missing fields

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import {
  buildClassifySystemPrompt,
  buildClassifyUserPrompt,
} from '../prompts';
import type { PipelineContext } from '../types';
import type { DocumentType, DocumentEnvelope } from '../../types/document';

interface ClassifyResult {
  documentType: DocumentType;
  detectedFields: Partial<DocumentEnvelope>;
  missingFields: string[];
}

export async function classifyIntent(
  rawInput: string
): Promise<ClassifyResult> {
  const system = buildClassifySystemPrompt();
  const user   = buildClassifyUserPrompt(rawInput);

  let raw: string;

  try {
    const gemini = new GeminiProvider();
    raw = await gemini.call(system, user, 'lightweight');
  } catch {
    // Fallback: Groq handles classification too
    const groq = new GroqProvider();
    raw = await groq.call(system, user) as string;
  }

  const parsed: ClassifyResult = JSON.parse(raw);
  return {
    documentType:   parsed.documentType   ?? 'general_letter',
    detectedFields: parsed.detectedFields ?? {},
    missingFields:  parsed.missingFields  ?? [],
  };
}

export function applyClassification(
  ctx: PipelineContext,
  result: ClassifyResult
): PipelineContext {
  return {
    ...ctx,
    documentType:   result.documentType,
    detectedFields: result.detectedFields,
    missingFields:  result.missingFields,
  };
}
