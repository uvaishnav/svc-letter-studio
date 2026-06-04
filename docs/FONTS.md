# Font Setup for SVC Letter Studio

## Why self-hosted fonts?

`@react-pdf/renderer` (PDFKit) fetches fonts via XHR and only supports `.ttf` / `.otf` format.
Google Fonts CDN serves `.woff2` to browsers, which PDFKit cannot parse.
Self-hosting `.ttf` files in `/public/fonts/` is the only reliable approach.

## Required font files

Download and place these exact files in `svc-letter-studio/public/fonts/`:

| File | Source | Weight |
|------|--------|--------|
| `CormorantGaramond-SemiBold.ttf` | [Download](https://fonts.google.com/specimen/Cormorant+Garamond) | 600 |
| `Montserrat-Regular.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 |
| `Montserrat-Italic.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 400 italic |
| `Montserrat-SemiBold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 600 |
| `Montserrat-Bold.ttf` | [Download](https://fonts.google.com/specimen/Montserrat) | 700 |

## Step-by-step

1. Go to https://fonts.google.com/specimen/Cormorant+Garamond
   - Click **Download family** (top right)
   - Unzip → find `static/CormorantGaramond-SemiBold.ttf`
   - Copy to `svc-letter-studio/public/fonts/CormorantGaramond-SemiBold.ttf`

2. Go to https://fonts.google.com/specimen/Montserrat
   - Click **Download family**
   - Unzip → find `static/` folder
   - Copy these files to `svc-letter-studio/public/fonts/`:
     - `Montserrat-Regular.ttf`
     - `Montserrat-Italic.ttf`
     - `Montserrat-SemiBold.ttf`
     - `Montserrat-Bold.ttf`

3. Restart `npm run dev` (Vite needs to pick up new public assets)

## Verification

After adding fonts, open the app → Preview screen.
The PDF should render with:
- `SRI VAISHNAV` in Cormorant Garamond (elegant serif)
- All other text in Montserrat (clean sans-serif)

If fonts fail to load, the PDF will show a `Font family not registered` error
in the Preview screen error panel (not just the console).
