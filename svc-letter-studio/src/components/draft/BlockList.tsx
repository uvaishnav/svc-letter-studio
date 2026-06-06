import type { ContentBlock } from '../../types/document'

interface Props {
  blocks: ContentBlock[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

function blockPreview(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':      return block.text
    case 'heading':        return block.text
    case 'bullet_list':    return block.items.join(' · ')
    case 'numbered_list':  return block.items.join(' · ')
    case 'table':          return `Table: ${block.headers.join(', ')}`
    case 'spacer':         return '⎵  spacer'
    case 'divider':        return '── divider ──'
    default:               return ''
  }
}

function blockLabel(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':     return block.bold ? 'Paragraph (Bold)' : 'Paragraph'
    case 'heading':       return `Heading ${block.level ?? 1}`
    case 'bullet_list':   return `Bullet List (${block.items.length} items)`
    case 'numbered_list': return `Numbered List (${block.items.length} items)`
    case 'table':         return `Table (${block.headers.length} cols × ${block.rows.length} rows)`
    case 'spacer':        return 'Spacer'
    case 'divider':       return 'Divider'
    default:              return 'Block'
  }
}

export default function BlockList({ blocks, selectedIndex, onSelect }: Props) {
  if (blocks.length === 0) {
    return (
      <div style={{
        padding: 24,
        textAlign: 'center',
        color: '#A0978B',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 14,
      }}>
        No content blocks yet.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {blocks.map((block, idx) => {
        const isSelected = selectedIndex === idx
        const isNonEditable = block.type === 'spacer' || block.type === 'divider'

        return (
          <button
            key={idx}
            onClick={() => !isNonEditable && onSelect(idx)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: isSelected ? '#FFF8EC' : '#FDFAF4',
              border: isSelected ? '2px solid #C8A96A' : '1.5px solid #E8E0D0',
              borderRadius: 10,
              padding: '10px 14px',
              cursor: isNonEditable ? 'default' : 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              opacity: isNonEditable ? 0.5 : 1,
            }}
          >
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              color: '#C8A96A',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}>
              {blockLabel(block)}
            </div>
            <div style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 13,
              color: '#3B2A1F',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {blockPreview(block)}
            </div>
          </button>
        )
      })}
    </div>
  )
}
