'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import type { QuestionMeta } from '@/lib/content'
import type { QuizAnswer } from '@/lib/quiz'

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

type Props = {
  question: QuestionMeta
  questionNumber: number
  totalQuestions: number
  answers: (QuizAnswer | null)[]
  secondsRemaining: number | null
  onAnswer: (answer: QuizAnswer) => void
  onClose: () => void
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  answers,
  secondsRemaining,
  onAnswer,
  onClose,
}: Props) {
  const t = useTranslations('quiz')
  const tQuestion = useTranslations('question')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => { setRevealed(false) }, [question.slug])

  return createPortal(
    <div className="fixed inset-0 z-50 bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-dark-bg border border-dark-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border flex-shrink-0">
          <span className="text-sm text-dark-muted font-mono">
            {t('questionLabel')} {questionNumber} / {totalQuestions}
          </span>
          <div className="flex items-center gap-4">
            {secondsRemaining !== null && (
              <span className={`font-mono text-sm font-bold ${secondsRemaining <= 60 ? 'text-red-400' : 'text-orange-400'}`}>
                ⏱ {formatTime(secondsRemaining)}
              </span>
            )}
            <button
              onClick={onClose}
              className="text-dark-muted hover:text-red-400 text-sm transition-colors"
            >
              × {t('endTest')}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 px-6 py-3 border-b border-dark-border flex-shrink-0">
          {answers.map((a, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                a === 'known' ? 'bg-green-500' :
                a === 'partial' ? 'bg-yellow-500' :
                a === 'unknown' ? 'bg-red-500' :
                i === questionNumber - 1 ? 'bg-blue-500' :
                'bg-dark-border'
              }`}
            />
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
              {tQuestion(`difficulty.${question.difficulty}`)}
            </Badge>
            <Badge variant="gray">{question.category}</Badge>
            {question.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
          </div>

          {/* Question title */}
          <h2 className="text-xl font-semibold text-dark-heading leading-snug mb-8">
            {question.title}
          </h2>

          {/* Quick answer (shown after reveal) */}
          {revealed && (
            <div className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3">
              <p className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-2">
                Quick answer
              </p>
              <p className="text-sm text-dark-text leading-relaxed">
                {question.quickAnswer || '—'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-dark-border flex-shrink-0">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {t('revealAnswer')}
            </button>
          ) : (
            <>
              <button
                onClick={() => onAnswer('known')}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white font-medium text-sm py-3 rounded-lg transition-colors"
              >
                {t('known')}
              </button>
              <button
                onClick={() => onAnswer('partial')}
                className="flex-1 bg-yellow-700 hover:bg-yellow-600 text-white font-medium text-sm py-3 rounded-lg transition-colors"
              >
                {t('partial')}
              </button>
              <button
                onClick={() => onAnswer('unknown')}
                className="flex-1 bg-red-800 hover:bg-red-700 text-white font-medium text-sm py-3 rounded-lg transition-colors"
              >
                {t('unknown')}
              </button>
            </>
          )}
        </div>

      </div>
    </div>,
    document.body
  )
}
