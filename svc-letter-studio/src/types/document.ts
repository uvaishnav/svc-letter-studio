// ─── Document Types ───────────────────────────────────────────────────────────

export type DocumentType =
  | 'letter'
  | 'quotation'
  | 'notice'
  | 'work_order'
  | 'invoice'
  | 'site_report'
  | 'agreement'
  | 'other'

// ─── Content Blocks (free-form body) ─────────────────────────────────────────
// The AI assembles these in any order/combination it sees fit.
// The PDF renderer iterates and renders each block.

export type ParagraphBlock = {
  type: 'paragraph'
  text: string
  bold?: boolean
  indent?: boolean
}

export type HeadingBlock = {
  type: 'heading'
  text: string
  level?: 1 | 2   // 1 = larger section heading, 2 = sub-heading
}

export type BulletListBlock = {
  type: 'bullet_list'
  items: string[]
}

export type NumberedListBlock = {
  type: 'numbered_list'
  items: string[]
}

export type TableBlock = {
  type: 'table'
  headers: string[]
  rows: string[][]
}

export type SpacerBlock = {
  type: 'spacer'
  size?: 'sm' | 'md' | 'lg'   // sm=4pt, md=8pt, lg=16pt
}

export type DividerBlock = {
  type: 'divider'
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | BulletListBlock
  | NumberedListBlock
  | TableBlock
  | SpacerBlock
  | DividerBlock

// ─── Envelope (fixed layout fields) ──────────────────────────────────────────
// These map to specific positions on the letterhead (header, footer, signatory).
// Optional — AI fills what it can infer; user can override.

export interface Recipient {
  name?: string
  designation?: string
  company?: string
  address?: string
}

export interface SignatoryInfo {
  name: string
  designation: string
}

export interface DocumentEnvelope {
  documentType: DocumentType
  date?: string           // e.g. "06 June 2026"
  refNumber?: string      // e.g. "SVC/2026/001"
  subject?: string
  recipient?: Recipient
  signatory: SignatoryInfo
}

// ─── Full Draft ───────────────────────────────────────────────────────────────

export interface LetterDraft {
  envelope: DocumentEnvelope
  blocks: ContentBlock[]
}

// ─── Validation ───────────────────────────────────────────────────────────────
// Per-type required envelope fields. Used to prompt AI for missing info.

export const REQUIRED_ENVELOPE_FIELDS: Record<DocumentType, (keyof DocumentEnvelope)[]> = {
  letter:      ['documentType', 'date', 'subject'],
  quotation:   ['documentType', 'date', 'recipient', 'refNumber'],
  notice:      ['documentType', 'date', 'subject'],
  work_order:  ['documentType', 'date', 'recipient', 'refNumber'],
  invoice:     ['documentType', 'date', 'recipient', 'refNumber'],
  site_report: ['documentType', 'date', 'subject'],
  agreement:   ['documentType', 'date', 'recipient'],
  other:       ['documentType', 'date'],
}

export function getMissingFields(draft: LetterDraft): string[] {
  const required = REQUIRED_ENVELOPE_FIELDS[draft.envelope.documentType]
  return required.filter(field => {
    const val = draft.envelope[field]
    if (val === undefined || val === null) return true
    if (typeof val === 'string' && val.trim() === '') return true
    return false
  }) as string[]
}
