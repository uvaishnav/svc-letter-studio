# Font Setup for SVC Letter Studio

## Why self-hosted fonts?

`@react-pdf/renderer` (PDFKit) fetches fonts via XHR and only supports `.ttf` / `.otf` format.
Google Fonts CDN serves `.woff2` to browsers, which PDFKit cannot parse.
Self-hosting `.ttf` files in `/public/fonts/` is the only reliable approach.

## Required font files

Download and place these exact files in `svc-letter-studio/public/fonts/`:

| File | Source | Weight |
|------|--------|--------|
| `PlayfairDisplay-Regular.ttf` | [Download](https://fonts.google.com/specimen/Playfair+Display) | 400 |
| `PlayfairDisplay-Bold.ttf` | [Download](https://fonts.google.com/specimen/Playfair+Display) | 700 |
| `Montserrat-Regular.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 |
| `Montserrat-Italic.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 italic |
| `Montserrat-SemiBold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 600 |
| `Montserrat-Bold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 700 |

## Step-by-step

1. **Playfair Display** (brand name — "SRI VAISHNAV")
   - Go to https://fonts.google.com/specimen/Playfair+Display
   - Click **Download family** (top right)
   - Unzip → go to `static/` folder
   - Copy `PlayfairDisplay-Regular.ttf` and `PlayfairDisplay-Bold.ttf` to `svc-letter-studio/public/fonts/`

2. **Montserrat** (all supporting text)
   - Go to https://fonts.google.com/specimen/Montserrat
   - Click **Download family**
   - Unzip → go to `static/` folder
   - Copy these to `svc-letter-studio/public/fonts/`:
     - `Montserrat-Regular.ttf`
     - `Montserrat-Italic.ttf`
     - `Montserrat-SemiBold.ttf`
     - `Montserrat-Bold.ttf`

3. **Remove old Cinzel and Cormorant Garamond files** if present — they are no longer used.

4. Restart `npm run dev`

## Verification

After adding fonts, open the app → Preview screen.
The PDF should render with:
- `SRI VAISHNAV` in Playfair Display Bold (heavy serif, thick strokes, elegant)
- `CONSTRUCTIONS` in Montserrat SemiBold gold
- Tagline in Montserrat Regular muted brown
- All body text in Montserrat

If fonts fail to load, the PDF will show a `Font family not registered` error
in the Preview screen error panel.
