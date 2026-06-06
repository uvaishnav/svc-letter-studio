import type { AIInput, AIProvider } from './types';
import type { LetterDraft } from '../types/document';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export class GroqProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY ?? '';
    if (!this.apiKey) throw new Error('VITE_GROQ_API_KEY is not set');
  }

  async generateDraft(input: AIInput): Promise<LetterDraft> {
    return this.call(buildSystemPrompt(), buildUserPrompt(input));
  }

  // Generic text call — used by task modules as fallback
  async call(systemPrompt: string, userPrompt: string): Promise<string>;
  async call(systemPrompt: string, userPrompt: string, returnDraft: true): Promise<LetterDraft>;
  async call(systemPrompt: string, userPrompt: string, returnDraft?: boolean): Promise<string | LetterDraft> {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq error: ${res.status} — ${err}`);
    }

    const json = await res.json();
    const raw: string = json.choices?.[0]?.message?.content ?? '{}';

    if (!returnDraft) return raw;

    const parsed = JSON.parse(raw);
    if (!parsed.envelope || !parsed.body) throw new Error('Invalid draft shape from Groq');
    return parsed as LetterDraft;
  }
}
