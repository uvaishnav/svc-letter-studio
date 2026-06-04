import { Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS, BRAND_NAME_PRIMARY } from '../../constants/brand'
import Footer from './Footer'
import Watermark from './Watermark'

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
  },
  minimalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 10,
    backgroundColor: COLORS.ivory,
  },
  brandName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.brown,
  },
  pageLabel: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: COLORS.brownMuted,
    letterSpacing: 0.5,
  },
  thinGoldLine: {
    height: 0.75,
    backgroundColor: COLORS.gold,
    marginHorizontal: 36,
  },
  contentArea: {
    flex: 1,
    marginHorizontal: 36,
    marginTop: 16,
    marginBottom: 72,
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
    <Page size="A4" style={styles.page}>
      <View style={styles.minimalTopBar}>
        <Text style={styles.brandName}>{BRAND_NAME_PRIMARY}</Text>
        <Text style={styles.pageLabel}>Page {pageNumber} of {totalPages}</Text>
      </View>
      <View style={styles.thinGoldLine} />
      {watermarkEnabled && <Watermark />}
      <View style={styles.contentArea}>{children}</View>
      <Footer showPageNumber pageNumber={pageNumber} totalPages={totalPages} />
    </Page>
  )
}
