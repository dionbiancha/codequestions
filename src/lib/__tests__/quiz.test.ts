import { describe, it, expect, beforeEach } from 'vitest'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

import {
  getQuizStore, startQuiz, answerCurrentQuestion,
  completeQuiz, forceCompleteQuiz, getQuizById,
  clearQuizHistory, computeScore, computeCategoryBreakdown,
} from '../quiz'
import type { QuizConfig } from '../quiz'
import type { QuestionMeta } from '../content'

beforeEach(() => localStorage.clear())

const mockConfig: QuizConfig = {
  categories: ['frontend'],
  count: 2,
  difficulties: ['pleno'],
  tags: [],
  timerMinutes: null,
}

const mockQuestions: QuestionMeta[] = [
  { slug: 'hooks', title: 'What are hooks?', category: 'frontend', subcategory: 'react', tags: ['react'], difficulty: 'pleno', lang: 'pt', path: 'frontend/react/hooks', quickAnswer: 'Functions that let you use state in functional components.' },
  { slug: 'let-const-var', title: 'var vs let vs const?', category: 'frontend', subcategory: 'javascript', tags: ['js'], difficulty: 'pleno', lang: 'pt', path: 'frontend/javascript/let-const-var', quickAnswer: 'Scope and mutability differences.' },
]

describe('getQuizStore', () => {
  it('returns empty store when nothing saved', () => {
    expect(getQuizStore()).toEqual({ active: null, history: [] })
  })
})

describe('startQuiz', () => {
  it('saves active quiz with correct shape', () => {
    const quiz = startQuiz(mockConfig, mockQuestions, 'pt')
    expect(quiz.config).toEqual(mockConfig)
    expect(quiz.questions).toEqual(mockQuestions)
    expect(quiz.answers).toEqual([null, null])
    expect(quiz.currentIndex).toBe(0)
    expect(quiz.locale).toBe('pt')
    expect(typeof quiz.id).toBe('string')
    expect(getQuizStore().active?.id).toBe(quiz.id)
  })
})

describe('answerCurrentQuestion', () => {
  it('records answer and advances index', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    const updated = answerCurrentQuestion('known')
    expect(updated?.answers[0]).toBe('known')
    expect(updated?.currentIndex).toBe(1)
  })

  it('returns null when no active quiz', () => {
    expect(answerCurrentQuestion('known')).toBeNull()
  })
})

describe('completeQuiz', () => {
  it('moves active to history and clears active', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    answerCurrentQuestion('known')
    answerCurrentQuestion('unknown')
    const completed = completeQuiz()
    expect(completed).not.toBeNull()
    expect(typeof completed?.completedAt).toBe('number')
    expect(typeof completed?.durationSeconds).toBe('number')
    const store = getQuizStore()
    expect(store.active).toBeNull()
    expect(store.history).toHaveLength(1)
    expect(store.history[0].id).toBe(completed?.id)
  })

  it('returns null when no active quiz', () => {
    expect(completeQuiz()).toBeNull()
  })
})

describe('forceCompleteQuiz', () => {
  it('fills unanswered questions with unknown', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    answerCurrentQuestion('known')
    // currentIndex is now 1, second question unanswered
    const completed = forceCompleteQuiz()
    expect(completed?.answers[0]).toBe('known')
    expect(completed?.answers[1]).toBe('unknown')
  })
})

describe('getQuizById', () => {
  it('finds active quiz by id', () => {
    const quiz = startQuiz(mockConfig, mockQuestions, 'pt')
    expect(getQuizById(quiz.id)?.id).toBe(quiz.id)
  })

  it('finds completed quiz in history', () => {
    const quiz = startQuiz(mockConfig, mockQuestions, 'pt')
    const id = quiz.id
    completeQuiz()
    expect(getQuizById(id)?.id).toBe(id)
  })

  it('returns null for unknown id', () => {
    expect(getQuizById('nonexistent')).toBeNull()
  })
})

describe('clearQuizHistory', () => {
  it('empties history', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    completeQuiz()
    clearQuizHistory()
    expect(getQuizStore().history).toHaveLength(0)
  })
})

describe('computeScore', () => {
  it('calculates score with partial worth 0.5', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    answerCurrentQuestion('known')
    answerCurrentQuestion('partial')
    const completed = completeQuiz()!
    const { known, partial, unknown, total, score } = computeScore(completed)
    expect(known).toBe(1)
    expect(partial).toBe(1)
    expect(unknown).toBe(0)
    expect(total).toBe(2)
    expect(score).toBe(75) // (1 + 0.5) / 2 * 100
  })
})

describe('computeCategoryBreakdown', () => {
  it('groups results by category', () => {
    startQuiz(mockConfig, mockQuestions, 'pt')
    answerCurrentQuestion('known')
    answerCurrentQuestion('unknown')
    const completed = completeQuiz()!
    const breakdown = computeCategoryBreakdown(completed)
    expect(breakdown).toHaveLength(1)
    expect(breakdown[0].category).toBe('frontend')
    expect(breakdown[0].known).toBe(1)
    expect(breakdown[0].unknown).toBe(1)
    expect(breakdown[0].score).toBe(50)
  })
})
