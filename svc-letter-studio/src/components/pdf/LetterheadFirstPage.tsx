import { Page, View, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'
import Header from './Header'
import Footer from './Footer'
import Watermark from './Watermark'

// ─── Page geometry (A4 = 841.89pt tall) ──────────────────────────────────────
// Header total:          108.75pt  (paddingTop:16 + logo:80 + paddingBottom:12 + rule:0.75)
// contentArea marginTop:  20pt    (breathing gap below header rule)
// contentArea marginBot:  65pt    (reserves space above absolute-positioned footer)
// Footer height:         ~35.85pt (sits inside the 65pt zone — 29pt breathing gap remains)
//
// Available content height = 841.89 - 108.75 - 20 - 65 = 648.14pt
// Available content width  = 595.28 - 36 - 36        = 523.28pt
//
// WHY maxHeight instead of flex:1:
// flex:1 expands contentArea to fill ALL remaining page height. The content
// inside then has a taller container than expected and flows to the bottom of
// that expanded box — visually touching the footer gold line.
// maxHeight:648.14 hard-caps the box so content can never overflow into the
// footer zone regardless of how @react-pdf/renderer resolves flex.

const CONTENT_MAX_HEIGHT = 648.14  // 841.89 - 108.75 - 20 - 65

const S = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
  },
  contentArea: {
    maxHeight: CONTENT_MAX_HEIGHT,
    marginLeft: 36,
    marginRight: 36,
    marginTop: 20,
    marginBottom: 65,
  },
})

interface Props {
  watermarkEnabled?: boolean
  children?: React.ReactNode
}

export default function LetterheadFirstPage({ watermarkEnabled = true, children }: Props) {
  return (
    <Page size="A4" style={S.page}>
      <Header />
      {watermarkEnabled && <Watermark />}
      <View style={S.contentArea}>
        {children}
      </View>
      <Footer />
    </Page>
  )
}
