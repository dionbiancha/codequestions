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

  const steps = [
    {
      num: '01',
      icon: '📖',
      title: t('step1Title'),
      desc: t('step1Desc'),
      tag: t('step1Tag'),
      accent: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      num: '02',
      icon: '🃏',
      title: t('step2Title'),
      desc: t('step2Desc'),
      tag: t('step2Tag'),
      accent: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    {
      num: '03',
      icon: '✅',
      title: t('step3Title'),
      desc: t('step3Desc'),
      tag: t('step3Tag'),
      accent: 'text-green-400',
      border: 'border-green-500/20',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      {/* Hero */}
      <section className="text-center mb-24">
        <h1 className="font-mono text-5xl font-bold text-blue-400 mb-4">
          codequestions
        </h1>
        <p className="text-xl text-dark-muted mb-10 max-w-xl mx-auto">
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
            className="border border-dark-border hover:border-blue-500/50 text-dark-muted hover:text-dark-heading px-6 py-3 rounded transition-colors"
          >
            {t('contribute')}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-24">
        <h2 className="text-center text-xs font-mono uppercase tracking-widest text-dark-muted mb-10">
          {t('howItWorks')}
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-dark-border rounded-xl overflow-hidden border border-dark-border">
          {steps.map(step => (
            <div key={step.num} className={`bg-dark-bg p-8 flex flex-col border-t-2 ${step.border}`}>
              <div className="text-3xl mb-5">{step.icon}</div>
              <div className={`text-xs font-mono ${step.accent} mb-3 tracking-widest`}>{step.num}</div>
              <h3 className="font-semibold text-dark-heading text-base mb-3 leading-snug">{step.title}</h3>
              <p className="text-sm text-dark-muted leading-relaxed flex-1">{step.desc}</p>
              <div className={`mt-6 pt-4 border-t border-dark-border/50 text-xs font-mono ${step.accent} opacity-70`}>
                {step.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      <section className="mb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {categoryCounts.map(cat => (
            <Link
              key={cat.slug}
              href={`/${locale}/questions/${cat.slug}`}
              className={`bg-dark-surface border ${cat.borderColor} rounded-lg p-6 hover:opacity-80 transition-opacity group`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className={`font-mono font-semibold ${cat.color} mb-1`}>{cat.slug}</div>
              <div className="text-xs text-dark-muted">{cat.count} questions</div>
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
      <section className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
        <h2 className="text-dark-heading font-semibold text-lg mb-2">
          Know a question that&apos;s missing?
        </h2>
        <p className="text-dark-muted text-sm mb-6 max-w-md mx-auto">
          CodeQuestions is open source. Add questions by submitting a Pull Request — just edit a markdown file.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={`/${locale}/contribute`} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded transition-colors">
            How to contribute
          </Link>
          <Link href={`/${locale}/support`} className="border border-dark-border text-dark-muted hover:text-dark-heading text-sm px-5 py-2 rounded transition-colors">
            Support the project
          </Link>
        </div>
      </section>

    </div>
  )
}
