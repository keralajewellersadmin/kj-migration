'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

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
      justifyContent: 'flex-end',
      gap: '16px',
      flexWrap: 'wrap',
      padding: '16px 24px',
      margin: '0 0 20px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
    }}>
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
