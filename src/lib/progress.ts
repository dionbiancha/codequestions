const STORAGE_KEY = 'cq_progress'

export type QuestionStatus = 'known' | 'review'
export type ProgressStore = Record<string, QuestionStatus>

export function getProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setProgress(questionPath: string, status: QuestionStatus): void {
  const store = getProgress()
  store[questionPath] = status
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getQuestionStatus(questionPath: string): QuestionStatus | null {
  return getProgress()[questionPath] ?? null
}

export function countProgress(category: string): { known: number; review: number } {
  const store = getProgress()
  let known = 0
  let review = 0
  for (const [path, status] of Object.entries(store)) {
    if (path.startsWith(category + '/')) {
      if (status === 'known') known++
      else if (status === 'review') review++
    }
  }
  return { known, review }
}
