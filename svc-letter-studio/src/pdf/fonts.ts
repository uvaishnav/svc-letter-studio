// Font strategy for @react-pdf/renderer:
// PDFKit has Helvetica, Times-Roman, Courier built-in — no network fetch needed.
// We map our brand font families to these built-ins so PDF generation never
// fails due to CDN fetch errors.
//
// When real custom fonts are needed in a future phase, host the .ttf files
// inside /public/fonts/ and use absolute URLs: window.location.origin + '/fonts/x.ttf'
// DO NOT use Google Fonts CDN — those are woff2 and require CORS-safe fetch.

import { Font } from '@react-pdf/renderer'

// No Font.register calls needed — we use built-in font names directly in StyleSheet:
// 'Helvetica-Bold'  → brand headings (replaces Cormorant Garamond)
// 'Helvetica'       → body text (replaces Montserrat regular)
// 'Helvetica-Bold'  → semi-bold/bold labels
//
// These are referenced by exact name in each component's StyleSheet.

// Prevent hyphenation globally
Font.registerHyphenationCallback(word => [word])
