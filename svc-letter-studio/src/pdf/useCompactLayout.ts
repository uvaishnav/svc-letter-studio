import type { ContentBlock } from '../types/document'

// ─── Page geometry — measured from actual component source ───────────────────────
//
// A4 = 841.89pt tall
//
// Header (Header.tsx):
//   paddingTop(16) + logo height(80) + paddingBottom(12) + gold rule(0.75) = 108.75pt
//
// LetterheadFirstPage contentArea (LetterheadFirstPage.tsx):
//   marginTop: 20, marginBottom: 65  (65 leaves room for absolute-positioned Footer)
//
// Footer (Footer.tsx): position:absolute — does NOT consume content flow space.
// Signatory (Signatory.tsx): position:absolute — does NOT consume content flow space.
//
// Usable body height = 841.89 - 108.75(header) - 20(marginTop) - 65(marginBottom)
//                    = 648.14pt  ← this is the real number
//
// Previous code used 542pt (wrong by ~106pt) which caused lastFill to be
// reported as 33% when the actual visual fill was under 10%.

const A4_HEIGHT         = 841.89
const HEADER_HEIGHT     = 108.75   // paddingTop(16) + logo(80) + paddingBottom(12) + rule(0.75)
const CONTENT_MARGIN_TOP    = 20
const CONTENT_MARGIN_BOTTOM = 65   // reserved for absolute-positioned footer
const PAGE_BODY_HEIGHT  = A4_HEIGHT - HEADER_HEIGHT - CONTENT_MARGIN_TOP - CONTENT_MARGIN_BOTTOM
// = 648.14pt per page (both first and continuation pages share same geometry)

// Body text width = A4(595.28pt) - left margin(36) - right margin(36) = 523.28pt
// At Montserrat 10pt, average char width ~7.1pt => ~73 chars per line
const CHARS_PER_LINE = 73

// Widow threshold: if last page fill < 40%, attempt compaction.
// Raised from 30% → 40% because our estimation has ~10-15% variance,
// so we need a buffer to catch real widows reliably.
const WIDOW_THRESHOLD  = 0.40

// Never compress spacing below 75% to preserve readability
const MIN_SCALE        = 0.75
const SEARCH_ITERATIONS = 16

// ─── Block height estimators ──────────────────────────────────────────────────
// These mirror the BASE constants in BodyRenderer.tsx exactly.
// Only spacing values (lineHeight, marginBottom, marginTop) scale.
// Font sizes stay constant so these estimators stay accurate at any scale.

function estimateParagraphHeight(text: string, scale: number): number {
  const lines = Math.max(1, Math.ceil(text.length / CHARS_PER_LINE))
  const lineHeightPt = 10 * 1.6 * scale   // fontSize(10) * lineHeight(1.6) * scale
  const marginBottom = 6 * scale
  return lines * lineHeightPt + marginBottom
}

function estimateHeadingHeight(level: 1 | 2, scale: number): number {
  if (level === 1) {
    // fontSize(12) * 1.4 lineHeight + marginTop(8) + marginBottom(6), all scaled
    return 12 * 1.4 * scale + (8 + 6) * scale
  }
  // fontSize(10.5) * 1.4 + marginTop(6) + marginBottom(4)
  return 10.5 * 1.4 * scale + (6 + 4) * scale
}

function estimateListHeight(items: string[], scale: number): number {
  // Each item: fontSize(10) * lineHeight(1.5) + marginBottom(3), all scaled
  return items.length * (10 * 1.5 * scale + 3 * scale)
}

function estimateTableHeight(rows: string[][], scale: number): number {
  // Header row + data rows, each row ~19pt (padding 5*2 + fontSize 9)
  // marginVertical(8) * 2 for top+bottom, scaled
  const rowHeight = 19   // cell padding does not scale
  return (1 + rows.length) * rowHeight + 16 * scale
}

function estimateSpacerHeight(size: 'sm' | 'md' | 'lg' | undefined, scale: number): number {
  const MAP: Record<string, number> = { sm: 4, md: 8, lg: 16 }
  return MAP[size ?? 'md'] * scale
}

function estimateDividerHeight(scale: number): number {
  // marginVertical(8) * 2 + border(0.5)
  return 8 * 2 * scale + 0.5
}

export function estimateTotalHeight(blocks: ContentBlock[], scale: number): number {
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
        total += estimateTableHeight(block.rows, scale)
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

// ─── Page fill calculator ─────────────────────────────────────────────────────────

function pagesAndLastFill(totalHeight: number): { pages: number; lastFill: number } {
  if (totalHeight <= PAGE_BODY_HEIGHT) {
    return { pages: 1, lastFill: totalHeight / PAGE_BODY_HEIGHT }
  }
  const overflow   = totalHeight - PAGE_BODY_HEIGHT
  const extraPages = Math.ceil(overflow / PAGE_BODY_HEIGHT)
  const lastUsed   = overflow - (extraPages - 1) * PAGE_BODY_HEIGHT
  const lastFill   = lastUsed / PAGE_BODY_HEIGHT
  return { pages: 1 + extraPages, lastFill }
}

// ─── Public interface ───────────────────────────────────────────────────────────────

export interface CompactLayout {
  spacingScale: number    // 1.0 = normal; < 1.0 = compacted to eliminate widow
  estimatedPages: number
}

export function useCompactLayout(
  blocks: ContentBlock[],
  envelopeHeight: number
): CompactLayout {
  if (!blocks || blocks.length === 0) {
    return { spacingScale: 1, estimatedPages: 1 }
  }

  // Step 1: natural layout at scale=1
  const bodyHeight  = estimateTotalHeight(blocks, 1)
  const totalHeight = envelopeHeight + bodyHeight
  const { pages: naturalPages, lastFill } = pagesAndLastFill(totalHeight)

  console.log(
    `[useCompactLayout] pageBodyHeight=${PAGE_BODY_HEIGHT.toFixed(1)}pt` +
    ` envelopeHeight=${envelopeHeight.toFixed(1)}pt` +
    ` bodyHeight=${bodyHeight.toFixed(1)}pt` +
    ` totalHeight=${totalHeight.toFixed(1)}pt` +
    ` naturalPages=${naturalPages}` +
    ` lastFill=${(lastFill * 100).toFixed(1)}%`
  )

  // Step 2: no widow? return unchanged
  if (naturalPages === 1 || lastFill >= WIDOW_THRESHOLD) {
    console.log('[useCompactLayout] No widow detected — spacingScale=1')
    return { spacingScale: 1, estimatedPages: naturalPages }
  }

  // Step 3: widow detected — binary search for minimum scale that fits in N-1 pages
  const targetPages  = naturalPages - 1
  const targetHeight = targetPages * PAGE_BODY_HEIGHT
  const maxBodyTarget = targetHeight - envelopeHeight  // max body height allowed

  console.log(
    `[useCompactLayout] Widow! lastFill=${(lastFill * 100).toFixed(1)}% < ${(WIDOW_THRESHOLD * 100)}%` +
    ` → targeting ${targetPages} page(s), maxBodyTarget=${maxBodyTarget.toFixed(1)}pt`
  )

  let lo = MIN_SCALE
  let hi = 1.0
  let foundScale = 1.0

  for (let i = 0; i < SEARCH_ITERATIONS; i++) {
    const mid         = (lo + hi) / 2
    const scaledBody  = estimateTotalHeight(blocks, mid)
    if (scaledBody <= maxBodyTarget) {
      foundScale = mid
      hi = mid
    } else {
      lo = mid
    }
  }

  // If even MIN_SCALE cannot fit, accept it — don't go below MIN_SCALE
  const finalScale = Math.max(MIN_SCALE, foundScale)
  const { pages: finalPages } = pagesAndLastFill(envelopeHeight + estimateTotalHeight(blocks, finalScale))

  console.log(`[useCompactLayout] ✅ spacingScale=${finalScale.toFixed(3)} → estimatedPages=${finalPages}`)

  return { spacingScale: finalScale, estimatedPages: finalPages }
}
