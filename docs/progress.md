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
- `Header` — ivory bg, logo + Playfair Display SC brand name, gold dash ornaments, Montserrat tagline, full-width gold hairline rule
- `Footer` — ivory bg, gold hairline rule on top, phone | GSTIN | email row, address centered below
- `Watermark` — centred logo at 3.2% opacity, 220px
- `Signatory` — absolutely positioned to bottom of content area (above footer), right-aligned, signature ruled line, name + designation
- `PreviewScreen` — single BlobProvider, inline `<object>` preview on all devices, download button
- Self-hosted font loading from `public/fonts/` via `src/pdf/fonts.ts`
- Buffer polyfill shim in `main.tsx`
- `vite.config.ts` — `define: { global, process.env, process.browser }`
- `App.tsx` — dynamic background (dark on preview, ivory elsewhere)
- `brand.ts` — corrected with real contact data (phone, email, address, GSTIN, tagline)

#### Font files required in `public/fonts/` (see `docs/FONTS.md`)
- `PlayfairDisplaySC-Bold.ttf`
- `PlayfairDisplay-Regular.ttf`
- `PlayfairDisplay-Bold.ttf`
- `Montserrat-Regular.ttf`
- `Montserrat-Italic.ttf`
- `Montserrat-SemiBold.ttf`
- `Montserrat-Bold.ttf`

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
- Diagnosed and fixed: `Buffer is not defined`
- Diagnosed and fixed: `Font family not registered: Montserrat`
- Diagnosed and fixed: Export button unclickable + double render crash
- Fixed: `vite.config.ts` externalizing `buffer` package
- Fixed: Preview not showing on mobile
- Fixed: Ivory bleed-through below preview
- Fixed: `apple-mobile-web-app-capable` deprecation warning
- Rebuilt: Premium letterhead — dark brown header band, gold accents
- Added: `docs/FONTS.md`

### Session 3 — 2026-06-05
- Redesigned header: ivory bg, no dark band, logo + Playfair Display SC wordmark, gold hairline rule
- Redesigned footer: ivory bg, gold hairline rule, GSTIN prominent center, clean two-row layout
- Updated `brand.ts`: real phone, email, address, GSTIN, corrected tagline
- Switched font: Playfair Display SC Bold for `SRI VAISHNAV` (replaces Cormorant Garamond / Cinzel)
- Removed stamp container from `Signatory` (physical stamps used instead)
- Fixed: Signatory now absolutely positioned to bottom of content area — always at bottom on empty letterhead
- Registered `Playfair Display SC` family in `fonts.ts`
- Updated `docs/FONTS.md` with Playfair Display SC instructions
