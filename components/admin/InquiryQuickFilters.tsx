'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const SOURCES = [
  { label: 'All Sources', value: '' },
  { label: 'Product Enquiry', value: 'enquiry', color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  { label: 'Contact Form', value: 'contact', color: '#9f1b1f', bg: '#fdf2f2', border: '#fecaca' },
]

const STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
  { label: 'Spam', value: 'spam' },
]

const InquiryQuickFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentType = searchParams.get('where[type][equals]') || ''
  const currentStatus = searchParams.get('where[status][equals]') || ''

  const handleFilter = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set(key, val)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      padding: '16px 24px',
      margin: '0 0 20px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
    }}>
      {/* Source Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginRight: '4px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          Filter By:
        </span>
        {SOURCES.map((s) => {
          const active = currentType === s.value
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleFilter('where[type][equals]', s.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: active ? 600 : 500,
                color: active && s.color ? s.color : active ? '#9f1b1f' : '#475569',
                backgroundColor: active && s.bg ? s.bg : active ? '#fdf2f2' : '#f8fafc',
                border: active && s.border ? `1px solid ${s.border}` : '1px solid #e2e8f0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {s.value && (
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: s.color || '#9f1b1f',
                }} />
              )}
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Status Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}>
          Status:
        </span>
        <select
          value={currentStatus}
          onChange={(e) => handleFilter('where[status][equals]', e.target.value)}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#0f172a',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {STATUSES.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default InquiryQuickFilters;
