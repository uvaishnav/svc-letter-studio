# Changelog

## [Phase 2 — Session 3 Redesign] — 2026-06-05

### Changed
- `Header.tsx` — Full premium redesign: ivory background (no dark band), logo 80px, `SRI VAISHNAV` in Playfair Display SC Bold 28pt tight letterSpacing, `— CONSTRUCTIONS —` with gold dash lines, tagline in Montserrat 5.5pt muted, full-width gold hairline rule at bottom
- `Footer.tsx` — Switched from dark brown band to ivory background: gold hairline rule on top, left accent bar, phone | GSTIN | email top row, address centered below. Zero heavy ink usage.
- `Watermark.tsx` — Reduced size 260px → 220px, opacity 3.5% → 3.2%
- `Signatory.tsx` — Removed stamp badge container (physical stamps used). Changed layout to `position: absolute, bottom: 0` so signatory always anchors to bottom of content area regardless of content length.
- `src/pdf/fonts.ts` — Replaced Cormorant Garamond + Cinzel with Playfair Display (Regular + Bold) and Playfair Display SC (Bold). Added `Font.register()` for `'Playfair Display SC'` family.
- `src/constants/brand.ts` — Updated with real contact data: phone `7989230912`, email `rambabuut@gmail.com`, address `2-14, Godavarru, Kankipadu Mandal, Krishna District, Andhra Pradesh – 521151`, GSTIN `37ADUPU2453N1ZK`, tagline `ENGINEERING • INFRASTRUCTURE • CIVIL WORKS`
- `docs/FONTS.md` — Updated required files list and download instructions for Playfair Display SC

### Fixed
- Signatory was floating at top of content area when page was empty — now always pinned to bottom above footer
- Font family mismatch error `Font family not registered: Playfair Display SC` — resolved by registering family name exactly matching usage in `Header.tsx`

---

## [Phase 2 — Bug Fix Session] — 2026-06-04

### Fixed
- `main.tsx` — Replaced bare `import { Buffer } from 'buffer'` with inline IIFE shim on `globalThis`
- `vite.config.ts` — Added `define` block: `global`, `process.env`, `process.browser`
- `LetterheadFirstPage.tsx` — Removed `fontFamily: 'Montserrat'` from `<Page>` style
- `LetterheadContinuationPage.tsx` — Same fix as above
- `PreviewScreen.tsx` — Removed `PDFDownloadLink`, replaced with `URL.createObjectURL(blob)` button
- `PreviewScreen.tsx` — Removed `isMobile()` check, `<object>` shown on all devices
- `App.tsx` — Dynamic background: dark on preview screen, ivory elsewhere
- `index.html` — Added `mobile-web-app-capable` meta tag

### Added
- `src/pdf/fonts.ts` — Font.register() for Cormorant Garamond + Montserrat from `public/fonts/`
- `docs/FONTS.md` — Font download and setup instructions

### Changed (Redesign)
- `Header.tsx` — Gold top edge + dark brown band, Cormorant Garamond brand name
- `Footer.tsx` — Dark brown band, two-row contact layout
- `Watermark.tsx` — Logo image at 3.5% opacity
- `Signatory.tsx` — Right-aligned signature block with gold stamp badge

---

## [Phase 2 — Initial Build] — 2026-06-03

### Added
- `vite.config.ts`, `src/index.css`, `src/main.tsx`, `src/App.tsx`, `src/App.css`
- `src/components/pdf/LetterheadDocument.tsx`
- `src/components/pdf/LetterheadFirstPage.tsx`
- `src/components/pdf/LetterheadContinuationPage.tsx`
- `src/components/pdf/Header.tsx`
- `src/components/pdf/Footer.tsx`
- `src/components/pdf/Watermark.tsx`
- `src/components/pdf/Signatory.tsx`
- `src/screens/PreviewScreen.tsx`
