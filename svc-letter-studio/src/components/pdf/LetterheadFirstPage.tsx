import { Page, View, StyleSheet } from '@react-pdf/renderer'
import { COLORS } from '../../constants/brand'
import Header from './Header'
import Footer from './Footer'
import Watermark from './Watermark'

const S = StyleSheet.create({
  page: {
    backgroundColor: COLORS.ivory,
  },
  contentArea: {
    flex: 1,
    marginLeft: 36,
    marginRight: 36,
    marginTop: 20,
    marginBottom: 65,
  },
})

interface Props {
  watermarkEnabled?: boolean
  children?: React.ReactNode
}

export default function LetterheadFirstPage({ watermarkEnabled = true, children }: Props) {
  return (
    <Page size="A4" style={S.page}>
      <Header />
      {watermarkEnabled && <Watermark />}
      <View style={S.contentArea}>
        {children}
      </View>
      <Footer />
    </Page>
  )
}
