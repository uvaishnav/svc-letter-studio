import { View, Text, StyleSheet } from '@react-pdf/renderer'
import type { ContentBlock } from '../../types/document'
import { COLORS, FONTS } from '../../constants/brand'

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  paragraph: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.6,
    marginBottom: 6,
    textAlign: 'justify',
  },
  paragraphBold: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  paragraphIndent: {
    marginLeft: 16,
  },
  heading1: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.darkBrown,
    marginBottom: 6,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heading2: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10.5,
    color: COLORS.darkBrown,
    marginBottom: 4,
    marginTop: 6,
  },
  listItem: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  listRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 8,
  },
  bullet: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.gold,
    marginRight: 6,
    lineHeight: 1.5,
  },
  // Table
  table: {
    marginVertical: 8,
    borderColor: COLORS.gold,
    borderWidth: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 0.5,
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.darkBrown,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    color: COLORS.ivory,
    borderRightColor: COLORS.gold,
    borderRightWidth: 0.5,
  },
  tableHeaderCellLast: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.darkBrown,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 9,
    color: COLORS.ivory,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.text,
    borderRightColor: COLORS.gold,
    borderRightWidth: 0.5,
  },
  tableCellLast: {
    flex: 1,
    padding: 5,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.text,
  },
  tableCellAlt: {
    flex: 1,
    padding: 5,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.text,
    backgroundColor: '#FAF7F2',
    borderRightColor: COLORS.gold,
    borderRightWidth: 0.5,
  },
  tableCellAltLast: {
    flex: 1,
    padding: 5,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.text,
    backgroundColor: '#FAF7F2',
  },
  divider: {
    borderBottomColor: COLORS.gold,
    borderBottomWidth: 0.5,
    marginVertical: 8,
  },
})

// ─── Spacer sizes ─────────────────────────────────────────────────────────────
const SPACER_SIZE = { sm: 4, md: 8, lg: 16 }

// ─── Block Renderers ─────────────────────────────────────────────────────────

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'paragraph': {
      const style = [
        block.bold ? s.paragraphBold : s.paragraph,
        block.indent ? s.paragraphIndent : {},
      ]
      return <Text key={index} style={style}>{block.text}</Text>
    }

    case 'heading': {
      const level = block.level ?? 1
      return <Text key={index} style={level === 1 ? s.heading1 : s.heading2}>{block.text}</Text>
    }

    case 'bullet_list': {
      return (
        <View key={index}>
          {block.items.map((item, i) => (
            <View key={i} style={s.listRow}>
              <Text style={s.bullet}>•</Text>
              <Text style={s.listItem}>{item}</Text>
            </View>
          ))}
        </View>
      )
    }

    case 'numbered_list': {
      return (
        <View key={index}>
          {block.items.map((item, i) => (
            <View key={i} style={s.listRow}>
              <Text style={s.bullet}>{i + 1}.</Text>
              <Text style={s.listItem}>{item}</Text>
            </View>
          ))}
        </View>
      )
    }

    case 'table': {
      return (
        <View key={index} style={s.table}>
          {/* Header row */}
          <View style={s.tableRow}>
            {block.headers.map((h, ci) => (
              <Text
                key={ci}
                style={ci === block.headers.length - 1 ? s.tableHeaderCellLast : s.tableHeaderCell}
              >
                {h}
              </Text>
            ))}
          </View>
          {/* Data rows */}
          {block.rows.map((row, ri) => (
            <View
              key={ri}
              style={ri === block.rows.length - 1 ? s.tableRowLast : s.tableRow}
            >
              {row.map((cell, ci) => {
                const isAlt = ri % 2 !== 0
                const isLast = ci === row.length - 1
                const cellStyle = isLast
                  ? (isAlt ? s.tableCellAltLast : s.tableCellLast)
                  : (isAlt ? s.tableCellAlt : s.tableCell)
                return <Text key={ci} style={cellStyle}>{cell}</Text>
              })}
            </View>
          ))}
        </View>
      )
    }

    case 'spacer': {
      const height = SPACER_SIZE[block.size ?? 'md']
      return <View key={index} style={{ height }} />
    }

    case 'divider': {
      return <View key={index} style={s.divider} />
    }

    default:
      return null
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  blocks: ContentBlock[]
}

export default function BodyRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>
}
