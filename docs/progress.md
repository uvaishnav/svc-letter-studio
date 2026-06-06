# Progress

## Completed Phases

### Phase 1 — Foundation and Design System ✅
- React + Vite + TypeScript scaffold
- PWA setup (vite-plugin-pwa, manifest, icons)
- Brand tokens (CSS custom properties)
- Shell UI with BottomNav, screen routing in App.tsx
- Tailwind v4 wired

### Phase 2 — Letterhead PDF Engine ✅
- `@react-pdf/renderer` integrated
- `LetterheadDocument`, `LetterheadFirstPage`, `LetterheadContinuationPage` components
- `Header` — ivory bg, logo + Playfair Display SC brand name, gold dash ornaments, Montserrat tagline, full-width gold hairline rule
- `Footer` — ivory bg, gold hairline rule on top, phone | GSTIN | email row, address centered below; `fixed` + `render` prop shows on page 1 only
- `Watermark` — centred logo at 3.2% opacity, 220px; `fixed` so it appears on every page
- `Signatory` — flow-positioned (`marginTop:24`) after last content block on whichever page content ends
- `PreviewScreen` — single BlobProvider, inline `<object>` preview, download button
- Self-hosted font loading from `public/fonts/` via `src/pdf/fonts.ts`
- Buffer polyfill shim in `main.tsx`

#### Font files required in `public/fonts/` (see `docs/FONTS.md`)
- `PlayfairDisplaySC-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`, `PlayfairDisplay-Bold.ttf`
- `Montserrat-Regular.ttf`, `Montserrat-Italic.ttf`, `Montserrat-SemiBold.ttf`, `Montserrat-Bold.ttf`

### Phase 3 — Document Schema and Pipeline ✅
- `src/types/document.ts` — `DocumentType`, `ContentBlock` (7 types), `DocumentEnvelope`, `LetterDraft`
- `src/components/pdf/BodyRenderer.tsx` — renders any `ContentBlock[]` into PDF elements
- `src/store/sessionStore.ts` — `SessionState`, `createEmptyDraft()`, `useSessionStore()`
- `src/constants/brand.ts` — `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

### Phase 4 — AI Provider Abstraction ✅
- Gemini 3.5 Flash (primary) + Groq llama-3.3-70b-versatile (fallback)
- `src/ai/types.ts`, `prompts.ts`, `gemini.ts`, `groq.ts`, `adapter.ts`
- `.env.example` documents required env vars

### Phase 5 — AI Intake and Clarification ✅
- Tiered AI routing (D022): `src/ai/models.ts`, `src/ai/tasks/` (classifyIntent, generateClarification, generateDraft)
- `src/screens/IntakeScreen.tsx` — full pipeline UI with stage loading, clarification step, error handling
- `PipelineContext` in `sessionStore.ts`

### Phase 7 — Smart Pagination ✅
- **Root cause fixed:** `LetterheadFirstPage` `flex:1` → `maxHeight:648.14` (content was expanding into footer zone)
- **Continuation page rebuilt:** blank ivory, `marginTop:50pt`, `marginBottom:48pt`, watermark, page number bottom-right. Exports `CONT_CONTENT_MAX_HEIGHT` constant.
- **`src/pdf/partitionBlocks.ts`** — pure partition function with 6-step pipeline
- **`LetterheadDocument.tsx`** rewritten: calls `partitionBlocks()`, renders explicit pages, signatory on last page only
- **`useCompactLayout.ts`** deleted — no spacing compression, ever

### Phase 6 — Draft Output, AI Improve Actions, Manual Editing UI ✅
- **Blocker resolved:** `LetterheadDocument.tsx` switched from `partitionDebug()` → `partitionBlocks()`
- **`src/ai/tasks/improveBlock.ts`** — Tier 2 per-block AI improve (Shorten / Expand / Formal / Rewrite / Custom instruction)
- **`src/ai/prompts.ts`** — added `buildImproveBlockSystemPrompt` + `buildImproveBlockUserPrompt`
- **`src/ai/adapter.ts`** — exports `improveBlock`, `ImproveBlockInput`, `ImproveAction`
- **`src/store/sessionStore.ts`** — added `updateBlock(index, block)` and `updateEnvelope(partial)` actions
- **`src/components/draft/EnvelopeFields.tsx`** — collapsible tap-to-edit panel (date, ref, subject, recipient)
- **`src/components/draft/BlockList.tsx`** — type-aware inline editors for all block types:
  - `paragraph` — full text + ✎ pencil → textarea
  - `heading` (level 1/2) — styled display + ✎ pencil → input
  - `bullet_list` / `numbered_list` — rendered items + per-item edit/remove + Add item
  - `table` — HTML table with tap-to-edit cells + Add row
  - `spacer` / `divider` — visual only, not editable
- **`src/components/draft/BlockActionBar.tsx`** — sticky bottom sheet: AI presets + Tell AI custom + manual edit modes
- **`src/screens/DraftScreen.tsx`** — full edit mode screen with hint text, error banner, Preview toggle
- **`src/screens/PreviewScreen.tsx`** — ✏️ Edit toggle button navigates back to DraftScreen
- **`src/App.tsx`** — wired `DraftScreen`, `updateBlock`, `updateEnvelope`; BottomNav hidden on draft screen

---

## Next Phase

### Phase 8 — Preview and Export Polish
- Download filename improvement (already done: `SVC-{docType}-{date}.pdf`)
- Share sheet on iOS (Web Share API)
- Print flow
- AI provider badge (D021 — already in PreviewScreen, verify it shows correctly)
- **Pending:** `IntakeScreen` currently navigates to `'preview'` after draft generation — change to `'draft'`

---

## Known Blockers / Open Issues

**`IntakeScreen` post-draft navigation:** After AI generates a draft, `IntakeScreen` calls `navigate('preview')`. This should be changed to `navigate('draft')` so users land in edit mode first. One-line fix in `src/screens/IntakeScreen.tsx`.

---

## Session Log

### Session 8b — 2026-06-06
- Fixed PreviewScreen: added ✏️ Edit toggle (back to DraftScreen)
- Redesigned BlockList: full content visible, type-aware inline editors for all block types
- Updated DraftScreen: passes onUpdate to BlockList, deselects after AI improve, hint text added

### Session 8a — 2026-06-06
- Cleared blocker: partitionDebug → partitionBlocks in LetterheadDocument.tsx
- Built Phase 6: DraftScreen, EnvelopeFields, BlockList, BlockActionBar
- Built improveBlock AI task (Tier 2 — Gemini standard + Groq fallback)
- Added updateBlock + updateEnvelope to sessionStore
- Wired DraftScreen into App.tsx
- Decided: edit/preview as two full-screen modes with toggle (D026)
- Decided: per-block AI improve (not whole-letter) (D027)

### Session 7 — 2026-06-06
- Audited all PDF source files; corrected hallucinations from session 6 progress notes
- Fixed `LetterheadFirstPage.tsx`: `flex:1` → `maxHeight:648.14` (root cause of footer overlap)
- Rebuilt `LetterheadContinuationPage.tsx`: clean ivory, correct fonts, `marginTop:50pt`, exports geometry constant
- Built `src/pdf/partitionBlocks.ts`: 6-step partition pipeline with orphan/widow/section-affinity control
- Added 70% fill guard to `sectionAffinity` rule: prefer small gap over half-empty page
- Rewrote `LetterheadDocument.tsx`: explicit multi-page rendering via partition output
- Deleted `src/pdf/useCompactLayout.ts`
- Updated D023, D024, D025 in decisions.md

### Session 6 — 2026-06-06
- Fixed `Footer` render prop, `Signatory` flow layout, `useCompactLayout` constants

### Session 5 — 2026-06-06
- Tiered AI routing (D022), Phase 5 intake pipeline

### Session 4 — 2026-06-06
- Phase 3 (document schema), Phase 4 (AI provider abstraction)

### Session 3 — 2026-06-05
- Redesigned Header/Footer, Playfair Display SC, brand.ts update

### Session 2 — 2026-06-04
- Buffer polyfill, font registration, export fix, mobile preview, ivory bleed

### Session 1 — 2026-06-03
- Phases 1 and 2 scaffolded
