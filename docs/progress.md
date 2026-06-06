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
- **`src/pdf/partitionBlocks.ts`** — pure partition function with 6-step pipeline:
  1. Greedy fill (height caps: 648.14pt page 1, 743.89pt continuation)
  2. Signatory overflow check
  3a. `keepWithNext` — lone heading always moves (unconditional)
  3b. `sectionAffinity` — heading+intro reunited with section body; **guarded by 70% fill rule** (if move drops source page below 70% of cap, skip — a small gap is less bad than a half-empty page)
  4. Orphan check (< 55pt)
  5. Thin-page check (< 80pt visual)
  6. Empty-page cleanup
- **`partitionDebug()`** export for console logging (currently active in `LetterheadDocument.tsx`)
- **`LetterheadDocument.tsx`** rewritten: calls partition, renders explicit pages, signatory on last page only
- **`useCompactLayout.ts`** deleted — no spacing compression, ever

---

## Next Phase

### Phase 6 — Draft Output, AI Improve Actions, Manual Editing UI
*(Phase 7 pagination was implemented before phase 6 to unblock real-output testing)*
- Show generated draft in an editable form
- AI improve actions: Shorten, Expand, Make Formal, Rewrite (Tier 2)
- Manual field editing (recipient, subject, date, ref)
- Full re-generation from context (Tier 3)

---

## Known Blockers / Open Issues

**Pagination debug mode is active.** `LetterheadDocument.tsx` currently calls `partitionDebug()` instead of `partitionBlocks()`. Switch back before Phase 6 build.

All other PDF layout issues resolved. No active blockers.

---

## Session Log

### Session 7 — 2026-06-06
- Audited all PDF source files; corrected hallucinations from session 6 progress notes
- Fixed `LetterheadFirstPage.tsx`: `flex:1` → `maxHeight:648.14` (root cause of footer overlap)
- Rebuilt `LetterheadContinuationPage.tsx`: clean ivory, correct fonts, `marginTop:50pt`, exports geometry constant
- Built `src/pdf/partitionBlocks.ts`: 6-step partition pipeline with orphan/widow/section-affinity control
- Added 70% fill guard to `sectionAffinity` rule: prefer small gap over half-empty page
- Rewrote `LetterheadDocument.tsx`: explicit multi-page rendering via partition output
- Deleted `src/pdf/useCompactLayout.ts`
- Added `partitionDebug()` for console logging; wired in `LetterheadDocument.tsx`
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
