import { View, Image, StyleSheet } from '@react-pdf/renderer'

const base = typeof window !== 'undefined' ? window.location.origin : ''

const S = StyleSheet.create({
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
    width: 220,
    height: 220,
    opacity: 0.032,
  },
})

export default function Watermark() {
  return (
    <View style={S.container} fixed>
      <Image src={`${base}/logo/logo.png`} style={S.logo} />
    </View>
  )
}
