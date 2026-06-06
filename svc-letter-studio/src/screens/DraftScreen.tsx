import { useState } from 'react'
import type { Screen } from '../App'
import type { SessionState } from '../store/sessionStore'
import type { ContentBlock } from '../types/document'
import type { ImproveAction } from '../ai/tasks/improveBlock'
import { improveBlock } from '../ai/adapter'
import EnvelopeFields from '../components/draft/EnvelopeFields'
import BlockList from '../components/draft/BlockList'
import BlockActionBar from '../components/draft/BlockActionBar'

interface Props {
  navigate: (s: Screen) => void
  state: SessionState
  updateBlock: (index: number, updated: ContentBlock) => void
  updateEnvelope: (partial: Partial<import('../types/document').DocumentEnvelope>) => void
}

export default function DraftScreen({ navigate, state, updateBlock, updateEnvelope }: Props) {
  const { draft } = state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isImproving, setIsImproving] = useState(false)
  const [improveError, setImproveError] = useState<string | null>(null)

  if (!draft) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-ivory)',
        fontFamily: 'Montserrat, sans-serif',
        gap: 16, padding: 32,
      }}>
        <p style={{ color: '#A0978B', textAlign: 'center' }}>No draft yet. Generate one first.</p>
        <button
          onClick={() => navigate('intake')}
          style={{
            padding: '12px 28px', borderRadius: 10,
            background: '#3B2A1F', color: '#F5F1E8',
            border: 'none', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700,
          }}
        >
          ← Back to Intake
        </button>
      </div>
    )
  }

  const handleImprove = async (
    index: number,
    action: ImproveAction,
    customInstruction?: string
  ) => {
    const block = draft.blocks[index]
    setIsImproving(true)
    setImproveError(null)
    try {
      const improved = await improveBlock({ block, action, customInstruction })
      updateBlock(index, improved)
    } catch (err) {
      setImproveError('AI improve failed. Please try again.')
      console.error('[DraftScreen] improveBlock error:', err)
    } finally {
      setIsImproving(false)
    }
  }

  const handleManualEdit = (index: number, updated: ContentBlock) => {
    updateBlock(index, updated)
  }

  const selectedBlock = selectedIndex !== null ? draft.blocks[selectedIndex] : null

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--color-ivory)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: selectedBlock ? 260 : 80,
    }}>
      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#3B2A1F',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={() => navigate('intake')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#C8A96A', fontFamily: 'Montserrat, sans-serif',
            fontSize: 13, fontWeight: 700, padding: 0,
          }}
        >
          ← Back
        </button>

        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 14, fontWeight: 700, color: '#F5F1E8',
        }}>
          Edit Draft
        </span>

        {/* Preview toggle */}
        <button
          onClick={() => navigate('preview')}
          style={{
            background: '#C8A96A',
            border: 'none', borderRadius: 8,
            padding: '7px 14px',
            cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 13, fontWeight: 700, color: '#3B2A1F',
          }}
        >
          👁 Preview
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>

        {/* Error banner */}
        {improveError && (
          <div style={{
            background: '#FFF0F0', border: '1.5px solid #F5A0A0',
            borderRadius: 10, padding: '10px 14px', marginBottom: 14,
            fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#C0392B',
          }}>
            {improveError}
            <button
              onClick={() => setImproveError(null)}
              style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', fontWeight: 700 }}
            >✕</button>
          </div>
        )}

        {/* Envelope fields */}
        <EnvelopeFields envelope={draft.envelope} onUpdate={updateEnvelope} />

        {/* Body blocks */}
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 11, fontWeight: 700,
          color: '#C8A96A', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 8,
        }}>
          Body ({draft.blocks.length} blocks)
        </div>

        {isImproving && (
          <div style={{
            textAlign: 'center', padding: '12px 0', marginBottom: 8,
            fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#C8A96A',
          }}>
            ✨ AI is improving the block…
          </div>
        )}

        <BlockList
          blocks={draft.blocks}
          selectedIndex={selectedIndex}
          onSelect={idx => setSelectedIndex(idx === selectedIndex ? null : idx)}
        />
      </div>

      {/* ── Block action bar (slides in when a block is selected) ── */}
      {selectedBlock !== null && selectedIndex !== null && (
        <BlockActionBar
          block={selectedBlock}
          blockIndex={selectedIndex}
          onImprove={handleImprove}
          onManualEdit={handleManualEdit}
          onClose={() => setSelectedIndex(null)}
          isLoading={isImproving}
        />
      )}
    </div>
  )
}
