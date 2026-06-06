# Architecture

## Stack
- React 18 + Vite + TypeScript
- `@react-pdf/renderer` v4 — PDF generation
- Tailwind CSS v4 via `@tailwindcss/vite`
- `vite-plugin-pwa` — PWA manifest + service worker
- Gemini Flash (primary AI) + Groq (fallback AI)
- In-memory state only — no database, no localStorage

---

## Screen Flow

```
home → intake → [AI pipeline] → draft ⇄ preview
                                   ↑
                            (toggle button)
settings (accessible from BottomNav)
```

- `BottomNav` is hidden on: `intake`, `draft`, `preview`
- `draft` ↔ `preview` toggle is a button in the top bar of each screen

---

## Directory Structure

```
src/
├── ai/
│   ├── adapter.ts             # ONLY import point for AI in components
│   ├── gemini.ts              # GeminiProvider — .call(system, user, tier)
│   ├── groq.ts                # GroqProvider — .call(system, user, jsonMode)
│   ├── models.ts              # geminiUrl(tier) — tier → model URL mapping
│   ├── prompts.ts             # All prompt builders (Tasks 1–4)
│   ├── types.ts               # TaskTier, PipelineContext, AIInput, AIOutput
│   └── tasks/
│       ├── classifyIntent.ts      # Tier 1 — document type + field detection
│       ├── generateClarification.ts # Tier 1 — single follow-up question
│       ├── generateDraft.ts       # Tier 3 — full LetterDraft from PipelineContext
│       └── improveBlock.ts        # Tier 2 — single ContentBlock improve
├── components/
│   ├── draft/
│   │   ├── EnvelopeFields.tsx   # Collapsible tap-to-edit envelope section
│   │   ├── BlockList.tsx        # Scrollable block list with tap-to-select
│   │   └── BlockActionBar.tsx   # Bottom sheet: AI actions + manual edit
│   ├── pdf/
│   │   ├── LetterheadDocument.tsx      # Root PDF document — partition + render
│   │   ├── LetterheadFirstPage.tsx     # Page 1 with header + footer
│   │   ├── LetterheadContinuationPage.tsx # Continuation pages (ivory + watermark)
│   │   ├── Header.tsx                 # Branded header component
│   │   ├── Footer.tsx                 # Footer with contact info
│   │   ├── Watermark.tsx              # Fixed centred logo watermark
│   │   ├── Signatory.tsx              # Signatory block (flow-positioned)
│   │   └── BodyRenderer.tsx           # ContentBlock[] → PDF elements
│   └── ui/
│       └── BottomNav.tsx
├── constants/
│   └── brand.ts               # COLORS, FONTS constants
├── pdf/
│   ├── fonts.ts               # Font.register() calls
│   └── partitionBlocks.ts     # Pure pagination: ContentBlock[] → { page1, continuations[], totalPages }
├── screens/
│   ├── HomeScreen.tsx
│   ├── IntakeScreen.tsx       # Freeform input → AI pipeline → draft
│   ├── DraftScreen.tsx        # Edit mode: envelope fields + block list + action bar
│   ├── PreviewScreen.tsx      # BlobProvider, inline <object> preview, download
│   └── SettingsScreen.tsx
├── store/
│   └── sessionStore.ts        # useSessionStore(): state, setDraft, setRawInput,
│                              #   setPipelineCtx, updateBlock, updateEnvelope, reset
├── types/
│   └── document.ts            # DocumentType, ContentBlock, DocumentEnvelope, LetterDraft
├── App.tsx                    # Screen router, state wiring
└── main.tsx                   # Buffer polyfill shim + app mount
```

---

## AI Tier Routing

| Tier | Model | Tasks |
|------|-------|-------|
| Tier 1 lightweight | `gemini-2.0-flash` | classifyIntent, generateClarification |
| Tier 2 standard | `gemini-2.5-flash` | improveBlock |
| Tier 3 premium | `gemini-3.5-flash` | generateDraft |
| Fallback | Groq `llama-3.3-70b-versatile` | All tasks |

---

## Key Constraints
- Single `BlobProvider` only — never mount two PDF instances simultaneously (D010)
- No localStorage/sessionStorage — all state in-memory (D004)
- All AI calls go through `src/ai/adapter.ts` — never import gemini.ts/groq.ts in components
- `partitionBlocks()` is the single source of truth for page layout — never rely on @react-pdf auto-overflow
