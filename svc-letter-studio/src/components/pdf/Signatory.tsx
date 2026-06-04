import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 36,
    alignItems: 'flex-end',
  },
  signatureSpace: {
    height: 40,
  },
  line: {
    width: 140,
    height: 0.75,
    backgroundColor: COLORS.brownMuted,
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: COLORS.brown,
    letterSpacing: 0.5,
    textAlign: 'center',
    width: 140,
  },
  designation: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: COLORS.brownMuted,
    letterSpacing: 0.3,
    textAlign: 'center',
    width: 140,
    marginTop: 1,
  },
  stamp: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 6.5,
    color: COLORS.gold,
    letterSpacing: 0.8,
    textAlign: 'center',
    width: 140,
    marginTop: 4,
  },
})

interface SignatoryProps {
  name: string
  designation: string
}

export default function Signatory({ name, designation }: SignatoryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.signatureSpace} />
      <View style={styles.line} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.designation}>{designation}</Text>
      <Text style={styles.stamp}>Sri Vaishnav Constructions</Text>
    </View>
  )
}
