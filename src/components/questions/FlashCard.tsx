'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { setProgress } from '@/lib/progress'
import { Button } from '@/components/ui/Button'

type Props = {
  questionPath: string
  front: string
  back: string
}

export function FlashCard({ questionPath, front, back }: Props) {
  const t = useTranslations('question')
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState<'known' | 'review' | null>(null)

  const handleGotIt = () => {
    setProgress(questionPath, 'known')
    setAnswered('known')
  }

  const handleNeedReview = () => {
    setProgress(questionPath, 'review')
    setAnswered('review')
  }

  const reset = () => {
    setFlipped(false)
    setAnswered(null)
  }

  return (
    <div className="select-none">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-3">
        {t('flashcard')}
      </p>

      <div
        className="relative cursor-pointer"
        style={{ perspective: '1000px', minHeight: '140px' }}
        onClick={() => !answered && setFlipped(f => !f)}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            minHeight: '140px',
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 bg-gray-50 dark:bg-dark-surface border border-blue-500/30 rounded-lg p-4 flex flex-col justify-between"
          >
            <p className="text-gray-900 dark:text-dark-heading text-sm font-medium">{front}</p>
            <p className="text-xs text-gray-400 dark:text-dark-muted mt-3">{t('clickToFlip')}</p>
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 bg-gray-50 dark:bg-dark-surface border border-green-500/30 rounded-lg p-4 flex flex-col justify-between"
          >
            <p className="text-gray-700 dark:text-dark-text text-sm">{back}</p>

            {flipped && !answered && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={e => { e.stopPropagation(); handleNeedReview() }}
                  className="flex-1 border-orange-500/30 text-orange-400 hover:border-orange-500/60"
                >
                  ↺ {t('needReview')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={e => { e.stopPropagation(); handleGotIt() }}
                  className="flex-1 border-green-500/30 text-green-400 hover:border-green-500/60"
                >
                  ✓ {t('gotIt')}
                </Button>
              </div>
            )}

            {answered && (
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-mono ${answered === 'known' ? 'text-green-400' : 'text-orange-400'}`}>
                  {answered === 'known' ? `✓ ${t('gotIt')}` : `↺ ${t('needReview')}`}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); reset() }}
                  className="text-xs text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading"
                >
                  reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
