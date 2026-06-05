'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { getQuestionStatus } from '@/lib/progress'
import { Badge } from '@/components/ui/Badge'
import type { QuestionMeta } from '@/lib/content'

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

type Props = {
  question: QuestionMeta
  onNext: () => void
  onPrev: () => void
  hasPrev: boolean
  onClose: () => void
}

export function FocusMode({ question, onNext, onPrev, hasPrev, onClose }: Props) {
  const locale = useLocale()
  const t = useTranslations('categories')
  const tQuestion = useTranslations('question')
  const [status, setStatus] = useState<'known' | 'review' | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setStatus(getQuestionStatus(question.path))
    setRevealed(false)
  }, [question.path])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="bg-dark-bg border border-dark-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-blue-500/5 rounded-t-xl flex-shrink-0">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
            🎲 {t('randomTitle')}
          </span>
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-dark-heading transition-colors text-2xl leading-none"
            aria-label={t('focusModeClose')}
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
              {tQuestion(`difficulty.${question.difficulty}`)}
            </Badge>
            {question.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
            {status === 'known' && <span title="Got it" className="text-base">✅</span>}
            {status === 'review' && <span title="Needs review" className="text-base">🔄</span>}
          </div>

          <h2 className="font-semibold text-dark-heading text-xl leading-snug mb-8">
            {question.title}
          </h2>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {t('showAnswer')}
            </button>
          ) : (
            <div>
              <div className="bg-dark-surface border border-dark-border rounded-lg px-4 py-3 mb-4">
                <p className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-2">
                  {t('quickAnswerLabel')}
                </p>
                <p className="text-sm text-dark-text leading-relaxed">
                  {question.quickAnswer || '—'}
                </p>
              </div>
              <a
                href={`/${locale}/questions/${question.category}/${question.slug}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {t('openQuestion')} →
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-dark-border rounded-b-xl flex-shrink-0">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            ← {t('focusModePrev')}
          </button>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t('focusModeNext')} →
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
