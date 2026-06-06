import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS, FONTS } from '../../constants/brand'
import Watermark from './Watermark'

// ─── Continuation page geometry (A4 = 841.89pt tall) ───────────────────────
// No header or footer branding — clean blank page.
// marginTop:  50pt — deliberate breathing room; signals content continuation
//                    (increased from 36pt — 36 felt too tight)
// marginBot:  48pt — breathing room; page number sits inside this zone
// marginLeft: 36pt
// marginRight: 36pt
// Available content height = 841.89 - 50 - 48 = 743.89pt
// Available content width  = 595.28 - 36 - 36 = 523.28pt

export const CONT_CONTENT_MAX_HEIGHT = 743.89  // 841.89 - 50 - 48

const S = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
  },
  contentArea: {
    maxHeight: CONT_CONTENT_MAX_HEIGHT,
    marginLeft: 36,
    marginRight: 36,
    marginTop: 50,
    marginBottom: 48,
  },
  // Page number — absolute, sits inside the 48pt bottom margin zone
  pageNumber: {
    position: 'absolute',
    bottom: 18,
    right: 36,
    fontFamily: FONTS.body,
    fontSize: 8,
    color: COLORS.brownMuted,
    letterSpacing: 0.3,
  },
})

interface Props {
  pageNumber: number
  totalPages: number
  watermarkEnabled?: boolean
  children?: React.ReactNode
}

export default function LetterheadContinuationPage({
  pageNumber,
  totalPages,
  watermarkEnabled = true,
  children,
}: Props) {
  return (
    <Page size="A4" style={S.page}>
      {watermarkEnabled && <Watermark />}
      <View style={S.contentArea}>
        {children}
      </View>
      <Text style={S.pageNumber}>{pageNumber} / {totalPages}</Text>
    </Page>
  )
}
