import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import {
  COLORS,
  BRAND_NAME_PRIMARY,
  BRAND_NAME_SECONDARY,
  BRAND_TAGLINE,
} from '../../constants/brand'

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
    fontFamily: 'Cormorant Garamond',
    fontWeight: 600,
    fontSize: 20,
    letterSpacing: 2.5,
    color: COLORS.brown,
    lineHeight: 1.1,
  },
  brandSecondary: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: 3,
    color: COLORS.brownLight,
    marginTop: 1,
  },
  tagline: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 7,
    letterSpacing: 0.8,
    color: COLORS.brownMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  goldDivider: {
    height: 1,
    backgroundColor: COLORS.gold,
    marginHorizontal: 36,
    marginBottom: 0,
  },
  goldAccentBar: {
    height: 0.5,
    backgroundColor: COLORS.goldLight,
    marginHorizontal: 36,
    marginTop: 2,
    marginBottom: 0,
  },
})

export default function Header() {
  return (
    <>
      <View style={styles.container}>
        <Image
          src="/logo/logo.png"
          style={styles.logo}
        />
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
