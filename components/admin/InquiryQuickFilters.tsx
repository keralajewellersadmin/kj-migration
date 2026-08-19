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
    <div className="inquiry-quick-filters">
      <div className="inquiry-quick-filters__field">
        <span className="inquiry-quick-filters__label">Status:</span>
        <select
          className="inquiry-quick-filters__select"
          value={currentStatus}
          onChange={(e) => handleFilter('where[status][equals]', e.target.value)}
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

export default InquiryQuickFilters
