# Changelog

## Session 9 — 2026-06-06 (Phase 8)

### Changed
- `src/screens/PreviewScreen.tsx` — Phase 8 export polish
  - **Share sheet (iOS):** `⬆ Share` button calls `navigator.share({ files: [pdfFile] })` → native iOS share sheet (AirDrop, Save to Files, Mail, Print)
  - **Download fallback (desktop):** `⬇ Download` button triggers `<a download>` on browsers without Web Share API file support
  - **Print button:** new 🖨️ icon button in top bar. On iOS reuses share sheet (includes Print option). On desktop opens hidden iframe + `window.print()`
  - **`canShareFiles()` helper:** detects `navigator.canShare({ files })` support; button label and hint text adapt per device
  - **`shareOrDownload()` helper:** async, handles AbortError (user cancelled share) gracefully, falls back to anchor download
  - **`printPDF()` helper:** async, iOS path via share, desktop path via hidden iframe
  - **Loading states:** `sharing` and `printing` booleans disable buttons with `…` label during async ops
  - **Top bar layout:** `flex gap-2` row — Edit | Badge (flex-1 centered) | Print | Share/Download
  - **Hint text** below PDF adapts: iOS shows AirDrop/Files/Print hint; desktop shows Download/Print hint
  - **ProviderBadge** verified working — shown when `aiProvider` is non-null (D021 ✅)
  - **Filename** verified: `SVC-{docType}-{date}.pdf` pattern unchanged

---

## Session 8c — 2026-06-06

### Fixed
- `src/screens/IntakeScreen.tsx` — navigate target changed from `'preview'` → `'draft'` after generation (manual fix by user)

---

## Session 8b — 2026-06-06

### Fixed
- `src/screens/PreviewScreen.tsx`
  - Replaced `← Back` (went to intake) with `✏️ Edit` button — navigates to `'draft'` if draft exists, else `'intake'`
  - Preview ⇄ Draft toggle is now fully two-way
- `src/components/draft/BlockList.tsx` — complete redesign
  - **Was:** 2-line truncated text preview, tap to select only
  - **Now:** Full content visible for every block type, inline editing per block
- `src/screens/DraftScreen.tsx`
  - Passes `onUpdate` prop to `BlockList` for inline edits
  - Deselects block after AI improve completes
  - Added hint text: "Tap a block to select it for AI actions. Use ✎ inline to edit text directly."

### Changed — BlockList type-aware inline editors

| Block type | Visual rendering | Edit mechanism |
|---|---|---|
| `paragraph` | Full text, respects `bold` and `indent` | ✎ pencil icon → textarea, Save/Cancel |
| `heading` level 1 | Large bold text, bottom border | ✎ pencil icon → input |
| `heading` level 2 | Medium bold text | ✎ pencil icon → input |
| `bullet_list` | Rendered • items | Per-item ✎ edit + ✕ remove + `+ Add item` |
| `numbered_list` | Rendered 1. 2. items | Per-item ✎ edit + ✕ remove + `+ Add item` |
| `table` | HTML table, styled headers | Tap any cell to edit inline, blur/Enter to save + `+ Add row` |
| `spacer` | Dashed line with SPACER label | Not editable |
| `divider` | Gold solid line with DIVIDER label | Not editable |

---

## Session 8a — 2026-06-06

### Fixed
- `src/components/pdf/LetterheadDocument.tsx` — switched `partitionDebug()` → `partitionBlocks()`. Debug mode cleared.

### Added
- `src/ai/tasks/improveBlock.ts` — Tier 2 per-block AI improve task
- `src/ai/prompts.ts` — `buildImproveBlockSystemPrompt`, `buildImproveBlockUserPrompt`
- `src/ai/adapter.ts` — exports `improveBlock`, `ImproveBlockInput`, `ImproveAction`
- `src/store/sessionStore.ts` — `updateBlock(index, block)`, `updateEnvelope(partial)`
- `src/components/draft/EnvelopeFields.tsx`
- `src/components/draft/BlockList.tsx`
- `src/components/draft/BlockActionBar.tsx`
- `src/screens/DraftScreen.tsx`

### Changed
- `src/App.tsx` — wired DraftScreen, BottomNav hidden on draft screen

---

## Session 7 — 2026-06-06

### Fixed
- `src/components/pdf/LetterheadFirstPage.tsx` — `flex:1` → `maxHeight:648.14`

### Added
- `src/pdf/partitionBlocks.ts` — pure pagination function with 6-step pipeline

### Changed
- `src/components/pdf/LetterheadContinuationPage.tsx` — rebuilt
- `src/components/pdf/LetterheadDocument.tsx` — explicit multi-page via partitionBlocks

### Removed
- `src/pdf/useCompactLayout.ts`

---

## Session 6 — 2026-06-06
- Fixed Footer render prop, Signatory flow layout, useCompactLayout constants

## Session 5 — 2026-06-06
- Tiered AI routing (D022), Phase 5 intake pipeline

## Session 4 — 2026-06-06
- Phase 3: document schema; Phase 4: AI provider abstraction

## Session 3 — 2026-06-05
- Redesigned Header/Footer with Playfair Display SC, brand.ts constants

## Session 2 — 2026-06-04
- Buffer polyfill, font registration, export fix, mobile preview, ivory bleed

## Session 1 — 2026-06-03
- Phases 1 and 2 scaffolded
