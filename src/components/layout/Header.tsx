'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()

  return (
    <header className="border-b border-dark-border bg-dark-surface sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono font-bold text-blue-400 text-lg tracking-tight">
          codequestions
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}/questions`} className="text-sm text-dark-muted hover:text-dark-heading transition-colors">{t('questions')}</Link>
          <Link href={`/${locale}/storytelling`} className="text-sm text-dark-muted hover:text-dark-heading transition-colors">{t('storytelling')}</Link>
        </nav>
      </div>
    </header>
  )
}
