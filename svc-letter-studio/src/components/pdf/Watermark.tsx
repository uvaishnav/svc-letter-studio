import { View, Image, StyleSheet } from '@react-pdf/renderer'

const getLogoUrl = () =>
  typeof window !== 'undefined'
    ? `${window.location.origin}/logo/logo.png`
    : '/logo/logo.png'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 240,
    opacity: 0.04,
  },
})

export default function Watermark() {
  return (
    <View style={styles.container} fixed>
      <Image src={getLogoUrl()} style={styles.logo} />
    </View>
  )
}
