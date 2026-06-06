import type { ContentBlock } from '../types/document'

// ─── Page geometry — measured from actual component source ───────────────────────
//
// A4 = 841.89pt
// Header.tsx: paddingTop(16) + logo(80) + paddingBottom(12) + rule(0.75) = 108.75pt
// LetterheadFirstPage contentArea: marginTop(20) + marginBottom(65)
// Footer + Signatory are position:absolute — consume ZERO content flow space
//
// PAGE_BODY_HEIGHT = 841.89 - 108.75 - 20 - 65 = 648.14pt

const A4_HEIGHT             = 841.89
const HEADER_HEIGHT         = 108.75
const CONTENT_MARGIN_TOP    = 20
const CONTENT_MARGIN_BOTTOM = 65
const PAGE_BODY_HEIGHT = A4_HEIGHT - HEADER_HEIGHT - CONTENT_MARGIN_TOP - CONTENT_MARGIN_BOTTOM
// = 648.14pt

// Effective chars per line at Montserrat 10pt on a 523pt-wide content area.
// Raw math gives ~73 chars, but word-boundary wrapping wastes ~8 chars per
// line on average. Calibrated against real PDF output: 65 chars/line.
const CHARS_PER_LINE = 65

// Widow threshold: if estimated last-page fill < 60%, attempt compaction.
//
// WHY 60% and not a lower value:
//   Our line-count estimator has a systematic upward bias of ~30 percentage
//   points on dense letters (many paragraphs + bullet lists). A letter whose
//   last page is genuinely ~10% full (a real widow — 3 closing lines) will be
//   estimated at ~40%. Setting the threshold at 60% ensures these real widows
//   are always caught regardless of estimation error.
//
//   Setting it higher than 60% is safe because the IMPOSSIBILITY GUARD (Step 3)
//   independently prevents wrong compression: it only compacts if the body can
//   actually fit at MIN_SCALE. So false positives from a high threshold are
//   harmless — they just trigger the guard and return scale=1.0.
const WIDOW_THRESHOLD  = 0.60

// Never compress spacing below 75% to preserve readability.
// If the target cannot be reached at this scale, we accept the extra page
// rather than over-squishing content.
const MIN_SCALE        = 0.75
const SEARCH_ITERATIONS = 16

// ─── Block height estimators ──────────────────────────────────────────────────
// Mirror BodyRenderer BASE constants exactly.
// Only spacing values scale with `scale`; font sizes stay constant.

function linesFor(text: string): number {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_LINE))
}

function estimateParagraphHeight(text: string, scale: number): number {
  return linesFor(text) * 10 * 1.6 * scale + 6 * scale
}

function estimateHeadingHeight(level: 1 | 2, scale: number): number {
  if (level === 1) return (12 * 1.4 + 14) * scale  // fontSize(12)*lineHeight + marginTop(8)+marginBottom(6)
  return (10.5 * 1.4 + 10) * scale                 // fontSize(10.5)*lineHeight + marginTop(6)+marginBottom(4)
}

function estimateListHeight(items: string[], scale: number): number {
  // Each item: fontSize(10) * lineHeight(1.5) * lines + marginBottom(3)
  return items.reduce((sum, item) => sum + linesFor(item) * 10 * 1.5 * scale + 3 * scale, 0)
}

function estimateTableHeight(rows: string[][], scale: number): number {
  // Header row + data rows at 19pt each (cell padding doesn't scale)
  // marginVertical(8) * 2 scales
  return (1 + rows.length) * 19 + 16 * scale
}

function estimateSpacerHeight(size: 'sm' | 'md' | 'lg' | undefined, scale: number): number {
  const MAP: Record<string, number> = { sm: 4, md: 8, lg: 16 }
  return (MAP[size ?? 'md'] ?? 8) * scale
}

function estimateDividerHeight(scale: number): number {
  return 16 * scale + 0.5  // marginVertical(8)*2 + border
}

export function estimateTotalHeight(blocks: ContentBlock[], scale: number): number {
  let total = 0
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':     total += estimateParagraphHeight(block.text, scale); break
      case 'heading':       total += estimateHeadingHeight(block.level ?? 1, scale); break
      case 'bullet_list':
      case 'numbered_list': total += estimateListHeight(block.items, scale); break
      case 'table':         total += estimateTableHeight(block.rows, scale); break
      case 'spacer':        total += estimateSpacerHeight(block.size, scale); break
      case 'divider':       total += estimateDividerHeight(scale); break
    }
  }
  return total
}

// ─── Page fill calculator ────────────────────────────────────────────────────────

function pagesAndLastFill(totalHeight: number): { pages: number; lastFill: number } {
  if (totalHeight <= PAGE_BODY_HEIGHT) {
    return { pages: 1, lastFill: totalHeight / PAGE_BODY_HEIGHT }
  }
  const overflow   = totalHeight - PAGE_BODY_HEIGHT
  const extraPages = Math.ceil(overflow / PAGE_BODY_HEIGHT)
  const lastUsed   = overflow - (extraPages - 1) * PAGE_BODY_HEIGHT
  return { pages: 1 + extraPages, lastFill: lastUsed / PAGE_BODY_HEIGHT }
}

// ─── Public interface ───────────────────────────────────────────────────────────────

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

  // Step 3: widow detected — check if compaction is even achievable.
  // ⚠️ IMPOSSIBILITY GUARD: if body at MIN_SCALE still can't fit the target,
  // the letter genuinely needs N pages. Return scale=1.0 — do NOT compress.
  const targetPages     = naturalPages - 1
  const maxTotalTarget  = targetPages * PAGE_BODY_HEIGHT
  const maxBodyTarget   = maxTotalTarget - envelopeHeight

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
