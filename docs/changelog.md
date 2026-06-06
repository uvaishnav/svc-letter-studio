# Changelog

## Session 7 — 2026-06-06 (pagination & layout)

### Added
- `src/pdf/partitionBlocks.ts` — pure pagination function: `partitionBlocks(blocks, envelopeHeight) → { page1, continuations[], totalPages }`
  - **Step 1:** Greedy fill — pack blocks into pages up to per-page height caps
  - **Step 2:** Signatory overflow — if last block + signatory (92pt) exceed cap, last block moves to new page
  - **Step 3a:** `keepWithNext` — lone heading at bottom of page always moves to next page (unconditional)
  - **Step 3b:** `sectionAffinity` — if page ends with [heading → para] and next page opens with list/table, move both to next page. **Guarded by 70% fill rule**: if the move would leave the source page below 70% of its cap, skip — prefer a small visual gap over a half-empty page
  - **Step 4:** Orphan check — if next page content < 55pt (~3 lines), move prev page’s last block forward
  - **Step 5:** Thin-page check — if last page visual (content + signatory) < 80pt, move another block forward
  - **Step 6:** Empty-page cleanup
  - `partitionDebug()` export — same as `partitionBlocks()` but logs every block height, cumulative height, overflow flags, fill%, and final page assignments to console
  - `MIN_FILL_RATIO = 0.70` — fill guard for sectionAffinity moves
  - Imports `CONT_CONTENT_MAX_HEIGHT` from `LetterheadContinuationPage.tsx` — single source of truth

### Changed
- `src/components/pdf/LetterheadFirstPage.tsx`
  - Replaced `flex:1` with `maxHeight: 648.14` on `contentArea`
  - Root cause of footer overlap: `flex:1` expanded container beyond intended 648.14pt
  - Added detailed geometry comment

- `src/components/pdf/LetterheadContinuationPage.tsx` — complete rewrite
  - Removed top bar, brand elements, Helvetica fonts
  - New design: plain ivory, watermark, `marginTop: 50pt` (increased from 36pt for deliberate breathing room), `marginBottom: 48pt`, page number at bottom-right
  - Exports `CONT_CONTENT_MAX_HEIGHT = 743.89pt` constant (imported by `partitionBlocks.ts`)
  - Available content: 743.89 × 523.28pt

- `src/components/pdf/LetterheadDocument.tsx` — rewritten
  - Calls `partitionBlocks()` / `partitionDebug()` to get page assignments
  - Renders explicit `LetterheadFirstPage` + N `LetterheadContinuationPage` elements
  - Signatory only on last page
  - `spacingScale` always 1.0 — no compression

### Deleted
- `src/pdf/useCompactLayout.ts` — removed entirely; replaced by partition approach

### Fixed (estimator corrections)
- Heading 1 height: `14+10+6=30pt` → `12+8+6=26pt` (matched to `BodyRenderer BASE`)
- List container: removed false `+4pt` padding (BodyRenderer `View` has no container padding)

---

## Session 7 — 2026-06-06 (layout audit, earlier in session)

### Fixed
- `src/components/pdf/LetterheadFirstPage.tsx` — `flex:1` → `maxHeight:648.14` (footer overlap root cause)

### Redesigned  
- `src/components/pdf/LetterheadContinuationPage.tsx` — plain ivory page, correct fonts, page number

### Documentation Corrections
- `docs/progress.md` — removed hallucinated blockers from session 6 log
- `docs/decisions.md` — corrected D023 to reflect auto-overflow was interim, partition is final

---

## Session 6 — 2026-06-06

### Fixed
- `src/components/pdf/Footer.tsx` — `render` prop hides footer on pages 2+
- `src/components/pdf/Signatory.tsx` — flow layout, `marginTop:24`; follows content to correct page
- `src/pdf/useCompactLayout.ts` — recalibrated `CHARS_PER_LINE` (65→80), added `SIGNATORY_HEIGHT=92pt`, adjusted `WIDOW_THRESHOLD` (0.60→0.50)

---

## Session 5 — 2026-06-06

### Added
- `src/ai/types.ts` — `TaskTier`, `PipelineContext`
- `src/ai/models.ts` — tier → model mapping
- `src/ai/tasks/classifyIntent.ts`, `generateClarification.ts`, `generateDraft.ts`
- `src/screens/IntakeScreen.tsx` — full pipeline UI

### Changed
- `src/ai/prompts.ts`, `gemini.ts`, `groq.ts`, `adapter.ts`, `sessionStore.ts` — tiered pipeline wiring

---

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts`, `src/components/pdf/BodyRenderer.tsx`, `src/store/sessionStore.ts` update
- `src/ai/types.ts`, `prompts.ts`, `gemini.ts`, `groq.ts`, `adapter.ts`, `.env.example`

### Fixed
- `src/constants/brand.ts` — missing `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

---

## Session 3 — 2026-06-05

### Changed
- Header, Footer redesigned; `brand.ts` updated; Playfair Display SC registered

### Removed
- Stamp container from Signatory

---

## Session 2 — 2026-06-04

### Fixed
- Buffer polyfill, font registration, export button, mobile preview, ivory bleed, PWA deprecation

### Changed
- Letterhead design: dark band → full ivory (D014)

---

## Session 1 — 2026-06-03

### Added
- Full project scaffold: React+Vite+TS, PWA, brand tokens, shell UI, PDF engine foundation
