'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryCard } from './CategoryCard'
import { countProgress } from '@/lib/progress'
import type { Category } from '@/lib/categories'

type CategoryItem = {
  cat: Category
  label: string
  count: number
}

type StatusFilter = 'all' | 'in-progress' | 'not-started'

type Props = {
  categories: CategoryItem[]
}

export function CategoryListClient({ categories }: Props) {
  const t = useTranslations('categories')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const map: Record<string, number> = {}
    for (const { cat } of categories) {
      const { known } = countProgress(cat.slug)
      map[cat.slug] = known
    }
    setProgressMap(map)
    setIsHydrated(true)
  }, [categories])

  const chips: { value: StatusFilter; label: string }[] = [
    { value: 'all',          label: t('filterAll') },
    { value: 'in-progress',  label: t('filterInProgress') },
    { value: 'not-started',  label: t('filterNotStarted') },
  ]

  const filtered = useMemo(() =>
    categories.filter(({ cat, label }) => {
      const q = query.toLowerCase()
      const matchesQuery = label.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)
      const known = progressMap[cat.slug] ?? 0
      if (statusFilter === 'in-progress') return matchesQuery && known > 0
      if (statusFilter === 'not-started') return matchesQuery && known === 0
      return matchesQuery
    }),
    [categories, query, statusFilter, progressMap]
  )

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 bg-dark-surface border border-dark-border rounded-md px-3 py-2">
          <span className="text-dark-muted text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('filterPlaceholder')}
            aria-label={t('filterPlaceholder')}
            className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-muted outline-none font-mono"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {chips.map(chip => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(chip.value)}
              aria-pressed={statusFilter === chip.value}
              className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
                statusFilter === chip.value
                  ? 'bg-blue-500/15 border-blue-500/50 text-blue-400'
                  : 'bg-dark-surface border-dark-border text-dark-muted hover:text-dark-heading'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-dark-muted font-mono">{t('noCategoriesFound')}</p>
        ) : (
          filtered.map(({ cat, label, count }) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              label={label}
              count={count}
              known={isHydrated ? (progressMap[cat.slug] ?? 0) : 0}
            />
          ))
        )}
      </div>
    </div>
  )
}
