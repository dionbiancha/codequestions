'use client'

import { useEffect, useState } from 'react'
import { CategoryCard } from './CategoryCard'
import { countProgress } from '@/lib/progress'
import type { Category } from '@/lib/categories'

type Props = {
  categories: Array<{
    cat: Category
    label: string
    count: number
  }>
}

export function CategoriesGrid({ categories }: Props) {
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const progressData: Record<string, number> = {}
    for (const { cat } of categories) {
      const { known } = countProgress(cat.slug)
      progressData[cat.slug] = known
    }
    setProgress(progressData)
    setIsHydrated(true)
  }, [categories])

  if (!isHydrated) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map(({ cat, label, count }) => (
          <CategoryCard
            key={cat.slug}
            category={cat}
            label={label}
            count={count}
            known={0}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {categories.map(({ cat, label, count }) => (
        <CategoryCard
          key={cat.slug}
          category={cat}
          label={label}
          count={count}
          known={progress[cat.slug] ?? 0}
        />
      ))}
    </div>
  )
}
