'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { getQuestionStatus } from '@/lib/progress'
import { Badge } from '@/components/ui/Badge'
import type { QuestionMeta } from '@/lib/content'

type Props = {
  question: QuestionMeta
}

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

export function QuestionCard({ question }: Props) {
  const locale = useLocale()
  const t = useTranslations('question')
  const [status, setStatus] = useState<'known' | 'review' | null>(null)

  useEffect(() => {
    setStatus(getQuestionStatus(question.path))
  }, [question.path])

  return (
    <Link
      href={`/${locale}/questions/${question.category}/${question.slug}`}
      className="block bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:border-blue-500/40 transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 dark:text-dark-heading font-medium group-hover:text-blue-400 transition-colors truncate">
            {question.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
              {t(`difficulty.${question.difficulty}`)}
            </Badge>
            {question.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 text-lg">
          {status === 'known' && <span title="Got it">✅</span>}
          {status === 'review' && <span title="Needs review">🔄</span>}
        </div>
      </div>
    </Link>
  )
}
