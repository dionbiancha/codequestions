'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from './ThemeProvider'

export function Header() {
  const t = useTranslations('nav')
  const { theme, toggle } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const otherLocale = locale === 'en' ? 'pt' : 'en'

  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)
    router.push(newPath)
  }

  return (
    <header className="border-b border-dark-border dark:border-dark-border bg-white dark:bg-dark-surface sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono font-bold text-blue-400 text-lg tracking-tight">
          codequestions
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}/questions`} className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors">{t('questions')}</Link>
          <Link href={`/${locale}/storytelling`} className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors">{t('storytelling')}</Link>
          <Link href={`/${locale}/contribute`} className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors">{t('contribute')}</Link>
          <Link href={`/${locale}/support`} className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors">{t('support')}</Link>
          <Link href={`/${locale}/about`} className="text-sm text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors">{t('about')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-mono border border-gray-300 dark:border-dark-border rounded px-2 py-1 text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors"
          >
            {otherLocale.toUpperCase()}
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 dark:border-dark-border text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
