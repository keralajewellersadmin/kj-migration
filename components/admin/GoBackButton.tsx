'use client'

import Link from 'next/link'
import { useConfig } from '@payloadcms/ui'

const GoBackButton = () => {
  const { config: { routes: { admin: adminRoute } } } = useConfig()

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
      <Link 
        href={`${adminRoute}/collections/inquiries`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          color: '#374151',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6' }}
      >
        <span style={{ marginRight: '0.5rem' }}>&larr;</span> Go Back to Inquiries
      </Link>
    </div>
  )
}

export default GoBackButton
