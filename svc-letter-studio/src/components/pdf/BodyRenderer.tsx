import { View, Text, StyleSheet } from '@react-pdf/renderer'
import type { ContentBlock } from '../../types/document'
import { COLORS, FONTS } from '../../constants/brand'

// ─── Base style values (never change these — scaling is applied dynamically) ──
const BASE = {
  paragraphFontSize:  10,
  paragraphLineHeight: 1.6,
  paragraphMarginBottom: 6,
  heading1FontSize:   12,
  heading1MarginBottom: 6,
  heading1MarginTop:  8,
  heading2FontSize:   10.5,
  heading2MarginBottom: 4,
  heading2MarginTop:  6,
  listItemFontSize:   10,
  listItemLineHeight: 1.5,
  listItemMarginBottom: 3,
  tableMarginVertical: 8,
  dividerMarginVertical: 8,
  spacerSizes: { sm: 4, md: 8, lg: 16 } as Record<string, number>,
}

// ─── Fixed styles (padding, borders, colors — NEVER scaled) ──────────────────
const S = StyleSheet.create({
  paragraphBold: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: BASE.paragraphFontSize,
    color: COLORS.text,
    textAlign: 'justify',
  },
  paragraphIndentBase: {
    marginLeft: 16,
  },
  listRow: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  bullet: {
    fontFamily: FONTS.body,
    fontSize: BASE.listItemFontSize,
    color: COLORS.gold,
    marginRight: 6,
  },
  table: {
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
  },
})

// ─── Block Renderers (spacingScale only touches spacing, never fonts/colors) ──

function renderBlock(block: ContentBlock, index: number, sc: number) {
  switch (block.type) {

    case 'paragraph': {
      const base = {
        fontFamily: FONTS.body,
        fontSize: BASE.paragraphFontSize,
        color: COLORS.text,
        lineHeight: BASE.paragraphLineHeight * sc,
        marginBottom: BASE.paragraphMarginBottom * sc,
        textAlign: 'justify' as const,
      }
      const style = block.bold
        ? { ...S.paragraphBold, lineHeight: BASE.paragraphLineHeight * sc, marginBottom: BASE.paragraphMarginBottom * sc }
        : block.indent
          ? { ...base, marginLeft: 16 }
          : base
      return <Text key={index} style={style}>{block.text}</Text>
    }

    case 'heading': {
      const level = block.level ?? 1
      if (level === 1) {
        return (
          <Text key={index} style={{
            fontFamily: FONTS.bodySemiBold,
            fontSize: BASE.heading1FontSize,
            color: COLORS.darkBrown,
            marginBottom: BASE.heading1MarginBottom * sc,
            marginTop: BASE.heading1MarginTop * sc,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
            {block.text}
          </Text>
        )
      }
      return (
        <Text key={index} style={{
          fontFamily: FONTS.bodySemiBold,
          fontSize: BASE.heading2FontSize,
          color: COLORS.darkBrown,
          marginBottom: BASE.heading2MarginBottom * sc,
          marginTop: BASE.heading2MarginTop * sc,
        }}>
          {block.text}
        </Text>
      )
    }

    case 'bullet_list': {
      return (
        <View key={index}>
          {block.items.map((item, i) => (
            <View key={i} style={{ ...S.listRow, marginBottom: BASE.listItemMarginBottom * sc }}>
              <Text style={{ ...S.bullet, lineHeight: BASE.listItemLineHeight * sc }}>•</Text>
              <Text style={{
                fontFamily: FONTS.body,
                fontSize: BASE.listItemFontSize,
                color: COLORS.text,
                lineHeight: BASE.listItemLineHeight * sc,
                flex: 1,
              }}>{item}</Text>
            </View>
          ))}
        </View>
      )
    }

    case 'numbered_list': {
      return (
        <View key={index}>
          {block.items.map((item, i) => (
            <View key={i} style={{ ...S.listRow, marginBottom: BASE.listItemMarginBottom * sc }}>
              <Text style={{ ...S.bullet, lineHeight: BASE.listItemLineHeight * sc }}>{i + 1}.</Text>
              <Text style={{
                fontFamily: FONTS.body,
                fontSize: BASE.listItemFontSize,
                color: COLORS.text,
                lineHeight: BASE.listItemLineHeight * sc,
                flex: 1,
              }}>{item}</Text>
            </View>
          ))}
        </View>
      )
    }

    case 'table': {
      return (
        <View key={index} style={{ ...S.table, marginVertical: BASE.tableMarginVertical * sc }}>
          <View style={S.tableRow}>
            {block.headers.map((h, ci) => (
              <Text
                key={ci}
                style={ci === block.headers.length - 1 ? S.tableHeaderCellLast : S.tableHeaderCell}
              >
                {h}
              </Text>
            ))}
          </View>
          {block.rows.map((row, ri) => (
            <View
              key={ri}
              style={ri === block.rows.length - 1 ? S.tableRowLast : S.tableRow}
            >
              {row.map((cell, ci) => {
                const isAlt  = ri % 2 !== 0
                const isLast = ci === row.length - 1
                const cellStyle = isLast
                  ? (isAlt ? S.tableCellAltLast : S.tableCellLast)
                  : (isAlt ? S.tableCellAlt    : S.tableCell)
                return <Text key={ci} style={cellStyle}>{cell}</Text>
              })}
            </View>
          ))}
        </View>
      )
    }

    case 'spacer': {
      const height = BASE.spacerSizes[block.size ?? 'md'] * sc
      return <View key={index} style={{ height }} />
    }

    case 'divider': {
      return (
        <View key={index} style={{
          ...S.divider,
          marginVertical: BASE.dividerMarginVertical * sc,
        }} />
      )
    }

    default:
      return null
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  blocks: ContentBlock[]
  spacingScale?: number   // 1.0 = normal; < 1.0 = compacted to eliminate widow page
}

export default function BodyRenderer({ blocks, spacingScale = 1 }: Props) {
  if (!blocks || blocks.length === 0) return null
  const sc = Math.max(0.72, Math.min(1, spacingScale))  // clamp safety
  return <>{blocks.map((block, i) => renderBlock(block, i, sc))}</>
}
