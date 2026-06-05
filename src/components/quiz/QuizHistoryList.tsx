'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import type { CompletedQuiz } from '@/lib/quiz'
import { getQuizStore, clearQuizHistory, computeScore } from '@/lib/quiz'

export function QuizHistoryList() {
  const t = useTranslations('quiz')
  const locale = useLocale()
  const [history, setHistory] = useState<CompletedQuiz[]>([])

  useEffect(() => {
    setHistory(getQuizStore().history)
  }, [])

  const handleClear = () => {
    if (!confirm(t('clearHistoryConfirm'))) return
    clearQuizHistory()
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-dark-muted">
        <p className="mb-4">{t('noHistory')}</p>
        <Link href={`/${locale}/questions`} className="text-blue-400 hover:underline text-sm">
          {t('newTest')}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {history.map(quiz => {
          const { known, partial, unknown, score } = computeScore(quiz)
          const date = new Date(quiz.completedAt).toLocaleString(locale === 'pt' ? 'pt-BR' : 'en-US', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })
          return (
            <Link
              key={quiz.id}
              href={`/${locale}/quiz/${quiz.id}`}
              className="block bg-dark-surface border border-dark-border hover:border-blue-500/30 rounded-lg px-4 py-3 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-dark-text font-mono">
                  {quiz.config.categories.join(' · ')}
                </span>
                <span className="text-xs text-dark-muted">{date}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-green-400">✅ {known}</span>
                <span className="text-yellow-400">🤔 {partial}</span>
                <span className="text-red-400">❌ {unknown}</span>
                <span className="ml-auto text-dark-muted font-mono">{score}%</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={handleClear}
          className="text-sm text-dark-muted hover:text-red-400 transition-colors"
        >
          {t('clearHistory')}
        </button>
      </div>
    </div>
  )
}
