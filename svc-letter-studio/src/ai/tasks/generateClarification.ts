// Tier 1 — lightweight model
// Generates exactly one clarifying question when critical fields are missing

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import {
  buildClarifySystemPrompt,
  buildClarifyUserPrompt,
} from '../prompts';
import type { PipelineContext } from '../types';

export async function generateClarification(
  ctx: PipelineContext
): Promise<string> {
  const system = buildClarifySystemPrompt();
  const user   = buildClarifyUserPrompt(ctx);

  let raw: string;

  try {
    const gemini = new GeminiProvider();
    raw = await gemini.call(system, user, 'lightweight');
  } catch {
    const groq = new GroqProvider();
    raw = await groq.call(system, user) as string;
  }

  const parsed = JSON.parse(raw);
  return parsed.question ?? 'Could you provide more details about the recipient?';
}

export function needsClarification(ctx: PipelineContext): boolean {
  return (ctx.missingFields?.length ?? 0) > 0;
}
