import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeQuestions — Tech Interview Prep',
  description: 'Open source collection of the most asked tech interview questions with complete answers, quick answers, and flashcards.',
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-dark-text min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
