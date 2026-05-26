'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
]

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (target: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${target}`)
    router.push(newPath)
  }

  return (
    <footer className="border-t border-dark-border mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-dark-muted">
        <p>{t('madeWith')}</p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${
                  locale === l.code
                    ? 'border-blue-500/60 text-blue-400'
                    : 'border-dark-border text-dark-muted hover:text-dark-heading'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link href={`/${locale}/contribute`} className="hover:text-dark-heading transition-colors">{nav('contribute')}</Link>
          <Link href={`/${locale}/support`} className="hover:text-dark-heading transition-colors">{nav('support')}</Link>
          <Link href={`/${locale}/about`} className="hover:text-dark-heading transition-colors">{nav('about')}</Link>
          <Link
            href="https://github.com/your-org/codequestions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dark-heading transition-colors"
          >
            {t('openSource')} ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
