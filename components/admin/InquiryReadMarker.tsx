'use client'

import { useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { markInquiryRead } from '@/lib/actions/markInquiryRead'

const InquiryReadMarker = () => {
  const { id, savedDocumentData } = useDocumentInfo()

  useEffect(() => {
    if (!id) return
    if (savedDocumentData?.read) return

    markInquiryRead(String(id)).then((res) => {
      if (res.success) {
        window.dispatchEvent(new CustomEvent('kj:inquiry-read'))
      }
    }).catch(() => {
      /* best-effort; ignore failures */
    })
  }, [id, savedDocumentData?.read])

  return null
}

export default InquiryReadMarker
