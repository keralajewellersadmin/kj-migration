'use client'

import Link from 'next/link'
import { useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

const GoBackButton = () => {
  const { config: { routes: { admin: adminRoute } } } = useConfig()
  const pathname = usePathname()
  
  if (!pathname) return null;

  const parts = pathname.split('/')
  const collectionsIndex = parts.indexOf('collections')
  
  if (collectionsIndex === -1 || collectionsIndex + 1 >= parts.length) {
    return null; // Not inside a collection view
  }
  
  const collectionSlug = parts[collectionsIndex + 1]
  const backUrl = `${adminRoute}/collections/${collectionSlug}`
  
  // Format the collection slug to a nice readable name
  const title = collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1).replace(/-/g, ' ')

  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
      <Link 
        href={backUrl}
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
        <span style={{ marginRight: '0.5rem' }}>&larr;</span> Go Back to {title}
      </Link>
    </div>
  )
}

export default GoBackButton
