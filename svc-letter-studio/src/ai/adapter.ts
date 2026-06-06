// ─── Adapter — the ONLY file components should import from ───────────────────
// Rule: Never import gemini.ts, groq.ts, or task files directly in components.

import { GeminiProvider } from './gemini';
import { GroqProvider }   from './groq';
import type { AIInput, AIOutput, PipelineContext } from './types';
import { classifyIntent, applyClassification } from './tasks/classifyIntent';
import { generateClarification, needsClarification } from './tasks/generateClarification';
import { generateDraftFromContext } from './tasks/generateDraft';

export type { AIInput, AIOutput, PipelineContext } from './types';

// ─── Legacy single-call path (kept for compatibility) ─────────────────────────
export async function generateDraft(input: AIInput): Promise<AIOutput> {
  try {
    const gemini = new GeminiProvider();
    const draft  = await gemini.generateDraft(input);
    return { draft, provider: 'gemini' };
  } catch {
    const groq  = new GroqProvider();
    const draft = await groq.generateDraft(input);
    return { draft, provider: 'groq' };
  }
}

// ─── Pipeline orchestrator ────────────────────────────────────────────────────
// Stage 1: classify intent          (Tier 1 — lightweight)
// Stage 2: clarification question   (Tier 1 — lightweight, only if needed)
// Stage 3: draft generation         (Tier 3 — premium)

export async function classifyPipeline(
  rawInput: string
): Promise<PipelineContext> {
  const result = await classifyIntent(rawInput);
  return applyClassification({ rawInput }, result);
}

export async function clarifyPipeline(
  ctx: PipelineContext
): Promise<{ ctx: PipelineContext; question: string | null }> {
  if (!needsClarification(ctx)) {
    return { ctx, question: null };
  }
  const question = await generateClarification(ctx);
  return { ctx: { ...ctx, clarificationQuestion: question }, question };
}

export async function draftPipeline(
  ctx: PipelineContext
): Promise<AIOutput> {
  return generateDraftFromContext(ctx);
}

export { needsClarification };
