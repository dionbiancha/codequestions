import { getTranslations } from 'next-intl/server'
import { QuizHistoryList } from '@/components/quiz/QuizHistoryList'

export default async function QuizHistoryPage() {
  const t = await getTranslations('quiz')
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-8">
        {t('history')}
      </h1>
      <QuizHistoryList />
    </div>
  )
}
