// Font registration for @react-pdf/renderer
//
// Fonts are self-hosted in /public/fonts/ to avoid CDN instability.
// @react-pdf/renderer fetches fonts via XHR and only supports .ttf / .otf format.
// We use window.location.origin to resolve correctly in dev and prod.
//
// REQUIRED FILES (see docs/FONTS.md for download instructions):
//   public/fonts/PlayfairDisplaySC-Bold.ttf
//   public/fonts/PlayfairDisplay-Regular.ttf
//   public/fonts/PlayfairDisplay-Bold.ttf
//   public/fonts/Montserrat-Regular.ttf
//   public/fonts/Montserrat-SemiBold.ttf
//   public/fonts/Montserrat-Bold.ttf
//   public/fonts/Montserrat-Italic.ttf

import { Font } from '@react-pdf/renderer'

const base = typeof window !== 'undefined' ? window.location.origin : ''

// Playfair Display SC — Small Caps variant, used for "SRI VAISHNAV"
Font.register({
  family: 'Playfair Display SC',
  fonts: [
    { src: `${base}/fonts/PlayfairDisplaySC-Bold.ttf`, fontWeight: 700 },
  ],
})

// Playfair Display — regular/bold, kept as fallback
Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: `${base}/fonts/PlayfairDisplay-Regular.ttf`, fontWeight: 400 },
    { src: `${base}/fonts/PlayfairDisplay-Bold.ttf`,    fontWeight: 700 },
  ],
})

// Montserrat — all supporting text
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: `${base}/fonts/Montserrat-Regular.ttf`,  fontWeight: 400 },
    { src: `${base}/fonts/Montserrat-Italic.ttf`,   fontWeight: 400, fontStyle: 'italic' },
    { src: `${base}/fonts/Montserrat-SemiBold.ttf`, fontWeight: 600 },
    { src: `${base}/fonts/Montserrat-Bold.ttf`,     fontWeight: 700 },
  ],
})

Font.registerHyphenationCallback(word => [word])
