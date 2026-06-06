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
**Reason:** Utility-first, no config file needed in v4, integrates cleanly with Vite.
**Status:** Final

---

## D004 — State Management
**Decision:** In-memory React state only (no localStorage, no sessionStorage)
**Reason:** Sandboxed environments block storage APIs. Session resets on refresh by design.
**Status:** Final

---

## D005 — AI Provider
**Decision:** Gemini Flash (primary) + Groq (fallback), routed through `src/ai/adapter.ts`
**Reason:** Redundancy for uptime. Single adapter interface keeps components clean.
**Status:** Final

---

## D006 — PWA
**Decision:** `vite-plugin-pwa` with `registerType: autoUpdate`
**Reason:** Auto-update keeps users on latest version without prompts.
**Status:** Final

---

## D007 — Screen Routing
**Decision:** State-driven screen switching in `App.tsx` (no URL router)
**Reason:** Simpler for a single-flow app. No URL bar clutter on mobile.
**Status:** Final

---

## D008 — Brand Typography
**Decision:** Playfair Display SC Bold for `SRI VAISHNAV`. Montserrat for all other text.
**Reason:** Playfair Display SC has the heavy high-contrast Roman serifs that match the physical letterhead reference. SC (Small Caps) variant gives the all-caps typographic structure seen in the brand. Montserrat keeps supporting text clean and modern.
**Supersedes:** Original decision to use Cormorant Garamond (too light) and Cinzel (too condensed).
**Status:** Final

---

## D009 — PDF Font Loading Strategy
**Decision:** Self-host TTF files in `public/fonts/`. Register via `Font.register()` with absolute URLs using `window.location.origin`.
**Reason:** `@react-pdf/renderer` (PDFKit) fetches fonts via raw XHR and can only parse `.ttf`/`.otf`. Google Fonts CDN serves `.woff2` to browsers which PDFKit cannot parse.
**Status:** Final
**Requires:** Manual step — TTF files must be placed in `public/fonts/`. See `docs/FONTS.md`.

---

## D010 — PDF Render Architecture
**Decision:** Single `BlobProvider` in `PreviewScreen`. No `PDFDownloadLink`.
**Reason:** `@react-pdf/renderer` v4 crashes when two PDF instances render simultaneously. Single `BlobProvider` drives both preview and download.
**Status:** Final

---

## D011 — Buffer Polyfill
**Decision:** Inline IIFE shim in `main.tsx` (must be first code executed). Plus `define` block in `vite.config.ts`.
**Reason:** Vite externalizes the `buffer` npm package for browser builds. Bare `import { Buffer } from 'buffer'` throws at runtime.
**Status:** Final

---

## D012 — Preview Screen Layout
**Decision:** `<object>` PDF preview shown on all devices (no mobile/desktop split).
**Reason:** `isMobile()` was hiding preview on phones. `<object>` works on Chrome Android. iOS Safari fallback card handles edge case.
**Status:** Final

---

## D013 — Preview Screen Background
**Decision:** `App.tsx` sets `background: #1C1C1E` on root div when on preview screen.
**Reason:** Ivory body background bleeds through below PreviewScreen content when BottomNav is hidden.
**Status:** Final

---

## D014 — Letterhead Design Language
**Decision:** Ivory background throughout (header, body, footer). Gold hairline rules as dividers. No heavy dark ink bands.
**Reason:** Dark brown bands waste ink on print. Ivory-on-ivory design is print-efficient while maintaining premium feel through typography and gold accents. Matches the physical reference letterhead.
**Status:** Final

---

## D015 — Signatory Stamp
**Decision:** No digital stamp badge in `Signatory` component. Physical rubber stamp used on printed copies.
**Reason:** Physical stamp is preferred by the proprietor for authenticity. Digital stamp element was removed to keep the signatory block clean.
**Status:** Final

---

## D016 — Signatory Positioning
**Decision:** `Signatory` uses flow layout (`marginTop: 24`) — renders immediately after the last content block on whichever page the content ends.
**Reason:** `position: absolute` anchored the signatory to the bottom of page 1 only. On letters whose content overflows to page 2, the signatory must follow the content — not stay pinned to page 1. Flow positioning achieves this naturally.
**Supersedes:** Previous decision (session 3) to use `position: absolute, bottom: 0`.
**Status:** Final

---

## D017 — Document Body Architecture
**Decision:** Free-form `ContentBlock[]` array for body. Fixed `DocumentEnvelope` for layout-critical fields (date, recipient, subject, ref, signatory).
**Reason:** A rigid field schema would prevent the AI from choosing the best visual structure (tables, bullets, paragraphs) per document type. The block model gives the AI full compositional freedom while keeping envelope fields in deterministic positions on the letterhead.
**Block types:** `paragraph`, `heading` (levels 1–2), `bullet_list`, `numbered_list`, `table`, `spacer`, `divider`.
**Status:** Final

---

## D018 — AI Gemini Model Version
**Decision:** Use `gemini-3.5-flash` model via REST API with `responseMimeType: application/json`.
**Supersedes:** Original decision to use `gemini-2.0-flash`.
**Reason:** Gemini 3.5 Flash (released Google I/O 2026, May 19) delivers near-Pro intelligence at Flash speed. Key improvements: 65K output tokens (vs 8K in 2.0 Flash), better structured output adherence, stronger instruction-following. Free tier via Google AI Studio. One-line model name change.
**Status:** Final

---

## D019 — Groq Fallback Model
**Decision:** Use `llama-3.3-70b-versatile` on Groq with `response_format: { type: 'json_object' }`.
**Reason:** Strong instruction-following for structured JSON. Groq’s inference speed makes it a viable real-time fallback.
**Status:** Final

---

## D020 — Shared Prompt Layer
**Decision:** Task-specific prompt builders in `src/ai/prompts.ts` shared across all providers.
**Reason:** Single source of truth for prompt logic. Changing tone, rules, or schema only requires editing one file.
**Status:** Final (updated from generic buildSystemPrompt/buildUserPrompt to task-specific builders)

---

## D021 — AI Provider Visibility in UI
**Decision:** Show a small badge in `PreviewScreen` indicating which AI provider generated the current draft (Gemini 3.5 Flash or Groq · Llama 3.3). Stored as `aiProvider: 'gemini' | 'groq' | null` in `SessionState`. Badge is hidden when `aiProvider` is null (e.g. empty/manual draft).
**Reason:** Transparency for the user — especially useful when Groq fallback is triggered. Also useful during development to verify which path the adapter took.
**Status:** Final

---

## D022 — Tiered AI Model Routing
**Decision:** Use different Gemini Flash model tiers depending on task complexity. All tiers fall back to Groq on failure.
- **Tier 1 (lightweight):** `gemini-2.0-flash` — intent classification, clarification question generation
- **Tier 2 (standard):** `gemini-2.5-flash` — (reserved) content restructuring, summarisation
- **Tier 3 (premium):** `gemini-3.5-flash` — full draft generation, AI improve actions

**Context continuity:** A `PipelineContext` object is built incrementally across all stages and passed in full to the premium model — no information loss between tiers.

**Module structure:**
- `src/ai/models.ts` — maps `TaskTier` → model name and URL
- `src/ai/tasks/classifyIntent.ts` — Tier 1
- `src/ai/tasks/generateClarification.ts` — Tier 1
- `src/ai/tasks/generateDraft.ts` — Tier 3
- `src/ai/adapter.ts` — orchestrates the pipeline via `classifyPipeline()`, `clarifyPipeline()`, `draftPipeline()`

**Reason:** Better models have lower rate limits. Trivial tasks (classification, one-question generation) do not need premium intelligence. Reserving the premium quota for draft generation maximises output quality within API limits.
**Status:** Final

---

## D023 — Multi-page PDF Layout Strategy
**Decision:** Use explicit block-level pagination via `src/pdf/partitionBlocks.ts`. `LetterheadDocument` renders one `LetterheadFirstPage` + N `LetterheadContinuationPage` elements explicitly. `@react-pdf/renderer` auto-overflow is NOT relied upon.

**Supersedes:** Previous D023 which described auto-overflow as the final strategy.

**Why changed:** Auto-overflow produced two bad outcomes:
1. `flex:1` on `contentArea` expanded the container beyond its intended 648.14pt height, causing content to visually touch the footer gold line.
2. When a few lines spilled to page 2, there was no mechanism to move whole logical blocks — resulting in 2-3 orphan lines alone on a continuation page.

**How `partitionBlocks` works:**
1. Greedy fill — pack blocks into pages, respecting height caps (648.14pt page 1, 757.89pt continuation)
2. Signatory overflow — if `lastBlock + SIGNATORY_HEIGHT > cap`, lastBlock moves to next page
3. Orphan check — if next page content < 55pt (~3 lines), move prev page’s last block forward
4. Thin-page check — if last page visual (content + signatory) < 80pt, move another block forward
5. Empty-page cleanup

**Spacing:** `spacingScale` is always `1.0`. No compression ever applied. Blocks are moved between pages instead.

**Status:** Final

---

## D024 — Continuation Page Design
**Decision:** Blank ivory page with `marginTop:36pt`, `marginBottom:48pt`, watermark, and page number (`FONTS.body`, 8pt, `brownMuted`) at `position:absolute, bottom:18, right:36`.
- No top bar, no brand name, no footer component on continuation pages.
- `marginTop:36` provides staple clearance + breathing room (matches side margins).
- `marginBottom:48` provides bottom breathing room; page number sits inside this zone.
- Available content area: 757.89 × 523.28pt.

**Reason:** Clean, professional, print-friendly. Branding is established on page 1. Repetitive brand elements on continuation pages add visual noise and waste ink.
**Status:** Final
