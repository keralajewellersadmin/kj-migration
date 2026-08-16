'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const FOLDERS = [
  { label: 'All Media', value: '' },
  { label: 'Products', value: 'product' },
  { label: 'Categories', value: 'category' },
  { label: 'Banners', value: 'banner' },
  { label: 'Hero Images', value: 'hero' },
  { label: 'Blog', value: 'blog' },
  { label: 'Heritage', value: 'heritage' },
  { label: 'Other', value: 'misc' },
]

const MediaFolderFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentFolder = searchParams.get('where[mediaType][equals]') || ''

  const handleSelectFolder = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set('where[mediaType][equals]', val)
    } else {
      params.delete('where[mediaType][equals]')
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      padding: '12px 0 16px',
      marginBottom: '8px',
      borderBottom: '1px solid #eef2f6',
    }}>
      {FOLDERS.map((f) => {
        const active = currentFolder === f.value
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => handleSelectFolder(f.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: active ? 600 : 500,
              color: active ? '#9f1b1f' : '#64748b',
              backgroundColor: active ? '#fdf2f2' : '#ffffff',
              border: active ? '1px solid #fecaca' : '1px solid #e2e8f0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}

export default MediaFolderFilters;
