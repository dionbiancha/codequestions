import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { NavigationProgress } from '@/components/ui/NavigationProgress'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'pt')) notFound()
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <NavigationProgress />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </NextIntlClientProvider>
  )
}
