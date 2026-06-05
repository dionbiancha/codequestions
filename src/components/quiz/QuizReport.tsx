'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { CompletedQuiz } from '@/lib/quiz'
import { computeScore, computeCategoryBreakdown } from '@/lib/quiz'

type Props = {
  quiz: CompletedQuiz
  locale: string
}

export function QuizReport({ quiz, locale }: Props) {
  const t = useTranslations('quiz')
  const { known, partial, unknown, total, score } = computeScore(quiz)
  const breakdown = computeCategoryBreakdown(quiz)
  const minutes = Math.floor(quiz.durationSeconds / 60)
  const seconds = quiz.durationSeconds % 60

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-mono text-2xl font-bold text-dark-heading mb-6">
        🎯 {t('result')}
      </h1>

      {/* Score cards */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{known}</div>
          <div className="text-xs text-dark-muted mt-1">{t('known')}</div>
        </div>
        <div className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{partial}</div>
          <div className="text-xs text-dark-muted mt-1">{t('partial')}</div>
        </div>
        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{unknown}</div>
          <div className="text-xs text-dark-muted mt-1">{t('unknown')}</div>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-dark-muted mb-8">
        <span>
          {t('score')}: <strong className="text-dark-heading">{score}%</strong>
        </span>
        <span>
          {t('duration')}: <strong className="text-dark-heading">
            {minutes}:{String(seconds).padStart(2, '0')}
          </strong>
        </span>
        <span className="text-dark-border">|</span>
        <span>{total} perguntas</span>
      </div>

      {/* Category breakdown */}
      {breakdown.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-4">
            {t('byCategory')}
          </h2>
          <div className="flex flex-col gap-3">
            {breakdown.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dark-text font-mono">{cat.category}</span>
                  <span className="text-dark-muted">{cat.score}%</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question list */}
      <div className="mb-8">
        <h2 className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-4">
          Perguntas
        </h2>
        <div className="flex flex-col gap-2">
          {quiz.questions.map((q, i) => {
            const answer = quiz.answers[i]
            const icon = answer === 'known' ? '✅' : answer === 'partial' ? '🤔' : '❌'
            return (
              <div
                key={q.slug}
                className="flex items-center justify-between bg-dark-surface border border-dark-border rounded-lg px-4 py-3"
              >
                <span className="text-sm text-dark-text mr-4">{q.title}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span>{icon}</span>
                  <Link
                    href={`/${locale}/questions/${q.category}/${q.slug}`}
                    className="text-xs text-blue-400 hover:underline"
                    target="_blank"
                  >
                    ver →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/${locale}/questions`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {t('newTest')}
        </Link>
        <Link
          href={`/${locale}/quiz/history`}
          className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-5 py-2 rounded-lg transition-colors"
        >
          {t('viewHistory')}
        </Link>
      </div>
    </div>
  )
}
