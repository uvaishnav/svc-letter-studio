# Changelog

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
- D023: New — multi-page PDF layout strategy documented

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
- `src/ai/prompts.ts` — replaced generic `buildSystemPrompt/buildUserPrompt` with task-specific builders:
  - `buildClassifySystemPrompt()`, `buildClassifyUserPrompt(rawInput)` — for intent classification
  - `buildClarifySystemPrompt()`, `buildClarifyUserPrompt(ctx)` — for clarification generation
  - `buildDraftSystemPrompt()`, `buildDraftUserPrompt(ctx)` — for full draft generation
  - Legacy `buildSystemPrompt()` / `buildUserPrompt()` kept as thin wrappers (no breaking change)
- `src/ai/gemini.ts` — added public `.call(system, user, tier)` method; `generateDraft()` uses `premium` tier internally; URL now resolved via `models.ts`
- `src/ai/groq.ts` — added public `.call(system, user)` method for use by task modules
- `src/ai/adapter.ts` — added `classifyPipeline()`, `clarifyPipeline()`, `draftPipeline()` orchestrators; legacy `generateDraft()` kept
- `src/store/sessionStore.ts` — added `pipelineCtx: PipelineContext | null` to `SessionState`; added `setPipelineCtx()` action

### Decisions
- D022: Tiered AI model routing (lightweight / standard / premium) with `PipelineContext` for context continuity
- D020: Updated — prompts now task-specific rather than generic

---

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts` — `DocumentType` union (8 types), `ContentBlock` discriminated union (paragraph, heading, bullet\_list, numbered\_list, table, spacer, divider), `DocumentEnvelope`, `LetterDraft`, `REQUIRED_ENVELOPE_FIELDS`, `getMissingFields()`
- `src/components/pdf/BodyRenderer.tsx` — renders `ContentBlock[]` into `@react-pdf/renderer` elements; tables use dark-brown header row + zebra striping + gold borders
- `src/store/sessionStore.ts` — updated `SessionState` to `{ draft: LetterDraft | null, aiProvider: 'gemini' | 'groq' | null }`, added `createEmptyDraft()`, `useSessionStore()` hook
- `src/components/pdf/LetterheadDocument.tsx` — wired to `LetterDraft`; renders envelope section + BodyRenderer blocks + Signatory
- `src/screens/PreviewScreen.tsx` — wired to new session shape; download filename from doc type + date; `ProviderBadge` component shows which AI model generated the draft
- `src/constants/brand.ts` — added `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`
- `src/ai/types.ts` — `AIInput`, `AIOutput`, `AIProvider` interface
- `src/ai/prompts.ts` — `buildSystemPrompt()`, `buildUserPrompt(input)` shared prompt layer
- `src/ai/gemini.ts` — `GeminiProvider` using Gemini 3.5 Flash REST API with native JSON mode, `maxOutputTokens: 8192`
- `src/ai/groq.ts` — `GroqProvider` using llama-3.3-70b-versatile with `response_format: json_object`
- `src/ai/adapter.ts` — `generateDraft(input: AIInput): Promise<AIOutput>` — Gemini-first with Groq fallback
- `.env.example` — documents `VITE_GEMINI_API_KEY` and `VITE_GROQ_API_KEY`

### Changed
- `src/components/pdf/LetterheadDocument.tsx` — full rewrite to consume new `LetterDraft` shape
- `src/screens/PreviewScreen.tsx` — wired to new session shape

### Fixed
- `src/constants/brand.ts` — missing `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`

### Docs
- `docs/architecture.md` — added `src/ai/` module tree, AI call flow diagram, data flow diagram
- `src/ai/gemini.ts` — upgraded model from `gemini-2.0-flash` → `gemini-3.5-flash`; bumped `maxOutputTokens` 2048 → 8192
- `src/store/sessionStore.ts` — added `aiProvider: 'gemini' | 'groq' | null` field to `SessionState`

---

## Session 3 — 2026-06-05

### Changed
- `src/components/pdf/Header.tsx` — redesigned: ivory bg, Playfair Display SC wordmark, gold dash ornaments, full-width gold hairline rule
- `src/components/pdf/Footer.tsx` — redesigned: ivory bg, gold hairline rule top, GSTIN prominent, clean two-row layout
- `src/constants/brand.ts` — updated with real phone, email, address, GSTIN; corrected tagline
- `src/pdf/fonts.ts` — registered `Playfair Display SC` Bold family

### Removed
- Stamp container from `Signatory` component (physical rubber stamp preferred)

### Fixed
- `Signatory` — now uses `position: absolute, bottom: 0` to always sit at the bottom of content area

### Docs
- `docs/FONTS.md` — updated with Playfair Display SC TTF instructions

---

## Session 2 — 2026-06-04

### Fixed
- `Buffer is not defined` — inline IIFE polyfill in `main.tsx` + `define` block in `vite.config.ts`
- Font not registered — self-hosted TTF + `Font.register()` with absolute URL from `window.location.origin`
- Export button unclickable — removed duplicate `BlobProvider`, single instance in `PreviewScreen`
- Preview not showing on mobile — switched from conditional hide to `<object>` on all devices
- Ivory background bleed — `App.tsx` sets dark bg when on preview screen
- `apple-mobile-web-app-capable` deprecation

### Changed
- Letterhead design: dark brown header band with ivory text + gold rule → full ivory design (D014)
- `vite.config.ts` — removed `external: ['buffer']`, added `define` block

### Added
- `docs/FONTS.md`

---

## Session 1 — 2026-06-03

### Added
- React + Vite + TypeScript scaffold
- PWA setup: `vite-plugin-pwa`, manifest, icons
- Brand tokens in `index.css`
- Shell UI: `App.tsx`, `BottomNav`, screen routing
- Tailwind v4 wired via `@tailwindcss/vite`
- `@react-pdf/renderer` integrated
- `LetterheadDocument`, `LetterheadFirstPage`, `LetterheadContinuationPage`
- `Header`, `Footer`, `Watermark`, `Signatory` PDF components
- `PreviewScreen` with BlobProvider + download
- `src/pdf/fonts.ts` — font registration
- `src/constants/brand.ts` — colors, fonts, contact
