import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'

const S = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 36,
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
        <Text style={S.name}>{name}</Text>
        <Text style={S.designation}>{designation}</Text>
      </View>
    </View>
  )
}
