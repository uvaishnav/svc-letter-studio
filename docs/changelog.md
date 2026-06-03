# Changelog

## [Phase 1] — 2026-06-03 — Foundation & Design System

### Added
- `svc-letter-studio/vite.config.ts` — Vite config with `@tailwindcss/vite` plugin and `vite-plugin-pwa` (PWA manifest, workbox, icons configured)
- `svc-letter-studio/src/index.css` — Tailwind v4 import, Google Fonts (Cormorant Garamond + Montserrat), CSS custom properties for all brand colors and fonts, safe-area inset helpers
- `svc-letter-studio/src/main.tsx` — App entry point
- `svc-letter-studio/src/App.tsx` — State-driven screen router (no URL router), exports `Screen` type, hides BottomNav on preview screen
- `svc-letter-studio/src/App.css` — Cleared to minimal comment only
- `svc-letter-studio/src/constants/brand.ts` — `COLORS`, `FONTS`, brand name strings, `CONTACT` constants
- `svc-letter-studio/src/constants/defaults.ts` — `DEFAULT_SIGNATORY` (UPPALAPATI SUREKHA / Proprietor), `DEFAULT_PDF_SETTINGS`
- `svc-letter-studio/src/store/sessionStore.ts` — `useSessionStore` hook, `SessionState` / `DocumentContext` / `PDFSettings` interfaces, `initialState`
- `svc-letter-studio/src/screens/HomeScreen.tsx` — Branded home with logo, Compose button, Upload/Settings grid, Recent Letters placeholder
- `svc-letter-studio/src/screens/IntakeScreen.tsx` — Placeholder with back nav and Continue button
- `svc-letter-studio/src/screens/DraftScreen.tsx` — Placeholder with back nav and Preview button
- `svc-letter-studio/src/screens/PreviewScreen.tsx` — Full-screen dark preview layout, top bar with Back/Export, A4 aspect ratio placeholder
- `svc-letter-studio/src/screens/SettingsScreen.tsx` — Signatory display, watermark toggle placeholder
- `svc-letter-studio/src/components/ui/BottomNav.tsx` — Dark brown bottom nav, gold active state, safe-area-inset-bottom padding for iPhone
- `svc-letter-studio/index.html` — PWA meta tags (apple-mobile-web-app-capable, status-bar-style, theme-color, apple-touch-icon)

### Notes
- `index.html` script src path needs verification — should be `/src/main.tsx` not `/svc-letter-studio/src/main.tsx` depending on Vite root config
- Logo and PWA icon assets not yet added (manual step for user)
