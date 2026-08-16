'use client'

import type { DefaultCellComponentProps } from 'payload'

const InquirySourceCell = ({ cellData, rowData }: DefaultCellComponentProps) => {
  const source = String(cellData || rowData?.type || '')
  
  const isProduct = source.toLowerCase().includes('enquiry') || source.startsWith('/products/') || source === 'product'
  const isContact = source.toLowerCase().includes('contact') || source === '/contact'

  const label = isProduct ? 'Product Enquiry' : isContact ? 'Contact Form' : (cellData ? String(cellData) : 'General')
  const bg = isProduct ? '#fef3c7' : isContact ? '#fdf2f2' : '#f1f5f9'
  const text = isProduct ? '#92400e' : isContact ? '#9f1b1f' : '#475569'
  const border = isProduct ? '#fde68a' : isContact ? '#fecaca' : '#e2e8f0'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '11.5px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export default InquirySourceCell
