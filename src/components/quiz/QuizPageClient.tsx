'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import type { ActiveQuiz, CompletedQuiz, QuizAnswer } from '@/lib/quiz'
import {
  getQuizById,
  answerCurrentQuestion,
  completeQuiz as doCompleteQuiz,
  forceCompleteQuiz,
} from '@/lib/quiz'
import { QuizQuestion } from './QuizQuestion'
import { QuizReport } from './QuizReport'

type Props = { id: string }

export function QuizPageClient({ id }: Props) {
  const locale = useLocale()
  const t = useTranslations('quiz')
  const [quiz, setQuiz] = useState<ActiveQuiz | CompletedQuiz | null | undefined>(undefined)
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)

  useEffect(() => {
    setQuiz(getQuizById(id))
  }, [id])

  // Timer countdown
  useEffect(() => {
    if (!quiz || 'completedAt' in quiz) return
    const active = quiz as ActiveQuiz
    if (!active.config.timerMinutes) { setSecondsRemaining(null); return }

    const endTime = active.startedAt + active.config.timerMinutes * 60 * 1000

    const tick = () => {
      const remaining = Math.round((endTime - Date.now()) / 1000)
      if (remaining <= 0) {
        clearInterval(interval)
        const completed = forceCompleteQuiz()
        if (completed) setQuiz(completed)
      } else {
        setSecondsRemaining(remaining)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [quiz && 'id' in quiz ? quiz.id : null]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((answer: QuizAnswer) => {
    const updated = answerCurrentQuestion(answer)
    if (!updated) return
    if (updated.currentIndex >= updated.questions.length) {
      const completed = doCompleteQuiz()
      if (completed) setQuiz(completed)
    } else {
      setQuiz({ ...updated })
    }
  }, [])

  const handleClose = useCallback(() => {
    if (!confirm(t('endConfirm'))) return
    const completed = forceCompleteQuiz()
    if (completed) setQuiz(completed)
  }, [t])

  // Loading state
  if (quiz === undefined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-3 bg-dark-border rounded w-1/4 mb-8" />
        <div className="h-6 bg-dark-border rounded w-3/4 mb-4" />
      </div>
    )
  }

  // Not found
  if (quiz === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-dark-muted">
        <p className="mb-4">{t('notFound')}</p>
        <Link href={`/${locale}/quiz/history`} className="text-blue-400 hover:underline text-sm">
          {t('viewHistory')}
        </Link>
      </div>
    )
  }

  // Completed — show report
  if ('completedAt' in quiz) {
    return <QuizReport quiz={quiz as CompletedQuiz} locale={locale} />
  }

  // Active — show question
  const active = quiz as ActiveQuiz
  return (
    <QuizQuestion
      question={active.questions[active.currentIndex]}
      questionNumber={active.currentIndex + 1}
      totalQuestions={active.questions.length}
      answers={active.answers}
      secondsRemaining={secondsRemaining}
      onAnswer={handleAnswer}
      onClose={handleClose}
    />
  )
}
