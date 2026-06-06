// Tier 3 — premium model
// Full draft generation using the enriched PipelineContext

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildDraftSystemPrompt, buildDraftUserPrompt } from '../prompts';
import type { PipelineContext, AIOutput } from '../types';
import type { LetterDraft } from '../../types/document';

export async function generateDraftFromContext(
  ctx: PipelineContext
): Promise<AIOutput> {
  const system = buildDraftSystemPrompt();
  const user   = buildDraftUserPrompt(ctx);

  // Try Gemini premium first
  try {
    const gemini = new GeminiProvider();
    const raw    = await gemini.call(system, user, 'premium');
    const parsed: LetterDraft = JSON.parse(raw);
    if (!parsed.envelope || !parsed.body) throw new Error('Invalid shape');
    return { draft: parsed, provider: 'gemini' };
  } catch (geminiErr) {
    console.warn('[generateDraft] Gemini premium failed, falling back to Groq:', geminiErr);
  }

  // Groq fallback
  const groq = new GroqProvider();
  const draft = await groq.call(system, user, true) as LetterDraft;
  return { draft, provider: 'groq' };
}
