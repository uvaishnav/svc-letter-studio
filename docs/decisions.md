# Decisions Log

This file documents all key product, design, and technical decisions made.
Update this whenever a decision is changed or a new one is made during a session.

---

## D001 — PDF rendering library
**Decision:** Use `@react-pdf/renderer`
**Reason:** True vector PDF output suitable for professional printing. Better than html2canvas which produces screenshot-based PDFs.
**Status:** Final

---

## D002 — Platform
**Decision:** Mobile-first PWA hosted on Cloudflare Pages or Vercel
**Reason:** Free hosting, no cold starts on Cloudflare, PWA Add to Home Screen works on iPhone Safari.
**Status:** Final

---

## D003 — No database
**Decision:** No backend database in v1
**Reason:** The product is a private personal tool. No document persistence needed. Each session is self-contained.
**Status:** Final

---

## D004 — AI provider strategy
**Decision:** Gemini Flash as primary, Groq as fallback
**Reason:** Gemini Flash has the best combination of quality, speed, and free-tier generosity for document drafting tasks. Groq provides high-speed inference as a reliable free fallback.
**Status:** Final

---

## D005 — AI intake UX
**Decision:** User writes everything first in one freeform input. AI then asks only missing questions one at a time.
**Reason:** Starting with forced one-question-at-a-time is frustrating when users already know most of their requirements. Freeform-first approach is more natural and faster for experienced users.
**Status:** Final

---

## D006 — Letterhead header style
**Decision:** Open ivory header (no heavy full-bleed dark bar). Logo on ivory background with gold hairline divider below.
**Reason:** Full-bleed dark headers suit large EPC firms with universal brand recognition. For a regional construction firm, the open elegant header reads more refined and premium.
**Status:** Final

---

## D007 — Watermark
**Decision:** Icon-only watermark (not wordmark) at 3–4% opacity, centered in body area. Default enabled, configurable off.
**Reason:** Fills the body area intentionally, subtly reinforces brand without interfering with reading or printing.
**Status:** Final

---

## D008 — Typography
**Decision:** Cormorant Garamond SemiBold for "SRI VAISHNAV" only. Montserrat for all other text.
**Reason:** Matches the premium construction firm identity. Two-font discipline keeps the letterhead clean.
**Status:** Final

---

## D009 — Brand colors
**Decision:** Dark Brown `#3B2A1F`, Warm Ivory `#F5F1E8`, Gold `#C8A96A`
**Reason:** Confirmed brand colors for Sri Vaishnav Constructions.
**Status:** Final

---

## D010 — Signatory defaults
**Decision:** Default to UPPALAPATI SUREKHA / Proprietor
**Reason:** Standard signatory details for Sri Vaishnav Constructions.
**Status:** Final. Editable per-document and in app settings.

---

## D011 — Multi-page strategy
**Decision:** First page uses full letterhead. Continuation pages use minimal top identity + watermark + page number.
**Reason:** Full letterhead on every page wastes visual space. Minimal continuation is industry standard.
**Status:** Final

---

## D012 — Development approach
**Decision:** Feature-by-feature development across multiple sessions. One phase per session. Documentation updated at end of each session.
**Reason:** Large app cannot be built in one session. Clear phased approach with documentation ensures continuity.
**Status:** Active ongoing process

---

## Template for new decisions

```
## D0XX — [Short title]
**Decision:** [What was decided]
**Reason:** [Why]
**Previous decision if changed:** [What changed and why]
**Status:** Final / Active / Under review
```
