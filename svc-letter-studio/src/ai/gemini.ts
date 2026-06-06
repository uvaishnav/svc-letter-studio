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
      throw new Error(`Gemini ${tier} error: ${res.status} — ${err}`);
    }

    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  }

  private async _call(
    systemPrompt: string,
    userPrompt: string,
    tier: import('./types').TaskTier
  ): Promise<LetterDraft> {
    const raw = await this.call(systemPrompt, userPrompt, tier);
    const parsed = JSON.parse(raw);
    if (!parsed.envelope || !parsed.body) throw new Error('Invalid draft shape from Gemini');
    return parsed as LetterDraft;
  }
}
