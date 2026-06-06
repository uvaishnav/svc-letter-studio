// Tier 1 — lightweight model
// Generates exactly one follow-up clarification question

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildClarifySystemPrompt, buildClarifyUserPrompt } from '../prompts';
import type { PipelineContext } from '../types';

// A clarification is needed if there are missing fields
export function needsClarification(ctx: PipelineContext): boolean {
  return Array.isArray(ctx.missingFields) && ctx.missingFields.length > 0;
}

export async function generateClarification(
  ctx: PipelineContext
): Promise<string> {
  const system = buildClarifySystemPrompt();
  const user   = buildClarifyUserPrompt(ctx);

  console.log('[generateClarification] ▶ Starting. missingFields =', ctx.missingFields);

  let raw = '';
  try {
    const gemini = new GeminiProvider();
    raw = await gemini.call(system, user, 'lightweight');
    console.log('[generateClarification] Gemini raw:', raw);
  } catch (geminiErr) {
    console.warn('[generateClarification] ⚠️ Gemini failed, trying Groq:', geminiErr);
    try {
      const groq = new GroqProvider();
      raw = await groq.call(system, user);
      console.log('[generateClarification] Groq raw:', raw);
    } catch (groqErr) {
      console.error('[generateClarification] ❌ Both providers failed:', groqErr);
      throw groqErr;
    }
  }

  const parsed = JSON.parse(raw);
  const question = parsed.question ?? 'Could you provide more details about the recipient?';
  console.log('[generateClarification] ✅ Question:', question);
  return question;
}
