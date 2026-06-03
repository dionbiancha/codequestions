import { getTranslations, getLocale } from 'next-intl/server'
import { PixQRCode } from '@/components/ui/PixQRCode'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }]
}

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

      <div className="bg-dark-surface border border-dark-border rounded-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🇧🇷</span>
          <div>
            <div className="font-semibold text-dark-heading text-lg">Pix</div>
            <div className="text-sm text-dark-muted">
              {isPt ? 'Transferência instantânea · sem taxas' : 'Instant transfer · no fees'}
            </div>
          </div>
        </div>

        <p className="text-sm text-dark-muted leading-relaxed mb-6 border-l-2 border-blue-500/40 pl-4">
          {isPt
            ? 'Os valores arrecadados cobrem os custos de manutenção do projeto: domínio, e-mail profissional e tempo dedicado ao desenvolvimento e curadoria do conteúdo.'
            : 'Contributions cover project running costs: domain, professional email, and the time spent developing and curating content.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          <PixQRCode />
          <div className="flex flex-col gap-3 text-sm text-dark-muted">
            <p>{isPt ? 'Escaneie com o app do seu banco:' : 'Scan with your banking app:'}</p>
            <div className="bg-dark-bg border border-dark-border rounded px-3 py-2 font-mono text-dark-muted text-xs select-all">
              pix@dionei.com
            </div>
            <p className="text-xs text-dark-muted/60">
              {isPt
                ? 'Qualquer valor é bem-vindo. Muito obrigado! 🙏'
                : 'Any amount is welcome. Thank you! 🙏'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
