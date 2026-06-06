// Tier 3 — premium model
// Full draft generation using the enriched PipelineContext

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildDraftSystemPrompt, buildDraftUserPrompt } from '../prompts';
import type { PipelineContext, AIOutput } from '../types';
import type { LetterDraft } from '../../types/document';

// ─── Normalizer ─────────────────────────────────────────────────────────────
// Safety net: AI may still return the old flat shape or use "body" instead of
// "blocks". This normalizes both shapes into the canonical LetterDraft shape.
function normalizeDraft(raw: any): LetterDraft {
  const envelope = raw.envelope ?? {};

  // Normalize "body" -> "blocks"
  const blocks = raw.blocks ?? raw.body ?? [];

  // Normalize flat recipient fields -> nested recipient object
  if (!envelope.recipient && (envelope.recipientName || envelope.recipientAddress)) {
    envelope.recipient = {
      name:    envelope.recipientName    ?? undefined,
      address: envelope.recipientAddress ?? undefined,
    };
    delete envelope.recipientName;
    delete envelope.recipientAddress;
  }

  // Normalize flat signatory fields -> nested signatory object
  if (!envelope.signatory && (envelope.signatoryName || envelope.signatoryDesignation)) {
    envelope.signatory = {
      name:        envelope.signatoryName        ?? 'UPPALAPATI SUREKHA',
      designation: envelope.signatoryDesignation ?? 'Proprietor',
    };
    delete envelope.signatoryName;
    delete envelope.signatoryDesignation;
  }

  // Ensure signatory always has a value
  if (!envelope.signatory) {
    envelope.signatory = { name: 'UPPALAPATI SUREKHA', designation: 'Proprietor' };
  }

  return { envelope, blocks };
}

// ─── Main task ─────────────────────────────────────────────────────────────
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
    const gemini  = new GeminiProvider();
    const rawText = await gemini.call(system, user, 'premium');

    console.log('[generateDraft] Gemini raw length:', rawText.length);
    console.log('[generateDraft] Gemini raw (first 600):', rawText.slice(0, 600));

    const parsed   = JSON.parse(rawText);
    const draft    = normalizeDraft(parsed);

    console.log('[generateDraft] After normalize — blocks count:', draft.blocks?.length);
    console.log('[generateDraft] After normalize — block types:', draft.blocks?.map((b: any) => b.type));
    console.log('[generateDraft] After normalize — recipient:', draft.envelope.recipient);
    console.log('[generateDraft] After normalize — signatory:', draft.envelope.signatory);
    console.log('[generateDraft] After normalize — date:', draft.envelope.date);

    if (!draft.envelope || !draft.blocks?.length) {
      console.error('[generateDraft] ❌ Invalid shape after normalize:', draft);
      throw new Error('Invalid shape after normalize');
    }

    console.log('[generateDraft] ✅ Gemini success.');
    return { draft, provider: 'gemini' };
  } catch (geminiErr) {
    console.warn('[generateDraft] ⚠️ Gemini premium failed, falling back to Groq:', geminiErr);
  }

  // ─ Groq fallback
  try {
    console.log('[generateDraft] Calling Groq fallback...');
    const groq    = new GroqProvider();
    const rawText = await groq.call(system, user, true) as string;
    const parsed  = JSON.parse(rawText);
    const draft   = normalizeDraft(parsed);

    console.log('[generateDraft] Groq — blocks count:', draft.blocks?.length);

    if (!draft.envelope || !draft.blocks?.length) {
      console.error('[generateDraft] ❌ Groq invalid shape after normalize:', draft);
      throw new Error('Groq invalid shape');
    }

    console.log('[generateDraft] ✅ Groq success.');
    return { draft, provider: 'groq' };
  } catch (groqErr) {
    console.error('[generateDraft] ❌ Groq also failed:', groqErr);
    throw groqErr;
  }
}
