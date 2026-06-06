// Tier 2 — standard model
// Improves a single ContentBlock given a user instruction.

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildImproveBlockSystemPrompt, buildImproveBlockUserPrompt } from '../prompts';
import type { ContentBlock } from '../../types/document';

export type ImproveAction = 'shorten' | 'expand' | 'formal' | 'rewrite' | 'custom';

export interface ImproveBlockInput {
  block: ContentBlock;
  action: ImproveAction;
  customInstruction?: string; // only for action === 'custom'
}

function parseBlock(raw: string): ContentBlock {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed.type) throw new Error('improveBlock: missing type in AI response');
  return parsed as ContentBlock;
}

export async function improveBlock(input: ImproveBlockInput): Promise<ContentBlock> {
  const system = buildImproveBlockSystemPrompt();
  const user   = buildImproveBlockUserPrompt(input);

  // Try Gemini standard (Tier 2)
  try {
    const gemini  = new GeminiProvider();
    const rawText = await gemini.call(system, user, 'standard');
    return parseBlock(rawText);
  } catch (geminiErr) {
    console.warn('[improveBlock] Gemini failed, falling back to Groq:', geminiErr);
  }

  // Groq fallback — call without returnDraft flag, returns plain string
  const groq    = new GroqProvider();
  const rawText = await groq.call(system, user);
  return parseBlock(rawText);
}
