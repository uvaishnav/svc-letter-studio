# Font Setup for SVC Letter Studio

## Why self-hosted fonts?

`@react-pdf/renderer` (PDFKit) fetches fonts via XHR and only supports `.ttf` / `.otf` format.
Google Fonts CDN serves `.woff2` to browsers, which PDFKit cannot parse.
Self-hosting `.ttf` files in `/public/fonts/` is the only reliable approach.

## Required font files

Download and place these exact files in `svc-letter-studio/public/fonts/`:

| File | Source | Weight |
|------|--------|--------|
| `Cinzel-Regular.ttf` | [Download](https://fonts.google.com/specimen/Cinzel) | 400 |
| `Cinzel-Bold.ttf` | [Download](https://fonts.google.com/specimen/Cinzel) | 700 |
| `CormorantGaramond-SemiBold.ttf` | [Download](https://fonts.google.com/specimen/Cormorant+Garamond) | 600 |
| `Montserrat-Regular.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 |
| `Montserrat-Italic.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 italic |
| `Montserrat-SemiBold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 600 |
| `Montserrat-Bold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 700 |

## Step-by-step

1. **Cinzel** (brand display font for "SRI VAISHNAV")
   - Go to https://fonts.google.com/specimen/Cinzel
   - Click **Download family** (top right)
   - Unzip → find `static/Cinzel-Regular.ttf` and `static/Cinzel-Bold.ttf`
   - Copy both to `svc-letter-studio/public/fonts/`

2. **Cormorant Garamond** (fallback serif)
   - Go to https://fonts.google.com/specimen/Cormorant+Garamond
   - Click **Download family**
   - Unzip → find `static/CormorantGaramond-SemiBold.ttf`
   - Copy to `svc-letter-studio/public/fonts/`

3. **Montserrat** (all UI and body text)
   - Go to https://fonts.google.com/specimen/Montserrat
   - Click **Download family**
   - Unzip → find `static/` folder
   - Copy these files to `svc-letter-studio/public/fonts/`:
     - `Montserrat-Regular.ttf`
     - `Montserrat-Italic.ttf`
     - `Montserrat-SemiBold.ttf`
     - `Montserrat-Bold.ttf`

4. Restart `npm run dev` (Vite needs to pick up new public assets)

## Verification

After adding fonts, open the app → Preview screen.
The PDF should render with:
- `SRI VAISHNAV` in Cinzel Bold (Roman all-caps display serif — impactful, classic)
- `CONSTRUCTIONS` in Montserrat SemiBold gold
- Tagline in Montserrat Regular muted
- All body text in Montserrat

If fonts fail to load, the PDF will show a `Font family not registered` error
in the Preview screen error panel (not just the console).
