import type { AIInput } from './types';
import type { PipelineContext } from './types';

// ─── Shared system context ────────────────────────────────────────────────────
const SVC_CONTEXT = `You are a professional business letter drafting assistant for Sri Vaishnav Constructions, a construction company based in Hyderabad, India.
The company deals in residential and commercial construction projects.
The proprietor is UPPALAPATI SUREKHA.
Always maintain a formal, professional tone appropriate for Indian business correspondence.`;

// ─── TASK 1: Intent classification (Tier 1 — lightweight) ────────────────────
export function buildClassifySystemPrompt(): string {
  return `${SVC_CONTEXT}

Your only task is to analyse a user's description of a document and return a JSON object identifying:
1. The document type
2. Any fields you can detect from the text
3. Critical fields that are missing

Document types: quotation | invoice | work_order | agreement | notice | appointment_letter | experience_letter | general_letter

Respond ONLY with valid JSON matching this schema:
{
  "documentType": "<one of the document types above>",
  "detectedFields": {
    "recipientName": "<if mentioned>",
    "recipientAddress": "<if mentioned>",
    "subject": "<if mentioned>",
    "date": "<if mentioned>",
    "refNumber": "<if mentioned>"
  },
  "missingFields": ["<list of critical missing fields for this document type>"]
}`;
}

export function buildClassifyUserPrompt(rawInput: string): string {
  return `Analyse this document request and return JSON:

"${rawInput}"`;
}

// ─── TASK 2: Clarification question generation (Tier 1 — lightweight) ─────────
export function buildClarifySystemPrompt(): string {
  return `${SVC_CONTEXT}

You will be given a document request and a list of missing critical fields.
Your task: generate EXACTLY ONE natural, concise question in English to ask the user for the most important missing piece of information.
Do not ask multiple questions. Do not explain yourself.
Respond ONLY with valid JSON:
{ "question": "<your single question>" }`;
}

export function buildClarifyUserPrompt(ctx: PipelineContext): string {
  return `Document type: ${ctx.documentType}
User's original request: "${ctx.rawInput}"
Missing fields: ${(ctx.missingFields ?? []).join(', ')}

Generate one clarifying question.`;
}

// ─── TASK 3: Full draft generation (Tier 3 — premium) ────────────────────────
export function buildDraftSystemPrompt(): string {
  return `${SVC_CONTEXT}

You are generating a complete formal business document for Sri Vaishnav Constructions.

You must return ONLY a valid JSON object with this exact structure:
{
  "envelope": {
    "documentType": "<type>",
    "date": "<DD MMMM YYYY>",
    "refNumber": "<ref or null>",
    "recipientName": "<name>",
    "recipientAddress": "<address>",
    "subject": "<subject line>",
    "signatoryName": "UPPALAPATI SUREKHA",
    "signatoryDesignation": "Proprietor"
  },
  "body": [
    // Array of ContentBlock objects. Use appropriate block types:
    // { "type": "paragraph", "text": "..." }
    // { "type": "heading", "level": 1, "text": "..." }
    // { "type": "heading", "level": 2, "text": "..." }
    // { "type": "bullet_list", "items": ["...", "..."] }
    // { "type": "numbered_list", "items": ["...", "..."] }
    // { "type": "table", "headers": ["..."], "rows": [["...", "..."]] }
    // { "type": "spacer" }
    // { "type": "divider" }
  ]
}

Choose block types that best match the document. Use tables for pricing/quantities. Use bullets for lists. Start with a formal salutation paragraph.`;
}

export function buildDraftUserPrompt(ctx: PipelineContext): string {
  const parts: string[] = [
    `Document type: ${ctx.documentType}`,
    `Original request: "${ctx.rawInput}"`,
  ];

  if (ctx.detectedFields && Object.keys(ctx.detectedFields).length > 0) {
    parts.push(`Detected fields: ${JSON.stringify(ctx.detectedFields, null, 2)}`);
  }

  if (ctx.clarificationQuestion && ctx.clarificationAnswer) {
    parts.push(`Additional context provided:`);
    parts.push(`Q: ${ctx.clarificationQuestion}`);
    parts.push(`A: ${ctx.clarificationAnswer}`);
  }

  parts.push(`\nGenerate the complete formal document JSON now.`);
  return parts.join('\n');
}

// ─── Legacy helpers (used by gemini.ts / groq.ts directly) ───────────────────
export function buildSystemPrompt(): string {
  return buildDraftSystemPrompt();
}

export function buildUserPrompt(input: AIInput): string {
  const ctx = {
    rawInput: input.userText,
    documentType: input.documentType,
    clarificationQuestion: input.clarifications ? Object.keys(input.clarifications)[0] : undefined,
    clarificationAnswer: input.clarifications ? Object.values(input.clarifications)[0] : undefined,
  };
  return buildDraftUserPrompt(ctx as any);
}
