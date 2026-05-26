import { getTranslations, getLocale } from 'next-intl/server'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'
import { CategoryCard } from '@/components/questions/CategoryCard'

export default async function QuestionsPage() {
  const t = await getTranslations()
  const locale = await getLocale()

  const categoriesWithCount = CATEGORIES.map(cat => ({
    cat,
    label: t(`categories.${cat.slug}`),
    count: getAllQuestionMeta(locale, cat.slug).length,
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-dark-heading mb-2">
        Interview Questions
      </h1>
      <p className="text-gray-500 dark:text-dark-muted mb-10">
        Browse by category. Click a card to see all questions.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesWithCount.map(({ cat, label, count }) => (
          <CategoryCard key={cat.slug} category={cat} label={label} count={count} />
        ))}
      </div>
    </div>
  )
}
