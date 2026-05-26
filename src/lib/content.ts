import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type QuestionMeta = {
  slug: string
  title: string
  category: string
  subcategory: string
  tags: string[]
  difficulty: Difficulty
  lang: string
  path: string
}

export type QuestionContent = QuestionMeta & {
  fullAnswer: string
  quickAnswer: string
  flashcard: string
  mindMap?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content')

export function parseQuestionSlug(questionPath: string): {
  category: string
  subcategory: string
  slug: string
} {
  const parts = questionPath.split('/')
  return {
    category: parts[0],
    subcategory: parts[1],
    slug: parts[2],
  }
}

export function getCategoryFromPath(questionPath: string): string {
  return questionPath.split('/')[0]
}

export function buildQuestionMeta(
  slug: string,
  fm: Record<string, unknown>
): QuestionMeta {
  return {
    slug,
    title: fm.title as string,
    category: fm.category as string,
    subcategory: fm.subcategory as string,
    tags: (fm.tags as string[]) ?? [],
    difficulty: (fm.difficulty as Difficulty) ?? 'intermediate',
    lang: fm.lang as string,
    path: `${fm.category}/${fm.subcategory}/${slug}`,
  }
}

export async function mdToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown)
  return result.toString()
}

function extractSection(content: string, heading: string): string {
  const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

export async function getQuestion(
  locale: string,
  category: string,
  slug: string
): Promise<QuestionContent | null> {
  const filePath = path.join(CONTENT_DIR, locale, category, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)

  const [fullAnswerHtml, quickAnswerHtml, flashcardHtml, mindMapHtml] =
    await Promise.all([
      mdToHtml(extractSection(content, 'Full Answer')),
      mdToHtml(extractSection(content, 'Quick Answer')),
      mdToHtml(extractSection(content, 'Flashcard')),
      mdToHtml(extractSection(content, 'Mind Map')),
    ])

  const meta = buildQuestionMeta(slug, fm)

  return {
    ...meta,
    fullAnswer: fullAnswerHtml,
    quickAnswer: quickAnswerHtml,
    flashcard: flashcardHtml,
    mindMap: mindMapHtml || undefined,
  }
}

export function getAllQuestionMeta(locale: string, category: string): QuestionMeta[] {
  const dir = path.join(CONTENT_DIR, locale, category)
  if (!fs.existsSync(dir)) return []

  const results: QuestionMeta[] = []
  const subcategories = fs.readdirSync(dir)
  for (const sub of subcategories) {
    const subDir = path.join(dir, sub)
    if (!fs.statSync(subDir).isDirectory()) continue
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const slug = file.replace('.md', '')
      const raw = fs.readFileSync(path.join(subDir, file), 'utf-8')
      const { data: fm } = matter(raw)
      results.push(buildQuestionMeta(slug, fm))
    }
  }
  return results
}

export function getAllSlugsForCategory(
  locale: string,
  category: string
): { slug: string; subcategory: string }[] {
  const dir = path.join(CONTENT_DIR, locale, category)
  if (!fs.existsSync(dir)) return []

  const results: { slug: string; subcategory: string }[] = []
  const subcategories = fs.readdirSync(dir)
  for (const sub of subcategories) {
    const subDir = path.join(dir, sub)
    if (!fs.statSync(subDir).isDirectory()) continue
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      results.push({ slug: file.replace('.md', ''), subcategory: sub })
    }
  }
  return results
}
