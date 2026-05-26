import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t border-gray-200 dark:border-dark-border mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-dark-muted">
        <p>{t('madeWith')}</p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/your-org/codequestions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-dark-heading transition-colors"
          >
            {t('openSource')} ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
