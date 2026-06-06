import type { ContentBlock } from '../types/document'

// ─── Page geometry constants ──────────────────────────────────────────────────
// Page 1:  841.89 − 108.75 (header) − 20 (marginTop) − 65 (marginBottom) = 648.14pt
// Cont:    841.89 − 36 (marginTop)  − 48 (marginBottom)                  = 757.89pt
export const PAGE1_BODY_HEIGHT  = 648.14
export const CONT_BODY_HEIGHT   = 757.89
export const SIGNATORY_HEIGHT   = 92    // marginTop:24 + box:44 + name:10 + desig:9 + mb:5
export const CHARS_PER_LINE     = 80    // 523.28pt ÷ ~6.5pt/char at Montserrat 10pt

// ─── Orphan / thin-page thresholds ───────────────────────────────────────────
// ORPHAN_THRESHOLD: if content on the *next* page is less than this,
// the page opener looks like a dangling orphan — move a block forward.
// ~3 lines of body text: 3 × 10pt × 1.6 lineHeight + 6pt margin = 54pt → round to 55
const ORPHAN_THRESHOLD = 55

// MIN_PAGE_FILL: minimum visual height (content + signatory on last page)
// before we pull another block forward to make the page look intentional.
// ~5 lines: 5 × 10 × 1.6 + gap = 86pt → use 80 to be lenient
const MIN_PAGE_FILL = 80

// ─── Block height estimators ──────────────────────────────────────────────────
// These mirror BodyRenderer render dimensions as closely as possible.
// spacingScale is always 1.0 here — partition works on natural sizes.

function ceilDiv(a: number, b: number): number {
  return Math.ceil(a / b)
}

function linesFor(text: string): number {
  return Math.max(1, ceilDiv(text.length, CHARS_PER_LINE))
}

export function estimateBlockHeight(block: ContentBlock): number {
  switch (block.type) {
    case 'paragraph': {
      // fontSize:10, lineHeight:1.6, marginBottom:6
      return linesFor(block.text) * 10 * 1.6 + 6
    }
    case 'heading': {
      // level 1: fontSize:14, marginTop:10, marginBottom:6
      // level 2: fontSize:11, marginTop:6, marginBottom:4
      return block.level === 2 ? 10.5 + 6 + 4 : 14 + 10 + 6
    }
    case 'bullet_list':
    case 'numbered_list': {
      // Each item: fontSize:10, lineHeight:1.5, marginBottom:3
      return block.items.reduce(
        (sum, item) => sum + linesFor(item) * 10 * 1.5 + 3,
        0
      ) + 4  // list container paddingTop
    }
    case 'table': {
      // Row height ~19pt (padding:4 top+bot + fontSize:9 + gap), header row same
      // Table paddingVertical:8 top+bot = 16
      return (1 + block.rows.length) * 19 + 16
    }
    case 'spacer': {
      const sizes = { sm: 4, md: 8, lg: 16 } as const
      return sizes[block.size ?? 'md']
    }
    case 'divider': {
      // marginVertical:8 top+bot + line:0.5
      return 8 * 2 + 0.5
    }
    default:
      return 0
  }
}

// ─── Result type ──────────────────────────────────────────────────────────────

export interface PartitionResult {
  /** Blocks for LetterheadFirstPage (excludes envelope — caller renders that separately) */
  page1: ContentBlock[]
  /** Each element = blocks for one LetterheadContinuationPage */
  continuations: ContentBlock[][]  
  /** Total page count including page 1 */
  totalPages: number
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Partitions ContentBlock[] across pages with smart orphan/widow control.
 *
 * Rules applied in order:
 * 1. Greedy fill — pack blocks into pages up to each page's height cap.
 * 2. Signatory overflow — if the last block + signatory don't fit on the
 *    current last page, the last block spills to a new page.
 * 3. Orphan check — if the next page starts with < ORPHAN_THRESHOLD of
 *    content, move the previous page's last block forward.
 * 4. Thin-page check — if the last page visual height (content + signatory)
 *    is < MIN_PAGE_FILL, move another block forward.
 * 5. Empty-page cleanup — remove any pages made empty by moves.
 *
 * @param blocks       All ContentBlock[] from the draft
 * @param envelopeHeight  Estimated pt height of the envelope section on page 1
 */
export function partitionBlocks(
  blocks: ContentBlock[],
  envelopeHeight: number
): PartitionResult {
  if (blocks.length === 0) {
    return { page1: [], continuations: [], totalPages: 1 }
  }

  // ── Step 1: greedy fill ──────────────────────────────────────────────────
  const pages: ContentBlock[][] = []
  let current: ContentBlock[] = []
  let usedH = 0
  let cap = PAGE1_BODY_HEIGHT - envelopeHeight  // page 1 has envelope above content

  for (const block of blocks) {
    const bh = estimateBlockHeight(block)
    if (usedH + bh <= cap) {
      current.push(block)
      usedH += bh
    } else {
      pages.push(current)
      current = [block]
      usedH = bh
      cap = CONT_BODY_HEIGHT  // continuation pages have no envelope
    }
  }
  pages.push(current)

  // ── Step 2: signatory overflow ───────────────────────────────────────────
  // If the last block + signatory together exceed the last page's cap, move
  // the last block to a new continuation page.
  const lastCap = pages.length === 1
    ? PAGE1_BODY_HEIGHT - envelopeHeight
    : CONT_BODY_HEIGHT
  const lastContentH = pages[pages.length - 1].reduce(
    (s, b) => s + estimateBlockHeight(b), 0
  )
  if (lastContentH + SIGNATORY_HEIGHT > lastCap && pages[pages.length - 1].length > 0) {
    const overflow = pages[pages.length - 1].pop()!
    pages.push([overflow])
  }

  // ── Step 3 & 4: orphan + thin-page check ────────────────────────────────
  // Iterate until stable. Each pass may move a block from page[i] to page[i+1].
  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < pages.length - 1; i++) {
      if (pages[i].length === 0) continue

      const isNextLast = (i + 1 === pages.length - 1)
      const nextContentH = pages[i + 1].reduce((s, b) => s + estimateBlockHeight(b), 0)

      // Orphan: pure content on next page is a dangling sliver
      if (nextContentH < ORPHAN_THRESHOLD) {
        const moved = pages[i].pop()!
        pages[i + 1].unshift(moved)
        changed = true
        continue
      }

      // Thin last page: content + signatory looks sparse
      const visualH = nextContentH + (isNextLast ? SIGNATORY_HEIGHT : 0)
      if (visualH < MIN_PAGE_FILL) {
        const moved = pages[i].pop()!
        pages[i + 1].unshift(moved)
        changed = true
      }
    }
  }

  // ── Step 5: remove empty pages ───────────────────────────────────────────
  const nonEmpty = pages.filter(p => p.length > 0)
  // Guard: always at least 1 page
  const finalPages = nonEmpty.length > 0 ? nonEmpty : [[]]

  return {
    page1: finalPages[0],
    continuations: finalPages.slice(1),
    totalPages: finalPages.length,
  }
}
