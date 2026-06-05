'use server'

import { getAllQuestionMeta } from '@/lib/content'
import type { QuizConfig } from '@/lib/quiz'
import type { QuestionMeta } from '@/lib/content'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function getQuestionsForQuiz(
  locale: string,
  config: QuizConfig
): Promise<QuestionMeta[]> {
  const all: QuestionMeta[] = []
  for (const category of config.categories) {
    all.push(...getAllQuestionMeta(locale, category))
  }

  const filtered = all.filter(q => {
    const diffMatch =
      config.difficulties.length === 0 || config.difficulties.includes(q.difficulty)
    const tagMatch =
      config.tags.length === 0 || config.tags.some(tag => q.tags.includes(tag))
    return diffMatch && tagMatch
  })

  return shuffle(filtered).slice(0, config.count)
}
