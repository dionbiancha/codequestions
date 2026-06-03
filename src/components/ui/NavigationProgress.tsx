'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const [pending, setPending] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const pathname = usePathname()
  const pendingRef = useRef(false)
  const skeletonTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!pendingRef.current) return
    pendingRef.current = false
    if (skeletonTimer.current) clearTimeout(skeletonTimer.current)
    if (safetyTimer.current) clearTimeout(safetyTimer.current)
    setPending(false)
    setShowSkeleton(false)
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

      if (skeletonTimer.current) clearTimeout(skeletonTimer.current)
      if (safetyTimer.current) clearTimeout(safetyTimer.current)

      pendingRef.current = true
      setPending(true)
      setShowSkeleton(false)

      skeletonTimer.current = setTimeout(() => setShowSkeleton(true), 5000)
      safetyTimer.current = setTimeout(() => {
        pendingRef.current = false
        setPending(false)
        setShowSkeleton(false)
      }, 30000)
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      if (skeletonTimer.current) clearTimeout(skeletonTimer.current)
      if (safetyTimer.current) clearTimeout(safetyTimer.current)
    }
  }, [])

  if (!pending) return null

  return (
    <>
      <div aria-hidden className="fixed top-0 inset-x-0 z-[200] h-[2px]">
        <div className="nav-progress-bar h-full bg-blue-400" />
      </div>

      {showSkeleton && (
        <div className="fixed inset-0 z-[199] bg-dark-bg">
          <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
            <div className="h-8 bg-dark-border rounded w-52 mb-4" />
            <div className="h-4 bg-dark-border rounded w-72 mb-12" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-dark-surface border border-dark-border rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
