'use client'

import { useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

const InquiryReadMarker = () => {
  const { id, savedDocumentData } = useDocumentInfo()

  useEffect(() => {
    if (!id) return
    if (savedDocumentData?.read) return
    const match = document.cookie
      .split('; ')
      .find((c) => c.startsWith('payload-token='))
    const token = match?.split('=')[1]
    if (!token) return

    fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ read: true }),
    }).catch(() => {
      /* best-effort; ignore failures */
    })
  }, [id, savedDocumentData?.read])

  return null
}

export default InquiryReadMarker
