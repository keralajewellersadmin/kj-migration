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
    <Link
      href={backUrl}
      className="btn btn--style-secondary"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginRight: 'auto',
        whiteSpace: 'nowrap',
        fontSize: '13px',
        fontWeight: 500,
        padding: '8px 14px',
        textDecoration: 'none',
      }}
    >
      <span>&larr;</span> Go Back to {title}
    </Link>
  )
}

export default GoBackButton
