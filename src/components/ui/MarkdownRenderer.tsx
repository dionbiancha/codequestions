type Props = {
  html: string
  className?: string
}

export function MarkdownRenderer({ html, className = '' }: Props) {
  return (
    <div
      className={`prose prose-sm max-w-none
        dark:prose-invert
        prose-headings:font-mono dark:prose-headings:text-dark-heading
        prose-p:text-gray-700 dark:prose-p:text-dark-text prose-p:leading-relaxed
        prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-dark-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-100 dark:prose-pre:bg-dark-surface prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-dark-border prose-pre:rounded-lg
        prose-strong:text-gray-900 dark:prose-strong:text-dark-heading
        prose-li:text-gray-700 dark:prose-li:text-dark-text
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
