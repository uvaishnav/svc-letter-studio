import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import {
  COLORS,
  BRAND_NAME_PRIMARY,
  BRAND_NAME_SECONDARY,
  BRAND_TAGLINE,
} from '../../constants/brand'

const base = typeof window !== 'undefined' ? window.location.origin : ''

const S = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  leftAccent: {
    width: 2.5,
    backgroundColor: COLORS.gold,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: COLORS.ivory,
  },
  logo: {
    width: 56,
    height: 56,
    marginRight: 18,
  },
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandPrimary: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 600,
    fontSize: 24,
    letterSpacing: 4,
    color: COLORS.brown,
    lineHeight: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  goldLine: {
    height: 0.75,
    width: 16,
    backgroundColor: COLORS.gold,
  },
  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 7,
    letterSpacing: 3.5,
    color: COLORS.gold,
  },
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 6,
    letterSpacing: 1.2,
    color: COLORS.brownMuted,
    marginTop: 5,
    textTransform: 'uppercase',
  },
  rule: {
    height: 0.75,
    backgroundColor: COLORS.gold,
    marginHorizontal: 30,
    opacity: 0.6,
  },
  ruleShadow: {
    height: 0.3,
    backgroundColor: COLORS.brown,
    marginHorizontal: 30,
    marginTop: 1.5,
    opacity: 0.08,
  },
})

export default function Header() {
  return (
    <View style={S.wrapper}>
      <View style={S.headerRow}>
        <View style={S.leftAccent} />
        <View style={S.inner}>
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
      </View>
      <View style={S.rule} />
      <View style={S.ruleShadow} />
    </View>
  )
}
