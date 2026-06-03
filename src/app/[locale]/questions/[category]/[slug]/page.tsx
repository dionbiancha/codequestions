import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getQuestion, getAllSlugsForCategory } from '@/lib/content'
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories'
import { Badge } from '@/components/ui/Badge'
import { QuestionSplitView } from '@/components/questions/QuestionSplitView'

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>
}

export async function generateStaticParams() {
  const locales = ['en', 'pt']
  const params: { locale: string; category: string; slug: string }[] = []
  for (const locale of locales) {
    for (const cat of CATEGORIES) {
      const slugs = getAllSlugsForCategory(locale, cat.slug)
      for (const { slug } of slugs) {
        params.push({ locale, category: cat.slug, slug })
      }
    }
  }
  return params
}

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  junior: 'green',
  pleno: 'blue',
  senior: 'orange',
  especialista: 'orange',
}

function extractFlashcardParts(flashcardHtml: string): { front: string; back: string } {
  // remark converts **Q:** → <strong>Q:</strong>; after stripping tags only "Q:" / "A:" remain
  const text = flashcardHtml.replace(/<[^>]+>/g, '').trim()
  const frontMatch = text.match(/[QP]:\s*([\s\S]*?)(?=\n\s*[AR]:)/)
  const backMatch = text.match(/[AR]:\s*([\s\S]*)/)
  return {
    front: frontMatch?.[1]?.trim() ?? '',
    back: backMatch?.[1]?.trim() ?? '',
  }
}

export default async function QuestionPage({ params }: Props) {
  const { category, slug } = await params
  const locale = await getLocale()
  const t = await getTranslations()

  const question = await getQuestion(locale, category, slug)
  if (!question) notFound()

  const cat = getCategoryBySlug(category)
  const { front, back } = extractFlashcardParts(question.flashcard)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-dark-muted mb-8 flex-wrap">
        <Link href={`/${locale}/questions`} className="hover:text-gray-900 dark:hover:text-dark-heading">Questions</Link>
        <span>/</span>
        <Link href={`/${locale}/questions/${category}`} className={`hover:text-gray-900 dark:hover:text-dark-heading ${cat?.color ?? ''}`}>
          {t(`categories.${category}`)}
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-dark-text truncate">{question.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-heading mb-4">{question.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
            {t(`question.difficulty.${question.difficulty}`)}
          </Badge>
          {question.tags.map(tag => (
            <Badge key={tag} variant="gray">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Split View */}
      <QuestionSplitView
        questionPath={question.path}
        fullAnswer={question.fullAnswer}
        quickAnswer={question.quickAnswer}
        flashcardFront={front}
        flashcardBack={back}
      />
    </div>
  )
}
