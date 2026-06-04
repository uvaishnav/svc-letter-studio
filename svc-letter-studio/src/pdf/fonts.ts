// Register fonts for @react-pdf/renderer
// Cormorant Garamond — brand name only
// Montserrat — all other text
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/cormorantgaramond/v22/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
      fontWeight: 600,
    },
  ],
})

Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw0aXp-p7K4KLg.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w0aXp-p7K4KLg.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w0aXp-p7K4KLg.woff2',
      fontWeight: 700,
    },
  ],
})

// Prevent font hyphenation
Font.registerHyphenationCallback(word => [word])
