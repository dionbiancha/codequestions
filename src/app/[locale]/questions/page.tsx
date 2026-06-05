import { getTranslations, getLocale } from 'next-intl/server'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'
import { CategoryListClient } from '@/components/questions/CategoryListClient'
import { QuizSetupPanel } from '@/components/quiz/QuizSetupPanel'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function QuestionsPage() {
  const t = await getTranslations()
  const locale = await getLocale()

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map(cat => [cat.slug, getAllQuestionMeta(locale, cat.slug).length])
  )

  const categories = CATEGORIES.map(cat => ({
    cat,
    label: t(`categories.${cat.slug}`),
    count: categoryCounts[cat.slug],
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="font-mono text-3xl font-bold text-dark-heading">
          {t('categories.title')}
        </h1>
        <QuizSetupPanel
          preselectedCategories={[]}
          categoryCounts={categoryCounts}
        />
      </div>
      <p className="text-dark-muted mb-8">
        {t('categories.subtitle')}
      </p>
      <CategoryListClient categories={categories} />
    </div>
  )
}
