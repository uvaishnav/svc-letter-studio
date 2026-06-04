import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import {
  COLORS,
  BRAND_NAME_PRIMARY,
  BRAND_NAME_SECONDARY,
  BRAND_TAGLINE,
} from '../../constants/brand'

// Logo must be an absolute URL so @react-pdf/renderer can fetch it via XHR.
// window.location.origin resolves correctly in both dev (localhost:5173) and prod.
const getLogoUrl = () =>
  typeof window !== 'undefined'
    ? `${window.location.origin}/logo/logo.png`
    : '/logo/logo.png'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 16,
    backgroundColor: COLORS.ivory,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 14,
  },
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandPrimary: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    letterSpacing: 2.5,
    color: COLORS.brown,
    lineHeight: 1.1,
  },
  brandSecondary: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 3,
    color: COLORS.brownLight,
    marginTop: 2,
  },
  tagline: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 7,
    letterSpacing: 0.5,
    color: COLORS.brownMuted,
    marginTop: 4,
  },
  goldDivider: {
    height: 1,
    backgroundColor: COLORS.gold,
    marginHorizontal: 36,
  },
  goldAccentBar: {
    height: 0.5,
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 36,
    marginTop: 2,
  },
})

export default function Header() {
  return (
    <>
      <View style={styles.container}>
        <Image src={getLogoUrl()} style={styles.logo} />
        <View style={styles.textBlock}>
          <Text style={styles.brandPrimary}>{BRAND_NAME_PRIMARY}</Text>
          <Text style={styles.brandSecondary}>{BRAND_NAME_SECONDARY}</Text>
          <Text style={styles.tagline}>{BRAND_TAGLINE}</Text>
        </View>
      </View>
      <View style={styles.goldDivider} />
      <View style={styles.goldAccentBar} />
    </>
  )
}
