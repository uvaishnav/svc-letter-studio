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
- `Header` — gold top edge + dark brown band + logo + brand hierarchy
- `Footer` — dark brown band + two-row contact info + gold accent
- `Watermark` — centred logo at 3.5% opacity
- `Signatory` — right-aligned signature block with gold stamp badge
- `PreviewScreen` — single BlobProvider, inline `<object>` preview on all devices, download button
- Self-hosted font loading from `public/fonts/` via `src/pdf/fonts.ts`
- Buffer polyfill shim in `main.tsx` (inline IIFE, no bare npm import)
- `vite.config.ts` — `define: { global, process.env, process.browser }`
- `App.tsx` — dynamic background (dark on preview, ivory elsewhere) to prevent bleed-through
- `index.html` — added `mobile-web-app-capable` meta tag

#### Known blocker (manual step required before fonts work)
Font files must be placed manually in `public/fonts/`. See `docs/FONTS.md`.

---

## Next Phase

### Phase 3 — Document Schema and Pipeline
- Field schema definition
- Document types (quotation, letter, notice, etc.)
- Required fields logic
- Draft state shape

---

## Session Log

### Session 1 — 2026-06-03
- Phases 1 and 2 scaffolded and built

### Session 2 — 2026-06-04
- Diagnosed and fixed: `Buffer is not defined` (PDFKit needs Node Buffer in browser)
- Diagnosed and fixed: `Font family not registered: Montserrat` (`LetterheadFirstPage` and `LetterheadContinuationPage` had `fontFamily: 'Montserrat'` on `<Page>` style without registration)
- Diagnosed and fixed: Export button unclickable + double render crash (`PDFDownloadLink` + `BlobProvider` rendered PDF twice simultaneously — v4 limitation)
- Fixed: `vite.config.ts` externalizing `buffer` package — switched to inline IIFE shim
- Fixed: Preview not showing on mobile — removed `isMobile()` check, `<object>` shown on all devices
- Fixed: Ivory bleed-through below preview — `App.tsx` now sets dark bg when on preview screen
- Fixed: `apple-mobile-web-app-capable` deprecation warning — added `mobile-web-app-capable`
- Rebuilt: Premium letterhead — dark brown header band, gold accents, Cormorant Garamond + Montserrat hierarchy
- Added: `docs/FONTS.md` with step-by-step font download instructions
