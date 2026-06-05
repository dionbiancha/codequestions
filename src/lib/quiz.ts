import type { QuestionMeta, Difficulty } from './content'

const STORAGE_KEY = 'cq_quiz'
const MAX_HISTORY = 50

export type QuizAnswer = 'known' | 'partial' | 'unknown'

export type QuizConfig = {
  categories: string[]
  count: number
  difficulties: Difficulty[]
  tags: string[]
  timerMinutes: number | null
}

export type ActiveQuiz = {
  id: string
  config: QuizConfig
  questions: QuestionMeta[]
  answers: (QuizAnswer | null)[]
  currentIndex: number
  startedAt: number
  locale: string
}

export type CompletedQuiz = ActiveQuiz & {
  completedAt: number
  durationSeconds: number
}

export type QuizStore = {
  active: ActiveQuiz | null
  history: CompletedQuiz[]
}

export function getQuizStore(): QuizStore {
  if (typeof window === 'undefined') return { active: null, history: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { active: null, history: [] }
  } catch {
    return { active: null, history: [] }
  }
}

function saveQuizStore(store: QuizStore): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function startQuiz(
  config: QuizConfig,
  questions: QuestionMeta[],
  locale: string
): ActiveQuiz {
  const now = Date.now()
  const quiz: ActiveQuiz = {
    id: crypto.randomUUID(),
    config,
    questions,
    answers: questions.map(() => null),
    currentIndex: 0,
    startedAt: now,
    locale,
  }
  const store = getQuizStore()
  store.active = quiz
  saveQuizStore(store)
  return quiz
}

export function answerCurrentQuestion(answer: QuizAnswer): ActiveQuiz | null {
  const store = getQuizStore()
  if (!store.active) return null
  const quiz = store.active
  if (quiz.currentIndex >= quiz.questions.length) return quiz  // already complete
  const answers = [...quiz.answers]
  answers[quiz.currentIndex] = answer
  const updated: ActiveQuiz = { ...quiz, answers, currentIndex: quiz.currentIndex + 1 }
  store.active = updated
  saveQuizStore(store)
  return updated
}

export function completeQuiz(): CompletedQuiz | null {
  const store = getQuizStore()
  if (!store.active) return null
  const now = Date.now()
  const completed: CompletedQuiz = {
    ...store.active,
    completedAt: now,
    durationSeconds: Math.round((now - store.active.startedAt) / 1000),
  }
  store.active = null
  store.history = [completed, ...store.history].slice(0, MAX_HISTORY)
  saveQuizStore(store)
  return completed
}

export function forceCompleteQuiz(): CompletedQuiz | null {
  const store = getQuizStore()
  if (!store.active) return null
  const now = Date.now()
  const answers = store.active.answers.map(a => a ?? 'unknown') as QuizAnswer[]
  const completed: CompletedQuiz = {
    ...store.active,
    answers,
    currentIndex: store.active.questions.length,
    completedAt: now,
    durationSeconds: Math.round((now - store.active.startedAt) / 1000),
  }
  store.active = null
  store.history = [completed, ...store.history].slice(0, MAX_HISTORY)
  saveQuizStore(store)
  return completed
}

export function getQuizById(id: string): ActiveQuiz | CompletedQuiz | null {
  const store = getQuizStore()
  if (store.active?.id === id) return store.active
  return store.history.find(q => q.id === id) ?? null
}

export function clearQuizHistory(): void {
  const store = getQuizStore()
  store.history = []
  saveQuizStore(store)
}

export function computeScore(quiz: CompletedQuiz) {
  const known = quiz.answers.filter(a => a === 'known').length
  const partial = quiz.answers.filter(a => a === 'partial').length
  const unknown = quiz.answers.filter(a => a === 'unknown').length
  const total = quiz.questions.length
  const score = Math.round(((known + partial * 0.5) / total) * 100)
  return { known, partial, unknown, total, score }
}

export function computeCategoryBreakdown(quiz: CompletedQuiz) {
  const byCategory: Record<string, { known: number; partial: number; unknown: number; total: number }> = {}
  quiz.questions.forEach((q, i) => {
    if (!byCategory[q.category]) byCategory[q.category] = { known: 0, partial: 0, unknown: 0, total: 0 }
    const answer = (quiz.answers[i] ?? 'unknown') as QuizAnswer
    byCategory[q.category][answer]++
    byCategory[q.category].total++
  })
  return Object.entries(byCategory).map(([category, s]) => ({
    category,
    ...s,
    score: Math.round(((s.known + s.partial * 0.5) / s.total) * 100),
  }))
}
