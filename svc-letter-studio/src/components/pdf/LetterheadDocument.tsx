import { Document, View, Text, StyleSheet } from '@react-pdf/renderer'
import '../../pdf/fonts'
import { DEFAULT_SIGNATORY, DEFAULT_PDF_SETTINGS } from '../../store/sessionStore'
import type { LetterDraft } from '../../types/document'
import LetterheadFirstPage from './LetterheadFirstPage'
import LetterheadContinuationPage from './LetterheadContinuationPage'
import Signatory from './Signatory'
import Watermark from './Watermark'
import BodyRenderer from './BodyRenderer'
import { COLORS, FONTS } from '../../constants/brand'

const S = StyleSheet.create({
  envelopeSection: {
    marginBottom: 10,
  },
  dateRef: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.text,
  },
  refText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.text,
  },
  recipientBlock: {
    marginBottom: 10,
  },
  recipientLine: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.5,
  },
  toLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9.5,
    color: COLORS.darkBrown,
    marginBottom: 2,
  },
  subjectLine: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 2,
  },
  subjectLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9.5,
    color: COLORS.darkBrown,
    marginRight: 4,
  },
  subjectText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9.5,
    color: COLORS.text,
    flex: 1,
  },
  divider: {
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
})

interface Props {
  draft?: LetterDraft | null
  watermarkEnabled?: boolean
}

export default function LetterheadDocument({
  draft,
  watermarkEnabled = DEFAULT_PDF_SETTINGS.watermarkEnabled,
}: Props) {
  const envelope = draft?.envelope
  const blocks   = draft?.blocks ?? []
  const signatory = envelope?.signatory ?? DEFAULT_SIGNATORY

  const envelopeSection = (
    <View style={S.envelopeSection}>
      {/* Date + Ref row */}
      {(envelope?.date || envelope?.refNumber) && (
        <View style={S.dateRef}>
          {envelope?.date
            ? <Text style={S.dateText}>Date: {envelope.date}</Text>
            : <Text style={S.dateText} />}
          {envelope?.refNumber
            ? <Text style={S.refText}>Ref: {envelope.refNumber}</Text>
            : null}
        </View>
      )}

      {/* Recipient block */}
      {envelope?.recipient && (
        <View style={S.recipientBlock}>
          <Text style={S.toLabel}>To,</Text>
          {envelope.recipient.name        && <Text style={S.recipientLine}>{envelope.recipient.name}</Text>}
          {envelope.recipient.designation && <Text style={S.recipientLine}>{envelope.recipient.designation}</Text>}
          {envelope.recipient.company     && <Text style={S.recipientLine}>{envelope.recipient.company}</Text>}
          {envelope.recipient.address     && <Text style={S.recipientLine}>{envelope.recipient.address}</Text>}
        </View>
      )}

      {/* Subject line */}
      {envelope?.subject && (
        <View style={S.subjectLine}>
          <Text style={S.subjectLabel}>Sub:</Text>
          <Text style={S.subjectText}>{envelope.subject}</Text>
        </View>
      )}

      {/* Divider before body */}
      {(envelope?.date || envelope?.recipient || envelope?.subject) && (
        <View style={S.divider} />
      )}
    </View>
  )

  return (
    <Document
      title="Sri Vaishnav Constructions — Letter"
      author="Sri Vaishnav Constructions"
      creator="SVC Letter Studio"
      producer="SVC Letter Studio"
    >
      <LetterheadFirstPage watermarkEnabled={watermarkEnabled}>
        {envelopeSection}
        <BodyRenderer blocks={blocks} />
        <Signatory name={signatory.name} designation={signatory.designation} />
      </LetterheadFirstPage>
    </Document>
  )
}
