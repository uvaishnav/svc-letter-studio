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
│   │   ├── types.ts                 # AIInput, AIOutput, AIProvider, TaskTier, PipelineContext
│   │   ├── models.ts                # geminiUrl(tier), geminiModelName(tier) — tier → model resolver
│   │   ├── prompts.ts               # Task-specific prompt builders (classify, clarify, draft)
│   │   ├── gemini.ts                # GeminiProvider — generateDraft() + call(system, user, tier)
│   │   ├── groq.ts                  # GroqProvider — generateDraft() + call(system, user)
│   │   ├── adapter.ts               # Pipeline orchestrator — ONLY file components import
│   │   └── tasks/
│   │       ├── classifyIntent.ts    # Tier 1: intent detection + field extraction
│   │       ├── generateClarification.ts  # Tier 1: one clarifying question
│   │       └── generateDraft.ts     # Tier 3: full LetterDraft generation
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
│   │   ├── IntakeScreen.tsx         # Phase 5 ✅ — full AI intake + clarification pipeline
│   │   ├── PreviewScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   └── sessionStore.ts          # SessionState (+ pipelineCtx), useSessionStore(), createEmptyDraft()
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

## Tiered AI Call Flow (Phase 5+)

```
IntakeScreen
     │
     ▼
classifyPipeline(rawInput)           ← Tier 1: gemini-2.0-flash
     │  returns PipelineContext
     ▼
clarifyPipeline(ctx)                 ← Tier 1: gemini-2.0-flash (only if missingFields > 0)
     │  returns { ctx, question }
     │
     ├── question? → show to user → user answers → enrich ctx
     │
     ▼
draftPipeline(ctx)                   ← Tier 3: gemini-3.5-flash
     │  receives FULL enriched PipelineContext (no information loss)
     ▼
AIOutput { draft: LetterDraft, provider }
     │
     ▼
sessionStore  →  PreviewScreen
```

## Fallback Strategy (all tiers)

```
Tier 1/2/3 Gemini call
     │
     ├── success → return result
     └── error   → Groq llama-3.3-70b-versatile (same prompt, JSON mode)
```

## Data Flow

```
User text input (IntakeScreen)
     │
 PipelineContext { rawInput }
     │  + classifyIntent (Tier 1)
 PipelineContext { rawInput, documentType, detectedFields, missingFields }
     │  + clarification (Tier 1, optional)
 PipelineContext { ..., clarificationQuestion, clarificationAnswer }
     │  + generateDraft (Tier 3)
 LetterDraft { envelope: DocumentEnvelope, body: ContentBlock[] }
     │
 sessionStore.draft
     │
 LetterheadDocument (PDF)
```

## Key Rules
- Buffer polyfill IIFE in `main.tsx` must always be the first executed code
- All AI calls must go through `src/ai/adapter.ts` — never import gemini.ts, groq.ts, or task files directly in components
- No localStorage / sessionStorage anywhere
- Fonts must be TTF, self-hosted in `public/fonts/`
- Tier assignment lives in `src/ai/models.ts` — never hardcode model names elsewhere
