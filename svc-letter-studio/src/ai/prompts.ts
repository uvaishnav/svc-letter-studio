import type { AIInput } from './types';
import type { PipelineContext } from './types';
import type { ImproveBlockInput } from './tasks/improveBlock';

export function todayDateString(): string {
  return new Date().toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  });
}

function svcContext(): string {
  return `You are a professional business letter drafting assistant for Sri Vaishnav Constructions, a construction company based in Hyderabad, India.
The company deals in residential and commercial construction projects, and also provides tipper vehicle services.
The proprietor is UPPALAPATI SUREKHA.
Today's date is ${todayDateString()}. Use this as the document date unless the user explicitly specifies a different date.
Always maintain a formal, professional tone appropriate for Indian business correspondence.`;
}

// ─── TASK 1: Intent classification (Tier 1 — lightweight) ─────────────────────
export function buildClassifySystemPrompt(): string {
  return `${svcContext()}

Your only task is to analyse a user's description of a document and return a JSON object identifying:
1. The document type
2. Any fields you can detect from the text
3. Critical fields that are missing

Document types: quotation | invoice | work_order | agreement | notice | appointment_letter | experience_letter | general_letter

Respond ONLY with a raw valid JSON object. No markdown, no code fences, no explanation.
{
  "documentType": "<one of the document types above>",
  "detectedFields": {
    "recipientName": "<if mentioned or null>",
    "recipientAddress": "<if mentioned or null>",
    "subject": "<if mentioned or null>",
    "date": "<if mentioned or null>",
    "refNumber": "<if mentioned or null>"
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
  return `${svcContext()}

You will be given a document request and a list of missing critical fields.
Your task: generate EXACTLY ONE natural, concise question in English to ask the user for the most important missing piece of information.
Do not ask multiple questions. Do not explain yourself.
Respond ONLY with a raw valid JSON object. No markdown, no code fences, no explanation.
{ "question": "<your single question>" }`;
}

export function buildClarifyUserPrompt(ctx: PipelineContext): string {
  return `Document type: ${ctx.documentType}
User's original request: "${ctx.rawInput}"
Missing fields: ${(ctx.missingFields ?? []).join(', ')}

Generate one clarifying question.`;
}

// ─── TASK 3: Full draft generation (Tier 3 — premium) ─────────────────────────
export function buildDraftSystemPrompt(): string {
  return `${svcContext()}

You are generating a complete formal business document for Sri Vaishnav Constructions.

You must return ONLY a raw valid JSON object matching this EXACT structure. No markdown, no code fences, no explanation.

{
  "envelope": {
    "documentType": "<string>",
    "date": "${todayDateString()}",
    "refNumber": "<string or null>",
    "subject": "<subject line string>",
    "recipient": {
      "name": "<recipient full name>",
      "designation": "<recipient designation or null>",
      "company": "<recipient company or null>",
      "address": "<recipient full address>"
    },
    "signatory": {
      "name": "UPPALAPATI SUREKHA",
      "designation": "Proprietor"
    }
  },
  "blocks": [
    { "type": "paragraph", "text": "<string>" },
    { "type": "heading", "level": 1, "text": "<string>" },
    { "type": "heading", "level": 2, "text": "<string>" },
    { "type": "bullet_list", "items": ["<string>", "<string>"] },
    { "type": "numbered_list", "items": ["<string>", "<string>"] },
    { "type": "table", "headers": ["<string>"], "rows": [["<string>"]] },
    { "type": "spacer" },
    { "type": "divider" }
  ]
}

Rules:
- The top-level body array key is "blocks" (not "body").
- blocks array MUST have at least 3 items. Never return an empty blocks array.
- Start with a formal salutation paragraph (e.g. "Respected Sir/Madam,").
- End with a closing paragraph (e.g. "Thanking you, Yours faithfully,").
- Use tables for equipment lists or pricing. Use bullet_list for enumerated points.
- The "date" field must be exactly: ${todayDateString()}`;
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

  parts.push(`\nToday's date is ${todayDateString()}. Use this as the document date.`);
  parts.push(`Generate the complete formal document JSON now. Return raw JSON only — no markdown fences. Use "blocks" (not "body") for the content array.`);
  return parts.join('\n');
}

// ─── TASK 4: Per-block improve (Tier 2 — standard) ────────────────────────────
const ACTION_INSTRUCTIONS: Record<string, string> = {
  shorten:  'Shorten this block. Keep all key information but make it more concise. Remove filler words.',
  expand:   'Expand this block with more detail and professional elaboration. Keep the same tone.',
  formal:   'Rewrite this block in a more formal, professional tone suitable for Indian business correspondence.',
  rewrite:  'Rewrite this block completely while preserving its meaning and intent.',
};

export function buildImproveBlockSystemPrompt(): string {
  return `${svcContext()}

You will be given a single content block from a business letter and an instruction to improve it.
Return ONLY a raw valid JSON object representing the improved block with the same "type" field.
Do NOT change the block type. Do NOT wrap in arrays. No markdown, no code fences, no explanation.

Block types and their fields:
- paragraph: { "type": "paragraph", "text": "<string>", "bold": <bool optional>, "indent": <bool optional> }
- heading:   { "type": "heading", "level": 1 or 2, "text": "<string>" }
- bullet_list: { "type": "bullet_list", "items": ["<string>"] }
- numbered_list: { "type": "numbered_list", "items": ["<string>"] }
- table: { "type": "table", "headers": ["<string>"], "rows": [["<string>"]] }`;
}

export function buildImproveBlockUserPrompt(input: ImproveBlockInput): string {
  const instruction = input.action === 'custom'
    ? (input.customInstruction ?? 'Improve this block.')
    : ACTION_INSTRUCTIONS[input.action];

  return `Instruction: ${instruction}

Current block:
${JSON.stringify(input.block, null, 2)}

Return the improved block as raw JSON only.`;
}

// ─── Legacy helpers ────────────────────────────────────────────────────────────
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
