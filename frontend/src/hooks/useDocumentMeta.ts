import { useEffect } from 'react'

type MetaOptions = {
  title: string
  description?: string
}

// Sets document.title and the meta description tag per page. This is a
// client-only, hand-rolled substitute for react-helmet — no new dependency,
// works today on Vite. It does NOT give crawlers server-rendered meta tags
// (that needs SSR/Next.js later), but it's correct for the browser tab
// title, social-share preview refresh on client navigation, and is a
// drop-in no-op to keep once a real <head> is rendered server-side.
export function useDocumentMeta({ title, description }: MetaOptions) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    let descTag: HTMLMetaElement | null = null
    let prevDescription: string | null = null
    if (description) {
      descTag = document.querySelector('meta[name="description"]')
      if (!descTag) {
        descTag = document.createElement('meta')
        descTag.setAttribute('name', 'description')
        document.head.appendChild(descTag)
      }
      prevDescription = descTag.getAttribute('content')
      descTag.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (descTag && prevDescription !== null) descTag.setAttribute('content', prevDescription)
    }
  }, [title, description])
}
