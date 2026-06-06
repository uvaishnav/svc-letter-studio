import type { ContentBlock } from '../types/document'

// ─── Page geometry (points) ───────────────────────────────────────────────────
// These values come directly from LetterheadFirstPage and LetterheadContinuationPage.
// Header and Footer are NEVER touched — only the content area between them changes.
const A4_HEIGHT       = 841.89  // A4 in points
const HEADER_HEIGHT   = 160     // Header component occupies ~160pt
const FOOTER_HEIGHT   = 55      // Footer component occupies ~55pt
const MARGIN_TOP      = 20      // contentArea marginTop
const MARGIN_BOTTOM   = 65      // contentArea marginBottom (accounts for footer gap)

const FIRST_PAGE_BODY  = A4_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
const CONTINUATION_BODY = A4_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM

// Threshold: if last page content < 30% of page body height, eliminate it
const WIDOW_THRESHOLD  = 0.30
// Min spacing scale — never compress below 72% to preserve readability
const MIN_SCALE        = 0.72
// How many binary-search iterations to find the right scale
const SEARCH_ITERATIONS = 12

// ─── Block height estimators (matches BodyRenderer style values exactly) ──────

function estimateParagraphHeight(text: string, scale = 1): number {
  // fontSize 10, lineHeight 1.6, ~65 chars per line at body width, marginBottom 6
  const CHARS_PER_LINE = 65
  const LINE_HEIGHT_PT = 10 * 1.6
  const lines = Math.max(1, Math.ceil(text.length / CHARS_PER_LINE))
  return lines * LINE_HEIGHT_PT * scale + 6 * scale
}

function estimateHeadingHeight(level: 1 | 2, scale = 1): number {
  // heading1: fontSize 12, marginBottom 6, marginTop 8  => ~26pt
  // heading2: fontSize 10.5, marginBottom 4, marginTop 6 => ~20pt
  if (level === 1) return (12 * 1.4 + 6 + 8) * scale
  return (10.5 * 1.4 + 4 + 6) * scale
}

function estimateListHeight(items: string[], scale = 1): number {
  // Each item: fontSize 10, lineHeight 1.5, marginBottom 3
  const ITEM_HEIGHT = 10 * 1.5 + 3
  return items.length * ITEM_HEIGHT * scale
}

function estimateTableHeight(headers: string[], rows: string[][], scale = 1): number {
  // Header row + data rows, each ~19pt; marginVertical 8
  const ROW_HEIGHT = 19
  return (1 + rows.length) * ROW_HEIGHT * scale + 16 * scale
}

function estimateSpacerHeight(size: 'sm' | 'md' | 'lg' | undefined, scale = 1): number {
  const MAP = { sm: 4, md: 8, lg: 16 }
  return (MAP[size ?? 'md']) * scale
}

function estimateDividerHeight(scale = 1): number {
  // marginVertical 8 top + 8 bottom + 0.5 border
  return 16.5 * scale
}

export function estimateTotalHeight(blocks: ContentBlock[], scale = 1): number {
  let total = 0
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        total += estimateParagraphHeight(block.text, scale)
        break
      case 'heading':
        total += estimateHeadingHeight(block.level ?? 1, scale)
        break
      case 'bullet_list':
      case 'numbered_list':
        total += estimateListHeight(block.items, scale)
        break
      case 'table':
        total += estimateTableHeight(block.headers, block.rows, scale)
        break
      case 'spacer':
        total += estimateSpacerHeight(block.size, scale)
        break
      case 'divider':
        total += estimateDividerHeight(scale)
        break
    }
  }
  return total
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export interface CompactLayout {
  spacingScale: number   // 1.0 = normal, < 1.0 = compacted
  estimatedPages: number
}

export function useCompactLayout(
  blocks: ContentBlock[],
  envelopeHeight: number   // caller estimates envelope section height
): CompactLayout {
  if (!blocks || blocks.length === 0) {
    return { spacingScale: 1, estimatedPages: 1 }
  }

  // ── Step 1: estimate total content height at scale=1
  const bodyHeight   = estimateTotalHeight(blocks, 1)
  const totalHeight  = envelopeHeight + bodyHeight

  // ── Step 2: calculate page count and last-page fill at scale=1
  const firstAvail   = FIRST_PAGE_BODY
  const contAvail    = CONTINUATION_BODY

  function pagesAndLastFill(h: number): { pages: number; lastFill: number } {
    if (h <= firstAvail) return { pages: 1, lastFill: h / firstAvail }
    const overflow   = h - firstAvail
    const extraPages = Math.ceil(overflow / contAvail)
    const lastUsed   = overflow - (extraPages - 1) * contAvail
    const lastFill   = lastUsed / contAvail
    return { pages: 1 + extraPages, lastFill }
  }

  const { pages: naturalPages, lastFill } = pagesAndLastFill(totalHeight)

  console.log(`[useCompactLayout] naturalPages=${naturalPages} lastFill=${(lastFill*100).toFixed(1)}%`)

  // ── Step 3: no widow? return scale=1 as-is
  if (naturalPages === 1 || lastFill >= WIDOW_THRESHOLD) {
    return { spacingScale: 1, estimatedPages: naturalPages }
  }

  // ── Step 4: widow detected — binary search for minimum scale that fits in N-1 pages
  const targetPages  = naturalPages - 1
  const targetHeight = targetPages === 1 ? firstAvail : firstAvail + (targetPages - 1) * contAvail

  console.log(`[useCompactLayout] Widow detected! Searching scale to fit in ${targetPages} page(s). Target height=${targetHeight.toFixed(1)}pt`)

  let lo = MIN_SCALE
  let hi = 1.0
  let foundScale = 1.0

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const mid = (lo + hi) / 2
    const scaledBody  = estimateTotalHeight(blocks, mid)
    const scaledTotal = envelopeHeight + scaledBody  // envelope never scales
    if (scaledTotal <= targetHeight) {
      foundScale = mid
      hi = mid
    } else {
      lo = mid
    }
  }

  // If even MIN_SCALE can't eliminate the widow, stay at MIN_SCALE rather than going below
  const finalScale = foundScale < MIN_SCALE ? MIN_SCALE : foundScale

  const { pages: finalPages } = pagesAndLastFill(envelopeHeight + estimateTotalHeight(blocks, finalScale))
  console.log(`[useCompactLayout] spacingScale=${finalScale.toFixed(3)} → estimatedPages=${finalPages}`)

  return { spacingScale: finalScale, estimatedPages: finalPages }
}
