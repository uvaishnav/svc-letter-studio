import { Document, View, Text, StyleSheet } from '@react-pdf/renderer'
import '../../pdf/fonts'
import { DEFAULT_SIGNATORY, DEFAULT_PDF_SETTINGS } from '../../constants/defaults'
import type { LetterDraft } from '../../types/document'
import { partitionBlocks } from '../../pdf/partitionBlocks'
import LetterheadFirstPage from './LetterheadFirstPage'
import LetterheadContinuationPage from './LetterheadContinuationPage'
import Signatory from './Signatory'
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

function estimateEnvelopeHeight(envelope: LetterDraft['envelope']): number {
  let h = 0
  if (envelope.date || envelope.refNumber) h += 22
  if (envelope.recipient) {
    h += 14
    if (envelope.recipient.name)        h += 14
    if (envelope.recipient.designation) h += 14
    if (envelope.recipient.company)     h += 14
    if (envelope.recipient.address)     h += 14
    h += 10
  }
  if (envelope.subject) {
    const lines = Math.ceil(envelope.subject.length / 70)
    h += lines * 14 + 12
  }
  h += 20
  return h
}

interface Props {
  draft?: LetterDraft | null
  watermarkEnabled?: boolean
}

export default function LetterheadDocument({
  draft,
  watermarkEnabled = DEFAULT_PDF_SETTINGS.watermarkEnabled,
}: Props) {
  const envelope  = draft?.envelope
  const blocks    = draft?.blocks ?? []
  const signatory = envelope?.signatory ?? DEFAULT_SIGNATORY

  const envelopeHeight = envelope ? estimateEnvelopeHeight(envelope) : 0

  const { page1, continuations, totalPages } = partitionBlocks(blocks, envelopeHeight)

  const envelopeSection = (
    <View style={S.envelopeSection}>
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
      {envelope?.recipient && (
        <View style={S.recipientBlock}>
          <Text style={S.toLabel}>To,</Text>
          {envelope.recipient.name        && <Text style={S.recipientLine}>{envelope.recipient.name}</Text>}
          {envelope.recipient.designation && <Text style={S.recipientLine}>{envelope.recipient.designation}</Text>}
          {envelope.recipient.company     && <Text style={S.recipientLine}>{envelope.recipient.company}</Text>}
          {envelope.recipient.address     && <Text style={S.recipientLine}>{envelope.recipient.address}</Text>}
        </View>
      )}
      {envelope?.subject && (
        <View style={S.subjectLine}>
          <Text style={S.subjectLabel}>Sub:</Text>
          <Text style={S.subjectText}>{envelope.subject}</Text>
        </View>
      )}
      {(envelope?.date || envelope?.recipient || envelope?.subject) && (
        <View style={S.divider} />
      )}
    </View>
  )

  const isLastPage = (pageIndex: number) => pageIndex === totalPages - 1

  return (
    <Document
      title="Sri Vaishnav Constructions — Letter"
      author="Sri Vaishnav Constructions"
      creator="SVC Letter Studio"
      producer="SVC Letter Studio"
    >
      <LetterheadFirstPage watermarkEnabled={watermarkEnabled}>
        {envelopeSection}
        <BodyRenderer blocks={page1} spacingScale={1} />
        {isLastPage(0) && (
          <Signatory name={signatory.name} designation={signatory.designation} />
        )}
      </LetterheadFirstPage>

      {continuations.map((pageBlocks, idx) => {
        const pageNumber = idx + 2
        const isLast = isLastPage(pageNumber - 1)
        return (
          <LetterheadContinuationPage
            key={pageNumber}
            pageNumber={pageNumber}
            totalPages={totalPages}
            watermarkEnabled={watermarkEnabled}
          >
            <BodyRenderer blocks={pageBlocks} spacingScale={1} />
            {isLast && (
              <Signatory name={signatory.name} designation={signatory.designation} />
            )}
          </LetterheadContinuationPage>
        )
      })}
    </Document>
  )
}
