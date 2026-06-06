import type { ContentBlock } from '../types/document'
import { CONT_CONTENT_MAX_HEIGHT } from '../components/pdf/LetterheadContinuationPage'

// ─── Page geometry constants ──────────────────────────────────────────────────
// Page 1:  841.89 − 108.75 (header) − 20 (marginTop) − 65 (marginBottom) = 648.14pt
// Cont:    imported from LetterheadContinuationPage (843.89 - 50 - 48 = 743.89pt)
export const PAGE1_BODY_HEIGHT = 648.14
export const CONT_BODY_HEIGHT  = CONT_CONTENT_MAX_HEIGHT   // single source of truth
export const SIGNATORY_HEIGHT  = 92    // marginTop:24 + box:44 + name:10 + desig:9 + mb:5
export const CHARS_PER_LINE    = 80    // 523.28pt ÷ ~6.5pt/char at Montserrat 10pt

// ─── Thresholds ─────────────────────────────────────────────────────────────
const ORPHAN_THRESHOLD = 55    // ~3 body lines: 3×10×1.6+6 = 54pt
const MIN_PAGE_FILL    = 80    // ~5 lines visual minimum on last page

// MIN_FILL_RATIO: before any block move, the source page must retain at least
// this fraction of its cap. If the move would drop it below this, skip the
// move and let @react-pdf break the content naturally inside the block.
// Exception: a lone bare heading at bottom ALWAYS moves (unconditional).
const MIN_FILL_RATIO   = 0.70

// ─── Block height estimators ──────────────────────────────────────────────────
function ceilDiv(a: number, b: number): number { return Math.ceil(a / b) }
function linesFor(text: string): number { return Math.max(1, ceilDiv(text.length, CHARS_PER_LINE)) }

export function estimateBlockHeight(block: ContentBlock): number {
  switch (block.type) {
    case 'paragraph':
      return linesFor(block.text) * 10 * 1.6 + 6
    case 'heading':
      return block.level === 2 ? 10.5 + 6 + 4 : 12 + 8 + 6
    case 'bullet_list':
    case 'numbered_list':
      return block.items.reduce((s, item) => s + linesFor(item) * 10 * 1.5 + 3, 0)
    case 'table':
      return (1 + block.rows.length) * 19 + 16
    case 'spacer':
      return { sm: 4, md: 8, lg: 16 }[block.size ?? 'md']
    case 'divider':
      return 8 * 2 + 0.5
    default:
      return 0
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function isListBlock(b: ContentBlock): boolean {
  return b.type === 'bullet_list' || b.type === 'numbered_list' || b.type === 'table'
}

function pageCapAt(pageIndex: number, envelopeHeight: number): number {
  return pageIndex === 0 ? PAGE1_BODY_HEIGHT - envelopeHeight : CONT_BODY_HEIGHT
}

function contentHeight(page: ContentBlock[]): number {
  return page.reduce((s, b) => s + estimateBlockHeight(b), 0)
}

// Would moving `nBlocks` from the tail of `page` drop it below MIN_FILL_RATIO?
function wouldUnderflow(
  page: ContentBlock[],
  nBlocks: number,
  cap: number
): boolean {
  const heightToRemove = page.slice(-nBlocks).reduce((s, b) => s + estimateBlockHeight(b), 0)
  const remaining = contentHeight(page) - heightToRemove
  return remaining < cap * MIN_FILL_RATIO
}

// ─── Step 3a: keepWithNext ──────────────────────────────────────────────────
// A bare heading at the bottom of a page always moves to the next page.
// This is unconditional — a lone heading with nothing below it is always wrong.
// The 70% fill guard does NOT apply here.
function applyKeepWithNext(
  pages: ContentBlock[][],
  envelopeHeight: number
): void {
  for (let i = 0; i < pages.length - 1; i++) {
    if (pages[i].length === 0) continue
    const last = pages[i][pages[i].length - 1]
    if (last.type !== 'heading') continue

    pages[i + 1].unshift(pages[i].pop()!)

    // Edge case: two consecutive headings at bottom — move both
    if (pages[i].length > 0 && pages[i][pages[i].length - 1].type === 'heading') {
      pages[i + 1].unshift(pages[i].pop()!)
    }
  }
  void envelopeHeight  // reserved for future per-page cap checks
}

// ─── Step 3b: sectionAffinity ───────────────────────────────────────────────
// When a page ends with [heading → para] and the next page opens with a
// list or table (the section body), the section is visually split.
// Move both the heading and intro para to the next page to reunite the section.
//
// GUARDED by MIN_FILL_RATIO: if moving both blocks would leave the source page
// below 70% of its cap, skip the move. A 46pt gap at the bottom of an otherwise
// well-filled page is less noticeable than a 196pt blank gap.
function applySectionAffinity(
  pages: ContentBlock[][],
  envelopeHeight: number
): void {
  for (let i = 0; i < pages.length - 1; i++) {
    const pg   = pages[i]
    const next = pages[i + 1]
    if (pg.length < 2 || next.length === 0) continue

    const secondLast = pg[pg.length - 2]
    const last       = pg[pg.length - 1]
    const firstNext  = next[0]

    // Pattern: [..., heading, non-heading-non-list]  |  [list/table, ...]
    if (
      secondLast.type === 'heading' &&
      last.type !== 'heading' &&
      !isListBlock(last) &&
      isListBlock(firstNext)
    ) {
      const cap = pageCapAt(i, envelopeHeight)
      // 70% fill guard: moving 2 blocks (heading + intro) must leave page ≥ 70%
      if (wouldUnderflow(pg, 2, cap)) continue  // skip — page would look half-empty

      next.unshift(pg.pop()!)   // move intro para
      next.unshift(pg.pop()!)   // move heading
    }
  }
}

// ─── Result type ────────────────────────────────────────────────────────────
export interface PartitionResult {
  page1: ContentBlock[]
  continuations: ContentBlock[][]
  totalPages: number
}

// ─── Main function ────────────────────────────────────────────────────────────
export function partitionBlocks(
  blocks: ContentBlock[],
  envelopeHeight: number
): PartitionResult {
  if (blocks.length === 0) {
    return { page1: [], continuations: [], totalPages: 1 }
  }

  // ── Step 1: greedy fill ───────────────────────────────────────────
  const pages: ContentBlock[][] = []
  let current: ContentBlock[] = []
  let usedH = 0
  let cap = PAGE1_BODY_HEIGHT - envelopeHeight

  for (const block of blocks) {
    const bh = estimateBlockHeight(block)
    if (usedH + bh <= cap) {
      current.push(block)
      usedH += bh
    } else {
      pages.push(current)
      current = [block]
      usedH = bh
      cap = CONT_BODY_HEIGHT
    }
  }
  pages.push(current)

  // ── Step 2: signatory overflow ───────────────────────────────────
  const lastCap = pages.length === 1 ? PAGE1_BODY_HEIGHT - envelopeHeight : CONT_BODY_HEIGHT
  const lastH   = contentHeight(pages[pages.length - 1])
  if (lastH + SIGNATORY_HEIGHT > lastCap && pages[pages.length - 1].length > 0) {
    pages.push([pages[pages.length - 1].pop()!])
  }

  // ── Step 3a: keepWithNext — lone heading at bottom always moves (unconditional) ─
  applyKeepWithNext(pages, envelopeHeight)

  // ── Step 3b: sectionAffinity — heading+intro reunited with list (70% guarded) ──
  applySectionAffinity(pages, envelopeHeight)

  // ── Step 4 & 5: orphan + thin-page check ────────────────────────────
  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < pages.length - 1; i++) {
      if (pages[i].length === 0) continue
      const isNextLast = (i + 1 === pages.length - 1)
      const nextH      = contentHeight(pages[i + 1])

      if (nextH < ORPHAN_THRESHOLD) {
        pages[i + 1].unshift(pages[i].pop()!)
        changed = true
        continue
      }

      const visualH = nextH + (isNextLast ? SIGNATORY_HEIGHT : 0)
      if (visualH < MIN_PAGE_FILL) {
        pages[i + 1].unshift(pages[i].pop()!)
        changed = true
      }
    }
  }

  // ── Step 6: remove empty pages ───────────────────────────────────────
  const finalPages = pages.filter(p => p.length > 0)
  const result = finalPages.length > 0 ? finalPages : [[]]

  return {
    page1: result[0],
    continuations: result.slice(1),
    totalPages: result.length,
  }
}

// ─── Debug logger ────────────────────────────────────────────────────────────
export function partitionDebug(
  blocks: ContentBlock[],
  envelopeHeight: number
): PartitionResult {
  console.group('[partitionBlocks] DEBUG')
  console.log(`envelopeHeight: ${envelopeHeight.toFixed(1)}pt`)
  console.log(`page1 cap: ${(PAGE1_BODY_HEIGHT - envelopeHeight).toFixed(1)}pt  cont cap: ${CONT_BODY_HEIGHT}pt`)
  console.log(`ORPHAN_THRESHOLD: ${ORPHAN_THRESHOLD}pt  MIN_PAGE_FILL: ${MIN_PAGE_FILL}pt  MIN_FILL_RATIO: ${MIN_FILL_RATIO * 100}%`)
  console.log(`SIGNATORY_HEIGHT: ${SIGNATORY_HEIGHT}pt`)
  console.log('--- Block heights ---')
  let cumH = 0
  const p1cap = PAGE1_BODY_HEIGHT - envelopeHeight
  blocks.forEach((b, i) => {
    const h = estimateBlockHeight(b)
    cumH += h
    const label =
      b.type === 'paragraph'  ? `para(${b.text.length}ch)` :
      b.type === 'heading'    ? `heading${b.level}("${b.text.slice(0, 30)}")` :
      b.type === 'bullet_list' || b.type === 'numbered_list' ? `${b.type}(${b.items.length} items)` :
      b.type === 'table'      ? `table(${b.rows.length}rows×${b.headers.length}cols)` :
      b.type
    const over = cumH > p1cap ? ` ⚠️ OVER p1 cap by ${(cumH - p1cap).toFixed(1)}pt` : ''
    console.log(`  [${i}] ${label.padEnd(38)} h=${h.toFixed(1)}pt  cumH=${cumH.toFixed(1)}pt${over}`)
  })

  const result = partitionBlocks(blocks, envelopeHeight)

  console.log('--- Result ---')
  console.log(`Total pages: ${result.totalPages}`)
  ;[result.page1, ...result.continuations].forEach((pg, pi) => {
    const ch   = contentHeight(pg)
    const sig  = pi === result.totalPages - 1 ? SIGNATORY_HEIGHT : 0
    const c    = pageCapAt(pi, envelopeHeight)
    const fill = (ch / c * 100).toFixed(1)
    console.log(`  Page ${pi + 1}: ${pg.length} blocks, content=${ch.toFixed(1)}pt (${fill}% fill) + sig=${sig}pt / cap=${c.toFixed(1)}pt`)
    pg.forEach((b, bi) => {
      const lbl = b.type === 'paragraph' ? `para(${b.text.length}ch)` : b.type
      console.log(`    [${bi}] ${lbl}  h=${estimateBlockHeight(b).toFixed(1)}pt`)
    })
  })
  console.groupEnd()
  return result
}
