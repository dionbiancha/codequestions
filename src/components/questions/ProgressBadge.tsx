'use client'

import { useEffect, useState } from 'react'
import { countProgress } from '@/lib/progress'

type Props = {
  category: string
  total: number
}

export function ProgressBadge({ category, total }: Props) {
  const [known, setKnown] = useState(0)

  useEffect(() => {
    const { known: k } = countProgress(category)
    setKnown(k)
  }, [category])

  if (known === 0) return null

  return (
    <span className="text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
      {known}/{total}
    </span>
  )
}
