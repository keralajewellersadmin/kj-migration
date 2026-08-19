'use client'

import { useDocumentInfo } from '@payloadcms/ui'

const LABELS = ['City:', 'Preferred Time:', 'Product:', 'Product ID:']

function parseEnquiryMeta(message: string): { meta: Record<string, string>; body: string } {
  const lines = (message || '').split('\n')
  const meta: Record<string, string> = {}
  const bodyLines: string[] = []
  for (const line of lines) {
    const hit = LABELS.find((l) => line.trim().startsWith(l))
    if (hit) {
      meta[hit] = line.trim().slice(hit.length).trim()
    } else if (line.trim()) {
      bodyLines.push(line)
    }
  }
  return { meta, body: bodyLines.join('\n') }
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </div>
    <div style={{ fontSize: '14px', color: '#0f172a', marginTop: '2px' }}>
      {value || <span style={{ color: '#9ca3af' }}>—</span>}
    </div>
  </div>
)

const InquiryDetail = () => {
  const { savedDocumentData } = useDocumentInfo()
  const data = (savedDocumentData || {}) as Record<string, unknown>
  const source = data.source as string | undefined
  const isEnquiry = source === 'enquiry'
  const message = (data.message as string) || ''
  const { meta, body } = isEnquiry ? parseEnquiryMeta(message) : { meta: {}, body: message }

  return (
    <div
      style={{
        padding: '16px 20px',
        margin: '0 0 20px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '12px',
        }}
      >
        Captured from: {isEnquiry ? 'Enquiry Form' : 'Contact Form'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
        <Field label="Name" value={data.name as string} />
        <Field label="Email" value={data.email as string} />
        <Field label="Phone" value={data.phone as string} />
        {isEnquiry && <Field label="City" value={meta['City:']} />}
        {isEnquiry && <Field label="Preferred Time" value={meta['Preferred Time:']} />}
        {isEnquiry && <Field label="Product" value={meta['Product:']} />}
        {isEnquiry && <Field label="Product ID" value={meta['Product ID:']} />}
      </div>

      <div style={{ marginTop: '8px' }}>
        <Field label="Message" value={body} />
      </div>
    </div>
  )
}

export default InquiryDetail
