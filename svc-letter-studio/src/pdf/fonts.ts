// Font registration for @react-pdf/renderer
//
// Fonts are self-hosted in /public/fonts/ to avoid CDN instability.
// @react-pdf/renderer fetches fonts via XHR so URLs must be absolute.
// We use window.location.origin to resolve correctly in dev and prod.
//
// REQUIRED FILES (see docs/FONTS.md for download instructions):
//   public/fonts/Cinzel-Bold.ttf
//   public/fonts/Cinzel-Regular.ttf
//   public/fonts/CormorantGaramond-SemiBold.ttf
//   public/fonts/Montserrat-Regular.ttf
//   public/fonts/Montserrat-SemiBold.ttf
//   public/fonts/Montserrat-Bold.ttf
//   public/fonts/Montserrat-Italic.ttf

import { Font } from '@react-pdf/renderer'

const base = typeof window !== 'undefined' ? window.location.origin : ''

// Cinzel — Roman-style all-caps display serif, used for "SRI VAISHNAV"
Font.register({
  family: 'Cinzel',
  fonts: [
    { src: `${base}/fonts/Cinzel-Regular.ttf`, fontWeight: 400 },
    { src: `${base}/fonts/Cinzel-Bold.ttf`,    fontWeight: 700 },
  ],
})

// Cormorant Garamond — kept for potential body use
Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    { src: `${base}/fonts/CormorantGaramond-SemiBold.ttf`, fontWeight: 600 },
  ],
})

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
