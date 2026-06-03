import { getTranslations, getLocale } from 'next-intl/server'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

export default async function ContactPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-dark-heading mb-2">{t('contact')}</h1>
      <p className="text-gray-500 dark:text-dark-muted mb-10">
        {locale === 'pt'
          ? 'Tem uma dúvida, sugestão ou encontrou um problema?'
          : 'Have a question, suggestion, or found an issue?'}
      </p>

      <div className="flex flex-col gap-4">
        <a
          href="mailto:contact@codequestions.dev"
          className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6 hover:border-blue-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">✉️</span>
          <div>
            <div className="font-medium text-gray-900 dark:text-dark-heading group-hover:text-blue-400 transition-colors">
              {locale === 'pt' ? 'Enviar um email' : 'Send an email'}
            </div>
            <div className="text-sm text-gray-500 dark:text-dark-muted">contact@codequestions.dev</div>
          </div>
        </a>

        <a
          href="https://github.com/dionbiancha/codequestions/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-6 hover:border-blue-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">🐛</span>
          <div>
            <div className="font-medium text-gray-900 dark:text-dark-heading group-hover:text-blue-400 transition-colors">
              {locale === 'pt' ? 'Abrir uma issue no GitHub' : 'Open a GitHub issue'}
            </div>
            <div className="text-sm text-gray-500 dark:text-dark-muted">
              {locale === 'pt' ? 'Para bugs, sugestões e melhorias' : 'For bugs, suggestions, and improvements'}
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
