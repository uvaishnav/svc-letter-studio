import { useState } from 'react'
import type { DocumentEnvelope, Recipient } from '../../types/document'

interface Props {
  envelope: DocumentEnvelope
  onUpdate: (partial: Partial<DocumentEnvelope>) => void
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1.5px solid #E8E0D0',
  background: '#FDFAF4',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 14,
  color: '#3B2A1F',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 11,
  fontWeight: 600,
  color: '#C8A96A',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
  display: 'block',
}

function Field({
  label, value, onChange, multiline = false, placeholder = ''
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={fieldStyle}
        />
      )}
    </div>
  )
}

export default function EnvelopeFields({ envelope, onUpdate }: Props) {
  const [open, setOpen] = useState(true)
  const r = envelope.recipient ?? {}

  const updateRecipient = (partial: Partial<Recipient>) => {
    onUpdate({ recipient: { ...r, ...partial } })
  }

  return (
    <div style={{
      background: '#FDFAF4',
      borderRadius: 12,
      border: '1px solid #E8E0D0',
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          color: '#3B2A1F',
        }}
      >
        <span>📋 Document Details</span>
        <span style={{ fontSize: 10, color: '#C8A96A' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '4px 16px 16px' }}>
          <Field
            label="Date"
            value={envelope.date ?? ''}
            onChange={v => onUpdate({ date: v })}
            placeholder="06 June 2026"
          />
          <Field
            label="Ref No."
            value={envelope.refNumber ?? ''}
            onChange={v => onUpdate({ refNumber: v || undefined })}
            placeholder="SVC/2026/001"
          />
          <Field
            label="Subject"
            value={envelope.subject ?? ''}
            onChange={v => onUpdate({ subject: v })}
            multiline
            placeholder="Enter subject..."
          />

          {/* Recipient sub-section */}
          <div style={{
            borderTop: '1px solid #E8E0D0',
            marginTop: 8,
            paddingTop: 12,
          }}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Recipient</div>
            <Field
              label="Name"
              value={r.name ?? ''}
              onChange={v => updateRecipient({ name: v || undefined })}
              placeholder="Recipient name"
            />
            <Field
              label="Designation"
              value={r.designation ?? ''}
              onChange={v => updateRecipient({ designation: v || undefined })}
              placeholder="Engineer / Manager..."
            />
            <Field
              label="Company"
              value={r.company ?? ''}
              onChange={v => updateRecipient({ company: v || undefined })}
              placeholder="Company name"
            />
            <Field
              label="Address"
              value={r.address ?? ''}
              onChange={v => updateRecipient({ address: v || undefined })}
              multiline
              placeholder="Full address"
            />
          </div>
        </div>
      )}
    </div>
  )
}
