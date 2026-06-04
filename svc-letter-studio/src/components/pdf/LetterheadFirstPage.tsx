import { Page, View, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'
import Header from './Header'
import Footer from './Footer'
import Watermark from './Watermark'

const styles = StyleSheet.create({
  page: {
    // Do NOT set fontFamily here — 'Montserrat' is not registered in @react-pdf/renderer.
    // Each component sets its own fontFamily using PDFKit built-ins (Helvetica, etc).
    backgroundColor: COLORS.ivory,
  },
  contentArea: {
    flex: 1,
    marginHorizontal: 36,
    marginTop: 20,
    marginBottom: 72,
  },
})

interface Props {
  watermarkEnabled?: boolean
  children?: React.ReactNode
}

export default function LetterheadFirstPage({ watermarkEnabled = true, children }: Props) {
  return (
    <Page size="A4" style={styles.page}>
      <Header />
      {watermarkEnabled && <Watermark />}
      <View style={styles.contentArea}>
        {children}
      </View>
      <Footer />
    </Page>
  )
}
