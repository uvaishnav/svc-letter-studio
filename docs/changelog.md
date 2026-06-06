# Changelog

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts` — `DocumentType` union (8 types), `ContentBlock` discriminated union (paragraph, heading, bullet\_list, numbered\_list, table, spacer, divider), `DocumentEnvelope`, `LetterDraft`, `REQUIRED_ENVELOPE_FIELDS`, `getMissingFields()`
- `src/components/pdf/BodyRenderer.tsx` — renders `ContentBlock[]` into `@react-pdf/renderer` elements; tables use dark-brown header row + zebra striping + gold borders

### Changed
- `src/store/sessionStore.ts` — replaced flat state shape with `SessionState { draft: LetterDraft | null, rawUserInput, uploadedContent, isGenerating, watermarkEnabled }`; added `createEmptyDraft()` and `useSessionStore()` hook
- `src/components/pdf/LetterheadDocument.tsx` — now accepts `draft: LetterDraft` prop; renders envelope section (date/ref row, recipient block, subject line, gold divider) then `<BodyRenderer blocks={blocks} />` then `<Signatory>`
- `src/screens/PreviewScreen.tsx` — wired to new `SessionState`; download filename now `svc-{type}-{date}.pdf`
- `src/constants/brand.ts` — added `COLORS.text` (`#2C1F16`), `COLORS.darkBrown` (alias for brown), `FONTS.bodySemiBold` (`'Montserrat-SemiBold'`)

---

## Session 3 — 2026-06-05

### Changed
- Redesigned header: ivory bg, Playfair Display SC wordmark, gold hairline rule (removed dark band)
- Redesigned footer: ivory bg, gold hairline rule, two-row layout (contact row + address row)
- `brand.ts`: real phone, email, address, GSTIN, corrected tagline
- `fonts.ts`: registered Playfair Display SC Bold family
- `Signatory`: removed stamp container, absolute positioning to bottom of content area
- `docs/FONTS.md`: updated with Playfair Display SC instructions

---

## Session 2 — 2026-06-04

### Fixed
- `Buffer is not defined` — inline IIFE shim in `main.tsx`
- `Font family not registered: Montserrat` — TTF files + `Font.register()` in `fonts.ts`
- Export button unclickable + double render crash — removed `PDFDownloadLink`, single `BlobProvider`
- `vite.config.ts` externalizing `buffer` package — switched to `define` block
- Preview not showing on mobile — `<object>` on all devices
- Ivory bleed-through below preview — dark background on preview screen (D013)
- `apple-mobile-web-app-capable` deprecation warning — switched to `mobile-web-app-capable`

---

## Session 1 — 2026-06-03

### Added
- `vite.config.ts`, `src/index.css`, `src/main.tsx`, `src/App.tsx`
- `src/components/pdf/LetterheadDocument.tsx`
- `src/components/pdf/LetterheadFirstPage.tsx`
- `src/components/pdf/LetterheadContinuationPage.tsx`
- `src/components/pdf/Header.tsx`
- `src/components/pdf/Footer.tsx`
- `src/components/pdf/Watermark.tsx`
- `src/components/pdf/Signatory.tsx`
- `src/components/ui/BottomNav.tsx`
- `src/screens/HomeScreen.tsx`, `IntakeScreen.tsx`, `DraftScreen.tsx`, `PreviewScreen.tsx`, `SettingsScreen.tsx`
- `src/store/sessionStore.ts`
- `src/constants/brand.ts`
- `src/pdf/fonts.ts`
- `public/manifest.webmanifest`
- `docs/FONTS.md`
