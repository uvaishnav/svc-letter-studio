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
- `Footer` — ivory bg, gold hairline rule on top, phone | GSTIN | email row, address centered below
- `Watermark` — centred logo at 3.2% opacity, 220px; uses `fixed` so it appears on every auto-overflow page
- `Signatory` — flow-positioned after last content block; renders on whichever page content ends
- `PreviewScreen` — single BlobProvider, inline `<object>` preview on all devices, download button
- Self-hosted font loading from `public/fonts/` via `src/pdf/fonts.ts`
- Buffer polyfill shim in `main.tsx`
- `vite.config.ts` — `define: { global, process.env, process.browser }`
- `App.tsx` — dynamic background (dark on preview, ivory elsewhere)
- `brand.ts` — corrected with real contact data (phone, email, address, GSTIN, tagline)

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
- `src/components/pdf/BodyRenderer.tsx` — renders any array of `ContentBlock` into PDF elements: paragraph, heading (2 levels), bullet list, numbered list, table (zebra + gold borders), spacer, divider
- `src/store/sessionStore.ts` — updated `SessionState` shape (`draft: LetterDraft | null`), `createEmptyDraft()`, `useSessionStore()` hook
- `src/components/pdf/LetterheadDocument.tsx` — consumes `LetterDraft`: renders envelope section (date, ref, recipient, subject) + `BodyRenderer` blocks + `Signatory`
- `src/screens/PreviewScreen.tsx` — wired to new `SessionState` shape; download filename uses doc type + date
- `src/constants/brand.ts` — added `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

### Phase 4 — AI Provider Abstraction ✅
- `src/ai/types.ts` — `AIInput`, `AIOutput`, `AIProvider` interface
- `src/ai/prompts.ts` — `buildSystemPrompt()`, `buildUserPrompt(input)` — shared across both providers
- `src/ai/gemini.ts` — `GeminiProvider` using Gemini 3.5 Flash REST API with native JSON mode
- `src/ai/groq.ts` — `GroqProvider` using `llama-3.3-70b-versatile` with `response_format: json_object`
- `src/ai/adapter.ts` — `generateDraft(input)` — tries Gemini first, falls back to Groq on any error; re-exports `AIInput`, `AIOutput`
- `.env.example` — documents required env vars

### Phase 5 — AI Intake and Clarification ✅
- **Tiered AI routing (D022):** `TaskTier` type, `PipelineContext` envelope, `src/ai/models.ts`
- **Task modules:** `src/ai/tasks/classifyIntent.ts` (Tier 1), `src/ai/tasks/generateClarification.ts` (Tier 1), `src/ai/tasks/generateDraft.ts` (Tier 3)
- **Updated prompts:** task-specific prompt builders for classify, clarify, and draft; legacy `buildSystemPrompt`/`buildUserPrompt` kept for backward compat
- **Updated `gemini.ts`:** `.call(system, user, tier)` public method accepts any tier; URL resolved via `models.ts`
- **Updated `groq.ts`:** `.call(system, user)` public method for use by task modules
- **Updated `adapter.ts`:** `classifyPipeline()`, `clarifyPipeline()`, `draftPipeline()` orchestrate the 3-stage pipeline
- **Updated `sessionStore.ts`:** added `pipelineCtx: PipelineContext | null` and `setPipelineCtx()` action
- **`IntakeScreen.tsx`:** freeform textarea → classify (Tier 1) → optional one-question clarification (Tier 1) → draft generation (Tier 3) → PreviewScreen
- Loading UI shows stage message + tier badge (Lightweight / Premium)
- Error state with retry button

---

## Next Phase

### Phase 6 — Draft Output, AI Improve Actions, Manual Editing UI
- Show generated draft in an editable form
- AI improve actions: Shorten, Expand, Make Formal, Rewrite (Tier 2 — standard model)
- Manual field editing (recipient, subject, date, ref)
- Full re-generation from context (Tier 3)

---

## Known Blockers / Open Issues

### Multi-page PDF layout — current state (verified session 7)

**How it works (correct behaviour — not a bug):**
- `LetterheadFirstPage` renders a single `<Page>`. `@react-pdf/renderer` auto-overflows content to new blank pages when content exceeds page 1.
- `Footer` uses `fixed` + `render={({ pageNumber: pn }) => pn > 1 ? null : ...}` — shows only on page 1. Auto-overflow pages (page 2+) intentionally have no footer. ✅
- `Signatory` is flow-positioned (`marginTop: 24`) — follows content to whatever page it ends on. ✅
- `Watermark` uses `fixed` — repeats on every auto-overflow page automatically. ✅

**`LetterheadContinuationPage` status:**
- This component exists and is imported in `LetterheadDocument.tsx` but is NOT rendered (dead import).
- It is a future-use component for explicit multi-page layouts. It is NOT a bug that it is unwired.
- Its fonts use PDFKit built-ins (`Helvetica-Bold`, `Helvetica`) instead of our registered Montserrat/Playfair fonts — needs fixing before it can be used.

**`useCompactLayout` known inaccuracy:**
- `estimateTotalHeight()` scales `SIGNATORY_HEIGHT * scale`, but `Signatory.tsx` only has scalable `marginTop` — the signature box height, name, and designation are fixed sizes. This causes a slight over-estimate of compaction needed on long letters.
- Not critical for correctness (impossibility guard prevents wrong compression), but estimation could be more precise.

**Active issues reported by user (session 7) — under investigation:**
- Content rendering problem (details TBD after user describes)
- Pagination logic problem (details TBD after user describes)

---

## Session Log

### Session 1 — 2026-06-03
- Phases 1 and 2 scaffolded and built

### Session 2 — 2026-06-04
- Diagnosed and fixed: `Buffer is not defined`
- Diagnosed and fixed: `Font family not registered: Montserrat`
- Diagnosed and fixed: Export button unclickable + double render crash
- Fixed: `vite.config.ts` externalizing `buffer` package
- Fixed: Preview not showing on mobile
- Fixed: Ivory bleed-through below preview
- Fixed: `apple-mobile-web-app-capable` deprecation warning
- Rebuilt: Premium letterhead — dark brown header band, gold accents
- Added: `docs/FONTS.md`

### Session 3 — 2026-06-05
- Redesigned header: ivory bg, no dark band, logo + Playfair Display SC wordmark, gold hairline rule
- Redesigned footer: ivory bg, gold hairline rule, GSTIN prominent center, clean two-row layout
- Updated `brand.ts`: real phone, email, address, GSTIN, corrected tagline
- Switched font: Playfair Display SC Bold for `SRI VAISHNAV` (replaces Cormorant Garamond / Cinzel)
- Removed stamp container from `Signatory` (physical stamps used instead)
- Fixed: Signatory now absolutely positioned to bottom of content area — always at bottom on empty letterhead
- Registered `Playfair Display SC` family in `fonts.ts`
- Updated `docs/FONTS.md` with Playfair Display SC instructions

### Session 4 — 2026-06-06
- Decided: free-form block-based body instead of rigid field schema (see D017)
- Built Phase 3: document schema, ContentBlock union, LetterDraft, BodyRenderer, sessionStore update
- Fixed: `brand.ts` missing `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`
- Wired `LetterheadDocument` and `PreviewScreen` to new `LetterDraft` shape
- Built Phase 4: AI provider abstraction — types, prompts, Gemini adapter, Groq adapter, routing adapter
- Added `.env.example`

### Session 5 — 2026-06-06
- Decided: Tiered AI routing (D022) — lightweight / standard / premium tiers
- Built Phase 5: full intake pipeline with tiered routing
- Added `src/ai/models.ts`, `src/ai/tasks/` directory with 3 task modules
- Updated `gemini.ts` with public `.call(system, user, tier)` method
- Updated `groq.ts` with public `.call(system, user)` method
- Updated `adapter.ts`: 3-stage pipeline orchestrator
- Updated `sessionStore.ts`: added `pipelineCtx` field
- Built `IntakeScreen.tsx`: full UI with loading states, tier badge, clarification step, error handling
- Updated `prompts.ts`: task-specific prompt builders (classify, clarify, draft)
- Logged D022 in decisions.md

### Session 6 — 2026-06-06
- Diagnosed multi-page PDF layout issues from real PDF output
- Fixed: `Footer` — added `render` prop to `fixed` View; footer now shows on page 1 only, hidden on page 2+
- Fixed: `Signatory` — changed from `position:absolute` to flow layout (`marginTop:24`); now renders after last content block on whichever page content ends
- Fixed: `useCompactLayout` — recalibrated `CHARS_PER_LINE` to 80 (from actual geometry: 523pt ÷ 6.5pt/char), added `SIGNATORY_HEIGHT: 92pt` to body estimate, set `WIDOW_THRESHOLD: 0.50`
- Updated D016 (Signatory positioning) in decisions.md
- ⚠️ Session 6 also logged incorrect "remaining issues" — these were hallucinations, corrected in session 7 (see Known Blockers above)

### Session 7 — 2026-06-06
- Audited all PDF source files against session 6 documentation
- Corrected hallucinations in progress.md blockers section
- Confirmed: single-page auto-overflow is correct intended behaviour — not a bug
- Confirmed: `LetterheadContinuationPage` unwired is intentional — it is a future-use component
- Confirmed: `Watermark` fixed prop correctly repeats on all pages
- Identified: `LetterheadContinuationPage` uses wrong fonts (Helvetica built-ins instead of Montserrat)
- Identified: `SIGNATORY_HEIGHT * scale` in estimateTotalHeight is slightly inaccurate (only marginTop scales in real component)
- Updated D023 in decisions.md to reflect correct multi-page strategy
