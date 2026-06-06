import type { AIInput, AIProvider } from './types';
import type { LetterDraft } from '../types/document';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!key) throw new Error('VITE_GEMINI_API_KEY is not set');
    this.apiKey = key;
  }

  async generateDraft(input: AIInput): Promise<LetterDraft> {
    const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: buildUserPrompt(input) }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) throw new Error('Gemini returned empty response');

    return JSON.parse(text) as LetterDraft;
  }
}
