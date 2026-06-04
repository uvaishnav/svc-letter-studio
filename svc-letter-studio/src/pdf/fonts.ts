// Register fonts for @react-pdf/renderer
// IMPORTANT: @react-pdf/renderer (PDFKit) only supports .ttf/.otf, NOT .woff2
// Cormorant Garamond SemiBold — brand name (SRI VAISHNAV) only
// Montserrat 400/600/700 — all other text
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjorn0.ttf',
      fontWeight: 600,
    },
  ],
})

Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw0aXpsomK1.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170wsomK1.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70wsomK1.ttf',
      fontWeight: 700,
    },
  ],
})

// Prevent hyphenation in PDF text
Font.registerHyphenationCallback(word => [word])
