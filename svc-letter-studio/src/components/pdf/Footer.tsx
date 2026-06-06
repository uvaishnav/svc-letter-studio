import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS, CONTACT } from '../../constants/brand'

const FOOTER_FONT_WEIGHT = 600
const FOOTER_FONT_SIZE = 7
const FOOTER_FONT_COLOR = COLORS.brown

const S = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  ruleGold: {
    height: 0.75,
    backgroundColor: COLORS.gold,
    marginHorizontal: 30,
    opacity: 0.7,
  },
  ruleShadow: {
    height: 0.3,
    backgroundColor: COLORS.brown,
    marginHorizontal: 30,
    marginBottom: 6,
    opacity: 0.07,
  },
  container: {
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 30,
    paddingBottom: 14,
    flexDirection: 'column',
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  contactItem: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: FOOTER_FONT_COLOR,
    letterSpacing: 0.3,
  },
  gstinLabel: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: COLORS.brown,
    letterSpacing: 0.5,
  },
  gstinValue: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: FOOTER_FONT_COLOR,
    letterSpacing: 0.3,
  },
  gstinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: COLORS.gold,
    opacity: 0.7,
  },
  address: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: FOOTER_FONT_COLOR,
    letterSpacing: 0.2,
    textAlign: 'center',
    opacity: 0.75,
  },
  pageNum: {
    fontFamily: 'Montserrat',
    fontWeight: FOOTER_FONT_WEIGHT,
    fontSize: FOOTER_FONT_SIZE,
    color: FOOTER_FONT_COLOR,
    letterSpacing: 0.3,
  },
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2.5,
    backgroundColor: COLORS.gold,
  },
})

interface FooterProps {
  pageNumber?: number
  totalPages?: number
  showPageNumber?: boolean
}

export default function Footer({ pageNumber, totalPages, showPageNumber = false }: FooterProps) {
  return (
    // No `fixed` prop — Footer only renders on the page it is explicitly placed in.
    // LetterheadFirstPage places it on page 1 only.
    // LetterheadContinuationPage can choose whether to include it.
    <View style={S.wrapper}>
      <View style={S.leftAccent} />
      <View style={S.ruleGold} />
      <View style={S.ruleShadow} />
      <View style={S.container}>
        <View style={S.topRow}>
          <Text style={S.contactItem}>☎  {CONTACT.phone}</Text>
          {CONTACT.gstin ? (
            <View style={S.gstinRow}>
              <Text style={S.gstinLabel}>GSTIN</Text>
              <Text style={S.dot}>:</Text>
              <Text style={S.gstinValue}>{CONTACT.gstin}</Text>
            </View>
          ) : showPageNumber && pageNumber != null ? (
            <Text style={S.pageNum}>{pageNumber} / {totalPages}</Text>
          ) : null}
          <Text style={S.contactItem}>✉  {CONTACT.email}</Text>
        </View>
        <View style={S.bottomRow}>
          <Text style={S.address}>{CONTACT.address}</Text>
        </View>
      </View>
    </View>
  )
}
