'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const [pending, setPending] = useState(false)
  const pathname = usePathname()
  const pendingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pendingRef.current) {
      pendingRef.current = false
      setPending(false)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return
      if (anchor.target === '_blank') return

      try {
        const dest = new URL(href, location.href)
        if (dest.pathname === location.pathname) return
      } catch {
        return
      }

      pendingRef.current = true
      setPending(true)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        pendingRef.current = false
        setPending(false)
      }, 5000)
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!pending) return null

  return (
    <div aria-hidden className="fixed top-0 inset-x-0 z-[200] h-[2px]">
      <div className="nav-progress-bar h-full bg-blue-400" />
    </div>
  )
}
