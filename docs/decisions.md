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

## D008 — Typography
**Decision:** Cormorant Garamond SemiBold for `SRI VAISHNAV` only. Montserrat for all other text.
**Reason:** Matches the premium construction firm identity. Two-font discipline keeps the letterhead clean.
**Status:** Final

---

## D009 — PDF Font Loading Strategy
**Decision:** Self-host TTF files in `public/fonts/`. Register via `Font.register()` with absolute URLs using `window.location.origin`.
**Reason:** `@react-pdf/renderer` (PDFKit) fetches fonts via raw XHR and can only parse `.ttf`/`.otf`. Google Fonts CDN serves `.woff2` to browsers which PDFKit cannot parse. Self-hosted TTF is the only reliable approach.
**Status:** Final
**Requires:** Manual step — 5 TTF files must be placed in `public/fonts/`. See `docs/FONTS.md`.

---

## D010 — PDF Render Architecture
**Decision:** Single `BlobProvider` in `PreviewScreen`. No `PDFDownloadLink`.
**Reason:** `@react-pdf/renderer` v4 crashes when two PDF instances render simultaneously (e.g. `BlobProvider` + `PDFDownloadLink`). Single `BlobProvider` drives both the inline `<object>` preview and the download button via `URL.createObjectURL(blob)`.
**Status:** Final

---

## D011 — Buffer Polyfill
**Decision:** Inline IIFE shim in `main.tsx` (must be first code executed). Plus `define` block in `vite.config.ts`.
**Reason:** Vite externalizes the `buffer` npm package for browser builds. Bare `import { Buffer } from 'buffer'` throws at runtime. The inline shim installs a `Uint8Array`-based `Buffer` on `globalThis` before any other module loads.
**Status:** Final

---

## D012 — Preview Screen Layout
**Decision:** `<object>` PDF preview shown on all devices (no mobile/desktop split).
**Reason:** Earlier `isMobile()` userAgent detection was hiding preview on phones. `<object>` works on Chrome Android and most mobile browsers. iOS Safari fallback card with download button handles the edge case.
**Status:** Final

---

## D013 — Preview Screen Background
**Decision:** `App.tsx` sets `background: #1C1C1E` on the root div when on preview screen.
**Reason:** Without this, the ivory body background bleeds through below `PreviewScreen` content when `BottomNav` is hidden, creating a white gap at the bottom.
**Status:** Final
