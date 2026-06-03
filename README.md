# SVC Letter Studio

AI-powered mobile-first PWA for Sri Vaishnav Constructions to generate premium branded letterhead PDFs.

## What it does

- Generate blank branded letterheads for Sri Vaishnav Constructions
- Create structured professional business documents with AI assistance
- Upload existing documents and re-render them on branded letterhead
- Export print-ready, share-ready PDFs directly from mobile (iPhone)

## Stack

- React + Vite + TypeScript
- @react-pdf/renderer
- Tailwind CSS v4
- vite-plugin-pwa
- Gemini Flash (primary AI) + Groq (fallback AI)

## Documentation

All project documentation lives in the `/docs` folder:

| File | Purpose |
|------|---------|
| `docs/prd.md` | Full product requirements document |
| `docs/progress.md` | Phase-by-phase progress tracker and session log |
| `docs/architecture.md` | Project structure and technical architecture |
| `docs/decisions.md` | All product, design, and technical decisions |
| `docs/changelog.md` | Changelog for all code and architecture changes |

## Development approach

This project is built feature by feature across multiple sessions. Each session works on one phase. At the end of every session, all documentation files are updated to preserve context for the next session.

## Environment variables

```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

## Brand

- Dark Brown: `#3B2A1F`
- Warm Ivory: `#F5F1E8`
- Gold: `#C8A96A`
