import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'

const S = StyleSheet.create({
  container: {
    marginTop: 48,
    marginHorizontal: 32,
    alignItems: 'flex-end',
  },
  signatureBox: {
    alignItems: 'center',
    width: 160,
  },
  signatureSpace: {
    height: 44,
    width: 160,
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.brownMuted,
    borderBottomStyle: 'solid',
    marginBottom: 5,
  },
  stampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  stampLine: {
    height: 0.5,
    width: 20,
    backgroundColor: COLORS.gold,
  },
  stamp: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: 6,
    color: COLORS.gold,
    letterSpacing: 0.8,
  },
  name: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: 8,
    color: COLORS.brown,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  designation: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 7,
    color: COLORS.brownMuted,
    letterSpacing: 0.3,
    textAlign: 'center',
    marginTop: 2,
  },
})

interface SignatoryProps {
  name: string
  designation: string
}

export default function Signatory({ name, designation }: SignatoryProps) {
  return (
    <View style={S.container}>
      <View style={S.signatureBox}>
        <View style={S.signatureSpace} />
        <View style={S.stampBadge}>
          <View style={S.stampLine} />
          <Text style={S.stamp}>Sri Vaishnav Constructions</Text>
          <View style={S.stampLine} />
        </View>
        <Text style={S.name}>{name}</Text>
        <Text style={S.designation}>{designation}</Text>
      </View>
    </View>
  )
}
