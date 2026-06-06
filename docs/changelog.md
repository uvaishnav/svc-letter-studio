# Changelog

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

- AI action bar (BlockActionBar) still works independently — tap block card to select, bottom sheet slides up with Shorten/Expand/Formal/Rewrite/Tell AI

---

## Session 8a — 2026-06-06

### Fixed
- `src/components/pdf/LetterheadDocument.tsx` — switched `partitionDebug()` → `partitionBlocks()`. Debug mode cleared.

### Added
- `src/ai/tasks/improveBlock.ts` — Tier 2 per-block AI improve task
  - `ImproveAction`: `shorten | expand | formal | rewrite | custom`
  - Tries Gemini standard (`gemini-2.5-flash`), falls back to Groq
  - `parseBlock()` strips markdown fences defensively
- `src/ai/prompts.ts` — added:
  - `buildImproveBlockSystemPrompt()` — instructs AI to return same block type, no type changes
  - `buildImproveBlockUserPrompt(input)` — maps action to instruction string, injects current block JSON
  - `ACTION_INSTRUCTIONS` map for 4 preset actions
- `src/ai/adapter.ts` — exports `improveBlock`, `ImproveBlockInput`, `ImproveAction`
- `src/store/sessionStore.ts` — added:
  - `updateBlock(index, block)` — immutably replaces one block in draft.blocks[]
  - `updateEnvelope(partial)` — merges partial into draft.envelope
- `src/components/draft/EnvelopeFields.tsx`
  - Collapsible section (chevron toggle)
  - Fields: Date, Ref No., Subject, Recipient (Name / Designation / Company / Address)
  - Gold label style, ivory input background, 8px border-radius
- `src/components/draft/BlockList.tsx` (initial version, redesigned in 8b)
- `src/components/draft/BlockActionBar.tsx`
  - Fixed bottom sheet (position: fixed, bottom: 0)
  - 3 modes: `actions` (default), `edit` (manual text), `custom` (free AI instruction)
  - AI action row: ✂️ Shorten · 📝 Expand · 🎩 Formal · 🔄 Rewrite
  - Secondary row: ✨ Tell AI... · ✏️ Edit (text-editable blocks only)
  - Drag handle visual at top
  - Loading state disables all buttons
- `src/screens/DraftScreen.tsx`
  - Sticky dark-brown top bar: ← Intake, "✏️ Edit Draft" title, 👁 Preview button
  - Scrollable content: error banner, EnvelopeFields, block section header, AI loading indicator, BlockList
  - BlockActionBar mounts when a block is selected
  - `paddingBottom` grows when action bar is visible to prevent content clip
  - Empty state with Back to Intake button when no draft exists

### Changed
- `src/App.tsx`
  - Imports and renders `DraftScreen`
  - Passes `updateBlock` + `updateEnvelope` from `useSessionStore()`
  - `BottomNav` hidden on `draft` screen (in addition to `intake` and `preview`)

---

## Session 7 — 2026-06-06

### Fixed
- `src/components/pdf/LetterheadFirstPage.tsx` — `flex:1` → `maxHeight:648.14` on content area (root cause of footer overlap)

### Added
- `src/pdf/partitionBlocks.ts` — pure pagination function
  - Greedy fill with per-page height caps (648.14pt page 1, 743.89pt continuation)
  - Signatory overflow check
  - `keepWithNext` — unconditional lone-heading move
  - `sectionAffinity` — heading+intro reunite with section body (70% fill guard)
  - Orphan check (< 55pt), thin-page check (< 80pt), empty-page cleanup
  - Exports `partitionBlocks()` (production) and `partitionDebug()` (console logging)

### Changed
- `src/components/pdf/LetterheadContinuationPage.tsx` — rebuilt
  - Clean ivory, correct fonts, `marginTop:50pt`, `marginBottom:48pt`
  - Page number `position:absolute, bottom:18, right:36`
  - Exports `CONT_CONTENT_MAX_HEIGHT = 743.89` constant
- `src/components/pdf/LetterheadDocument.tsx` — rewritten
  - Calls `partitionBlocks()` to get page assignments
  - Renders explicit `LetterheadFirstPage` + N `LetterheadContinuationPage` elements
  - Signatory only on last page

### Removed
- `src/pdf/useCompactLayout.ts` — deleted (replaced by partitionBlocks approach)

---

## Session 6 — 2026-06-06
- Fixed Footer render prop
- Fixed Signatory flow layout
- Fixed useCompactLayout constants

## Session 5 — 2026-06-06
- Tiered AI routing (D022)
- Phase 5 intake pipeline with PipelineContext

## Session 4 — 2026-06-06
- Phase 3: document schema (document.ts, BodyRenderer)
- Phase 4: AI provider abstraction (gemini.ts, groq.ts, adapter.ts)

## Session 3 — 2026-06-05
- Redesigned Header/Footer with Playfair Display SC
- brand.ts constants

## Session 2 — 2026-06-04
- Buffer polyfill, font registration, export fix, mobile preview, ivory bleed

## Session 1 — 2026-06-03
- Phases 1 and 2 scaffolded
