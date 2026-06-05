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
    backgroundColor: COLORS.ivory,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 12,
  },

  logo: {
    width: 80,
    height: 80,
    marginRight: 0,
  },

  // Tight unified text block — all 3 rows centered as one structure
  textBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // "SRI VAISHNAV" — Playfair Display Bold, heavy, tight spacing
  brandPrimary: {
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 1,
    color: COLORS.brown,
    lineHeight: 1,
  },

  // "— CONSTRUCTIONS —"
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  dashLine: {
    height: 1,
    width: 25,
    backgroundColor: COLORS.gold,
  },

  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 800,
    fontSize: 10,
    letterSpacing: 3.5,
    color: COLORS.gold,
  },

  // "ENGINEERING • INFRASTRUCTURE • CIVIL WORKS"
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 5.5,
    letterSpacing: 1,
    color: COLORS.brownMuted,
    marginTop: 2,
  },

  // Full-width gold hairline rule
  rule: {
    height: 0.75,
    backgroundColor: COLORS.gold,
    marginHorizontal: 30,
    opacity: 0.85,
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
