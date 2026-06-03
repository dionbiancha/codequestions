'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { getQuestionStatus } from '@/lib/progress'
import { Badge } from '@/components/ui/Badge'
import { QuestionCard } from './QuestionCard'
import type { QuestionMeta } from '@/lib/content'

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

function RandomCard({ question, onClose }: {
  question: QuestionMeta
  onClose: () => void
}) {
  const locale = useLocale()
  const t = useTranslations('categories')
  const tQuestion = useTranslations('question')
  const [status, setStatus] = useState<'known' | 'review' | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setStatus(getQuestionStatus(question.path))
    setRevealed(false)
  }, [question.path])

  return (
    <div className="mb-6 bg-dark-surface border border-blue-500/30 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-500/20 bg-blue-500/5">
        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
          🎲 {t('randomTitle')}
        </span>
        <button
          onClick={onClose}
          className="text-dark-muted hover:text-dark-heading transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
            {tQuestion(`difficulty.${question.difficulty}`)}
          </Badge>
          {question.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="gray">{tag}</Badge>
          ))}
          {status === 'known' && <span title="Got it" className="text-base">✅</span>}
          {status === 'review' && <span title="Needs review" className="text-base">🔄</span>}
        </div>

        <h3 className="font-semibold text-dark-heading text-base leading-snug mb-5">
          {question.title}
        </h3>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t('showAnswer')}
          </button>
        ) : (
          <div>
            <div className="bg-dark-bg border border-dark-border rounded-lg px-4 py-3 mb-4">
              <p className="text-xs font-mono text-dark-muted uppercase tracking-widest mb-2">
                {t('quickAnswerLabel')}
              </p>
              <p className="text-sm text-dark-text leading-relaxed">
                {question.quickAnswer || '—'}
              </p>
            </div>
            <Link
              href={`/${locale}/questions/${question.category}/${question.slug}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {t('openQuestion')} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

type Props = {
  questions: QuestionMeta[]
}

export function QuestionListClient({ questions }: Props) {
  const t = useTranslations('categories')

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [randomQuestion, setRandomQuestion] = useState<QuestionMeta | null>(null)
  const [seenSlugs, setSeenSlugs] = useState<Set<string>>(new Set())

  const allTags = useMemo(() => {
    const set = new Set<string>()
    questions.forEach(q => q.tags.forEach(tag => set.add(tag)))
    return Array.from(set).sort()
  }, [questions])

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return questions
    return questions.filter(q => selectedTags.some(tag => q.tags.includes(tag)))
  }, [questions, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    setRandomQuestion(null)
    setSeenSlugs(new Set())
  }

  const clearFilters = () => {
    setSelectedTags([])
    setRandomQuestion(null)
    setSeenSlugs(new Set())
  }

  const pickRandom = useCallback(() => {
    if (filtered.length === 0) return
    let available = filtered.filter(q => !seenSlugs.has(q.slug))
    let nextSeen = seenSlugs
    if (available.length === 0) {
      available = filtered
      nextSeen = new Set()
    }
    const pick = available[Math.floor(Math.random() * available.length)]
    setRandomQuestion(pick)
    setSeenSlugs(new Set([...nextSeen, pick.slug]))
  }, [filtered, seenSlugs])

  const closeRandom = () => {
    setRandomQuestion(null)
    setSeenSlugs(new Set())
  }

  const isFiltering = selectedTags.length > 0

  return (
    <div>
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-dark-muted uppercase tracking-widest mr-1">
              {t('filterLabel')}
            </span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-dark-border text-dark-muted hover:border-blue-500/50 hover:text-dark-heading'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar: count + random button */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <span className="text-sm text-dark-muted font-mono">
          {isFiltering
            ? `${filtered.length} / ${questions.length} ${t('questionsFiltered')}`
            : `${questions.length} ${t('questionsTotal')}`
          }
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="ml-3 text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
            >
              {t('clearFilters')}
            </button>
          )}
        </span>

        <button
          onClick={pickRandom}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
        >
          🎲 {t('randomQuestion')}
        </button>
      </div>

      {/* Random question card */}
      {randomQuestion && (
        <RandomCard
          question={randomQuestion}
          onClose={closeRandom}
        />
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          <p className="mb-3">{t('noResults')}</p>
          <button
            onClick={clearFilters}
            className="text-blue-400 hover:underline text-sm"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(q => (
            <QuestionCard key={q.slug} question={q} />
          ))}
        </div>
      )}
    </div>
  )
}
