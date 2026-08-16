'use client'

import type { DefaultCellComponentProps } from 'payload'

const InquiryProductCell = ({ cellData, rowData }: DefaultCellComponentProps) => {
  if (!cellData) return <span style={{ color: '#9ca3af' }}>—</span>

  // cellData could be an ID or a populated object
  const productTitle = typeof cellData === 'object' && cellData !== null && 'title' in cellData
    ? String((cellData as Record<string, unknown>).title)
    : String(cellData)

  return (
    <span style={{ fontSize: '13px', color: '#374151' }}>
      {productTitle}
    </span>
  )
}

export default InquiryProductCell
