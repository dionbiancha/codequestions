import { MarkdownRenderer } from './MarkdownRenderer'

type Props = {
  title: string
  subtitle?: string
  html: string
}

export function StaticPage({ title, subtitle, html }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-gray-900 dark:text-dark-heading mb-2">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-dark-muted mb-10">{subtitle}</p>}
      <div className="bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-8">
        <MarkdownRenderer html={html} />
      </div>
    </div>
  )
}
