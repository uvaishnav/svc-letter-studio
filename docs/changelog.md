# Changelog

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts` — `DocumentType` union (8 types), `ContentBlock` discriminated union (paragraph, heading, bullet\_list, numbered\_list, table, spacer, divider), `DocumentEnvelope`, `LetterDraft`, `REQUIRED_ENVELOPE_FIELDS`, `getMissingFields()`
- `src/components/pdf/BodyRenderer.tsx` — renders `ContentBlock[]` into `@react-pdf/renderer` elements; tables use dark-brown header row + zebra striping + gold borders
- `src/store/sessionStore.ts` — updated `SessionState` to `{ draft: LetterDraft | null }`, added `createEmptyDraft()`, `useSessionStore()` hook
- `src/components/pdf/LetterheadDocument.tsx` — wired to `LetterDraft`; renders envelope section + BodyRenderer blocks + Signatory
- `src/screens/PreviewScreen.tsx` — wired to new session shape; download filename from doc type + date
- `src/constants/brand.ts` — added `COLORS.text`, `COLORS.darkBrown`, `FONTS.bodySemiBold`
- `src/ai/types.ts` — `AIInput`, `AIOutput`, `AIProvider` interface
- `src/ai/prompts.ts` — `buildSystemPrompt()`, `buildUserPrompt(input)` shared prompt layer
- `src/ai/gemini.ts` — `GeminiProvider` using Gemini 2.0 Flash REST API with native JSON mode
- `src/ai/groq.ts` — `GroqProvider` using llama-3.3-70b-versatile with `response_format: json_object`
- `src/ai/adapter.ts` — `generateDraft(input: AIInput): Promise<AIOutput>` — Gemini-first with Groq fallback
- `.env.example` — documents `VITE_GEMINI_API_KEY` and `VITE_GROQ_API_KEY`

### Changed
- `docs/architecture.md` — added `src/ai/` module tree, AI call flow diagram, data flow diagram

---

## Session 3 — 2026-06-05

### Changed
- `src/components/pdf/Header.tsx` — redesigned: ivory bg, Playfair Display SC wordmark, gold hairline rule, removed dark band
- `src/components/pdf/Footer.tsx` — redesigned: ivory bg, gold hairline rule on top, GSTIN centered, clean two-row layout
- `src/constants/brand.ts` — updated phone, email, address, GSTIN, corrected tagline
- `src/pdf/fonts.ts` — registered Playfair Display SC Bold family
- `src/components/pdf/Signatory.tsx` — removed stamp container; absolute bottom positioning

### Added
- `docs/FONTS.md` — Playfair Display SC TTF instructions added

---

## Session 2 — 2026-06-04

### Fixed
- `main.tsx` — inline Buffer polyfill IIFE (must be first)
- `vite.config.ts` — removed `buffer` from `optimizeDeps.exclude`; added `define` block
- `src/pdf/fonts.ts` — registered all Montserrat weights + italics
- `src/screens/PreviewScreen.tsx` — single BlobProvider, removed PDFDownloadLink, fixed double render
- `src/App.tsx` — dynamic dark background on preview screen

### Added
- `docs/FONTS.md`

---

## Session 1 — 2026-06-03

### Added
- Initial scaffold: React + Vite + TypeScript
- PWA: vite-plugin-pwa, manifest, icons
- Brand tokens: CSS custom properties in index.css
- Shell UI: BottomNav, screen routing in App.tsx
- Phase 2: @react-pdf/renderer, all PDF components, PreviewScreen
