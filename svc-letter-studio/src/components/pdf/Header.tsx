import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import {
  COLORS,
  BRAND_NAME_PRIMARY,
  BRAND_NAME_SECONDARY,
  BRAND_TAGLINE,
} from '../../constants/brand'

const base = typeof window !== 'undefined' ? window.location.origin : ''

const S = StyleSheet.create({
  // Thin gold top edge bar — premium accent
  topEdge: {
    height: 3,
    backgroundColor: COLORS.gold,
  },
  // Dark brown band — primary brand identity area
  band: {
    backgroundColor: COLORS.brown,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  brandPrimary: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 600,
    fontSize: 22,
    letterSpacing: 3,
    color: COLORS.ivory,
    lineHeight: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  goldLine: {
    width: 18,
    height: 0.75,
    backgroundColor: COLORS.gold,
  },
  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 7.5,
    letterSpacing: 3.5,
    color: COLORS.gold,
  },
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: 6.5,
    letterSpacing: 0.5,
    color: COLORS.goldLight,
    marginTop: 5,
  },
  // Thin ivory bottom edge of band
  bandEdge: {
    height: 1,
    backgroundColor: COLORS.goldDark,
    marginHorizontal: 32,
  },
})

export default function Header() {
  return (
    <>
      <View style={S.topEdge} />
      <View style={S.band}>
        <Image src={`${base}/logo/logo.png`} style={S.logo} />
        <View style={S.textBlock}>
          <Text style={S.brandPrimary}>{BRAND_NAME_PRIMARY}</Text>
          <View style={S.brandRow}>
            <View style={S.goldLine} />
            <Text style={S.brandSecondary}>{BRAND_NAME_SECONDARY}</Text>
            <View style={S.goldLine} />
          </View>
          <Text style={S.tagline}>{BRAND_TAGLINE}</Text>
        </View>
      </View>
      <View style={S.bandEdge} />
    </>
  )
}
