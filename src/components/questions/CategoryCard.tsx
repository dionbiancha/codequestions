'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { Category } from '@/lib/categories'

type Props = {
  category: Category
  label: string
  count: number
  known: number
}

export function CategoryCard({ category, label, count, known }: Props) {
  const locale = useLocale()
  const pct = count > 0 ? Math.round((known / count) * 100) : 0

  return (
    <Link
      href={`/${locale}/questions/${category.slug}`}
      className="block bg-dark-surface border border-dark-border rounded-lg p-4 hover:bg-[#1c2128] transition-colors"
      style={{ borderLeftColor: category.accentColor, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{category.icon}</span>
          <span className="font-mono font-bold text-sm text-dark-heading">{label}</span>
        </div>
        <span className="text-xs text-dark-muted font-mono">{count} perguntas</span>
      </div>
      <div className="h-[3px] bg-dark-border rounded-full mb-1">
        <div
          data-testid="progress-fill"
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: category.accentColor }}
        />
      </div>
      {known > 0 ? (
        <p className="text-[10px] font-mono" style={{ color: category.accentColor }}>
          {known}/{count} concluídas
        </p>
      ) : (
        <p className="text-[10px] font-mono text-dark-muted">não iniciado</p>
      )}
    </Link>
  )
}
