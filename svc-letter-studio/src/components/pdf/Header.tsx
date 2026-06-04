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

  // Logo + text side by side, page margin on both sides
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 12,
  },

  // Logo — 20% larger than before (64 → 77)
  logo: {
    width: 77,
    height: 77,
    marginRight: 14,
  },

  // Text column: flex-column, center-aligned, tight spacing
  textBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // "SRI VAISHNAV" — Cinzel Bold, large, dark brown
  brandPrimary: {
    fontFamily: 'Cinzel',
    fontWeight: 700,
    fontSize: 24,
    letterSpacing: 3,
    color: COLORS.brown,
    lineHeight: 1,
  },

  // "— CONSTRUCTIONS —" row
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    gap: 4,
  },

  dashLine: {
    height: 0.75,
    width: 16,
    backgroundColor: COLORS.gold,
  },

  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 7,
    letterSpacing: 4,
    color: COLORS.gold,
  },

  // Tagline — tight gap above
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 5.5,
    letterSpacing: 1.2,
    color: COLORS.brownMuted,
    marginTop: 2,
  },

  // Full-width gold hairline rule, flush to page edges
  rule: {
    height: 0.75,
    backgroundColor: COLORS.gold,
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
