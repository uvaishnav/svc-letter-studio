// Tier 3 — premium model
// Full draft generation using the enriched PipelineContext

import { GeminiProvider } from '../gemini';
import { GroqProvider } from '../groq';
import { buildDraftSystemPrompt, buildDraftUserPrompt } from '../prompts';
import type { PipelineContext, AIOutput } from '../types';
import type { LetterDraft } from '../../types/document';
import { DEFAULT_SIGNATORY } from '../../constants/defaults';

// ─── Normalizer ─────────────────────────────────────────────────────────────────────
// Safety net: AI may return old flat shape or use "body" instead of "blocks".
// Also handles Groq sometimes wrapping output in a top-level key.
function normalizeDraft(raw: any): LetterDraft {
  // Groq sometimes wraps: { "letter": { envelope, blocks } } or { "draft": {...} }
  // Unwrap if the top-level object has exactly one key and no "envelope" directly
  if (!raw.envelope && !raw.blocks && !raw.body) {
    const keys = Object.keys(raw);
    if (keys.length === 1) {
      raw = raw[keys[0]];
    }
  }

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
      name:        envelope.signatoryName        ?? DEFAULT_SIGNATORY.name,
      designation: envelope.signatoryDesignation ?? DEFAULT_SIGNATORY.designation,
    };
    delete envelope.signatoryName;
    delete envelope.signatoryDesignation;
  }

  // Ensure signatory always has a value
  if (!envelope.signatory) {
    envelope.signatory = { ...DEFAULT_SIGNATORY };
  }

  return { envelope, blocks };
}

// ─── Main task ──────────────────────────────────────────────────────────────────────
export async function generateDraftFromContext(
  ctx: PipelineContext
): Promise<AIOutput> {
  const system = buildDraftSystemPrompt();
  const user   = buildDraftUserPrompt(ctx);

  console.log('[generateDraft] ▶ Starting. documentType =', ctx.documentType);
  console.log('[generateDraft] clarificationAnswer =', ctx.clarificationAnswer);

  // ─ Try Gemini premium first
  try {
    console.log('[generateDraft] Calling Gemini premium...');
    const gemini  = new GeminiProvider();
    const rawText = await gemini.call(system, user, 'premium');

    console.log('[generateDraft] Gemini raw length:', rawText.length);

    const parsed = JSON.parse(rawText);
    const draft  = normalizeDraft(parsed);

    if (!draft.envelope || !draft.blocks?.length) {
      throw new Error('Invalid shape after normalize');
    }

    console.log('[generateDraft] ✅ Gemini success. blocks:', draft.blocks.length);
    return { draft, provider: 'gemini' };

  } catch (geminiErr) {
    console.warn('[generateDraft] ⚠️ Gemini premium failed, falling back to Groq:', geminiErr);
  }

  // ─ Groq fallback
  // IMPORTANT: call without the `true` flag — get raw string back, then parse
  // ourselves so normalizeDraft can handle shape differences.
  // Calling with `true` returns an already-parsed object; JSON.parse on an
  // object throws SyntaxError before normalizeDraft ever runs.
  try {
    console.log('[generateDraft] Calling Groq fallback...');
    const groq    = new GroqProvider();
    const rawText = await groq.call(system, user) as string;  // returns string
    console.log('[generateDraft] Groq raw (first 400):', rawText.slice(0, 400));

    const parsed = JSON.parse(rawText);
    const draft  = normalizeDraft(parsed);

    if (!draft.envelope || !draft.blocks?.length) {
      console.error('[generateDraft] ❌ Groq invalid shape after normalize:', draft);
      throw new Error('Groq: invalid draft shape after normalize');
    }

    console.log('[generateDraft] ✅ Groq success. blocks:', draft.blocks.length);
    return { draft, provider: 'groq' };

  } catch (groqErr) {
    console.error('[generateDraft] ❌ Groq also failed:', groqErr);
    throw new Error(
      `Draft generation failed on both Gemini and Groq. Last error: ${(groqErr as Error).message}`
    );
  }
}
