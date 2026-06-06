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

  console.log('[generateDraft] ▶ Starting. documentType =', ctx.documentType);
  console.log('[generateDraft] clarificationQuestion =', ctx.clarificationQuestion);
  console.log('[generateDraft] clarificationAnswer =', ctx.clarificationAnswer);
  console.log('[generateDraft] detectedFields =', ctx.detectedFields);

  // ─ Try Gemini premium first
  try {
    console.log('[generateDraft] Calling Gemini premium...');
    const gemini = new GeminiProvider();
    const raw    = await gemini.call(system, user, 'premium');

    console.log('[generateDraft] Gemini raw response length:', raw.length);
    console.log('[generateDraft] Gemini raw (first 600 chars):', raw.slice(0, 600));

    const parsed: LetterDraft = JSON.parse(raw);

    if (!parsed.envelope || !parsed.body) {
      console.error('[generateDraft] ❌ Gemini returned invalid shape:', parsed);
      throw new Error('Invalid shape');
    }

    console.log('[generateDraft] ✅ Gemini success. envelope.date =', parsed.envelope.date);
    console.log('[generateDraft] body blocks count =', parsed.body.length);
    console.log('[generateDraft] body block types =', parsed.body.map((b: any) => b.type));

    return { draft: parsed, provider: 'gemini' };
  } catch (geminiErr) {
    console.warn('[generateDraft] ⚠️ Gemini premium failed, falling back to Groq:', geminiErr);
  }

  // ─ Groq fallback
  try {
    console.log('[generateDraft] Calling Groq fallback...');
    const groq  = new GroqProvider();
    const draft = await groq.call(system, user, true) as LetterDraft;

    if (!draft.envelope || !draft.body) {
      console.error('[generateDraft] ❌ Groq returned invalid shape:', draft);
      throw new Error('Groq invalid shape');
    }

    console.log('[generateDraft] ✅ Groq success. body blocks count =', draft.body.length);
    return { draft, provider: 'groq' };
  } catch (groqErr) {
    console.error('[generateDraft] ❌ Groq also failed:', groqErr);
    throw groqErr;
  }
}
