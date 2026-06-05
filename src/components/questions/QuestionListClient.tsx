'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { FocusMode } from './FocusMode'
import { QuizSetupPanel } from '@/components/quiz/QuizSetupPanel'
import type { QuestionMeta } from '@/lib/content'
import { QuestionCard } from './QuestionCard'
const LEVELS = ['junior', 'pleno', 'senior', 'especialista'] as const

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

type Props = {
  questions: QuestionMeta[]
  categoryCounts: Record<string, number>
  currentCategory: string
}

export function QuestionListClient({ questions, categoryCounts, currentCategory }: Props) {
  const t = useTranslations('categories')
  const tQuestion = useTranslations('question')

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tagFocused, setTagFocused] = useState(false)
  const [randomQuestion, setRandomQuestion] = useState<QuestionMeta | null>(null)
  const [seenSlugs, setSeenSlugs] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<QuestionMeta[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    questions.forEach(q => q.tags.forEach(tag => set.add(tag)))
    return Array.from(set).sort()
  }, [questions])

  const tagSuggestions = useMemo(() => {
    if (!tagInput) return []
    const lower = tagInput.toLowerCase()
    return allTags
      .filter(t => !selectedTags.includes(t) && t.toLowerCase().includes(lower))
      .slice(0, 8)
  }, [allTags, selectedTags, tagInput])

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(q.difficulty)
      const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => q.tags.includes(tag))
      return levelMatch && tagMatch
    })
  }, [questions, selectedLevels, selectedTags])

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    )
    setRandomQuestion(null)
    setSeenSlugs(new Set())
    setHistory([])
    setHistoryIndex(-1)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    setRandomQuestion(null)
    setSeenSlugs(new Set())
    setHistory([])
    setHistoryIndex(-1)
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag])
      setRandomQuestion(null)
      setSeenSlugs(new Set())
      setHistory([])
      setHistoryIndex(-1)
    }
    setTagInput('')
    inputRef.current?.focus()
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedLevels([])
    setTagInput('')
    setRandomQuestion(null)
    setSeenSlugs(new Set())
    setHistory([])
    setHistoryIndex(-1)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagSuggestions.length > 0) {
      e.preventDefault()
      addTag(tagSuggestions[0])
    }
    if (e.key === 'Escape') {
      setTagInput('')
    }
    if (e.key === 'Backspace' && tagInput === '' && selectedTags.length > 0) {
      setSelectedTags(prev => prev.slice(0, -1))
    }
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
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1)
      return [...truncated, pick]
    })
    setHistoryIndex(prev => prev + 1)
  }, [filtered, seenSlugs, historyIndex])

  const handlePrev = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setRandomQuestion(history[newIndex])
  }, [history, historyIndex])

  const closeRandom = () => {
    setRandomQuestion(null)
    setSeenSlugs(new Set())
    setHistory([])
    setHistoryIndex(-1)
  }

  const isFiltering = selectedTags.length > 0 || selectedLevels.length > 0

  return (
    <div>
      {/* Level filter */}
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-dark-muted uppercase tracking-widest mr-1">
            {t('filterLabel')}
          </span>
          {LEVELS.map(level => {
            const active = selectedLevels.includes(level)
            return (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? 'border-green-500 text-green-400 bg-green-500/10'
                    : 'border-dark-border text-dark-muted hover:border-green-500/50 hover:text-dark-heading'
                }`}
              >
                {active && '✓ '}{tQuestion(`difficulty.${level}`)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tag search */}
      <div className="mb-5 relative">
        <div
          className="flex flex-wrap gap-1.5 items-center p-2 bg-dark-surface border border-dark-border rounded-lg focus-within:border-blue-500/50 transition-colors cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded px-2 py-0.5"
            >
              {tag}
              <button
                onMouseDown={(e) => { e.preventDefault(); toggleTag(tag) }}
                className="hover:text-blue-300 leading-none"
                aria-label={`Remove ${tag}`}
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
            onFocus={() => setTagFocused(true)}
            onBlur={() => setTagFocused(false)}
            placeholder={selectedTags.length === 0 ? t('searchTags') : ''}
            className="flex-1 bg-transparent text-sm text-dark-text placeholder-dark-muted outline-none min-w-[120px]"
          />
        </div>

        {/* Dropdown */}
        {tagFocused && tagSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-dark-surface border border-dark-border rounded-lg overflow-hidden z-10 shadow-lg">
            {tagSuggestions.map(tag => (
              <button
                key={tag}
                onMouseDown={(e) => { e.preventDefault(); addTag(tag) }}
                className="w-full text-left px-3 py-2 text-sm text-dark-text hover:bg-dark-border transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

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

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={pickRandom}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 border border-indigo-500/40 text-indigo-400 hover:border-indigo-500/70 hover:text-indigo-300 text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            🎲 {t('randomQuestion')}
          </button>
          <QuizSetupPanel
            preselectedCategories={[currentCategory]}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Focus mode overlay */}
      {randomQuestion && (
        <FocusMode
          question={randomQuestion}
          onNext={pickRandom}
          onPrev={handlePrev}
          hasPrev={historyIndex > 0}
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
