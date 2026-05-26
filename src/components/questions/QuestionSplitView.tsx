'use client'

import { useTranslations } from 'next-intl'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { FlashCard } from './FlashCard'

type Props = {
  questionPath: string
  fullAnswer: string
  quickAnswer: string
  flashcardFront: string
  flashcardBack: string
}

export function QuestionSplitView({
  questionPath,
  fullAnswer,
  quickAnswer,
  flashcardFront,
  flashcardBack,
}: Props) {
  const t = useTranslations('question')

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Full Answer */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-4">
          {t('fullAnswer')}
        </p>
        <div className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6">
          <MarkdownRenderer html={fullAnswer} />
        </div>
      </div>

      {/* Right: Quick Answer + Flashcard */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-3">
            {t('quickAnswer')}
          </p>
          <div className="bg-gray-50 dark:bg-dark-surface border-l-2 border-l-green-500 border border-gray-200 dark:border-dark-border rounded-lg p-4">
            <MarkdownRenderer html={quickAnswer} />
          </div>
        </div>

        <FlashCard
          questionPath={questionPath}
          front={flashcardFront}
          back={flashcardBack}
        />
      </div>
    </div>
  )
}
