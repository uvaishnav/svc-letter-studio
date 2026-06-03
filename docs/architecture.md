# Architecture

## Project structure

```
svc-letter-studio/               ← repo root
├── docs/                        ← session documentation
└── svc-letter-studio/           ← Vite app root
    ├── public/
    │   ├── icons/               ← PWA icons (192, 512, apple-touch) [MANUAL: add these]
    │   └── logo/                ← SVC logo assets [MANUAL: add logo.svg + logo.png]
    ├── src/
    │   ├── ai/
    │   │   ├── providers/
    │   │   │   ├── gemini.ts    ← Phase 4
    │   │   │   └── groq.ts      ← Phase 4
    │   │   ├── adapter.ts       ← Phase 4 — common provider interface
    │   │   └── prompts/         ← Phase 5+
    │   ├── components/
    │   │   ├── ui/
    │   │   │   └── BottomNav.tsx  ✅ Phase 1
    │   │   └── pdf/             ← Phase 2
    │   │       ├── LetterheadFirstPage.tsx
    │   │       ├── LetterheadContinuationPage.tsx
    │   │       ├── Header.tsx
    │   │       ├── Footer.tsx
    │   │       └── Watermark.tsx
    │   ├── screens/
    │   │   ├── HomeScreen.tsx     ✅ Phase 1
    │   │   ├── IntakeScreen.tsx   ✅ Phase 1 (placeholder)
    │   │   ├── DraftScreen.tsx    ✅ Phase 1 (placeholder)
    │   │   ├── PreviewScreen.tsx  ✅ Phase 1 (placeholder)
    │   │   └── SettingsScreen.tsx ✅ Phase 1 (placeholder)
    │   ├── schema/
    │   │   ├── documentTypes.ts   ← Phase 3
    │   │   └── documentSchema.ts  ← Phase 3
    │   ├── store/
    │   │   └── sessionStore.ts    ✅ Phase 1 — useSessionStore hook
    │   ├── utils/
    │   │   ├── fileParser.ts      ← Phase 7
    │   │   └── pdfExport.ts       ← Phase 8
    │   ├── constants/
    │   │   ├── brand.ts           ✅ Phase 1 — COLORS, FONTS, BRAND_NAME, CONTACT
    │   │   └── defaults.ts        ✅ Phase 1 — DEFAULT_SIGNATORY, DEFAULT_PDF_SETTINGS
    │   ├── App.tsx                ✅ Phase 1 — state-driven Screen router
    │   └── main.tsx               ✅ Phase 1
    ├── index.html                 ✅ Phase 1 — PWA meta tags
    ├── vite.config.ts             ✅ Phase 1 — PWA + Tailwind v4 plugins
    ├── tailwind.config.ts         ← not needed for Tailwind v4 (uses vite plugin)
    └── package.json
```

## Routing
State-driven via `useState<Screen>` in `App.tsx`. No URL router. `Screen` type is exported and imported by all screens and BottomNav.

## Key modules

### Session store
`useSessionStore()` in `src/store/sessionStore.ts` — single hook exposing `{ state, update }`. `update()` does a shallow merge. Passed down as props or lifted to `App.tsx` when needed.

### AI adapter interface (Phase 4)
```ts
interface AIProvider {
  analyzeBrief(input: string, context: DocumentContext): Promise<AnalysisResult>
  askNextQuestion(context: DocumentContext): Promise<string>
  draftDocument(context: DocumentContext): Promise<string>
  improveDraft(action: ImprovementAction, draft: string, context: DocumentContext): Promise<string>
}
```

### PDF component hierarchy (Phase 2)
```
<LetterheadDocument>
  <LetterheadFirstPage>
    <Header />
    <GoldDivider />
    <Watermark />
    <ContentArea>{children}</ContentArea>
    <Footer />
  </LetterheadFirstPage>
  {extraPages.map(page =>
    <LetterheadContinuationPage>
      <MinimalTopBar />
      <ContentArea>{page}</ContentArea>
      <PageNumber />
    </LetterheadContinuationPage>
  )}
</LetterheadDocument>
```

## State model (in-memory only)
```ts
interface SessionState {
  screen: 'home' | 'intake' | 'draft' | 'preview' | 'settings'
  documentContext: DocumentContext
  draftContent: string
  pdfSettings: PDFSettings
  signatoryName: string
  signatoryDesignation: string
}
```

## No backend
No API server. No database. All state lives in memory for session duration. No localStorage or sessionStorage.

## Environment variables
```
VITE_GEMINI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
```
