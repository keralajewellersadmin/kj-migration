'use client'

import type { DefaultCellComponentProps } from 'payload'

const InquirySourcePill = ({ cellData }: DefaultCellComponentProps) => {
  const isEnquiry = cellData === 'enquiry'
  const label = isEnquiry ? 'Enquiry Form' : 'Contact Form'
  const bg = isEnquiry ? '#fef3c7' : '#fdf2f2'
  const text = isEnquiry ? '#92400e' : '#9f1b1f'
  const border = isEnquiry ? '#fde68a' : '#fecaca'

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

export default InquirySourcePill
