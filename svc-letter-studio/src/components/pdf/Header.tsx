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

  // The entire header sits on a pure white background
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: COLORS.white,
  },

  // Logo — left side, square aspect
  logo: {
    width: 64,
    height: 64,
    marginRight: 16,
  },

  // Text column to the right of logo
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // "SRI VAISHNAV" — large, Cormorant Garamond SemiBold, dark brown
  brandPrimary: {
    fontFamily: 'Cormorant Garamond',
    fontWeight: 600,
    fontSize: 26,
    letterSpacing: 5,
    color: COLORS.brown,
    lineHeight: 1,
  },

  // "— CONSTRUCTIONS —" row
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 5,
  },

  // The em-dash lines flanking CONSTRUCTIONS
  dashLine: {
    height: 0.75,
    width: 18,
    backgroundColor: COLORS.gold,
  },

  // "CONSTRUCTIONS" text
  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 8,
    letterSpacing: 4,
    color: COLORS.gold,
  },

  // "ENGINEERING • INFRASTRUCTURE • CIVIL WORKS"
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 6,
    letterSpacing: 1.5,
    color: COLORS.brownMuted,
    marginTop: 6,
  },

  // Full-width gold hairline rule — runs edge to edge
  rule: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.8,
  },
})

export default function Header() {
  return (
    <View style={S.wrapper}>
      <View style={S.headerRow}>
        <Image src={`${base}/logo/logo.png`} style={S.logo} />
        <View style={S.textBlock}>
          <Text style={S.brandPrimary}>{BRAND_NAME_PRIMARY}</Text>
          <View style={S.brandRow}>
            <View style={S.dashLine} />
            <Text style={S.brandSecondary}>{BRAND_NAME_SECONDARY}</Text>
            <View style={S.dashLine} />
          </View>
          <Text style={S.tagline}>{BRAND_TAGLINE}</Text>
        </View>
      </View>
      <View style={S.rule} />
    </View>
  )
}
