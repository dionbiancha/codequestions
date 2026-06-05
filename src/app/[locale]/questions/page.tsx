import { getTranslations, getLocale } from 'next-intl/server'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'
import { CategoryCard } from '@/components/questions/CategoryCard'
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

  const categoriesWithCount = CATEGORIES.map(cat => ({
    cat,
    label: t(`categories.${cat.slug}`),
    count: categoryCounts[cat.slug],
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">
        {t('categories.title')}
      </h1>
      <p className="text-dark-muted mb-10">
        {t('categories.subtitle')}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categoriesWithCount.map(({ cat, label, count }) => (
          <CategoryCard key={cat.slug} category={cat} label={label} count={count} />
        ))}
      </div>

      <div className="mt-2 mb-4">
        <QuizSetupPanel
          preselectedCategories={[]}
          categoryCounts={categoryCounts}
        />
      </div>
    </div>
  )
}
