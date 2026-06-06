import type { ContentBlock } from '../types/document'

// ─── Page geometry constants ──────────────────────────────────────────────────
// Page 1:  841.89 − 108.75 (header) − 20 (marginTop) − 65 (marginBottom) = 648.14pt
// Cont:    841.89 − 36 (marginTop)  − 48 (marginBottom)                  = 757.89pt
export const PAGE1_BODY_HEIGHT = 648.14
export const CONT_BODY_HEIGHT  = 757.89
export const SIGNATORY_HEIGHT  = 92    // marginTop:24 + box:44 + name:10 + desig:9 + mb:5
export const CHARS_PER_LINE    = 80    // 523.28pt ÷ ~6.5pt/char at Montserrat 10pt

// ─── Orphan / thin-page thresholds ───────────────────────────────────────────
const ORPHAN_THRESHOLD = 55   // ~3 lines: 3×10×1.6+6 = 54pt
const MIN_PAGE_FILL    = 80   // ~5 lines visual minimum on last page

// ─── Block height estimators ──────────────────────────────────────────────────
// Values taken directly from BodyRenderer BASE constants.
// MUST stay in sync with BodyRenderer.tsx BASE object.

function ceilDiv(a: number, b: number): number { return Math.ceil(a / b) }
function linesFor(text: string): number { return Math.max(1, ceilDiv(text.length, CHARS_PER_LINE)) }

export function estimateBlockHeight(block: ContentBlock): number {
  switch (block.type) {
    case 'paragraph':
      // fontSize:10, lineHeight:1.6, marginBottom:6
      return linesFor(block.text) * 10 * 1.6 + 6

    case 'heading':
      // level 1: fontSize:12, marginTop:8,  marginBottom:6  → 26pt
      // level 2: fontSize:10.5, marginTop:6, marginBottom:4  → 20.5pt
      // Previously heading1 was calculated as 14+10+6=30pt (WRONG — used wrong fontSize+margins)
      return block.level === 2
        ? 10.5 + 6 + 4      // 20.5pt
        : 12   + 8 + 6      // 26pt

    case 'bullet_list':
    case 'numbered_list':
      // Each item: fontSize:10, lineHeight:1.5, marginBottom:3
      // No container paddingTop in BodyRenderer (View has no extra padding)
      return block.items.reduce(
        (sum, item) => sum + linesFor(item) * 10 * 1.5 + 3,
        0
      )

    case 'table':
      // Cell: padding:5 top+bot=10, fontSize:9 → row height = 19pt
      // marginVertical:8 top+bot = 16pt
      return (1 + block.rows.length) * 19 + 16

    case 'spacer':
      return { sm: 4, md: 8, lg: 16 }[block.size ?? 'md']

    case 'divider':
      // marginVertical:8 top+bot + line:0.5
      return 8 * 2 + 0.5

    default:
      return 0
  }
}

// ─── keepWithNext ────────────────────────────────────────────────────────────
// A heading stranded at the bottom of a page (with its body on the next page)
// looks broken. Rule: if the LAST block of a page is a heading, move it to
// the start of the next page so it always travels with its content.
function applyKeepWithNext(pages: ContentBlock[][]): void {
  for (let i = 0; i < pages.length - 1; i++) {
    if (pages[i].length === 0) continue
    const last = pages[i][pages[i].length - 1]
    if (last.type === 'heading') {
      pages[i].pop()
      pages[i + 1].unshift(last)
      // After moving, check if new last block is also a heading (edge case: two headings)
      if (pages[i].length > 0 && pages[i][pages[i].length - 1].type === 'heading') {
        const prev = pages[i].pop()!
        pages[i + 1].unshift(prev)
      }
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
  const lastContentH = pages[pages.length - 1].reduce((s, b) => s + estimateBlockHeight(b), 0)
  if (lastContentH + SIGNATORY_HEIGHT > lastCap && pages[pages.length - 1].length > 0) {
    const overflow = pages[pages.length - 1].pop()!
    pages.push([overflow])
  }

  // ── Step 3: keepWithNext — headings travel with the block that follows them ──
  applyKeepWithNext(pages)

  // ── Step 4 & 5: orphan + thin-page check ────────────────────────────
  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < pages.length - 1; i++) {
      if (pages[i].length === 0) continue
      const isNextLast = (i + 1 === pages.length - 1)
      const nextContentH = pages[i + 1].reduce((s, b) => s + estimateBlockHeight(b), 0)

      if (nextContentH < ORPHAN_THRESHOLD) {
        const moved = pages[i].pop()!
        pages[i + 1].unshift(moved)
        changed = true
        continue
      }

      const visualH = nextContentH + (isNextLast ? SIGNATORY_HEIGHT : 0)
      if (visualH < MIN_PAGE_FILL) {
        const moved = pages[i].pop()!
        pages[i + 1].unshift(moved)
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
// Call partitionDebug() in LetterheadDocument instead of partitionBlocks()
// to see detailed logs in the browser console. Remove when done.
export function partitionDebug(
  blocks: ContentBlock[],
  envelopeHeight: number
): PartitionResult {
  console.group('[partitionBlocks] DEBUG')
  console.log(`envelopeHeight: ${envelopeHeight.toFixed(1)}pt`)
  console.log(`page1 cap: ${(PAGE1_BODY_HEIGHT - envelopeHeight).toFixed(1)}pt  cont cap: ${CONT_BODY_HEIGHT}pt`)
  console.log(`ORPHAN_THRESHOLD: ${ORPHAN_THRESHOLD}pt  MIN_PAGE_FILL: ${MIN_PAGE_FILL}pt`)
  console.log(`SIGNATORY_HEIGHT: ${SIGNATORY_HEIGHT}pt`)
  console.log('--- Block heights ---')
  let cumH = 0
  const p1cap = PAGE1_BODY_HEIGHT - envelopeHeight
  blocks.forEach((b, i) => {
    const h = estimateBlockHeight(b)
    cumH += h
    const label = b.type === 'paragraph'
      ? `para(${b.text.length}ch)`
      : b.type === 'heading'
        ? `heading${b.level}("${b.text.slice(0, 30)}")`
        : b.type === 'bullet_list' || b.type === 'numbered_list'
          ? `${b.type}(${b.items.length} items)`
          : b.type === 'table'
            ? `table(${b.rows.length}rows×${b.headers.length}cols)`
            : b.type
    const overflow = cumH > p1cap ? ` ⚠️ OVER p1 cap by ${(cumH - p1cap).toFixed(1)}pt` : ''
    console.log(`  [${i}] ${label.padEnd(35)} h=${h.toFixed(1)}pt  cumH=${cumH.toFixed(1)}pt${overflow}`)
  })

  const result = partitionBlocks(blocks, envelopeHeight)

  console.log('--- Result ---')
  console.log(`Total pages: ${result.totalPages}`)
  const allPages = [result.page1, ...result.continuations]
  allPages.forEach((pageBlocks, pi) => {
    const contentH = pageBlocks.reduce((s, b) => s + estimateBlockHeight(b), 0)
    const sig = pi === allPages.length - 1 ? SIGNATORY_HEIGHT : 0
    const cap2 = pi === 0 ? PAGE1_BODY_HEIGHT - envelopeHeight : CONT_BODY_HEIGHT
    console.log(`  Page ${pi + 1}: ${pageBlocks.length} blocks, content=${contentH.toFixed(1)}pt + sig=${sig}pt = ${(contentH + sig).toFixed(1)}pt / cap=${cap2.toFixed(1)}pt`)
    pageBlocks.forEach((b, bi) => {
      const label = b.type === 'paragraph' ? `para(${b.text.length}ch)` : b.type
      console.log(`    [${bi}] ${label}  h=${estimateBlockHeight(b).toFixed(1)}pt`)
    })
  })
  console.groupEnd()
  return result
}
