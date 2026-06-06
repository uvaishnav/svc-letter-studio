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
**Decision:** `Signatory` uses `position: absolute, bottom: 0` within the content area.
**Reason:** Ensures signatory always appears at the bottom of the page regardless of content length. On empty letterheads it sits just above the footer. Content area has `marginBottom: 65` which clears the footer height.
**Status:** Final

---

## D017 — Document Body Architecture
**Decision:** Free-form `ContentBlock[]` array for body. Fixed `DocumentEnvelope` for layout-critical fields (date, recipient, subject, ref, signatory).
**Reason:** A rigid field schema would prevent the AI from choosing the best visual structure (tables, bullets, paragraphs) per document type. The block model gives the AI full compositional freedom while keeping envelope fields in deterministic positions on the letterhead.
**Block types:** `paragraph`, `heading` (levels 1–2), `bullet_list`, `numbered_list`, `table`, `spacer`, `divider`.
**Status:** Final

---

## D018 — AI Gemini Model Version
**Decision:** Use `gemini-2.0-flash` model via REST API with `responseMimeType: application/json`.
**Reason:** Flash variant is fast and cost-effective for structured generation. Native JSON mode eliminates need to strip markdown fences from output.
**Status:** Final

---

## D019 — Groq Fallback Model
**Decision:** Use `llama-3.3-70b-versatile` on Groq with `response_format: { type: 'json_object' }`.
**Reason:** Strong instruction-following for structured JSON. Groq's inference speed makes it a viable real-time fallback.
**Status:** Final

---

## D020 — Shared Prompt Layer
**Decision:** `buildSystemPrompt()` and `buildUserPrompt()` in `src/ai/prompts.ts` are shared by both providers.
**Reason:** Single source of truth for prompt logic. Changing tone, rules, or schema only requires editing one file.
**Status:** Final
