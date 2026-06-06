import { useState } from 'react'
import type { ContentBlock, ParagraphBlock, HeadingBlock, BulletListBlock, NumberedListBlock, TableBlock } from '../../types/document'

interface Props {
  blocks: ContentBlock[]
  selectedIndex: number | null
  onSelect: (index: number) => void
  onUpdate: (index: number, updated: ContentBlock) => void
}

// ─── Shared styles ──────────────────────────────────────────────────────────
const card = (selected: boolean): React.CSSProperties => ({
  width: '100%',
  textAlign: 'left',
  background: selected ? '#FFF8EC' : '#FDFAF4',
  border: selected ? '2px solid #C8A96A' : '1.5px solid #E8E0D0',
  borderRadius: 10,
  padding: '10px 14px',
  marginBottom: 8,
  cursor: 'pointer',
  transition: 'border-color 0.15s, background 0.15s',
  boxSizing: 'border-box' as const,
})

const chipStyle: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 10,
  fontWeight: 700,
  color: '#C8A96A',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '7px 10px',
  borderRadius: 6,
  border: '1.5px solid #C8A96A',
  background: '#FFF8EC',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 13,
  color: '#3B2A1F',
  lineHeight: 1.5,
  resize: 'vertical' as const,
  outline: 'none',
}

// ─── Paragraph block ────────────────────────────────────────────────────────
function ParagraphEditor({ block, onSave }: { block: ParagraphBlock; onSave: (b: ParagraphBlock) => void }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(block.text)

  if (editing) {
    return (
      <div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          autoFocus
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button onClick={() => { setText(block.text); setEditing(false) }}
            style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #E8E0D0', background: '#F5F1E8', fontFamily: 'Montserrat, sans-serif', fontSize: 12, cursor: 'pointer', color: '#3B2A1F' }}>
            Cancel
          </button>
          <button onClick={() => { onSave({ ...block, text }); setEditing(false) }}
            style={{ flex: 2, padding: '6px 0', borderRadius: 6, border: 'none', background: '#3B2A1F', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#F5F1E8' }}>
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 13,
        color: block.bold ? '#3B2A1F' : '#5C4A3A',
        fontWeight: block.bold ? 700 : 400,
        lineHeight: 1.6,
        margin: 0,
        paddingLeft: block.indent ? 12 : 0,
        borderLeft: block.indent ? '2px solid #E8E0D0' : 'none',
        whiteSpace: 'pre-wrap',
      }}>
        {block.text}
      </p>
      <button onClick={() => setEditing(true)}
        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#C8A96A', padding: '0 2px' }}>
        ✎
      </button>
    </div>
  )
}

// ─── Heading block ──────────────────────────────────────────────────────────
function HeadingEditor({ block, onSave }: { block: HeadingBlock; onSave: (b: HeadingBlock) => void }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(block.text)

  if (editing) {
    return (
      <div>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
          style={{ ...inputStyle, fontSize: block.level === 1 ? 16 : 14, fontWeight: 700 }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button onClick={() => { setText(block.text); setEditing(false) }}
            style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #E8E0D0', background: '#F5F1E8', fontFamily: 'Montserrat, sans-serif', fontSize: 12, cursor: 'pointer', color: '#3B2A1F' }}>
            Cancel
          </button>
          <button onClick={() => { onSave({ ...block, text }); setEditing(false) }}
            style={{ flex: 2, padding: '6px 0', borderRadius: 6, border: 'none', background: '#3B2A1F', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#F5F1E8' }}>
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: block.level === 1 ? 16 : 14,
        fontWeight: 700,
        color: '#3B2A1F',
        margin: 0,
        letterSpacing: block.level === 1 ? '0.01em' : '0',
        borderBottom: block.level === 1 ? '1.5px solid #E8E0D0' : 'none',
        paddingBottom: block.level === 1 ? 4 : 0,
      }}>
        {block.text}
      </p>
      <button onClick={() => setEditing(true)}
        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#C8A96A', padding: '0 2px' }}>
        ✎
      </button>
    </div>
  )
}

// ─── List block (bullet + numbered) ─────────────────────────────────────────
function ListEditor({
  block, onSave
}: {
  block: BulletListBlock | NumberedListBlock
  onSave: (b: BulletListBlock | NumberedListBlock) => void
}) {
  const [items, setItems] = useState<string[]>(block.items)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')

  const startEdit = (idx: number) => { setEditingIdx(idx); setEditVal(items[idx]) }
  const saveEdit  = (idx: number) => {
    const next = [...items]; next[idx] = editVal
    setItems(next)
    onSave({ ...block, items: next })
    setEditingIdx(null)
  }
  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx)
    setItems(next)
    onSave({ ...block, items: next })
  }
  const addItem = () => {
    const next = [...items, '']
    setItems(next)
    setEditingIdx(next.length - 1)
    setEditVal('')
  }

  const isBullet = block.type === 'bullet_list'

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 13, color: '#C8A96A',
            marginTop: editingIdx === idx ? 8 : 3,
            minWidth: 18, fontWeight: 700, flexShrink: 0,
          }}>
            {isBullet ? '•' : `${idx + 1}.`}
          </span>
          {editingIdx === idx ? (
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={editVal}
                autoFocus
                onChange={e => setEditVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(idx); if (e.key === 'Escape') setEditingIdx(null) }}
                style={{ ...inputStyle, padding: '5px 8px', marginBottom: 4 }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditingIdx(null)}
                  style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid #E8E0D0', background: '#F5F1E8', fontFamily: 'Montserrat, sans-serif', fontSize: 11, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => saveEdit(idx)}
                  style={{ flex: 2, padding: '4px 0', borderRadius: 5, border: 'none', background: '#3B2A1F', fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#F5F1E8' }}>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#3B2A1F', lineHeight: 1.5 }}>
                {item || <em style={{ color: '#A0978B' }}>empty</em>}
              </span>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 6 }}>
                <button onClick={() => startEdit(idx)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8A96A', fontSize: 13, padding: '0 2px' }}>✎</button>
                <button onClick={() => removeItem(idx)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D0847A', fontSize: 13, padding: '0 2px' }}>✕</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addItem}
        style={{
          marginTop: 6, width: '100%', padding: '6px 0',
          borderRadius: 6, border: '1.5px dashed #C8A96A',
          background: 'transparent', cursor: 'pointer',
          fontFamily: 'Montserrat, sans-serif', fontSize: 12,
          color: '#C8A96A', fontWeight: 600,
        }}
      >
        + Add item
      </button>
    </div>
  )
}

// ─── Table block ─────────────────────────────────────────────────────────────
function TableEditor({ block, onSave }: { block: TableBlock; onSave: (b: TableBlock) => void }) {
  const [headers, setHeaders] = useState<string[]>(block.headers)
  const [rows, setRows]       = useState<string[][]>(block.rows)
  const [editCell, setEditCell] = useState<{ r: number; c: number } | null>(null) // r=-1 for header
  const [cellVal, setCellVal]   = useState('')

  const startEdit = (r: number, c: number, val: string) => { setEditCell({ r, c }); setCellVal(val) }

  const saveCell = () => {
    if (!editCell) return
    const { r, c } = editCell
    if (r === -1) {
      const next = [...headers]; next[c] = cellVal
      setHeaders(next); onSave({ ...block, headers: next, rows })
    } else {
      const next = rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? cellVal : cell) : row)
      setRows(next); onSave({ ...block, headers, rows: next })
    }
    setEditCell(null)
  }

  const addRow = () => {
    const next = [...rows, headers.map(() => '')]
    setRows(next); onSave({ ...block, headers, rows: next })
  }

  const cellStyle = (isHeader: boolean, isEditing: boolean): React.CSSProperties => ({
    padding: isEditing ? 2 : '5px 8px',
    border: '1px solid #E8E0D0',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 12,
    fontWeight: isHeader ? 700 : 400,
    color: isHeader ? '#3B2A1F' : '#5C4A3A',
    background: isHeader ? '#F0EAD8' : '#FDFAF4',
    cursor: isEditing ? 'default' : 'pointer',
    minWidth: 60,
    verticalAlign: 'top' as const,
  })

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
        <thead>
          <tr>
            {headers.map((h, c) => (
              <th key={c} style={cellStyle(true, editCell?.r === -1 && editCell?.c === c)}
                onClick={() => editCell === null && startEdit(-1, c, h)}>
                {editCell?.r === -1 && editCell?.c === c ? (
                  <input
                    autoFocus value={cellVal}
                    onChange={e => setCellVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveCell(); if (e.key === 'Escape') setEditCell(null) }}
                    onBlur={saveCell}
                    style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'Montserrat, sans-serif', fontSize: 12, fontWeight: 700, outline: 'none', padding: '3px 4px' }}
                  />
                ) : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} style={cellStyle(false, editCell?.r === r && editCell?.c === c)}
                  onClick={() => editCell === null && startEdit(r, c, cell)}>
                  {editCell?.r === r && editCell?.c === c ? (
                    <input
                      autoFocus value={cellVal}
                      onChange={e => setCellVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveCell(); if (e.key === 'Escape') setEditCell(null) }}
                      onBlur={saveCell}
                      style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'Montserrat, sans-serif', fontSize: 12, outline: 'none', padding: '3px 4px' }}
                    />
                  ) : (cell || <span style={{ color: '#C8A96A', fontStyle: 'italic' }}>—</span>)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        style={{
          marginTop: 6, width: '100%', padding: '5px 0',
          borderRadius: 6, border: '1.5px dashed #C8A96A',
          background: 'transparent', cursor: 'pointer',
          fontFamily: 'Montserrat, sans-serif', fontSize: 11,
          color: '#C8A96A', fontWeight: 600,
        }}
      >
        + Add row
      </button>
    </div>
  )
}

// ─── Spacer / Divider visual ─────────────────────────────────────────────────
function SpacerVisual() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45 }}>
      <div style={{ flex: 1, borderTop: '1.5px dashed #C8A96A' }} />
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: '#C8A96A' }}>SPACER</span>
      <div style={{ flex: 1, borderTop: '1.5px dashed #C8A96A' }} />
    </div>
  )
}

function DividerVisual() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, borderTop: '1.5px solid #C8A96A' }} />
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: '#C8A96A', fontWeight: 700 }}>DIVIDER</span>
      <div style={{ flex: 1, borderTop: '1.5px solid #C8A96A' }} />
    </div>
  )
}

// ─── Block type label ─────────────────────────────────────────────────────────
function blockLabel(block: ContentBlock): string {
  switch (block.type) {
    case 'paragraph':     return block.bold ? 'Paragraph · Bold' : 'Paragraph'
    case 'heading':       return `Heading ${block.level ?? 1}`
    case 'bullet_list':   return `Bullet List · ${block.items.length} items`
    case 'numbered_list': return `Numbered List · ${block.items.length} items`
    case 'table':         return `Table · ${block.headers.length} cols × ${block.rows.length} rows`
    case 'spacer':        return 'Spacer'
    case 'divider':       return 'Divider'
    default:              return 'Block'
  }
}

// ─── Main BlockList ───────────────────────────────────────────────────────────
export default function BlockList({ blocks, selectedIndex, onSelect, onUpdate }: Props) {
  if (blocks.length === 0) {
    return (
      <div style={{
        padding: 24, textAlign: 'center',
        color: '#A0978B', fontFamily: 'Montserrat, sans-serif', fontSize: 14,
      }}>
        No content blocks yet.
      </div>
    )
  }

  return (
    <div>
      {blocks.map((block, idx) => {
        const isSelected = selectedIndex === idx
        const isNonEditable = block.type === 'spacer' || block.type === 'divider'

        return (
          <div
            key={idx}
            style={card(isSelected)}
            onClick={() => !isNonEditable && onSelect(idx)}
          >
            {/* Block type chip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={chipStyle}>{blockLabel(block)}</span>
              {isSelected && !isNonEditable && (
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: '#C8A96A' }}>
                  ✦ selected
                </span>
              )}
            </div>

            {/* Block content — type-aware inline editor */}
            <div onClick={e => e.stopPropagation()}>
              {block.type === 'paragraph' && (
                <ParagraphEditor
                  block={block}
                  onSave={updated => onUpdate(idx, updated)}
                />
              )}
              {block.type === 'heading' && (
                <HeadingEditor
                  block={block}
                  onSave={updated => onUpdate(idx, updated)}
                />
              )}
              {(block.type === 'bullet_list' || block.type === 'numbered_list') && (
                <ListEditor
                  block={block}
                  onSave={updated => onUpdate(idx, updated)}
                />
              )}
              {block.type === 'table' && (
                <TableEditor
                  block={block}
                  onSave={updated => onUpdate(idx, updated)}
                />
              )}
              {block.type === 'spacer'  && <SpacerVisual />}
              {block.type === 'divider' && <DividerVisual />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
