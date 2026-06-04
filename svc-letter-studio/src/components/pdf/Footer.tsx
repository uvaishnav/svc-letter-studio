import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS, CONTACT } from '../../constants/brand'

const S = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  goldTopBar: {
    height: 2,
    backgroundColor: COLORS.gold,
  },
  container: {
    backgroundColor: COLORS.brown,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 14,
    flexDirection: 'column',
    gap: 4,
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
    marginTop: 2,
  },
  contactItem: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 7,
    color: COLORS.goldLight,
    letterSpacing: 0.3,
  },
  centerBrand: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 6.5,
    color: COLORS.gold,
    letterSpacing: 2,
    textAlign: 'center',
  },
  address: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 6.5,
    color: COLORS.ivoryDark,
    letterSpacing: 0.3,
    textAlign: 'center',
    opacity: 0.7,
  },
  dot: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 6,
    color: COLORS.gold,
    opacity: 0.6,
  },
  pageNum: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 7,
    color: COLORS.goldLight,
    letterSpacing: 0.3,
  },
})

interface FooterProps {
  pageNumber?: number
  totalPages?: number
  showPageNumber?: boolean
}

export default function Footer({ pageNumber, totalPages, showPageNumber = false }: FooterProps) {
  return (
    <View style={S.wrapper} fixed>
      <View style={S.goldTopBar} />
      <View style={S.container}>
        <View style={S.topRow}>
          <Text style={S.contactItem}>{CONTACT.phone}</Text>
          {showPageNumber && pageNumber != null
            ? <Text style={S.pageNum}>{pageNumber} / {totalPages}</Text>
            : <Text style={S.centerBrand}>SRI VAISHNAV CONSTRUCTIONS</Text>
          }
          <Text style={S.contactItem}>{CONTACT.email}</Text>
        </View>
        <View style={S.bottomRow}>
          <Text style={S.address}>{CONTACT.address}</Text>
          {CONTACT.gstin ? (
            <><Text style={S.dot}>•</Text><Text style={S.address}>GSTIN: {CONTACT.gstin}</Text></>
          ) : null}
        </View>
      </View>
    </View>
  )
}
