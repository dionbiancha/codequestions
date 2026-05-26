import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'

export default async function HomePage() {
  const t = await getTranslations('home')
  const locale = await getLocale()

  const featuredCategories = CATEGORIES.slice(0, 3)
  const categoryCounts = featuredCategories.map(c => ({
    ...c,
    count: getAllQuestionMeta(locale, c.slug).length,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="font-mono text-5xl font-bold text-blue-400 mb-4">
          codequestions
        </h1>
        <p className="text-xl text-gray-500 dark:text-dark-muted mb-8 max-w-xl mx-auto">
          {t('tagline')}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href={`/${locale}/questions`}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded transition-colors"
          >
            {t('browse')}
          </Link>
          <Link
            href={`/${locale}/contribute`}
            className="border border-gray-300 dark:border-dark-border hover:border-blue-500/50 text-gray-700 dark:text-dark-text px-6 py-3 rounded transition-colors"
          >
            {t('contribute')}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-20">
        <h2 className="text-center text-sm font-mono uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-10">
          {t('howItWorks')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: t('step1Title'), desc: t('step1Desc'), icon: '📖', num: '01' },
            { title: t('step2Title'), desc: t('step2Desc'), icon: '🃏', num: '02' },
            { title: t('step3Title'), desc: t('step3Desc'), icon: '🔀', num: '03' },
          ].map(step => (
            <div key={step.num} className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6">
              <div className="font-mono text-xs text-gray-400 dark:text-dark-muted mb-3">{step.num}</div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-dark-heading mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {categoryCounts.map(cat => (
            <Link
              key={cat.slug}
              href={`/${locale}/questions/${cat.slug}`}
              className={`bg-gray-50 dark:bg-dark-surface border ${cat.borderColor} rounded-lg p-6 hover:opacity-80 transition-opacity group`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className={`font-mono font-semibold ${cat.color} mb-1`}>{cat.slug}</div>
              <div className="text-xs text-gray-400 dark:text-dark-muted">{cat.count} questions</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href={`/${locale}/questions`} className="text-sm text-blue-400 hover:underline">
            View all categories →
          </Link>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-8 text-center">
        <h2 className="text-gray-900 dark:text-dark-heading font-semibold text-lg mb-2">
          Know a question that&apos;s missing?
        </h2>
        <p className="text-gray-500 dark:text-dark-muted text-sm mb-6 max-w-md mx-auto">
          CodeQuestions is open source. Add questions by submitting a Pull Request — just edit a markdown file.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={`/${locale}/contribute`} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded transition-colors">
            How to contribute
          </Link>
          <Link href={`/${locale}/support`} className="border border-gray-300 dark:border-dark-border text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading text-sm px-5 py-2 rounded transition-colors">
            Support the project
          </Link>
        </div>
      </section>
    </div>
  )
}
