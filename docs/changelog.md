# Changelog

## Session 12 — 2026-06-07

### Fixed
- `src/App.tsx` — Removed `isIntake` and `isUpload` from `hideNav`; bottom nav now visible on Intake, Upload, and all non-preview/non-draft screens
- `src/App.tsx` — Removed `&& state.draft` guard on DraftScreen mount; `DraftScreen` now always renders and handles its own empty state (shows "No draft yet" message with back button)
- `src/screens/IntakeScreen.tsx` — Added `← Back` button in header that navigates to `home`; button is hidden while AI pipeline is running to prevent mid-flight navigation

### Navigation behaviour after fix
| Screen | Bottom Nav | Back Button |
|--------|-----------|-------------|
| Home | ✅ | — |
| Intake (Compose) | ✅ | ✅ ← Back (header) |
| Upload | ✅ | ✅ ← Back (header, pre-existing) |
| Draft | ❌ (focused edit mode) | ✅ ← Intake (top bar, pre-existing) |
| Preview | ❌ (full-screen PDF) | ✅ ✏️ Edit (top bar, pre-existing) |
| Settings | ✅ | — |

---

## Session 11 — 2026-06-07

### Added
- `src/utils/extractText.ts` — `extractTextFromFile(file: File)`: mammoth for .docx, pdfjs-dist for .pdf; returns `{ text, warning? }`; throws descriptive error on image-only PDF, empty file, or unsupported format
- `src/screens/UploadScreen.tsx` — full Upload & Convert screen: file picker (drag-and-drop + tap), 4-stage pipeline (extracting → classifying → clarifying → generating), clarification step with Skip option, extraction warning banner, error state with retry
- `src/screens/BlankScreen.tsx` — blank letterhead download screen: BlobProvider wraps empty `LetterheadDocument`, loading spinner, download link with dated filename
- `src/screens/HomeScreen.tsx` — fully rebuilt: SVC brand header (logo block, gold CONSTRUCTIONS label, Montserrat tagline), gold divider rule, 3 entry cards (Create with AI primary dark, Upload & Convert gold-border, Blank Letterhead subtle), footer note
- `src/App.tsx` — `Screen` type extended: added `'upload'` and `'blank'`; UploadScreen and BlankScreen wired; BottomNav hidden on `upload` screen

### Changed
- `src/App.tsx` — `hideNav` now includes `isUpload` so BottomNav is hidden during upload flow
- `docs/architecture.md` — added `mammoth`, `pdfjs-dist` to stack; added `UploadScreen`, `BlankScreen`, `extractText.ts` to directory tree; added Upload & Convert flow diagram; updated screen flow diagram
- `docs/decisions.md` — added D028 (Upload & Convert pipeline reuse) and D029 (Blank Letterhead as dedicated screen)
- `docs/progress.md` — Phase 7 (PRD) marked complete; blockers updated with npm install note

### Dependencies required
- `mammoth` — `.docx` text extraction
- `pdfjs-dist` — browser-safe PDF text extraction
- **Run:** `npm install mammoth pdfjs-dist`

---

## Session 10 — 2026-06-07

### Changed
- `src/store/sessionStore.ts` — removed duplicate `DEFAULT_SIGNATORY` constant; now imports from `src/constants/defaults.ts`
- `src/store/sessionStore.ts` — removed duplicate `DEFAULT_PDF_SETTINGS` constant; now imports from `src/constants/defaults.ts`
- `src/ai/tasks/generateDraft.ts` — removed two hardcoded signatory string literals (`'UPPALAPATI SUREKHA'`, `'Proprietor'`); now uses `DEFAULT_SIGNATORY` imported from `src/constants/defaults.ts`

### Single sources of truth
| Value | Location |
|---|---|
| Phone, email, GSTIN, address | `src/constants/brand.ts` → `CONTACT` |
| Signatory name + designation | `src/constants/defaults.ts` → `DEFAULT_SIGNATORY` |
| Watermark on/off, paper size | `src/constants/defaults.ts` → `DEFAULT_PDF_SETTINGS` |
| Brand name, tagline | `src/constants/brand.ts` → `BRAND_NAME_*`, `BRAND_TAGLINE` |

---

## Session 9 — 2026-06-06

### Added
- `src/screens/PreviewScreen.tsx` — `canShareFiles()` helper for runtime iOS detection
- `src/screens/PreviewScreen.tsx` — `⬆ Share` button using `navigator.share({ files })` on iOS
- `src/screens/PreviewScreen.tsx` — `⬇ Download` fallback using `<a download>` on desktop
- `src/screens/PreviewScreen.tsx` — 🖨️ Print button: share sheet on iOS, `window.print()` via hidden iframe on desktop
- `src/screens/PreviewScreen.tsx` — Adaptive hint text (iOS vs desktop message)
- `src/screens/PreviewScreen.tsx` — AI provider badge (Gemini / Groq, hidden when null)
- `src/screens/PreviewScreen.tsx` — Filename: `SVC-{docType}-{date}.pdf`

---

## Session 8c — 2026-06-06

### Fixed
- `src/screens/IntakeScreen.tsx` — navigate target changed from `'preview'` → `'draft'` after generation (manual fix by user)

---

## Session 8b — 2026-06-06

### Changed
- `src/screens/PreviewScreen.tsx` — added ✏️ Edit button (toggle back to DraftScreen)
- `src/components/draft/BlockList.tsx` — redesigned: full content visible in list, type-aware inline editors for all block types (paragraph textarea, heading input, list item editors, table cell editors)
- `src/screens/DraftScreen.tsx` — passes `onUpdate` to BlockList, deselects block after AI improve action, hint text added

---

## Session 8a — 2026-06-06

### Added
- `src/ai/tasks/improveBlock.ts` — Tier 2 per-block AI improve (Shorten / Expand / Formal / Rewrite / Custom prompt)
- `src/components/draft/EnvelopeFields.tsx` — collapsible tap-to-edit envelope section (date, subject, recipient)
- `src/components/draft/BlockList.tsx` — scrollable block list with tap-to-select, type-aware inline edit
- `src/components/draft/BlockActionBar.tsx` — sticky bottom sheet: AI improve presets + Tell AI + manual edit
- `src/screens/DraftScreen.tsx` — full edit mode screen
- `src/store/sessionStore.ts` — `updateBlock()`, `updateEnvelope()` actions

### Changed
- `src/screens/IntakeScreen.tsx` — navigates to `'draft'` after generation
- `src/App.tsx` — wired DraftScreen, BottomNav hidden on draft screen

---

## Session 7 — 2026-06-06

### Fixed
- `src/components/pdf/LetterheadFirstPage.tsx` — `flex:1` → `maxHeight:648.14` (root cause of footer overlap / content overflow)

### Added
- `src/pdf/partitionBlocks.ts` — 6-step pagination pipeline (measure → orphan → widow → section-affinity → 70% fill guard → finalize)
- `src/components/pdf/LetterheadContinuationPage.tsx` — rebuilt: clean ivory, `marginTop:50pt`, `marginBottom:48pt`, watermark fixed, page number `position:absolute bottom:18 right:36`; exports `CONT_CONTENT_MAX_HEIGHT`

### Changed
- `src/components/pdf/LetterheadDocument.tsx` — rewritten: calls `partitionBlocks()`, renders explicit `<Page>` array, signatory on last page only

### Deleted
- `src/pdf/useCompactLayout.ts` — spacing compression hook removed entirely

---

## Session 6 — 2026-06-06

### Fixed
- `src/components/pdf/Footer.tsx` — corrected render prop type and positioning
- `src/components/pdf/Signatory.tsx` — fixed flow layout margins

---

## Session 5 — 2026-06-06

### Added
- `src/ai/models.ts` — `geminiUrl(tier)` mapping
- `src/ai/tasks/classifyIntent.ts` — Tier 1 intent classification
- `src/ai/tasks/generateClarification.ts` — Tier 1 single follow-up question
- `src/ai/tasks/generateDraft.ts` — Tier 3 full draft generation
- `src/screens/IntakeScreen.tsx` — 4-stage pipeline UI (classifying → clarifying → generating)

---

## Session 4 — 2026-06-06

### Added
- `src/types/document.ts` — `DocumentType`, `ContentBlock`, `DocumentEnvelope`, `LetterDraft`
- `src/store/sessionStore.ts` — `SessionState`, `createEmptyDraft()`, `useSessionStore()`
- `src/components/pdf/BodyRenderer.tsx` — `ContentBlock[]` → PDF elements
- `src/ai/types.ts`, `src/ai/prompts.ts`, `src/ai/gemini.ts`, `src/ai/groq.ts`, `src/ai/adapter.ts`
- `.env.example`

---

## Session 3 — 2026-06-05

### Changed
- `src/components/pdf/Header.tsx` — redesigned: Playfair Display SC Bold, gold ornaments, Montserrat tagline, hairline rule
- `src/components/pdf/Footer.tsx` — three-column layout, gold hairline rule above
- `src/constants/brand.ts` — added `CONTACT`, `FONTS` exports

---

## Session 2 — 2026-06-04

### Fixed
- `src/main.tsx` — Buffer polyfill IIFE shim added first
- `vite.config.ts` — `define: { 'global': 'globalThis' }` block
- `src/pdf/fonts.ts` — absolute URL font registration
- `src/screens/PreviewScreen.tsx` — `<object>` preview, mobile viewport fix

---

## Session 1 — 2026-06-03

### Added
- React + Vite + TypeScript scaffold
- `vite-plugin-pwa` setup
- Tailwind CSS v4
- Brand token CSS variables
- Shell layout with BottomNav
- `src/components/pdf/` — initial LetterheadDocument, Header, Footer, Watermark
