import { Page, View, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'
import Header from './Header'
import Footer from './Footer'
import Watermark from './Watermark'

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
    fontFamily: 'Montserrat',
  },
  contentArea: {
    flex: 1,
    marginHorizontal: 36,
    marginTop: 20,
    // bottom margin is occupied by the absolute-positioned Footer (≈56pt)
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
