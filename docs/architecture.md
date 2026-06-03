# Architecture

## Project structure

```
svc-letter-studio/
├── public/
│   ├── icons/           # PWA icons
│   └── logo/            # SVC logo assets
├── src/
│   ├── ai/
│   │   ├── providers/
│   │   │   ├── gemini.ts
│   │   │   └── groq.ts
│   │   ├── adapter.ts   # Common provider interface
│   │   └── prompts/     # Prompt templates per document type
│   ├── components/
│   │   ├── ui/          # App UI components
│   │   └── pdf/         # React-PDF letterhead components
│   │       ├── LetterheadFirstPage.tsx
│   │       ├── LetterheadContinuationPage.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Watermark.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── IntakeScreen.tsx
│   │   ├── DraftScreen.tsx
│   │   └── PreviewScreen.tsx
│   ├── schema/
│   │   ├── documentTypes.ts   # Enum of supported types
│   │   └── documentSchema.ts  # Core field definitions per type
│   ├── store/
│   │   └── sessionStore.ts    # In-memory session state
│   ├── utils/
│   │   ├── fileParser.ts      # .docx and PDF text extraction
│   │   └── pdfExport.ts       # PDF generation helpers
│   ├── constants/
│   │   ├── brand.ts           # Colors, fonts, letterhead constants
│   │   └── defaults.ts        # Signatory defaults, page defaults
│   ├── App.tsx
│   └── main.tsx
├── docs/                # Documentation files (this folder)
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## Key modules

### AI adapter interface
All AI calls go through a common adapter so providers are interchangeable:
```ts
interface AIProvider {
  analyzeBrief(input: string, context: DocumentContext): Promise<AnalysisResult>
  askNextQuestion(context: DocumentContext): Promise<string>
  draftDocument(context: DocumentContext): Promise<string>
  improveDraft(action: ImprovementAction, draft: string, context: DocumentContext): Promise<string>
}
```

### PDF component hierarchy
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

### Screen routing
Simple in-memory routing, no URL-based router required for v1. Use a state-driven screen switcher.

## State model (in-memory only)
```ts
interface SessionState {
  screen: 'home' | 'intake' | 'draft' | 'preview'
  documentContext: DocumentContext
  draftContent: string
  conversationHistory: Message[]
  pdfSettings: PDFSettings
  signatoryName: string
  signatoryDesignation: string
}
```

## No backend
No API server. No database. All state lives in memory for the session duration.

## Environment variables required
```
VITE_GEMINI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
```
