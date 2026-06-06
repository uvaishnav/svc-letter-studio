import type { ContentBlock } from '../types/document'

// ─── Page geometry — measured from actual component source ───────────────────
//
// A4 = 841.89pt tall, 595.28pt wide
//
// LetterheadFirstPage (LetterheadFirstPage.tsx):
//   contentArea: marginLeft:36, marginRight:36, marginTop:20, marginBottom:65
//   → usable width  = 595.28 - 36 - 36 = 523.28pt
//   → usable height = depends on Header height
//
// Header (Header.tsx): paddingTop:16 + logo:80 + paddingBottom:12 + rule:0.75 = 108.75pt
//
// Footer (Footer.tsx): position:absolute fixed — react-pdf repeats it on every
//   page automatically. It does NOT consume content-area flow space on any page.
//   The contentArea marginBottom:65 already reserves space for the footer.
//
// Signatory (Signatory.tsx): NOW a flow element (marginTop:24 + signatureSpace:44
//   + marginBottom:5 + name:~10 + designation:~9 = ~92pt)
//   It IS included in body height estimates.
//
// PAGE_BODY_HEIGHT = 841.89 - 108.75 - 20 - 65 = 648.14pt

const A4_HEIGHT             = 841.89
const HEADER_HEIGHT         = 108.75   // measured from Header.tsx
const CONTENT_MARGIN_TOP    = 20       // contentArea marginTop
const CONTENT_MARGIN_BOTTOM = 65       // contentArea marginBottom (reserves footer space)
const PAGE_BODY_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - CONTENT_MARGIN_TOP - CONTENT_MARGIN_BOTTOM
// = 648.14pt

// Signatory height as a flow element:
//   marginTop(24) + signatureSpace(44) + marginBottom(5) + name(~10) + designation(~9) = ~92pt
const SIGNATORY_HEIGHT = 92

// Content width = 523.28pt. Montserrat 10pt averages ~6.5pt per char.
// Effective CPL = 523 / 6.5 ≈ 80. Validated against real PDF renders.
const CHARS_PER_LINE = 80

// Widow threshold: if estimated last-page fill < 50%, attempt compaction.
// The impossibility guard (Step 3) independently prevents wrong compression,
// so a higher threshold just means more letters get evaluated — harmless.
const WIDOW_THRESHOLD   = 0.50
const MIN_SCALE         = 0.75
const SEARCH_ITERATIONS = 16

// ─── Block height estimators ──────────────────────────────────────────────────
// These mirror BodyRenderer BASE constants exactly.
// lineHeight and marginBottom are the ONLY things that scale.
// Font sizes never change.

function linesFor(text: string): number {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_LINE))
}

function estimateParagraphHeight(text: string, scale: number): number {
  // fontSize(10) * lineHeight(1.6) * scale * lines + marginBottom(6) * scale
  return linesFor(text) * 10 * 1.6 * scale + 6 * scale
}

function estimateHeadingHeight(level: 1 | 2, scale: number): number {
  if (level === 1) {
    // fontSize(12) * lineHeight(~1.4implied) + marginTop(8)*sc + marginBottom(6)*sc
    return 12 * scale + (8 + 6) * scale
  }
  // fontSize(10.5) + marginTop(6)*sc + marginBottom(4)*sc
  return 10.5 * scale + (6 + 4) * scale
}

function estimateListHeight(items: string[], scale: number): number {
  // Each item: fontSize(10) * lineHeight(1.5) * scale * lines + marginBottom(3) * scale
  return items.reduce((sum, item) => sum + linesFor(item) * 10 * 1.5 * scale + 3 * scale, 0)
}

function estimateTableHeight(rows: string[][], scale: number): number {
  // Header row (padding:5 top+bottom = 10) + data rows (padding:5 top+bottom = 10)
  // Each row: fontSize(9) + padding(10) = ~19pt. marginVertical(8)*2 scales.
  return (1 + rows.length) * 19 + BASE_TABLE_MARGIN * 2 * scale
}
const BASE_TABLE_MARGIN = 8

function estimateSpacerHeight(size: 'sm' | 'md' | 'lg' | undefined, scale: number): number {
  const MAP: Record<string, number> = { sm: 4, md: 8, lg: 16 }
  return (MAP[size ?? 'md'] ?? 8) * scale
}

function estimateDividerHeight(scale: number): number {
  return BASE_TABLE_MARGIN * 2 * scale + 0.5
}

export function estimateTotalHeight(blocks: ContentBlock[], scale: number): number {
  let total = 0
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':     total += estimateParagraphHeight(block.text, scale); break
      case 'heading':       total += estimateHeadingHeight((block.level ?? 1) as 1|2, scale); break
      case 'bullet_list':
      case 'numbered_list': total += estimateListHeight(block.items, scale); break
      case 'table':         total += estimateTableHeight(block.rows, scale); break
      case 'spacer':        total += estimateSpacerHeight(block.size, scale); break
      case 'divider':       total += estimateDividerHeight(scale); break
    }
  }
  // Add signatory — it's now a flow element at the end of the body
  total += SIGNATORY_HEIGHT * scale
  return total
}

// ─── Page fill calculator ─────────────────────────────────────────────────────

function pagesAndLastFill(totalHeight: number): { pages: number; lastFill: number } {
  if (totalHeight <= PAGE_BODY_HEIGHT) {
    return { pages: 1, lastFill: totalHeight / PAGE_BODY_HEIGHT }
  }
  const overflow   = totalHeight - PAGE_BODY_HEIGHT
  const extraPages = Math.ceil(overflow / PAGE_BODY_HEIGHT)
  const lastUsed   = overflow - (extraPages - 1) * PAGE_BODY_HEIGHT
  return { pages: 1 + extraPages, lastFill: lastUsed / PAGE_BODY_HEIGHT }
}

// ─── Public interface ─────────────────────────────────────────────────────────

export interface CompactLayout {
  spacingScale: number
  estimatedPages: number
}

export function useCompactLayout(
  blocks: ContentBlock[],
  envelopeHeight: number
): CompactLayout {
  if (!blocks || blocks.length === 0) {
    return { spacingScale: 1, estimatedPages: 1 }
  }

  // Step 1: natural layout
  const bodyHeight  = estimateTotalHeight(blocks, 1)
  const totalHeight = envelopeHeight + bodyHeight
  const { pages: naturalPages, lastFill } = pagesAndLastFill(totalHeight)

  console.log(
    `[useCompactLayout] pageBody=${PAGE_BODY_HEIGHT.toFixed(1)}pt` +
    ` envelope=${envelopeHeight.toFixed(1)}pt` +
    ` body=${bodyHeight.toFixed(1)}pt` +
    ` total=${totalHeight.toFixed(1)}pt` +
    ` pages=${naturalPages}` +
    ` lastFill=${(lastFill * 100).toFixed(1)}%`
  )

  // Step 2: no widow — single page or last page is well-filled
  if (naturalPages === 1 || lastFill >= WIDOW_THRESHOLD) {
    console.log('[useCompactLayout] No widow — spacingScale=1.0')
    return { spacingScale: 1, estimatedPages: naturalPages }
  }

  // Step 3: widow detected — check if compaction is achievable.
  // ⚠️ IMPOSSIBILITY GUARD: if body at MIN_SCALE still can't fit, the letter
  // genuinely needs N pages. Return scale=1.0 — do NOT compress.
  const targetPages    = naturalPages - 1
  const maxTotalTarget = targetPages * PAGE_BODY_HEIGHT
  const maxBodyTarget  = maxTotalTarget - envelopeHeight

  const bodyAtMinScale = estimateTotalHeight(blocks, MIN_SCALE)
  if (bodyAtMinScale > maxBodyTarget) {
    console.log(
      `[useCompactLayout] Widow detected (lastFill=${(lastFill*100).toFixed(1)}%) but impossible to eliminate` +
      ` — bodyAtMinScale=${bodyAtMinScale.toFixed(1)}pt > maxBodyTarget=${maxBodyTarget.toFixed(1)}pt` +
      ` — keeping spacingScale=1.0`
    )
    return { spacingScale: 1, estimatedPages: naturalPages }
  }

  // Step 4: compaction is achievable — binary search for minimum scale
  console.log(
    `[useCompactLayout] Widow! lastFill=${(lastFill*100).toFixed(1)}% < ${(WIDOW_THRESHOLD*100)}%` +
    ` → targeting ${targetPages} page(s), maxBodyTarget=${maxBodyTarget.toFixed(1)}pt`
  )

  let lo = MIN_SCALE
  let hi = 1.0
  let foundScale = 1.0

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const mid = (lo + hi) / 2
    if (estimateTotalHeight(blocks, mid) <= maxBodyTarget) {
      foundScale = mid
      hi = mid
    } else {
      lo = mid
    }
  }

  const finalScale = Math.max(MIN_SCALE, foundScale)
  const { pages: finalPages } = pagesAndLastFill(envelopeHeight + estimateTotalHeight(blocks, finalScale))

  console.log(`[useCompactLayout] ✅ spacingScale=${finalScale.toFixed(3)} → estimatedPages=${finalPages}`)
  return { spacingScale: finalScale, estimatedPages: finalPages }
}
