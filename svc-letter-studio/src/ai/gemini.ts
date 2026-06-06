import type { AIInput, AIProvider } from './types';
import type { LetterDraft } from '../types/document';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { geminiUrl } from './models';

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
    if (!this.apiKey) throw new Error('VITE_GEMINI_API_KEY is not set');
  }

  async generateDraft(input: AIInput): Promise<LetterDraft> {
    // Legacy path always uses premium tier
    return this._call(buildSystemPrompt(), buildUserPrompt(input), 'premium');
  }

  // Internal helper used by task modules
  async call(
    systemPrompt: string,
    userPrompt: string,
    tier: import('./types').TaskTier = 'premium'
  ): Promise<string> {
    const url = `${geminiUrl(tier)}?key=${this.apiKey}`;

    console.log(`[Gemini] ▶ call() tier=${tier}`);
    console.log(`[Gemini] system prompt (${systemPrompt.length} chars):`, systemPrompt.slice(0, 300));
    console.log(`[Gemini] user prompt (${userPrompt.length} chars):`, userPrompt.slice(0, 300));

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: tier === 'premium' ? 8192 : 2048,
        temperature: tier === 'lightweight' ? 0.1 : 0.7,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Gemini] ❌ HTTP ${res.status} for tier=${tier}:`, err);
      throw new Error(`Gemini ${tier} error: ${res.status} — ${err}`);
    }

    const json = await res.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    console.log(`[Gemini] ✅ raw response (${raw.length} chars):`, raw.slice(0, 500));

    // Strip markdown code fences defensively (even though responseMimeType is set)
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();

    if (cleaned !== raw) {
      console.warn('[Gemini] ⚠️ Markdown fences were present in response — stripped successfully');
    }

    return cleaned;
  }

  private async _call(
    systemPrompt: string,
    userPrompt: string,
    tier: import('./types').TaskTier
  ): Promise<LetterDraft> {
    const raw = await this.call(systemPrompt, userPrompt, tier);
    console.log('[Gemini._call] Attempting JSON.parse...');
    const parsed = JSON.parse(raw);
    if (!parsed.envelope || !parsed.body) {
      console.error('[Gemini._call] ❌ Invalid draft shape. parsed =', parsed);
      throw new Error('Invalid draft shape from Gemini');
    }
    console.log('[Gemini._call] ✅ Draft parsed. body blocks:', parsed.body?.length);
    return parsed as LetterDraft;
  }
}
