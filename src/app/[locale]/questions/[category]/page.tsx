import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllQuestionMeta } from '@/lib/content'
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories'
import { QuestionCard } from '@/components/questions/QuestionCard'

type Props = {
  params: Promise<{ locale: string; category: string }>
}

export async function generateStaticParams() {
  const locales = ['en', 'pt']
  return CATEGORIES.flatMap(cat =>
    locales.map(locale => ({ locale, category: cat.slug }))
  )
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const locale = await getLocale()
  const t = await getTranslations()

  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const questions = getAllQuestionMeta(locale, category)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/${locale}/questions`} className="text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading text-sm">
          ← All categories
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className={`font-mono text-3xl font-bold ${cat.color}`}>
            {t(`categories.${cat.slug}`)}
          </h1>
          <p className="text-gray-400 dark:text-dark-muted text-sm mt-1">{questions.length} questions</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 text-dark-muted">
          <p className="mb-4">{t('categories.noQuestions')}</p>
          <Link href={`/${locale}/contribute`} className="text-blue-400 hover:underline">
            {t('categories.beFirst')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map(q => (
            <QuestionCard key={q.slug} question={q} />
          ))}
        </div>
      )}
    </div>
  )
}
