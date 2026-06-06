# Decisions

## D001 — Framework
**Decision:** React + Vite + TypeScript
**Reason:** Fast dev server, excellent PWA support via vite-plugin-pwa, strong typing.
**Status:** Final

---

## D002 — PDF Engine
**Decision:** `@react-pdf/renderer`
**Reason:** React component model for PDF layout. Declarative, composable.
**Status:** Final

---

## D003 — Styling
**Decision:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
**Status:** Final

---

## D004 — State Management
**Decision:** In-memory React state only (no localStorage, no sessionStorage)
**Reason:** Sandboxed environments block storage APIs. Session resets on refresh by design.
**Status:** Final

---

## D005 — AI Provider
**Decision:** Gemini Flash (primary) + Groq (fallback), routed through `src/ai/adapter.ts`
**Status:** Final

---

## D006 — PWA
**Decision:** `vite-plugin-pwa` with `registerType: autoUpdate`
**Status:** Final

---

## D007 — Screen Routing
**Decision:** State-driven screen switching in `App.tsx` (no URL router)
**Status:** Final

---

## D008 — Brand Typography
**Decision:** Playfair Display SC Bold for `SRI VAISHNAV`. Montserrat for all other text.
**Status:** Final

---

## D009 — PDF Font Loading Strategy
**Decision:** Self-host TTF files in `public/fonts/`. Register via `Font.register()` with absolute URLs.
**Requires:** Manual step — see `docs/FONTS.md`.
**Status:** Final

---

## D010 — PDF Render Architecture
**Decision:** Single `BlobProvider` in `PreviewScreen`. No `PDFDownloadLink`.
**Reason:** `@react-pdf/renderer` v4 crashes when two PDF instances render simultaneously.
**Status:** Final

---

## D011 — Buffer Polyfill
**Decision:** Inline IIFE shim in `main.tsx` (must be first code executed) + `define` block in `vite.config.ts`.
**Status:** Final

---

## D012 — Preview Screen Layout
**Decision:** `<object>` PDF preview on all devices.
**Status:** Final

---

## D013 — Preview Screen Background
**Decision:** `App.tsx` sets `background: #1C1C1E` on root div when on preview screen.
**Status:** Final

---

## D014 — Letterhead Design Language
**Decision:** Ivory background throughout. Gold hairline rules as dividers. No dark ink bands.
**Status:** Final

---

## D015 — Signatory Stamp
**Decision:** No digital stamp badge. Physical rubber stamp used on printed copies.
**Status:** Final

---

## D016 — Signatory Positioning
**Decision:** `Signatory` uses flow layout (`marginTop: 24`) — renders after last content block on whichever page content ends.
**Supersedes:** Session 3 decision to use `position: absolute, bottom: 0`.
**Status:** Final

---

## D017 — Document Body Architecture
**Decision:** Free-form `ContentBlock[]` array for body. Fixed `DocumentEnvelope` for layout-critical fields.
**Block types:** `paragraph`, `heading` (levels 1–2), `bullet_list`, `numbered_list`, `table`, `spacer`, `divider`.
**Status:** Final

---

## D018 — AI Gemini Model Version
**Decision:** `gemini-3.5-flash` (Tier 3 — premium). Released Google I/O 2026, 65K output tokens, strong structured output.
**Status:** Final

---

## D019 — Groq Fallback Model
**Decision:** `llama-3.3-70b-versatile` on Groq with `response_format: { type: 'json_object' }`.
**Status:** Final

---

## D020 — Shared Prompt Layer
**Decision:** Task-specific prompt builders in `src/ai/prompts.ts` shared across all providers.
**Status:** Final

---

## D021 — AI Provider Visibility in UI
**Decision:** Small badge in `PreviewScreen` showing which AI generated the draft (Gemini / Groq). Hidden when `aiProvider` is null.
**Status:** Final

---

## D022 — Tiered AI Model Routing
**Decision:** Three tiers mapped to different Gemini Flash models. All fall back to Groq.
- Tier 1 (lightweight): `gemini-2.0-flash` — classify, clarify
- Tier 2 (standard): `gemini-2.5-flash` — per-block improve actions
- Tier 3 (premium): `gemini-3.5-flash` — draft generation

**Context:** `PipelineContext` built incrementally and passed in full to premium model.
**Status:** Final

---

## D023 — Multi-page PDF Layout Strategy
**Decision:** Explicit block-level pagination via `src/pdf/partitionBlocks.ts`. `@react-pdf/renderer` auto-overflow is NOT relied upon for multi-page content.
**Status:** Final

---

## D024 — Continuation Page Design
**Decision:** Blank ivory page, watermark, `marginTop:50pt`, `marginBottom:48pt`, page number at `position:absolute, bottom:18, right:36`.
**Status:** Final

---

## D025 — Section Affinity 70% Fill Guard
**Decision:** The `sectionAffinity` rule is guarded by a minimum fill ratio of **70%**. Below 70%, skip the move and let content break naturally.
**Status:** Final

---

## D026 — Edit / Preview UX Pattern
**Decision:** Full-screen mode toggle between `DraftScreen` (edit) and `PreviewScreen` (PDF preview). Never split-panel.
**Reason:** A4 PDF at 65% height on iPhone renders too small to be useful. Full-screen for each mode gives the best experience. PDF re-renders in background while editing so Preview is instant when toggled.
**Status:** Final

---

## D027 — AI Improve Scope
**Decision:** Per-block AI improve only. No whole-letter regeneration from DraftScreen.
**Reason:** AI already produces a good initial draft. Re-generating everything for a small change is wasteful and slow. Per-block actions (Shorten / Expand / Formal / Rewrite / Custom) give precise, fast edits.
**Tier:** Tier 2 (standard — `gemini-2.5-flash`)
**Status:** Final
