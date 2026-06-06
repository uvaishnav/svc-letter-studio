# Architecture

## Project Structure

```
svc-letter-studio/
├── public/
│   ├── fonts/                       # Self-hosted TTF files (see docs/FONTS.md)
│   ├── icons/                       # PWA icons
│   └── manifest.webmanifest
├── src/
│   ├── ai/
│   │   ├── types.ts                 # AIInput, AIOutput, AIProvider interface
│   │   ├── prompts.ts               # buildSystemPrompt(), buildUserPrompt() — shared
│   │   ├── gemini.ts                # GeminiProvider (Gemini 2.0 Flash)
│   │   ├── groq.ts                  # GroqProvider (llama-3.3-70b-versatile)
│   │   └── adapter.ts               # generateDraft() — primary entry point, fallback routing
│   ├── components/
│   │   └── pdf/
│   │       ├── LetterheadDocument.tsx
│   │       ├── LetterheadFirstPage.tsx
│   │       ├── LetterheadContinuationPage.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Watermark.tsx
│   │       ├── Signatory.tsx
│   │       └── BodyRenderer.tsx     # Renders ContentBlock[] into PDF elements
│   ├── constants/
│   │   └── brand.ts                 # Colors, fonts, contact info, tagline
│   ├── pdf/
│   │   └── fonts.ts                 # Font.register() calls for @react-pdf/renderer
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── IntakeScreen.tsx         # Phase 5 (not yet built)
│   │   ├── PreviewScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   └── sessionStore.ts          # SessionState, useSessionStore(), createEmptyDraft()
│   ├── types/
│   │   └── document.ts              # DocumentType, ContentBlock union, DocumentEnvelope, LetterDraft
│   ├── App.tsx                      # Screen router + BottomNav visibility + bg color
│   ├── main.tsx                     # Buffer polyfill IIFE (must stay first) + React root
│   └── index.css                    # Tailwind v4 + Google Fonts (web UI only) + CSS vars
├── docs/
│   ├── prd.md
│   ├── progress.md
│   ├── decisions.md
│   ├── architecture.md
│   ├── changelog.md
│   └── FONTS.md
├── .env.example                     # Documents VITE_GEMINI_API_KEY, VITE_GROQ_API_KEY
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

## AI Call Flow

```
Component / Screen
       │
       ▼
 generateDraft(AIInput)        ← src/ai/adapter.ts  (only import allowed by components)
       │
       ├── GeminiProvider.generateDraft()   → Gemini 2.0 Flash REST API
       │         ↓ on error
       └── GroqProvider.generateDraft()     → Groq llama-3.3-70b REST API
               ↓
         LetterDraft  →  sessionStore  →  PreviewScreen
```

## Data Flow

```
User text input
       │
  AIInput { userText, documentType?, clarifications? }
       │
  generateDraft() in adapter.ts
       │
  LetterDraft { envelope: DocumentEnvelope, body: ContentBlock[] }
       │
  sessionStore.draft
       │
  LetterheadDocument (PDF)
```

## Key Rules
- Buffer polyfill IIFE in `main.tsx` must always be the first executed code
- All AI calls must go through `src/ai/adapter.ts` — never import gemini.ts or groq.ts directly
- No localStorage / sessionStorage anywhere
- Fonts must be TTF, self-hosted in `public/fonts/`
