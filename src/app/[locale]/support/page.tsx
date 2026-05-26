import { getTranslations, getLocale } from 'next-intl/server'
import { PixQRCode } from '@/components/ui/PixQRCode'

export default async function SupportPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()

  const isPt = locale === 'pt'

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{t('support')}</h1>
      <p className="text-dark-muted mb-10">
        {isPt
          ? 'CodeQuestions é gratuito e open source. Se ele te ajudou, considere apoiar o projeto.'
          : 'CodeQuestions is free and open source. If it helped you, consider supporting the project.'}
      </p>

      <div className="flex flex-col gap-4">
        <a
          href="https://github.com/sponsors/your-org"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-pink-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">💖</span>
          <div>
            <div className="font-medium text-dark-heading group-hover:text-pink-400 transition-colors">GitHub Sponsors</div>
            <div className="text-sm text-dark-muted">{isPt ? 'Apoio recorrente via GitHub' : 'Recurring support via GitHub'}</div>
          </div>
        </a>

        <a
          href="https://ko-fi.com/your-handle"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-yellow-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">☕</span>
          <div>
            <div className="font-medium text-dark-heading group-hover:text-yellow-400 transition-colors">Ko-fi</div>
            <div className="text-sm text-dark-muted">{isPt ? 'Pague um café' : 'Buy me a coffee'}</div>
          </div>
        </a>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl">🇧🇷</span>
            <div>
              <div className="font-medium text-dark-heading">Pix</div>
              <div className="text-sm text-dark-muted">{isPt ? 'Para contribuidores brasileiros' : 'For Brazilian contributors'}</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <PixQRCode />
            <div className="flex flex-col gap-2 text-sm text-dark-muted">
              <p>{isPt ? 'Escaneie o QR code com o app do seu banco.' : 'Scan the QR code with your banking app.'}</p>
              <p>{isPt ? 'Ou copie a chave Pix:' : 'Or copy the Pix key:'}</p>
              <div className="bg-dark-bg border border-dark-border rounded px-3 py-2 font-mono text-dark-muted text-xs select-all">
                pix@dionei.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
