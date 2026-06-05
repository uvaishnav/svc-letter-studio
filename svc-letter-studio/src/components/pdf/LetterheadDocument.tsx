import { Document, Text, StyleSheet } from '@react-pdf/renderer'
import '../../pdf/fonts'
import { DEFAULT_SIGNATORY, DEFAULT_PDF_SETTINGS } from '../../constants/defaults'
import LetterheadFirstPage from './LetterheadFirstPage'
import Signatory from './Signatory'
import { COLORS } from '../../constants/brand'

const S = StyleSheet.create({
  body: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 9.5,
    color: COLORS.brown,
    lineHeight: 1.7,
    letterSpacing: 0.15,
  },
})

interface Props {
  content?: string
  watermarkEnabled?: boolean
  signatoryName?: string
  signatoryDesignation?: string
  showSignatory?: boolean
}

export default function LetterheadDocument({
  content = '',
  watermarkEnabled = DEFAULT_PDF_SETTINGS.watermarkEnabled,
  signatoryName = DEFAULT_SIGNATORY.name,
  signatoryDesignation = DEFAULT_SIGNATORY.designation,
  showSignatory = true,
}: Props) {
  return (
    <Document
      title="Sri Vaishnav Constructions — Letter"
      author="Sri Vaishnav Constructions"
      creator="SVC Letter Studio"
      producer="SVC Letter Studio"
    >
      <LetterheadFirstPage watermarkEnabled={watermarkEnabled}>
        {content ? <Text style={S.body}>{content}</Text> : null}
        {showSignatory && (
          <Signatory name={signatoryName} designation={signatoryDesignation} />
        )}
      </LetterheadFirstPage>
    </Document>
  )
}
