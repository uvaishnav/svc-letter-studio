// Tier 1 — lightweight model
// Classifies user intent: document type + detected fields + missing fields

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildClassifySystemPrompt, buildClassifyUserPrompt } from '../prompts';
import type { PipelineContext } from '../types';

export async function classifyIntent(
  rawInput: string
): Promise<Partial<PipelineContext>> {
  const system = buildClassifySystemPrompt();
  const user   = buildClassifyUserPrompt(rawInput);

  console.log('[classifyIntent] ▶ Starting classification for input:', rawInput.slice(0, 100));

  let raw = '';
  try {
    const gemini = new GeminiProvider();
    raw = await gemini.call(system, user, 'lightweight');
    console.log('[classifyIntent] Gemini raw response:', raw.slice(0, 300));
  } catch (geminiErr) {
    console.warn('[classifyIntent] ⚠️ Gemini failed, trying Groq:', geminiErr);
    try {
      const groq = new GroqProvider();
      raw = await groq.call(system, user);
      console.log('[classifyIntent] Groq raw response:', raw.slice(0, 300));
    } catch (groqErr) {
      console.error('[classifyIntent] ❌ Both providers failed:', groqErr);
      throw groqErr;
    }
  }

  const parsed = JSON.parse(raw);
  console.log('[classifyIntent] ✅ Parsed:', parsed);
  return {
    documentType:   parsed.documentType,
    detectedFields: parsed.detectedFields,
    missingFields:  parsed.missingFields,
  };
}

// Merges classification result into an existing PipelineContext
export function applyClassification(
  ctx: Partial<PipelineContext>,
  result: Partial<PipelineContext>
): PipelineContext {
  return {
    ...ctx,
    ...result,
  } as PipelineContext;
}
