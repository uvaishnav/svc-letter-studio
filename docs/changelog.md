# Changelog

## [Phase 2 — Bug Fix Session] — 2026-06-04

### Fixed
- `main.tsx` — Replaced bare `import { Buffer } from 'buffer'` (Vite externalizes it) with an inline IIFE shim that installs `Buffer` on `globalThis` before any other module loads. Implements `from`, `alloc`, `allocUnsafe`, `isBuffer`, `concat` via native `Uint8Array`.
- `vite.config.ts` — Added `define` block: `global: 'globalThis'`, `process.env: '{}'`, `process.browser: 'true'` to satisfy PDFKit Node-like environment checks.
- `LetterheadFirstPage.tsx` — Removed `fontFamily: 'Montserrat'` from `<Page>` style. Was causing `Font family not registered` error because Montserrat was not yet registered when Page style evaluated.
- `LetterheadContinuationPage.tsx` — Same fix as above.
- `PreviewScreen.tsx` — Removed `PDFDownloadLink` from top bar entirely. Replaced with a plain `<button>` that calls `URL.createObjectURL(blob)`. Eliminates double-render crash caused by `BlobProvider` + `PDFDownloadLink` both rendering the PDF simultaneously (known `@react-pdf/renderer` v4 limitation).
- `PreviewScreen.tsx` — Removed `isMobile()` userAgent check. `<object>` PDF preview now shown on all devices. Fallback card shown inside `<object>` for browsers that block inline PDF (some iOS Safari).
- `App.tsx` — Dynamic background: `#1C1C1E` when on preview screen, `var(--color-ivory)` otherwise. Eliminates ivory bleed-through visible below preview content.
- `index.html` — Added `<meta name="mobile-web-app-capable" content="yes">` (modern standard) alongside existing Apple tag.

### Added
- `src/pdf/fonts.ts` — Proper `Font.register()` calls for Cormorant Garamond (600) and Montserrat (400, 400i, 600, 700) loading from `public/fonts/*.ttf` via `window.location.origin` absolute URLs. Includes `Font.registerHyphenationCallback` to prevent hyphenation.
- `docs/FONTS.md` — Step-by-step instructions for downloading and placing the 5 required TTF files in `public/fonts/`.

### Changed (Premium Redesign)
- `Header.tsx` — Redesigned: 3pt gold top edge + dark brown brand band with logo, `SRI VAISHNAV` in Cormorant Garamond 22pt tracked, flanking gold lines, `CONSTRUCTIONS` in Montserrat tracked caps, italic tagline.
- `Footer.tsx` — Redesigned: dark brown band matching header, gold top accent, two-row layout (phone + brand + email / address + GSTIN).
- `Watermark.tsx` — Switched from text to logo image at 3.5% opacity, centred on page.
- `Signatory.tsx` — Redesigned: right-aligned signature block with ruled line, gold stamp badge flanked by hairlines, name in Montserrat Bold tracked caps, designation in Montserrat Regular.

---

## [Phase 2 — Initial Build] — 2026-06-03

### Added
- `svc-letter-studio/vite.config.ts` — Vite config with `@tailwindcss/vite` plugin and `vite-plugin-pwa`
- `svc-letter-studio/src/index.css` — Tailwind v4 import, Google Fonts (Cormorant Garamond + Montserrat), CSS custom properties for brand colors and fonts
- `svc-letter-studio/src/main.tsx` — App entry point
- `svc-letter-studio/src/App.tsx` — State-driven screen router, hides BottomNav on preview screen
- `svc-letter-studio/src/App.css` — Cleared to minimal comment only
- `src/components/pdf/LetterheadDocument.tsx` — Root PDF Document component
- `src/components/pdf/LetterheadFirstPage.tsx` — First page layout with header/footer/watermark
- `src/components/pdf/LetterheadContinuationPage.tsx` — Continuation page with minimal top bar
- `src/components/pdf/Header.tsx` — Brand header
- `src/components/pdf/Footer.tsx` — Contact footer
- `src/components/pdf/Watermark.tsx` — Background watermark
- `src/components/pdf/Signatory.tsx` — Signature block
- `src/screens/PreviewScreen.tsx` — Preview and export screen
