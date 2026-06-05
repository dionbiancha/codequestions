'use client'

import { useState, useTransition, useRef, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getQuestionsForQuiz } from '@/app/quiz-actions'
import { startQuiz } from '@/lib/quiz'
import type { QuizConfig } from '@/lib/quiz'
import type { Difficulty } from '@/lib/content'

const DIFFICULTIES: Difficulty[] = ['junior', 'pleno', 'senior', 'especialista']

type Props = {
  preselectedCategories: string[]
  categoryCounts: Record<string, number>
}

export function QuizSetupPanel({ preselectedCategories, categoryCounts }: Props) {
  const t = useTranslations('quiz')
  const tQuestion = useTranslations('question')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>(preselectedCategories)
  const [count, setCount] = useState(10)
  const [difficulties, setDifficulties] = useState<Difficulty[]>([...DIFFICULTIES])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [timerMinutes, setTimerMinutes] = useState('')
  const [noResults, setNoResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const availableCount = useMemo(
    () => CATEGORIES
      .filter(c => categories.includes(c.slug))
      .reduce((sum, c) => sum + (categoryCounts[c.slug] ?? 0), 0),
    [categories, categoryCounts]
  )
  const maxCount = Math.min(availableCount, 100)
  const safeCount = Math.max(1, Math.min(count, maxCount || 1))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const toggleCategory = (slug: string) =>
    setCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )

  const toggleDifficulty = (d: Difficulty) =>
    setDifficulties(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) setTags(prev => [...prev, trimmed])
    setTagInput('')
    inputRef.current?.focus()
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const handleStart = () => {
    setNoResults(false)
    const config: QuizConfig = {
      categories,
      count: safeCount,
      difficulties,
      tags,
      timerMinutes: timerMinutes ? parseInt(timerMinutes) : null,
    }
    startTransition(async () => {
      const questions = await getQuestionsForQuiz(locale, config)
      if (questions.length === 0) { setNoResults(true); return }
      const quiz = startQuiz(config, questions, locale)
      router.push(`/${locale}/quiz/${quiz.id}`)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-blue-500/40 text-blue-400 hover:border-blue-500/70 hover:text-blue-300 text-sm px-4 py-2 rounded-lg transition-colors"
      >
        🎯 {t('createTest')}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 bg-dark-bg flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-dark-bg border border-dark-border rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20 bg-blue-500/5 rounded-t-xl flex-shrink-0">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                🎯 {t('createTest')}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-dark-muted hover:text-dark-heading transition-colors text-2xl leading-none"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* Categories */}
              <div className="mb-5">
                <span className="text-xs font-mono text-dark-muted uppercase tracking-widest block mb-2">
                  {t('categories')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => {
                    const active = categories.includes(cat.slug)
                    const cnt = categoryCounts[cat.slug] ?? 0
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                            : 'border-dark-border text-dark-muted hover:border-blue-500/50 hover:text-dark-heading'
                        }`}
                      >
                        {active && '✓ '}{cat.icon} {cat.slug} ({cnt})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Count + Timer */}
              <div className="flex gap-3 mb-5">
                <div className="flex-1">
                  <span className="text-xs font-mono text-dark-muted uppercase tracking-widest block mb-2">
                    {t('questionCount')}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={maxCount || 1}
                    value={safeCount}
                    onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-dark-surface border border-dark-border rounded px-3 py-1.5 text-sm text-dark-text focus:border-blue-500/50 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-mono text-dark-muted uppercase tracking-widest block mb-2">
                    {t('timer')}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="—"
                      value={timerMinutes}
                      onChange={e => setTimerMinutes(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded px-3 py-1.5 text-sm text-dark-text focus:border-blue-500/50 outline-none"
                    />
                    <span className="text-xs text-dark-muted flex-shrink-0">{t('timerUnit')}</span>
                  </div>
                </div>
              </div>

              {/* Seniority */}
              <div className="mb-5">
                <span className="text-xs font-mono text-dark-muted uppercase tracking-widest block mb-2">
                  {t('seniority')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(d => {
                    const active = difficulties.includes(d)
                    return (
                      <button
                        key={d}
                        onClick={() => toggleDifficulty(d)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                          active
                            ? 'border-green-500 text-green-400 bg-green-500/10'
                            : 'border-dark-border text-dark-muted hover:border-green-500/50'
                        }`}
                      >
                        {active && '✓ '}{tQuestion(`difficulty.${d}`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-2">
                <span className="text-xs font-mono text-dark-muted uppercase tracking-widest block mb-2">
                  {t('tags')}
                </span>
                <div
                  className="flex flex-wrap gap-1.5 items-center p-2 bg-dark-surface border border-dark-border rounded-lg focus-within:border-blue-500/50 transition-colors cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-2 py-0.5"
                    >
                      {tag}
                      <button
                        onMouseDown={e => { e.preventDefault(); setTags(prev => prev.filter(t => t !== tag)) }}
                        className="hover:text-blue-300 leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? 'react, hooks, ...' : ''}
                    className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-muted outline-none min-w-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-dark-border rounded-b-xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStart}
                  disabled={isPending || categories.length === 0 || maxCount === 0}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isPending ? '...' : `${t('start')} →`}
                </button>
                {categories.length > 0 && maxCount > 0 && (
                  <span className="text-xs text-dark-muted">
                    {availableCount} {t('questionsAvailable')}
                  </span>
                )}
                {noResults && (
                  <span className="text-xs text-red-400">{t('noQuestionsHint')}</span>
                )}
              </div>
              <Link
                href={`/${locale}/quiz/history`}
                onClick={() => setOpen(false)}
                className="text-xs text-dark-muted hover:text-dark-heading transition-colors"
              >
                {t('viewHistory')}
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
