# SVC Letter Studio — Product Requirements Document (PRD)

## 1. Document overview

### 1.1 Product name
SVC Letter Studio

### 1.2 Product type
A mobile-first Progressive Web App (PWA) built with React that helps Sri Vaishnav Constructions generate premium, professional, print-ready PDF documents on a branded company letterhead using AI-assisted drafting and formatting.

### 1.3 Product objective
The product exists to eliminate the operational problems of traditional pre-printed letterheads, especially print alignment issues, wasted stationery, manual formatting effort, and inconsistent document quality. Instead of printing content onto physical letterhead paper, the app will generate a complete final PDF where the letterhead and content are rendered together as a single polished document.

### 1.4 Core value proposition
- Generate a blank letterhead PDF when needed.
- Generate a fully structured professional letter on the company letterhead.
- Upload source content from supported file types and convert it into a properly formatted branded PDF.
- Use AI to draft, improve, refine, and structure business documents according to the intended use case.
- Export a ready-to-print and ready-to-share PDF directly from mobile, especially iPhone.

### 1.5 Primary user
Internal operator of Sri Vaishnav Constructions, using an iPhone and occasionally desktop, for business correspondence, notices, tender submissions, formal letters, agreements, and related construction-company communications.

---

## 2. Brand and visual identity

### 2.1 Company name
Sri Vaishnav Constructions

### 2.2 Brand colors
- Dark Brown: `#3B2A1F`
- Warm Ivory: `#F5F1E8`
- Metallic Gold: `#C8A96A`

### 2.3 Typography
- Brand serif: Cormorant Garamond SemiBold — used only for "SRI VAISHNAV"
- Corporate sans-serif: Montserrat — used for all other text in document

### 2.4 Letterhead page specification
- Format: A4 portrait (210 × 297 mm)
- Margins: Top 22mm, Bottom 20mm, Left 22mm, Right 22mm
- Usable content area: ~166mm × 255mm

### 2.5 Header specification
- Total header height: 42 mm
- Logo: 22mm from left, 12mm from top, height ~26mm
- "SRI VAISHNAV": Cormorant Garamond SemiBold, 24pt, Dark Brown
- "CONSTRUCTIONS": Montserrat SemiBold, 10pt, Gold, wide tracking
- Tagline "Engineering • Infrastructure • Civil Works": Montserrat Medium, 7pt, Gold
- Gold hairline divider rule at 44mm from top, full width inside margins, 0.4pt, subtle opacity

### 2.6 Body area
- Clean premium whitespace
- Optional centered icon-only watermark (SVC mark only, not wordmark) at 3–4% opacity
- Optional thin gold left-margin vertical accent bar (configurable)

### 2.7 Footer specification
- Gold divider rule above footer
- Three-column layout: Email+Website | GSTIN | Phone
- Address row centered below contact row
- Clean and structured, visually lighter than the header

### 2.8 Continuation pages (page 2+)
- No full letterhead header
- Minimal top identity (company name only, small) or just watermark
- Page number included
- Consistent professional feel

### 2.9 Signatory defaults
- Name: UPPALAPATI SUREKHA
- Designation: Proprietor

---

## 3. Feature set

### Feature 1 — Blank letterhead PDF
- One-tap generation of empty branded letterhead
- Full first-page layout
- Print-ready output

### Feature 2 — AI document creation from scratch
- Freeform intake: user writes everything they know first
- AI detects intent and extracts structured fields
- AI asks only missing questions, one at a time
- AI drafts professional structured document
- AI improvement actions on draft

### Feature 3 — Upload and convert
- Upload `.docx` or text-extractable `.pdf`
- Extract text and reconstruct into structured branded draft
- Offer AI improvement before final rendering

### Feature 4 — AI improvement actions
- Make more formal
- Make shorter / longer
- Adapt for government/PSU tone
- Adapt for tender tone
- Improve subject line
- Correct grammar and structure
- Regenerate closing

### Feature 5 — PDF rendering with letterhead
- First page: full letterhead
- Continuation pages: minimal branding
- Professional spacing and typography
- Print-ready and share-ready PDF

### Feature 6 — Settings and defaults
- Editable signatory name and designation
- Watermark on/off toggle
- Contact details management

---

## 4. Supported document types
- Standard business letter
- Notice
- Quotation cover letter
- Government correspondence
- PSU tender or bid covering letter
- Work order letter
- Contract / agreement draft letter
- Project communication letter
- Formal response letter
- Request letter
- Compliance / declaration communication

---

## 5. AI specification

### 5.1 Provider routing
- Primary: Gemini Flash (free tier)
- Fallback: Groq (free tier, strong instruction model)
- Abstracted through a common provider adapter interface

### 5.2 AI operations
- `analyzeBrief(input)` — extract fields and detect missing info
- `askNextQuestion(context)` — generate one follow-up question
- `draftDocument(context)` — produce complete structured draft
- `improveDraft(action, draft, context)` — apply one improvement action

### 5.3 AI behavior rules
- First turn: broad intake, do not force step-by-step form
- Follow-up: ask only what is missing, one at a time
- Never fabricate factual data (dates, numbers, names)
- Use placeholders labeled clearly if needed in draft state
- Drafts must be usable in real business settings

---

## 6. Tech stack
- Framework: React + Vite + TypeScript
- PDF: @react-pdf/renderer
- PWA: vite-plugin-pwa
- DOCX parsing: mammoth
- AI: Gemini Flash (primary), Groq fallback
- Styling: Tailwind CSS v4
- Hosting: Cloudflare Pages or Vercel
- State: in-memory only, no database

---

## 7. Implementation phases (feature by feature)

| Phase | Feature | Scope |
|-------|---------|-------|
| 1 | Foundation and design system | Scaffold, PWA, brand tokens, shell UI, routing |
| 2 | Letterhead PDF engine | React-PDF components, header, footer, watermark, blank export |
| 3 | Document schema and pipeline | Field schema, type-based required fields, draft state |
| 4 | AI provider abstraction | Gemini + Groq adapters, fallback routing |
| 5 | AI intake and clarification flow | Freeform intake, intent detection, one-question follow-up |
| 6 | Draft generation and improvement | Draft output, improvement actions, manual editing |
| 7 | Upload and conversion | File upload, parsing, AI restructuring |
| 8 | Preview and export | PDF preview, download, print workflow |
| 9 | Settings and defaults | Signatory defaults, watermark toggle, contact settings |
| 10 | QA and polish | Device testing, error states, edge cases |
