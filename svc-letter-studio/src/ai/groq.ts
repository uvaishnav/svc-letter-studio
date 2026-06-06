import type { AIInput, AIProvider } from './types';
import type { LetterDraft } from '../types/document';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export class GroqProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    const key = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
    if (!key) throw new Error('VITE_GROQ_API_KEY is not set');
    this.apiKey = key;
  }

  async generateDraft(input: AIInput): Promise<LetterDraft> {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(input) },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text: string = data?.choices?.[0]?.message?.content ?? '';
    if (!text) throw new Error('Groq returned empty response');

    return JSON.parse(text) as LetterDraft;
  }
}
