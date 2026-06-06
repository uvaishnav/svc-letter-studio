# Architecture

## Repository Structure

```
svc-letter-studio/
├── public/
│   ├── fonts/               # Self-hosted TTF font files (see docs/FONTS.md)
│   ├── icons/               # PWA icons
│   └── manifest.webmanifest
├── src/
│   ├── ai/
│   │   ├── adapter.ts         # Pipeline orchestrator: classifyPipeline, clarifyPipeline, draftPipeline
│   │   ├── gemini.ts          # GeminiProvider — .call(system, user, tier)
│   │   ├── groq.ts            # GroqProvider — .call(system, user)
│   │   ├── models.ts          # TaskTier → Gemini model name/URL mapping
│   │   ├── prompts.ts         # Task-specific prompt builders
│   │   ├── types.ts           # AIInput, AIOutput, AIProvider, TaskTier, PipelineContext
│   │   └── tasks/
│   │       ├── classifyIntent.ts
│   │       ├── generateClarification.ts
│   │       └── generateDraft.ts
│   ├── components/
│   │   └── pdf/
│   │       ├── BodyRenderer.tsx        # Renders ContentBlock[] → PDF elements
│   │       ├── Footer.tsx              # Fixed footer, page 1 only
│   │       ├── Header.tsx              # Ivory bg, logo, brand name, gold rule
│   │       ├── LetterheadContinuationPage.tsx  # Blank ivory page; exports CONT_CONTENT_MAX_HEIGHT
│   │       ├── LetterheadDocument.tsx  # Root PDF; calls partitionBlocks; renders all pages
│   │       ├── LetterheadFirstPage.tsx # Page 1; maxHeight:648.14pt content area
│   │       ├── Signatory.tsx           # Flow-positioned; appears on last page after content
│   │       └── Watermark.tsx           # Fixed; repeats on all pages
│   ├── constants/
│   │   └── brand.ts               # COLORS, FONTS, brand text (phone, GSTIN, address, tagline)
│   ├── pdf/
│   │   ├── fonts.ts               # Font.register() calls for all TTF families
│   │   └── partitionBlocks.ts     # Pure pagination: ContentBlock[] → { page1, continuations[], totalPages }
│   ├── screens/
│   │   ├── IntakeScreen.tsx       # Freeform input → AI pipeline → draft
│   │   └── PreviewScreen.tsx      # BlobProvider, inline preview, download
│   ├── store/
│   │   └── sessionStore.ts        # Zustand store: draft, pipelineCtx, aiProvider
│   ├── types/
│   │   └── document.ts            # DocumentType, ContentBlock (7 variants), DocumentEnvelope, LetterDraft
│   ├── App.tsx                    # Screen router, background switcher
│   └── main.tsx                   # Buffer polyfill shim (must be first), app mount
├── docs/
│   ├── architecture.md            # This file
│   ├── changelog.md
│   ├── decisions.md
│   ├── FONTS.md
│   ├── prd.md
│   └── progress.md
├── index.html
├── vite.config.ts
├── .env.example
└── package.json
```

## Key Data Flow

```
IntakeScreen
  └→ adapter.ts: classifyPipeline() → Tier 1 (gemini-2.0-flash)
  └→ adapter.ts: clarifyPipeline()  → Tier 1 (gemini-2.0-flash)  [optional]
  └→ adapter.ts: draftPipeline()    → Tier 3 (gemini-3.5-flash)
        └→ LetterDraft → sessionStore

PreviewScreen
  └→ sessionStore.draft
  └→ LetterheadDocument
        └→ estimateEnvelopeHeight()
        └→ partitionBlocks(blocks, envelopeHeight)
              └→ { page1, continuations[], totalPages }
        └→ <LetterheadFirstPage>  ← page1 blocks + signatory (if last)
        └→ <LetterheadContinuationPage> × N  ← continuation blocks + signatory (if last)
```

## Page Geometry

| Page | Height cap | Width | Notes |
|------|-----------|-------|-------|
| Page 1 content area | `648.14pt` | `523.28pt` | `841.89 − 108.75 (header) − 20 (marginTop) − 65 (marginBottom)` |
| Continuation content area | `743.89pt` | `523.28pt` | `841.89 − 50 (marginTop) − 48 (marginBottom)` |
| Effective page 1 body | `648.14 − envelopeHeight` | `523.28pt` | Envelope occupies top of page 1 content area |

## Partition Rules (priority order)

| Step | Rule | Conditional? |
|------|------|--------------|
| 1 | Greedy fill | — |
| 2 | Signatory overflow | Always |
| 3a | `keepWithNext` — lone heading at bottom | **Unconditional** |
| 3b | `sectionAffinity` — heading+intro reunited with section body | 70% fill guard |
| 4 | Orphan check (< 55pt on next page) | Always |
| 5 | Thin-page check (< 80pt visual on last page) | Always |
| 6 | Empty-page cleanup | — |

## Environment Variables

```
VITE_GEMINI_API_KEY=   # Required — Gemini Flash API key
VITE_GROQ_API_KEY=     # Required — Groq API key (fallback)
```

## Deleted Files

| File | Reason |
|------|--------|
| `src/pdf/useCompactLayout.ts` | Replaced by `partitionBlocks.ts`. Spacing compression approach abandoned — blocks are moved between pages instead. |
