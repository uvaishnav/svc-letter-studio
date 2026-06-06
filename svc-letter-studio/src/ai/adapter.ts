/**
 * AI Adapter — single entry point for all AI calls in the app.
 * Primary: Gemini Flash. Fallback: Groq llama-3.3-70b.
 * No component should import from gemini.ts or groq.ts directly.
 */
import type { AIInput, AIOutput } from './types';
import { GeminiProvider } from './gemini';
import { GroqProvider } from './groq';

export type { AIInput, AIOutput } from './types';

export async function generateDraft(input: AIInput): Promise<AIOutput> {
  // --- Try Gemini first ---
  try {
    const gemini = new GeminiProvider();
    const draft = await gemini.generateDraft(input);
    return { draft, provider: 'gemini' };
  } catch (geminiError) {
    console.warn('[AI Adapter] Gemini failed, falling back to Groq:', geminiError);
  }

  // --- Fallback: Groq ---
  try {
    const groq = new GroqProvider();
    const draft = await groq.generateDraft(input);
    return { draft, provider: 'groq' };
  } catch (groqError) {
    console.error('[AI Adapter] Groq also failed:', groqError);
    throw new Error(
      'Both AI providers failed. Please check your API keys and internet connection.'
    );
  }
}
