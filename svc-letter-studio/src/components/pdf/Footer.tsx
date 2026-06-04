import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS, CONTACT } from '../../constants/brand'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 4,
    paddingBottom: 20,
    backgroundColor: COLORS.ivory,
  },
  contactItem: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 7,
    color: COLORS.brownMuted,
    letterSpacing: 0.3,
  },
  centerText: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 6.5,
    color: COLORS.gold,
    letterSpacing: 1,
    textAlign: 'center',
  },
})

interface FooterProps {
  pageNumber?: number
  totalPages?: number
  showPageNumber?: boolean
}

export default function Footer({ pageNumber, totalPages, showPageNumber = false }: FooterProps) {
  return (
    <View style={styles.wrapper} fixed>
      <View style={styles.goldDivider} />
      <View style={styles.goldAccentBar} />
      <View style={styles.container}>
        <Text style={styles.contactItem}>{CONTACT.phone}</Text>
        {showPageNumber && pageNumber != null && totalPages != null ? (
          <Text style={styles.centerText}>
            {pageNumber} / {totalPages}
          </Text>
        ) : (
          <Text style={styles.centerText}>SRI VAISHNAV CONSTRUCTIONS</Text>
        )}
        <Text style={styles.contactItem}>{CONTACT.email}</Text>
      </View>
    </View>
  )
}
