# Changelog

## Session 7 — 2026-06-06 (continued)

### Fixed
- `src/components/pdf/LetterheadFirstPage.tsx` — replaced `flex:1` with `maxHeight: 648.14` on `contentArea`
  - Root cause: `flex:1` was expanding the content container to fill all remaining page height after the header, giving content a taller box than expected. Content then flowed to the bottom of that expanded box — visually touching the footer gold line with no breathing gap.
  - Fix: `maxHeight: 648.14pt` (= 841.89 − 108.75 − 20 − 65) hard-caps the content area. Content can never overflow into the footer zone.
  - Added detailed geometry comment to file explaining every measurement.

### Redesigned
- `src/components/pdf/LetterheadContinuationPage.tsx` — complete rewrite
  - Removed: top bar (brand name + page label), `Footer` component import, Helvetica built-in fonts
  - New design: plain ivory page, watermark, `marginTop: 36pt`, `marginBottom: 48pt`, page number (`FONTS.body`, 8pt, `COLORS.brownMuted`) at `position: absolute, bottom: 18, right: 36`
  - Available content area: 757.89pt tall × 523.28pt wide
  - Geometry comment added to file

### Cleaned
- `src/components/pdf/LetterheadDocument.tsx` — removed dead `LetterheadContinuationPage` import

### Documentation Corrections (hallucination audit)
- `docs/progress.md` — removed false blockers from session 6:
  - Removed: “Page 2 has no header/branding — raw overflow page looks bare” (this is correct intended behaviour)
  - Removed: “LetterheadContinuationPage is not yet wired” (it is intentionally not wired — future-use component only)
  - Replaced with accurate description of current multi-page behaviour and real known inaccuracies
- `docs/decisions.md` — corrected D023:
  - Rewritten to accurately describe auto-overflow as the correct and final strategy
  - Documented `LetterheadContinuationPage` as future-use only; noted its font issue (now fixed)
  - Documented `SIGNATORY_HEIGHT * scale` inaccuracy in `useCompactLayout` (minor, non-critical)

### Verified from source (no code changes in audit phase)
- `Signatory.tsx` — confirmed flow layout, marginTop:24, correct
- `Footer.tsx` — confirmed `fixed` + `render` prop hides footer on page 2+, correct
- `Watermark.tsx` — confirmed `fixed` prop repeats watermark on all pages, correct
- `useCompactLayout.ts` — confirmed `PAGE_BODY_HEIGHT = 648.14pt` matches actual geometry exactly

### Next
- Build `src/pdf/partitionBlocks.ts` — smart block-level pagination with orphan/widow control
- Wire `LetterheadContinuationPage` into `LetterheadDocument` using partition output
- Remove `useCompactLayout` compression strategy (replaced by partition approach)

---

## Session 6 — 2026-06-06

### Fixed
- `src/components/pdf/Footer.tsx` — added `render={({ pageNumber }) => pageNumber > 1 ? null : <.../>}` to `fixed` View; footer now renders on page 1 only, invisible on all overflow pages
- `src/components/pdf/Signatory.tsx` — changed from `position: absolute, bottom: 0` to flow layout (`marginTop: 24, alignItems: flex-end`); signatory now renders after the last content block on whichever page the content ends
- `src/pdf/useCompactLayout.ts` — recalibrated constants from real component source:
  - `CHARS_PER_LINE`: 65 → 80 (actual geometry: 523pt content width ÷ ~6.5pt/char for Montserrat 10pt)
  - Added `SIGNATORY_HEIGHT = 92pt` to `estimateTotalHeight()` (signatory is now a flow element)
  - `WIDOW_THRESHOLD`: 0.60 → 0.50
  - Fixed comment accuracy throughout

### Decisions
- D016: Updated — Signatory now flow-positioned, not absolute (supersedes session 3 decision)
- D023: New — multi-page PDF layout strategy documented (later corrected in session 7)

---

## Session 5 — 2026-06-06

### Added
- `src/ai/types.ts` — `TaskTier` type (`lightweight | standard | premium`), `PipelineContext` interface
- `src/ai/models.ts` — `geminiUrl(tier)` and `geminiModelName(tier)` — single source of truth for tier → model mapping
- `src/ai/tasks/classifyIntent.ts` — Tier 1 task: classifies document type, extracts detected fields, identifies missing fields
- `src/ai/tasks/generateClarification.ts` — Tier 1 task: generates exactly one clarifying question when critical fields are missing
- `src/ai/tasks/generateDraft.ts` — Tier 3 task: generates full `LetterDraft` from enriched `PipelineContext`
- `src/screens/IntakeScreen.tsx` — full intake UI: freeform textarea → classify → optional clarification → generate → navigate to preview
  - Loading states per pipeline stage with stage message + tier badge
  - Error state with retry
  - Clarification step shows detected document type pill + AI question

### Changed
- `src/ai/types.ts` — added `TaskTier`, `PipelineContext` alongside existing `AIInput`, `AIOutput`, `AIProvider`
- `src/ai/prompts.ts` — replaced generic `buildSystemPrompt/buildUserPrompt` with task-specific builders
- `src/ai/gemini.ts` — added public `.call(system, user, tier)` method
- `src/ai/groq.ts` — added public `.call(system, user)` method
- `src/ai/adapter.ts` — added 3-stage pipeline orchestrators
- `src/store/sessionStore.ts` — added `pipelineCtx` field

### Decisions
- D022: Tiered AI model routing
- D020: Updated — prompts now task-specific

---

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts`, `src/components/pdf/BodyRenderer.tsx`, `src/store/sessionStore.ts` update
- `src/components/pdf/LetterheadDocument.tsx` wired to `LetterDraft`
- `src/screens/PreviewScreen.tsx` wired to new session shape
- `src/ai/types.ts`, `src/ai/prompts.ts`, `src/ai/gemini.ts`, `src/ai/groq.ts`, `src/ai/adapter.ts`
- `.env.example`

### Fixed
- `src/constants/brand.ts` — missing `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

---

## Session 3 — 2026-06-05

### Changed
- Header, Footer redesigned; brand.ts updated; Playfair Display SC registered

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
