# Architecture

## Stack
- **React 19** + **Vite 6** + **TypeScript**
- **@react-pdf/renderer v4** — PDF generation in browser via Web Worker
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- **vite-plugin-pwa** — PWA manifest, service worker, offline support
- **mammoth** — `.docx` parsing (Phase 7)
- **Gemini Flash + Groq** — AI providers via `src/ai/adapter.ts` (Phase 4+)

---

## Directory Structure

```
svc-letter-studio/
├── public/
│   ├── fonts/                  # Self-hosted TTF files (see docs/FONTS.md)
│   │   ├── CormorantGaramond-SemiBold.ttf
│   │   ├── Montserrat-Regular.ttf
│   │   ├── Montserrat-Italic.ttf
│   │   ├── Montserrat-SemiBold.ttf
│   │   └── Montserrat-Bold.ttf
│   ├── logo/
│   │   ├── logo.png             # Used in PDF header + watermark
│   │   └── logo.svg
│   └── icons/                  # PWA icons
├── src/
│   ├── ai/
│   │   └── adapter.ts           # All AI calls go here (Phase 4+)
│   ├── components/
│   │   ├── pdf/                 # @react-pdf/renderer components
│   │   │   ├── LetterheadDocument.tsx
│   │   │   ├── LetterheadFirstPage.tsx
│   │   │   ├── LetterheadContinuationPage.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Watermark.tsx
│   │   │   └── Signatory.tsx
│   │   └── ui/                  # App shell UI components
│   │       └── BottomNav.tsx
│   ├── constants/
│   │   └── brand.ts             # COLORS, FONTS, CONTACT, BRAND_NAME_*, BRAND_TAGLINE
│   ├── pdf/
│   │   └── fonts.ts             # Font.register() calls — imported once in LetterheadDocument
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── IntakeScreen.tsx
│   │   ├── DraftScreen.tsx
│   │   ├── PreviewScreen.tsx    # Single BlobProvider — see D010
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   └── sessionStore.ts      # In-memory state (no localStorage)
│   ├── App.tsx               # Screen router + BottomNav visibility + bg color
│   ├── main.tsx              # Buffer polyfill IIFE (must stay first) + React root
│   └── index.css             # Tailwind v4 + Google Fonts (web UI only) + CSS vars
├── index.html             # PWA meta tags incl. mobile-web-app-capable
├── vite.config.ts         # Vite + PWA + define block for global/process
└── package.json
```

---

## Key Architectural Rules

1. **All AI calls** must go through `src/ai/adapter.ts`. Never call Gemini or Groq directly.
2. **No localStorage / sessionStorage** — blocked in sandboxed environments.
3. **Single `BlobProvider`** per PDF render. Never use `PDFDownloadLink` alongside `BlobProvider` (double render crash in v4).
4. **Font files** must be `.ttf` in `public/fonts/`. Google Fonts CDN `.woff2` does not work with PDFKit.
5. **Buffer polyfill** IIFE in `main.tsx` must remain the first executed code. Do not move it below any import.
6. **CSS custom properties** in `index.css` are the single source of truth for brand colors and fonts in the web UI.

---

## PDF Render Flow

```
PreviewScreen
  └── BlobProvider (renders once)
        ├── loading → show pill
        ├── error   → show error card
        └── blob/url ready
              ├── <object data={url}> → inline preview (all devices)
              └── Download button → URL.createObjectURL(blob) → programmatic <a> click
```

---

## Environment Variables

```
VITE_GEMINI_API_KEY=
VITE_GROQ_API_KEY=
```
