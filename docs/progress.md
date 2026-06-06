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
- `Signatory` — flow-positioned after last content block
- `PreviewScreen` — single BlobProvider, inline `<object>` preview, download button
- Self-hosted font loading from `public/fonts/` via `src/pdf/fonts.ts`
- Buffer polyfill shim in `main.tsx`

#### Font files required in `public/fonts/` (see `docs/FONTS.md`)
- `PlayfairDisplaySC-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`
- `PlayfairDisplay-Bold.ttf`
- `Montserrat-Regular.ttf`
- `Montserrat-Italic.ttf`
- `Montserrat-SemiBold.ttf`
- `Montserrat-Bold.ttf`

### Phase 3 — Document Schema and Pipeline ✅
- `src/types/document.ts` — `DocumentType` union, `ContentBlock` discriminated union (7 block types), `DocumentEnvelope`, `LetterDraft`, `REQUIRED_ENVELOPE_FIELDS`, `getMissingFields()`
- `src/components/pdf/BodyRenderer.tsx` — renders any array of `ContentBlock` into PDF elements
- `src/store/sessionStore.ts` — updated `SessionState` shape, `createEmptyDraft()`, `useSessionStore()` hook
- `src/components/pdf/LetterheadDocument.tsx` — consumes `LetterDraft`
- `src/screens/PreviewScreen.tsx` — wired to `SessionState`
- `src/constants/brand.ts` — `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

### Phase 4 — AI Provider Abstraction ✅
- `src/ai/types.ts`, `src/ai/prompts.ts`, `src/ai/gemini.ts`, `src/ai/groq.ts`, `src/ai/adapter.ts`
- Gemini 3.5 Flash (primary) + Groq llama-3.3-70b-versatile (fallback)
- `.env.example` documents required env vars

### Phase 5 — AI Intake and Clarification ✅
- Tiered AI routing (D022): `src/ai/models.ts`, `src/ai/tasks/` (classifyIntent, generateClarification, generateDraft)
- `src/screens/IntakeScreen.tsx` — full pipeline UI with stage loading, clarification step, error handling
- Task-specific prompt builders in `src/ai/prompts.ts`
- `PipelineContext` in `sessionStore.ts`

### Phase 7 — Smart Pagination (partial) ✅
**Layout bug fixed:**
- `LetterheadFirstPage.tsx` — replaced `flex:1` with `maxHeight:648.14` on `contentArea`.
  This was the root cause of content touching the footer gold line despite a 65pt `marginBottom`.
  `flex:1` was expanding the container to fill all space after the header (~732pt instead of 648.14pt).

**Continuation page redesigned:**
- `LetterheadContinuationPage.tsx` — complete rewrite: blank ivory page, watermark, `marginTop:36`, `marginBottom:48`, page number bottom-right. Corrected fonts from Helvetica to `FONTS.body`.

**Smart block partitioner built:**
- `src/pdf/partitionBlocks.ts` — pure function, partitions `ContentBlock[]` into `{ page1, continuations[], totalPages }`
  - Greedy fill respecting per-page height caps (648.14pt page 1, 757.89pt continuation)
  - Signatory overflow check — if last block + signatory don’t fit, last block moves to next page
  - Orphan check — if next page content < 55pt (~3 lines), move previous page’s last block forward
  - Thin-page check — if last page visual (content + signatory) < 80pt, move another block forward
  - Empty-page cleanup

**LetterheadDocument wired to partition:**
- `LetterheadDocument.tsx` — rewritten: calls `partitionBlocks()`, renders explicit `LetterheadFirstPage` + N `LetterheadContinuationPage` elements. Signatory always on last page.
- `useCompactLayout.ts` — deleted (replaced by partition approach; no spacing compression ever applied)

---

## Next Phase

### Phase 6 — Draft Output, AI Improve Actions, Manual Editing UI
*(Phase numbering follows PRD — phase 7 pagination was inserted before phase 6 in implementation order)*
- Show generated draft in an editable form
- AI improve actions: Shorten, Expand, Make Formal, Rewrite (Tier 2 — standard model)
- Manual field editing (recipient, subject, date, ref)
- Full re-generation from context (Tier 3)

---

## Known Blockers / Open Issues

**None currently.** All PDF layout issues have been resolved.

- Content area is now hard-capped at 648.14pt — cannot touch footer.
- Block-level pagination is handled by `partitionBlocks.ts` — no orphan lines, no spacing compression.
- Continuation pages have correct margins and page numbers.
- `useCompactLayout.ts` has been deleted; spacing scale is always 1.0.

---

## Session Log

### Session 7 — 2026-06-06
- Audited all PDF source files against session 6 documentation; corrected hallucinations
- Diagnosed root cause of content touching footer: `flex:1` expanding `contentArea` beyond intended bounds
- Fixed `LetterheadFirstPage.tsx`: `flex:1` → `maxHeight:648.14`
- Redesigned `LetterheadContinuationPage.tsx`: blank page, `marginTop:36`, `marginBottom:48`, page number at bottom-right, correct fonts
- Built `src/pdf/partitionBlocks.ts`: smart block-level pagination with orphan/widow control
- Rewrote `LetterheadDocument.tsx` to use partition output — explicit multi-page rendering
- Deleted `src/pdf/useCompactLayout.ts` (no longer needed)
- Updated D023 and D024 in decisions.md

### Session 6 — 2026-06-06
- Fixed `Footer` — `render` prop, shows page 1 only
- Fixed `Signatory` — flow layout, `marginTop:24`
- Recalibrated `useCompactLayout` constants (superseded in session 7)

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
