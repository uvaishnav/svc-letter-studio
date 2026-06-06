import { useState } from 'react'
import type { ContentBlock } from '../../types/document'
import type { ImproveAction } from '../../ai/tasks/improveBlock'

interface Props {
  block: ContentBlock
  blockIndex: number
  onImprove: (index: number, action: ImproveAction, customInstruction?: string) => Promise<void>
  onManualEdit: (index: number, updated: ContentBlock) => void
  onClose: () => void
  isLoading: boolean
}

const btnBase: React.CSSProperties = {
  flex: 1,
  padding: '9px 4px',
  borderRadius: 8,
  border: 'none',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
}

const AI_ACTIONS: { action: ImproveAction; label: string; emoji: string }[] = [
  { action: 'shorten',  label: 'Shorten',  emoji: '✂️' },
  { action: 'expand',   label: 'Expand',   emoji: '📝' },
  { action: 'formal',   label: 'Formal',   emoji: '🎩' },
  { action: 'rewrite',  label: 'Rewrite',  emoji: '🔄' },
]

function getEditableText(block: ContentBlock): string {
  if (block.type === 'paragraph') return block.text
  if (block.type === 'heading')   return block.text
  if (block.type === 'bullet_list' || block.type === 'numbered_list')
    return block.items.join('\n')
  return ''
}

function applyEditedText(block: ContentBlock, text: string): ContentBlock {
  if (block.type === 'paragraph') return { ...block, text }
  if (block.type === 'heading')   return { ...block, text }
  if (block.type === 'bullet_list' || block.type === 'numbered_list')
    return { ...block, items: text.split('\n').map(s => s.trim()).filter(Boolean) }
  return block
}

export default function BlockActionBar({
  block,
  blockIndex,
  onImprove,
  onManualEdit,
  onClose,
  isLoading,
}: Props) {
  const [mode, setMode] = useState<'actions' | 'edit' | 'custom'>('actions')
  const [editText, setEditText] = useState(getEditableText(block))
  const [customText, setCustomText] = useState('')

  const canEdit = block.type === 'paragraph' || block.type === 'heading'
    || block.type === 'bullet_list' || block.type === 'numbered_list'

  const handleSaveEdit = () => {
    onManualEdit(blockIndex, applyEditedText(block, editText))
    onClose()
  }

  const handleCustomImprove = async () => {
    if (!customText.trim()) return
    await onImprove(blockIndex, 'custom', customText)
    setCustomText('')
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#FDFAF4',
      borderTop: '2px solid #C8A96A',
      borderRadius: '16px 16px 0 0',
      padding: '16px 16px 28px',
      zIndex: 100,
      boxShadow: '0 -4px 24px rgba(59,42,31,0.12)',
    }}>
      {/* Drag handle */}
      <div style={{
        width: 36, height: 4, borderRadius: 2,
        background: '#E8E0D0', margin: '0 auto 14px',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 12, fontWeight: 700,
          color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {mode === 'edit' ? 'Edit Block' : mode === 'custom' ? 'Tell AI...' : 'Improve Block'}
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#A0978B', padding: 4 }}
        >
          ✕
        </button>
      </div>

      {/* ── Mode: actions ── */}
      {mode === 'actions' && (
        <>
          {/* AI action buttons */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {AI_ACTIONS.map(({ action, label, emoji }) => (
              <button
                key={action}
                disabled={isLoading}
                onClick={() => onImprove(blockIndex, action).then(onClose)}
                style={{
                  ...btnBase,
                  background: '#3B2A1F',
                  color: '#F5F1E8',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {isLoading ? '…' : `${emoji} ${label}`}
              </button>
            ))}
          </div>

          {/* Secondary row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMode('custom')}
              disabled={isLoading}
              style={{
                ...btnBase,
                flex: 2,
                background: '#F5F1E8',
                color: '#3B2A1F',
                border: '1.5px solid #C8A96A',
              }}
            >
              ✨ Tell AI what to change...
            </button>
            {canEdit && (
              <button
                onClick={() => { setEditText(getEditableText(block)); setMode('edit') }}
                style={{
                  ...btnBase,
                  flex: 1,
                  background: '#F5F1E8',
                  color: '#3B2A1F',
                  border: '1.5px solid #E8E0D0',
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </>
      )}

      {/* ── Mode: edit ── */}
      {mode === 'edit' && (
        <>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={5}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', borderRadius: 8,
              border: '1.5px solid #C8A96A',
              background: '#FFF8EC',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 14, color: '#3B2A1F',
              lineHeight: 1.6, resize: 'vertical', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => setMode('actions')} style={{ ...btnBase, flex: 1, background: '#F5F1E8', color: '#3B2A1F', border: '1.5px solid #E8E0D0' }}>Cancel</button>
            <button onClick={handleSaveEdit} style={{ ...btnBase, flex: 2, background: '#3B2A1F', color: '#F5F1E8' }}>Save</button>
          </div>
        </>
      )}

      {/* ── Mode: custom AI ── */}
      {mode === 'custom' && (
        <>
          <textarea
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="e.g. Add a sentence about safety compliance"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', borderRadius: 8,
              border: '1.5px solid #C8A96A',
              background: '#FFF8EC',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 14, color: '#3B2A1F',
              lineHeight: 1.6, resize: 'none', outline: 'none',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => setMode('actions')} style={{ ...btnBase, flex: 1, background: '#F5F1E8', color: '#3B2A1F', border: '1.5px solid #E8E0D0' }}>Cancel</button>
            <button
              onClick={handleCustomImprove}
              disabled={isLoading || !customText.trim()}
              style={{ ...btnBase, flex: 2, background: '#3B2A1F', color: '#F5F1E8', opacity: (!customText.trim() || isLoading) ? 0.5 : 1 }}
            >
              {isLoading ? 'Improving…' : '✨ Apply'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
