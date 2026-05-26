'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ProgressBadge } from './ProgressBadge'
import type { Category } from '@/lib/categories'

type Props = {
  category: Category
  label: string
  count: number
}

export function CategoryCard({ category, label, count }: Props) {
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/questions/${category.slug}`}
      className={`block bg-gray-50 dark:bg-dark-surface border ${category.borderColor} rounded-lg p-6 hover:opacity-80 transition-opacity group`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{category.icon}</span>
        <ProgressBadge category={category.slug} total={count} />
      </div>
      <div className={`font-mono font-bold text-lg ${category.color} mb-1`}>
        {label}
      </div>
      <div className="text-sm text-gray-400 dark:text-dark-muted">{count} questions</div>
    </Link>
  )
}
