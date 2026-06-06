import type { TaskTier } from './types';

// ─── Gemini model names per tier ──────────────────────────────────────────────
const GEMINI_MODELS: Record<TaskTier, string> = {
  lightweight: 'gemini-2.0-flash',
  standard:    'gemini-2.5-flash',
  premium:     'gemini-3.5-flash',
};

// ─── Base URL builder ─────────────────────────────────────────────────────────
export function geminiUrl(tier: TaskTier): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELS[tier]}:generateContent`;
}

export function geminiModelName(tier: TaskTier): string {
  return GEMINI_MODELS[tier];
}
