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
- Tier 2 (standard): `gemini-2.5-flash` — reserved
- Tier 3 (premium): `gemini-3.5-flash` — draft generation, improve actions

**Context:** `PipelineContext` built incrementally and passed in full to premium model.
**Status:** Final

---

## D023 — Multi-page PDF Layout Strategy
**Decision:** Explicit block-level pagination via `src/pdf/partitionBlocks.ts`. `@react-pdf/renderer` auto-overflow is NOT relied upon for multi-page content.

**Why not auto-overflow:**
1. `flex:1` on `contentArea` expanded the container beyond its 648.14pt cap — content touched the footer gold line.
2. Auto-overflow has no block-awareness — it splits mid-paragraph, produces orphan lines, cannot apply heading/section rules.

**Partition pipeline (6 steps):**
1. Greedy fill — height caps: 648.14pt (page 1), 743.89pt (continuation)
2. Signatory overflow — last block moves if content + 92pt signatory exceeds cap
3a. `keepWithNext` — lone heading at page bottom always moves (unconditional)
3b. `sectionAffinity` — heading+intro move to reunite with section list/table body (70% fill guarded)
4. Orphan check — < 55pt on next page pulls a block forward
5. Thin-page check — last page visual < 80pt pulls a block forward
6. Empty-page cleanup

**Status:** Final

---

## D024 — Continuation Page Design
**Decision:** Blank ivory page, watermark, `marginTop:50pt`, `marginBottom:48pt`, page number at `position:absolute, bottom:18, right:36`.
- No branding elements repeated on continuation pages.
- `marginTop:50pt`: deliberate breathing room that visually signals content continuation (increased from 36pt — 36 felt too tight).
- `CONT_CONTENT_MAX_HEIGHT = 743.89pt` exported from the component as a constant and imported by `partitionBlocks.ts` (single source of truth).

**Status:** Final

---

## D025 — Section Affinity 70% Fill Guard
**Decision:** The `sectionAffinity` rule (which moves a heading+intro para to the next page to reunite them with their section body) is guarded by a minimum fill ratio of **70%**.

**Rule:** Before moving blocks, compute what the source page fill would be after the move. If it would drop below `cap × 0.70`, skip the move entirely. Let `@react-pdf` break the content naturally inside the block.

**Why 70%:**
- A 46pt gap at the bottom of a 75%-filled page looks like deliberate section spacing.
- Moving 74pt (heading + intro) from a page at 75% fill drops it to 60% — nearly half-empty, very visible.
- 70% is the crossover point: above it, a small gap is acceptable; below it, the page looks broken.

**Exception:** `keepWithNext` (lone bare heading) is **unconditional** — a heading with nothing below it on a page is always typographically wrong, regardless of fill.

**Applies to:** All pages (page 1 and continuation pages use the same ratio against their respective caps).

**Status:** Final
