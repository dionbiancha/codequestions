# CodeQuestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the CodeQuestions open-source interview prep portal — a Next.js 15 static site with markdown-based questions, split-view question pages, flip-card flashcards, localStorage progress tracking, dark/light themes, and English/Portuguese i18n.

**Architecture:** Content lives as `.md` files read at build time with `gray-matter` + `remark`. Next.js App Router with `next-intl` handles locale routing. No database, no auth — fully static, deployed to Vercel.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, next-intl, gray-matter, remark, remark-html, Vitest

---

## File Map

```
codequestions/
  src/
    app/
      layout.tsx                        root layout — theme class on <html>
      middleware.ts                      next-intl locale detection
      [locale]/
        layout.tsx                      next-intl provider
        page.tsx                        home page
        questions/
          page.tsx                      category hub
          [category]/
            page.tsx                    question list
            [slug]/
              page.tsx                  question detail (split view)
        storytelling/page.tsx
        faq/page.tsx
        about/page.tsx
        contribute/page.tsx
        contact/page.tsx
        support/page.tsx
    components/
      layout/
        Header.tsx                      nav + locale switcher + theme toggle
        Footer.tsx
      questions/
        CategoryCard.tsx                hub card with progress badge
        QuestionCard.tsx                list item with status icon
        QuestionSplitView.tsx           split view wrapper
        FlashCard.tsx                   3D flip card
        ProgressBadge.tsx               "12/42" badge
      ui/
        Badge.tsx
        Button.tsx
        MarkdownRenderer.tsx            remark HTML rendering
    lib/
      content.ts                        read/parse .md files
      progress.ts                       localStorage helpers
      categories.ts                     category metadata (slug, label, icon)
    i18n/
      routing.ts                        next-intl locales config
      request.ts                        next-intl server config
    messages/
      en.json
      pt.json
    content/
      en/
        frontend/javascript/let-const-var.md
        frontend/javascript/event-delegation.md
        frontend/react/hooks.md
        backend/node/event-loop.md
        soft-skills/storytelling.md
      pt/
        frontend/javascript/let-const-var.md
        soft-skills/storytelling.md
  vitest.config.ts
  next.config.ts
  tailwind.config.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`

- [ ] **Step 1: Scaffold Next.js project**

Run in the repo root (`codequestions/`):
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```
Answer prompts: accept defaults. This creates the base structure.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-intl gray-matter remark remark-html
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configure Vitest**

Replace `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

Create `vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Configure next.config.ts**

```typescript
import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const config: NextConfig = {
  output: 'standalone',
}

export default withNextIntl(config)
```

- [ ] **Step 5: Configure Tailwind dark mode**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          heading: '#f0f6fc',
          muted: '#8b949e',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Add test script to package.json**

In `package.json`, add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Delete boilerplate**

Delete `src/app/page.tsx`, `src/app/globals.css` content (keep the file, clear it), and `public/` SVGs. We'll replace them.

Replace `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Verify setup compiles**

```bash
npm run build
```
Expected: build succeeds (may warn about missing pages — that's fine at this stage).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 project with Tailwind, next-intl, Vitest"
```

---

## Task 2: i18n Setup (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`
- Create: `src/messages/en.json`, `src/messages/pt.json`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create i18n routing config**

Create `src/i18n/routing.ts`:
```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
})
```

- [ ] **Step 2: Create i18n request config**

Create `src/i18n/request.ts`:
```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'pt')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create middleware**

Create `src/middleware.ts`:
```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: Create English messages**

Create `src/messages/en.json`:
```json
{
  "nav": {
    "questions": "Questions",
    "storytelling": "StoryTelling",
    "contribute": "Contribute",
    "support": "Support Us",
    "about": "About"
  },
  "home": {
    "title": "CodeQuestions",
    "tagline": "Master your tech interview. One question at a time.",
    "browse": "Browse Questions",
    "contribute": "Contribute",
    "howItWorks": "How it works",
    "step1Title": "Study",
    "step1Desc": "Read complete answers to the most asked interview questions.",
    "step2Title": "Test yourself",
    "step2Desc": "Use flashcards to check what you really know.",
    "step3Title": "Contribute",
    "step3Desc": "Add questions via Pull Request. It's open source."
  },
  "categories": {
    "frontend": "Frontend",
    "backend": "Backend",
    "devops": "DevOps",
    "data": "Data",
    "soft-skills": "Soft Skills",
    "architecture": "Architecture",
    "security": "Security"
  },
  "question": {
    "fullAnswer": "Full Answer",
    "quickAnswer": "Quick Answer for Interviewer",
    "flashcard": "Flashcard",
    "clickToFlip": "Click to reveal answer",
    "gotIt": "Got it!",
    "needReview": "Need more study",
    "difficulty": {
      "beginner": "Beginner",
      "intermediate": "Intermediate",
      "advanced": "Advanced"
    }
  },
  "progress": {
    "studied": "studied",
    "resetProgress": "Reset my progress",
    "resetConfirm": "Are you sure? This will clear all your progress."
  },
  "pages": {
    "faq": "FAQ",
    "about": "About",
    "contribute": "How to Contribute",
    "contact": "Contact",
    "support": "Support the Project",
    "storytelling": "StoryTelling Guide"
  },
  "footer": {
    "openSource": "Open source on GitHub",
    "madeWith": "Made with ❤️ for developers"
  }
}
```

- [ ] **Step 5: Create Portuguese messages**

Create `src/messages/pt.json`:
```json
{
  "nav": {
    "questions": "Perguntas",
    "storytelling": "StoryTelling",
    "contribute": "Contribuir",
    "support": "Apoie",
    "about": "Sobre"
  },
  "home": {
    "title": "CodeQuestions",
    "tagline": "Domine sua entrevista técnica. Uma pergunta por vez.",
    "browse": "Ver Perguntas",
    "contribute": "Contribuir",
    "howItWorks": "Como funciona",
    "step1Title": "Estude",
    "step1Desc": "Leia respostas completas para as perguntas mais feitas em entrevistas.",
    "step2Title": "Teste-se",
    "step2Desc": "Use os flashcards para checar o que você realmente sabe.",
    "step3Title": "Contribua",
    "step3Desc": "Adicione perguntas via Pull Request. É open source."
  },
  "categories": {
    "frontend": "Frontend",
    "backend": "Backend",
    "devops": "DevOps",
    "data": "Dados",
    "soft-skills": "Soft Skills",
    "architecture": "Arquitetura",
    "security": "Segurança"
  },
  "question": {
    "fullAnswer": "Resposta Completa",
    "quickAnswer": "Resposta Rápida para o Entrevistador",
    "flashcard": "Flashcard",
    "clickToFlip": "Clique para revelar a resposta",
    "gotIt": "Sei!",
    "needReview": "Preciso estudar",
    "difficulty": {
      "beginner": "Iniciante",
      "intermediate": "Intermediário",
      "advanced": "Avançado"
    }
  },
  "progress": {
    "studied": "estudadas",
    "resetProgress": "Resetar meu progresso",
    "resetConfirm": "Tem certeza? Isso vai apagar todo o seu progresso."
  },
  "pages": {
    "faq": "FAQ",
    "about": "Sobre",
    "contribute": "Como Contribuir",
    "contact": "Contato",
    "support": "Apoie o Projeto",
    "storytelling": "Guia de StoryTelling"
  },
  "footer": {
    "openSource": "Open source no GitHub",
    "madeWith": "Feito com ❤️ para desenvolvedores"
  }
}
```

- [ ] **Step 6: Update root layout**

Replace `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeQuestions — Tech Interview Prep',
  description: 'Open source collection of the most asked tech interview questions with complete answers, quick answers, and flashcards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-dark-bg text-dark-text min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Create locale layout**

Create `src/app/[locale]/layout.tsx`:
```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

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
      {children}
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 8: Create placeholder home page**

Create `src/app/[locale]/page.tsx`:
```typescript
export default function HomePage() {
  return <div className="p-8 text-dark-heading">CodeQuestions — coming soon</div>
}
```

- [ ] **Step 9: Verify i18n works**

```bash
npm run dev
```
Open `http://localhost:3000` — should show "CodeQuestions — coming soon".
Open `http://localhost:3000/pt` — same page, locale prefix working.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n with en/pt locales and middleware"
```

---

## Task 3: Theme System

**Files:**
- Create: `src/components/layout/ThemeProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ThemeProvider**

Create `src/components/layout/ThemeProvider.tsx`:
```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('cq_theme') as Theme | null
    const resolved = stored ?? 'dark'
    setTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('cq_theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 2: Wrap root layout with ThemeProvider**

Replace `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeQuestions — Tech Interview Prep',
  description: 'Open source collection of the most asked tech interview questions with complete answers, quick answers, and flashcards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-dark-bg text-gray-800 dark:text-dark-text min-h-screen transition-colors duration-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add dark/light theme system with localStorage persistence"
```

---

## Task 4: Content Library

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/__tests__/content.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/content.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseQuestionSlug, getCategoryFromPath, buildQuestionMeta } from '../content'

describe('parseQuestionSlug', () => {
  it('extracts category and slug from a path', () => {
    const result = parseQuestionSlug('frontend/javascript/let-const-var')
    expect(result).toEqual({ category: 'frontend', subcategory: 'javascript', slug: 'let-const-var' })
  })
})

describe('getCategoryFromPath', () => {
  it('returns the top-level category', () => {
    expect(getCategoryFromPath('frontend/javascript/let-const-var')).toBe('frontend')
  })
})

describe('buildQuestionMeta', () => {
  it('builds a QuestionMeta from frontmatter', () => {
    const fm = {
      title: 'let vs const',
      category: 'frontend',
      subcategory: 'javascript',
      tags: ['es6'],
      difficulty: 'beginner',
      lang: 'en',
    }
    const meta = buildQuestionMeta('let-const-var', fm)
    expect(meta.slug).toBe('let-const-var')
    expect(meta.title).toBe('let vs const')
    expect(meta.category).toBe('frontend')
    expect(meta.tags).toEqual(['es6'])
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL — "Cannot find module '../content'"

- [ ] **Step 3: Implement content.ts**

Create `src/lib/content.ts`:
```typescript
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

async function mdToHtml(markdown: string): Promise<string> {
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
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```
Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add content library for reading and parsing markdown question files"
```

---

## Task 5: Progress Library

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/lib/__tests__/progress.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/progress.test.ts`:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

import { getProgress, setProgress, resetProgress, getQuestionStatus, countProgress } from '../progress'

beforeEach(() => localStorage.clear())

describe('getProgress', () => {
  it('returns empty object when nothing stored', () => {
    expect(getProgress()).toEqual({})
  })
})

describe('setProgress', () => {
  it('saves a status for a question path', () => {
    setProgress('frontend/javascript/let-const-var', 'known')
    expect(getProgress()['frontend/javascript/let-const-var']).toBe('known')
  })

  it('overwrites an existing status', () => {
    setProgress('frontend/javascript/let-const-var', 'known')
    setProgress('frontend/javascript/let-const-var', 'review')
    expect(getProgress()['frontend/javascript/let-const-var']).toBe('review')
  })
})

describe('resetProgress', () => {
  it('clears all stored progress', () => {
    setProgress('frontend/javascript/let-const-var', 'known')
    resetProgress()
    expect(getProgress()).toEqual({})
  })
})

describe('getQuestionStatus', () => {
  it('returns null for unseen question', () => {
    expect(getQuestionStatus('frontend/javascript/let-const-var')).toBeNull()
  })

  it('returns the saved status', () => {
    setProgress('frontend/javascript/let-const-var', 'known')
    expect(getQuestionStatus('frontend/javascript/let-const-var')).toBe('known')
  })
})

describe('countProgress', () => {
  it('counts known questions for a category', () => {
    setProgress('frontend/javascript/let-const-var', 'known')
    setProgress('frontend/javascript/event-delegation', 'known')
    setProgress('frontend/react/hooks', 'review')
    expect(countProgress('frontend')).toEqual({ known: 2, review: 1 })
  })

  it('returns zeros for a category with no progress', () => {
    expect(countProgress('backend')).toEqual({ known: 0, review: 0 })
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: FAIL — "Cannot find module '../progress'"

- [ ] **Step 3: Implement progress.ts**

Create `src/lib/progress.ts`:
```typescript
const STORAGE_KEY = 'cq_progress'

export type QuestionStatus = 'known' | 'review'
export type ProgressStore = Record<string, QuestionStatus>

export function getProgress(): ProgressStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setProgress(questionPath: string, status: QuestionStatus): void {
  const store = getProgress()
  store[questionPath] = status
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getQuestionStatus(questionPath: string): QuestionStatus | null {
  return getProgress()[questionPath] ?? null
}

export function countProgress(category: string): { known: number; review: number } {
  const store = getProgress()
  let known = 0
  let review = 0
  for (const [path, status] of Object.entries(store)) {
    if (path.startsWith(category + '/')) {
      if (status === 'known') known++
      else if (status === 'review') review++
    }
  }
  return { known, review }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```
Expected: PASS — all tests passing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add localStorage progress library with status tracking"
```

---

## Task 6: Category Metadata

**Files:**
- Create: `src/lib/categories.ts`

- [ ] **Step 1: Create categories.ts**

Create `src/lib/categories.ts`:
```typescript
export type Category = {
  slug: string
  icon: string
  color: string
  borderColor: string
}

export const CATEGORIES: Category[] = [
  { slug: 'frontend',     icon: '⚛️',  color: 'text-blue-400',   borderColor: 'border-blue-500/30' },
  { slug: 'backend',      icon: '🖥️',  color: 'text-green-400',  borderColor: 'border-green-500/30' },
  { slug: 'devops',       icon: '🐳',  color: 'text-orange-400', borderColor: 'border-orange-500/30' },
  { slug: 'data',         icon: '📊',  color: 'text-purple-400', borderColor: 'border-purple-500/30' },
  { slug: 'soft-skills',  icon: '🗣️',  color: 'text-pink-400',   borderColor: 'border-pink-500/30' },
  { slug: 'architecture', icon: '🏗️',  color: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
  { slug: 'security',     icon: '🔒',  color: 'text-red-400',    borderColor: 'border-red-500/30' },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add category metadata (slugs, icons, colors)"
```

---

## Task 7: Layout Components (Header + Footer)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Create Header**

Create `src/components/layout/Header.tsx`:
```typescript
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from './ThemeProvider'

export function Header() {
  const t = useTranslations('nav')
  const { theme, toggle } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const otherLocale = locale === 'en' ? 'pt' : 'en'

  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)
    router.push(newPath)
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={`/${locale}${href}`}
      className="text-sm text-dark-muted hover:text-dark-heading dark:hover:text-dark-heading transition-colors"
    >
      {label}
    </Link>
  )

  return (
    <header className="border-b border-dark-border dark:border-dark-border bg-dark-surface dark:bg-dark-surface sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-mono font-bold text-blue-400 text-lg tracking-tight">
          codequestions
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLink('/questions', t('questions'))}
          {navLink('/storytelling', t('storytelling'))}
          {navLink('/contribute', t('contribute'))}
          {navLink('/support', t('support'))}
          {navLink('/about', t('about'))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-mono border border-dark-border rounded px-2 py-1 text-dark-muted hover:text-dark-heading transition-colors"
          >
            {otherLocale.toUpperCase()}
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded border border-dark-border text-dark-muted hover:text-dark-heading transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create Footer**

Create `src/components/layout/Footer.tsx`:
```typescript
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t border-dark-border mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-muted">
        <p>{t('madeWith')}</p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/your-org/codequestions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-dark-heading transition-colors"
          >
            {t('openSource')} ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

**Note:** Replace `your-org/codequestions` with the real GitHub URL when the repo is created.

- [ ] **Step 3: Add Header + Footer to locale layout**

Replace `src/app/[locale]/layout.tsx`:
```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```
Open `http://localhost:3000` — should see the header with "codequestions" logo, nav links, locale toggle, theme toggle, and footer.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Header and Footer layout components"
```

---

## Task 8: UI Components (Badge, Button, ProgressBadge)

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/questions/ProgressBadge.tsx`

- [ ] **Step 1: Create Badge**

Create `src/components/ui/Badge.tsx`:
```typescript
type BadgeProps = {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'orange' | 'gray'
}

const variants = {
  blue:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  gray:   'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono ${variants[variant]}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Create Button**

Create `src/components/ui/Button.tsx`:
```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white',
  secondary: 'bg-dark-surface border border-dark-border text-dark-text hover:border-blue-500/50',
  ghost:     'text-dark-muted hover:text-dark-heading',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Create ProgressBadge**

Create `src/components/questions/ProgressBadge.tsx`:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { countProgress } from '@/lib/progress'

type Props = {
  category: string
  total: number
}

export function ProgressBadge({ category, total }: Props) {
  const [known, setKnown] = useState(0)

  useEffect(() => {
    const { known: k } = countProgress(category)
    setKnown(k)
  }, [category])

  if (known === 0) return null

  return (
    <span className="text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
      {known}/{total}
    </span>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Badge, Button, and ProgressBadge UI components"
```

---

## Task 9: Home Page

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Implement Home page**

Replace `src/app/[locale]/page.tsx`:
```typescript
import { useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'

export default async function HomePage() {
  const t = useTranslations('home')
  const locale = await getLocale()

  const featuredCategories = CATEGORIES.slice(0, 3)
  const categoryCounts = await Promise.all(
    featuredCategories.map(async c => ({
      ...c,
      count: getAllQuestionMeta(locale, c.slug).length,
    }))
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="font-mono text-5xl font-bold text-blue-400 mb-4">
          codequestions
        </h1>
        <p className="text-xl text-dark-muted mb-8 max-w-xl mx-auto">
          {t('tagline')}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/${locale}/questions`}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded transition-colors"
          >
            {t('browse')}
          </Link>
          <Link
            href={`/${locale}/contribute`}
            className="border border-dark-border hover:border-blue-500/50 text-dark-text px-6 py-3 rounded transition-colors"
          >
            {t('contribute')}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-20">
        <h2 className="text-center text-sm font-mono uppercase tracking-widest text-dark-muted mb-10">
          {t('howItWorks')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: t('step1Title'), desc: t('step1Desc'), icon: '📖', num: '01' },
            { title: t('step2Title'), desc: t('step2Desc'), icon: '🃏', num: '02' },
            { title: t('step3Title'), desc: t('step3Desc'), icon: '🔀', num: '03' },
          ].map(step => (
            <div key={step.num} className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <div className="font-mono text-xs text-dark-muted mb-3">{step.num}</div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-dark-heading mb-2">{step.title}</h3>
              <p className="text-sm text-dark-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {categoryCounts.map(cat => (
            <Link
              key={cat.slug}
              href={`/${locale}/questions/${cat.slug}`}
              className={`bg-dark-surface border ${cat.borderColor} rounded-lg p-6 hover:border-opacity-60 transition-colors group`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className={`font-mono font-semibold ${cat.color} mb-1`}>{cat.slug}</div>
              <div className="text-xs text-dark-muted">{cat.count} questions</div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href={`/${locale}/questions`} className="text-sm text-blue-400 hover:underline">
            View all categories →
          </Link>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
        <h2 className="text-dark-heading font-semibold text-lg mb-2">
          Know a question that's missing?
        </h2>
        <p className="text-dark-muted text-sm mb-6 max-w-md mx-auto">
          CodeQuestions is open source. Add questions by submitting a Pull Request — just edit a markdown file.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href={`/${locale}/contribute`} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded transition-colors">
            How to contribute
          </Link>
          <Link href={`/${locale}/support`} className="border border-dark-border text-dark-muted hover:text-dark-heading text-sm px-5 py-2 rounded transition-colors">
            Support the project
          </Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```
Open `http://localhost:3000` — should redirect to `/en` and show the home page with hero, 3 steps, category cards, and contribute CTA.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement home page with hero, how-it-works, and contribute CTA"
```

---

## Task 10: Sample Content (MD Files)

**Files:**
- Create: multiple `.md` files under `src/content/`

- [ ] **Step 1: Create content directory structure**

```bash
mkdir -p src/content/en/frontend/javascript
mkdir -p src/content/en/frontend/react
mkdir -p src/content/en/backend/node
mkdir -p src/content/en/soft-skills
mkdir -p src/content/pt/frontend/javascript
mkdir -p src/content/pt/soft-skills
```

- [ ] **Step 2: Create first English question**

Create `src/content/en/frontend/javascript/let-const-var.md`:
```markdown
---
title: "What is the difference between let, const, and var?"
category: frontend
subcategory: javascript
tags: [es6, scope, hoisting, variables]
difficulty: beginner
lang: en
---

## Full Answer

JavaScript has three ways to declare variables: `var`, `let`, and `const`. They differ in scope, hoisting behavior, and mutability.

**var**
- Function-scoped (or globally scoped if declared outside a function)
- Hoisted to the top of its scope and initialized as `undefined`
- Can be redeclared and reassigned

```js
var x = 1
var x = 2 // allowed
```

**let**
- Block-scoped (limited to the `{}` block it is declared in)
- Hoisted but NOT initialized — accessing it before declaration throws a `ReferenceError` (Temporal Dead Zone)
- Cannot be redeclared in the same scope, but can be reassigned

```js
let y = 1
let y = 2 // SyntaxError
y = 3     // OK
```

**const**
- Block-scoped, same as `let`
- Cannot be redeclared or reassigned — the binding is constant
- Objects and arrays declared with `const` are still mutable (their contents can change)

```js
const z = 1
z = 2 // TypeError

const obj = { a: 1 }
obj.a = 2 // OK — the object itself is mutable
```

**Rule of thumb:** prefer `const` by default, use `let` when you need to reassign, avoid `var`.

## Quick Answer

`var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped with a Temporal Dead Zone. `const` prevents reassignment; `let` allows it. Prefer `const` by default.

## Flashcard

**Q:** What are the three key differences between `var`, `let`, and `const`?

**A:** 1) Scope — `var` is function-scoped, `let`/`const` are block-scoped. 2) Hoisting — `var` initializes as `undefined`, `let`/`const` enter the Temporal Dead Zone. 3) Reassignment — `const` forbids it, `let` and `var` allow it.
```

- [ ] **Step 3: Create second English question**

Create `src/content/en/frontend/javascript/event-delegation.md`:
```markdown
---
title: "What is event delegation?"
category: frontend
subcategory: javascript
tags: [dom, events, performance, bubbling]
difficulty: intermediate
lang: en
---

## Full Answer

Event delegation is a pattern where a single event listener is placed on a **parent element** to handle events triggered by its **child elements**, instead of attaching individual listeners to each child.

It works because of **event bubbling**: when an event fires on a child, it bubbles up through the DOM to parent elements. The parent listener can inspect `event.target` to determine which child triggered the event.

**Example:**
```js
// Without delegation — one listener per button
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// With delegation — one listener on the parent
document.getElementById('button-list').addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    handleClick(e)
  }
})
```

**Benefits:**
- Fewer event listeners → less memory usage
- Works for dynamically added children (no need to reattach listeners)
- Simpler cleanup (remove one listener instead of many)

**When not to use it:** events that don't bubble (e.g., `focus`, `blur`) require `focusin`/`focusout` instead, or `addEventListener` with `useCapture: true`.

## Quick Answer

Event delegation attaches one listener to a parent element that handles events from its children via bubbling, checking `event.target` to identify the source. It reduces memory usage and works for dynamically added elements.

## Flashcard

**Q:** What is event delegation and why is it useful?

**A:** Placing a single event listener on a parent to handle events from children via bubbling. Useful because it reduces listener count, saves memory, and automatically handles dynamically added children.
```

- [ ] **Step 4: Create a React question**

Create `src/content/en/frontend/react/hooks.md`:
```markdown
---
title: "What are React Hooks and why were they introduced?"
category: frontend
subcategory: react
tags: [hooks, useState, useEffect, functional-components]
difficulty: beginner
lang: en
---

## Full Answer

React Hooks are functions that let you use React state and lifecycle features inside **functional components**, without writing a class component.

Introduced in React 16.8, they solve three main problems with class components:

1. **Reusing stateful logic** — before Hooks, sharing stateful logic required patterns like render props or HOCs, which add wrapper components. Hooks let you extract stateful logic into a custom Hook and reuse it directly.

2. **Complex components** — lifecycle methods like `componentDidMount` forced unrelated logic to live together. `useEffect` lets you co-locate related side effects.

3. **Classes are confusing** — `this` binding, event handler binding, and the distinction between class and function components created a learning curve. Hooks eliminate all of that.

**Core Hooks:**
- `useState` — local state in a functional component
- `useEffect` — side effects (data fetching, subscriptions, DOM updates)
- `useContext` — consume a React context
- `useRef` — mutable ref that persists across renders without causing re-renders
- `useMemo` / `useCallback` — memoization for performance optimization

**Rules of Hooks:**
1. Only call Hooks at the top level (not inside loops, conditions, or nested functions)
2. Only call Hooks from React functions (components or custom Hooks)

## Quick Answer

Hooks let functional components use state and lifecycle features previously only available in class components. They were introduced in React 16.8 to simplify code reuse, co-locate related logic, and eliminate class complexity.

## Flashcard

**Q:** What problem did React Hooks solve?

**A:** They let functional components use state and lifecycle features without classes, solving three issues: (1) difficulty reusing stateful logic, (2) unrelated code mixed in lifecycle methods, (3) `this` binding confusion in classes.
```

- [ ] **Step 5: Create a Backend question**

Create `src/content/en/backend/node/event-loop.md`:
```markdown
---
title: "How does the Node.js event loop work?"
category: backend
subcategory: node
tags: [event-loop, async, non-blocking, libuv]
difficulty: intermediate
lang: en
---

## Full Answer

The Node.js event loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel or libuv thread pool and resumes execution when they complete.

**Phases of the event loop (in order):**

1. **timers** — executes `setTimeout` and `setInterval` callbacks whose delay has elapsed
2. **pending callbacks** — I/O callbacks deferred from the previous loop iteration
3. **idle, prepare** — internal use only
4. **poll** — retrieves new I/O events; blocks here if the queue is empty (waiting for I/O)
5. **check** — executes `setImmediate` callbacks
6. **close callbacks** — handles `close` events (e.g., `socket.on('close', ...)`)

Between each phase, Node.js checks for `process.nextTick` and Promise microtask queues and drains them completely before moving to the next phase.

**Key takeaway:** `process.nextTick` runs before any I/O, before `setImmediate`. `setImmediate` runs in the check phase, after I/O. `setTimeout(fn, 0)` runs in the timers phase.

## Quick Answer

The event loop processes callbacks across 6 phases (timers → pending I/O → poll → check → close), draining microtasks (`nextTick`, Promises) between each phase. It allows Node.js to handle concurrent I/O without threads by deferring work to the OS/libuv.

## Flashcard

**Q:** What is the order of `process.nextTick`, `Promise.then`, `setImmediate`, and `setTimeout(fn, 0)` in the event loop?

**A:** `process.nextTick` → `Promise.then` (both are microtasks, before next phase) → `setTimeout(fn, 0)` (timers phase) → `setImmediate` (check phase, after I/O poll).
```

- [ ] **Step 6: Create Portuguese translation of first question**

Create `src/content/pt/frontend/javascript/let-const-var.md`:
```markdown
---
title: "Qual é a diferença entre let, const e var?"
category: frontend
subcategory: javascript
tags: [es6, escopo, hoisting, variáveis]
difficulty: beginner
lang: pt
---

## Full Answer

JavaScript tem três formas de declarar variáveis: `var`, `let` e `const`. Elas diferem em escopo, comportamento de hoisting e mutabilidade.

**var**
- Escopo de função (ou escopo global se declarada fora de uma função)
- Sofre hoisting para o topo do seu escopo e é inicializada como `undefined`
- Pode ser redeclarada e reatribuída

```js
var x = 1
var x = 2 // permitido
```

**let**
- Escopo de bloco (limitado ao bloco `{}` em que foi declarada)
- Sofre hoisting mas NÃO é inicializada — acessá-la antes da declaração lança `ReferenceError` (Temporal Dead Zone)
- Não pode ser redeclarada no mesmo escopo, mas pode ser reatribuída

```js
let y = 1
let y = 2 // SyntaxError
y = 3     // OK
```

**const**
- Escopo de bloco, igual ao `let`
- Não pode ser redeclarada nem reatribuída — o vínculo é constante
- Objetos e arrays declarados com `const` ainda são mutáveis (seus conteúdos podem mudar)

```js
const z = 1
z = 2 // TypeError

const obj = { a: 1 }
obj.a = 2 // OK — o objeto em si é mutável
```

**Regra geral:** prefira `const` por padrão, use `let` quando precisar reatribuir, evite `var`.

## Quick Answer

`var` tem escopo de função e sofre hoisting como `undefined`; `let` e `const` têm escopo de bloco com Temporal Dead Zone. `const` impede reatribuição; `let` permite. Prefira `const` por padrão.

## Flashcard

**P:** Quais são as três diferenças principais entre `var`, `let` e `const`?

**R:** 1) Escopo — `var` é de função, `let`/`const` são de bloco. 2) Hoisting — `var` inicializa como `undefined`, `let`/`const` entram na Temporal Dead Zone. 3) Reatribuição — `const` proíbe, `let` e `var` permitem.
```

- [ ] **Step 7: Verify content is read correctly**

```bash
npm run dev
```
No visual change yet, but content files should be parseable. We'll verify in Task 12 when the question page is built.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add initial sample content (5 questions in en/pt)"
```

---

## Task 11: Category Hub Page

**Files:**
- Create: `src/components/questions/CategoryCard.tsx`
- Create: `src/app/[locale]/questions/page.tsx`

- [ ] **Step 1: Create CategoryCard**

Create `src/components/questions/CategoryCard.tsx`:
```typescript
'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ProgressBadge } from './ProgressBadge'
import type { Category } from '@/lib/categories'

type Props = {
  category: Category
  label: string
  count: number
}

export function CategoryCard({ category, label, count }: Props) {
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/questions/${category.slug}`}
      className={`block bg-dark-surface border ${category.borderColor} rounded-lg p-6 hover:border-opacity-60 transition-all group`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{category.icon}</span>
        <ProgressBadge category={category.slug} total={count} />
      </div>
      <div className={`font-mono font-bold text-lg ${category.color} mb-1 group-hover:opacity-80`}>
        {label}
      </div>
      <div className="text-sm text-dark-muted">{count} questions</div>
    </Link>
  )
}
```

- [ ] **Step 2: Create Category Hub page**

Create `src/app/[locale]/questions/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'
import { CATEGORIES } from '@/lib/categories'
import { getAllQuestionMeta } from '@/lib/content'
import { CategoryCard } from '@/components/questions/CategoryCard'

export default async function QuestionsPage() {
  const t = await getTranslations()
  const locale = await getLocale()

  const categoriesWithCount = CATEGORIES.map(cat => ({
    cat,
    label: t(`categories.${cat.slug}`),
    count: getAllQuestionMeta(locale, cat.slug).length,
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">
        Interview Questions
      </h1>
      <p className="text-dark-muted mb-10">
        Browse by category. Click a card to see all questions.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesWithCount.map(({ cat, label, count }) => (
          <CategoryCard key={cat.slug} category={cat} label={label} count={count} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/questions` — should see 7 category cards with icons, names, and question counts.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement category hub page with CategoryCard components"
```

---

## Task 12: Question List Page

**Files:**
- Create: `src/components/questions/QuestionCard.tsx`
- Create: `src/app/[locale]/questions/[category]/page.tsx`

- [ ] **Step 1: Create QuestionCard**

Create `src/components/questions/QuestionCard.tsx`:
```typescript
'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { getQuestionStatus } from '@/lib/progress'
import { Badge } from '@/components/ui/Badge'
import type { QuestionMeta } from '@/lib/content'

type Props = {
  question: QuestionMeta
}

const difficultyVariant: Record<string, 'blue' | 'green' | 'orange'> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'orange',
}

export function QuestionCard({ question }: Props) {
  const locale = useLocale()
  const [status, setStatus] = useState<'known' | 'review' | null>(null)

  useEffect(() => {
    setStatus(getQuestionStatus(question.path))
  }, [question.path])

  return (
    <Link
      href={`/${locale}/questions/${question.category}/${question.slug}`}
      className="block bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-blue-500/40 transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-dark-heading font-medium group-hover:text-blue-400 transition-colors truncate">
            {question.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
              {question.difficulty}
            </Badge>
            {question.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="gray">{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 text-lg">
          {status === 'known' && <span title="Got it">✅</span>}
          {status === 'review' && <span title="Needs review">🔄</span>}
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create Question List page**

Create `src/app/[locale]/questions/[category]/page.tsx`:
```typescript
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAllQuestionMeta } from '@/lib/content'
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories'
import { QuestionCard } from '@/components/questions/QuestionCard'

type Props = {
  params: Promise<{ locale: string; category: string }>
}

export async function generateStaticParams() {
  const locales = ['en', 'pt']
  return CATEGORIES.flatMap(cat =>
    locales.map(locale => ({ locale, category: cat.slug }))
  )
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const locale = await getLocale()
  const t = await getTranslations()

  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const questions = getAllQuestionMeta(locale, category)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/${locale}/questions`} className="text-dark-muted hover:text-dark-heading text-sm">
          ← All categories
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className={`font-mono text-3xl font-bold ${cat.color}`}>
            {t(`categories.${cat.slug}`)}
          </h1>
          <p className="text-dark-muted text-sm mt-1">{questions.length} questions</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 text-dark-muted">
          <p className="mb-4">No questions yet for this category in this language.</p>
          <Link href={`/${locale}/contribute`} className="text-blue-400 hover:underline">
            Be the first to contribute →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map(q => (
            <QuestionCard key={q.slug} question={q} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/questions/frontend` — should show the Frontend category with 2 JavaScript questions and 1 React question listed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement question list page with status icons and QuestionCard"
```

---

## Task 13: FlashCard Component

**Files:**
- Create: `src/components/questions/FlashCard.tsx`

- [ ] **Step 1: Create FlashCard**

Create `src/components/questions/FlashCard.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { setProgress } from '@/lib/progress'
import { Button } from '@/components/ui/Button'

type Props = {
  questionPath: string
  front: string
  back: string
}

export function FlashCard({ questionPath, front, back }: Props) {
  const t = useTranslations('question')
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState<'known' | 'review' | null>(null)

  const handleGotIt = () => {
    setProgress(questionPath, 'known')
    setAnswered('known')
  }

  const handleNeedReview = () => {
    setProgress(questionPath, 'review')
    setAnswered('review')
  }

  const reset = () => {
    setFlipped(false)
    setAnswered(null)
  }

  return (
    <div className="select-none">
      <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-3">
        {t('flashcard')}
      </p>

      {/* Card container with 3D perspective */}
      <div
        className="relative cursor-pointer"
        style={{ perspective: '1000px', minHeight: '120px' }}
        onClick={() => !answered && setFlipped(f => !f)}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            minHeight: '120px',
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="absolute inset-0 bg-dark-surface border border-blue-500/30 rounded-lg p-4 flex flex-col justify-between"
          >
            <p className="text-dark-heading text-sm font-medium">{front}</p>
            {!flipped && (
              <p className="text-xs text-dark-muted mt-3">{t('clickToFlip')}</p>
            )}
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 bg-dark-surface border border-green-500/30 rounded-lg p-4 flex flex-col justify-between"
          >
            <p className="text-dark-text text-sm">{back}</p>

            {flipped && !answered && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={e => { e.stopPropagation(); handleNeedReview() }}
                  className="flex-1 border-orange-500/30 text-orange-400 hover:border-orange-500/60"
                >
                  ↺ {t('needReview')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={e => { e.stopPropagation(); handleGotIt() }}
                  className="flex-1 border-green-500/30 text-green-400 hover:border-green-500/60"
                >
                  ✓ {t('gotIt')}
                </Button>
              </div>
            )}

            {answered && (
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-mono ${answered === 'known' ? 'text-green-400' : 'text-orange-400'}`}>
                  {answered === 'known' ? `✓ ${t('gotIt')}` : `↺ ${t('needReview')}`}
                </span>
                <button onClick={e => { e.stopPropagation(); reset() }} className="text-xs text-dark-muted hover:text-dark-heading">
                  reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add FlashCard component with 3D flip animation and progress tracking"
```

---

## Task 14: Question Detail Page (Split View)

**Files:**
- Create: `src/components/questions/QuestionSplitView.tsx`
- Create: `src/components/ui/MarkdownRenderer.tsx`
- Create: `src/app/[locale]/questions/[category]/[slug]/page.tsx`

- [ ] **Step 1: Create MarkdownRenderer**

Create `src/components/ui/MarkdownRenderer.tsx`:
```typescript
type Props = {
  html: string
  className?: string
}

export function MarkdownRenderer({ html, className = '' }: Props) {
  return (
    <div
      className={`prose prose-invert prose-sm max-w-none
        prose-headings:font-mono prose-headings:text-dark-heading
        prose-p:text-dark-text prose-p:leading-relaxed
        prose-code:text-blue-400 prose-code:bg-dark-surface prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-dark-surface prose-pre:border prose-pre:border-dark-border prose-pre:rounded-lg
        prose-strong:text-dark-heading
        prose-li:text-dark-text
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 2: Install Tailwind Typography plugin**

```bash
npm install -D @tailwindcss/typography
```

Update `tailwind.config.ts` plugins array:
```typescript
plugins: [require('@tailwindcss/typography')],
```

- [ ] **Step 3: Create QuestionSplitView**

Create `src/components/questions/QuestionSplitView.tsx`:
```typescript
'use client'

import { useTranslations } from 'next-intl'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { FlashCard } from './FlashCard'

type Props = {
  questionPath: string
  fullAnswer: string
  quickAnswer: string
  flashcardFront: string
  flashcardBack: string
}

export function QuestionSplitView({
  questionPath,
  fullAnswer,
  quickAnswer,
  flashcardFront,
  flashcardBack,
}: Props) {
  const t = useTranslations('question')

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Full Answer */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-4">
          {t('fullAnswer')}
        </p>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <MarkdownRenderer html={fullAnswer} />
        </div>
      </div>

      {/* Right: Quick Answer + Flashcard */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        {/* Quick Answer */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-dark-muted mb-3">
            {t('quickAnswer')}
          </p>
          <div className="bg-dark-surface border-l-2 border-l-green-500 border border-dark-border rounded-lg p-4">
            <MarkdownRenderer html={quickAnswer} />
          </div>
        </div>

        {/* Flashcard */}
        <FlashCard
          questionPath={questionPath}
          front={flashcardFront}
          back={flashcardBack}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Question Detail page**

Create `src/app/[locale]/questions/[category]/[slug]/page.tsx`:
```typescript
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
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'orange',
}

export default async function QuestionPage({ params }: Props) {
  const { category, slug } = await params
  const locale = await getLocale()
  const t = await getTranslations()

  const question = await getQuestion(locale, category, slug)
  if (!question) notFound()

  const cat = getCategoryBySlug(category)

  // Extract question and answer from flashcard content (split on **A:** or **R:**)
  const flashcardParts = question.flashcard
    .replace(/<[^>]+>/g, '')
    .split(/\*\*[AR]:\*\*/)
  const flashcardFront = flashcardParts[0]?.replace(/\*\*[QP]:\*\*/g, '').trim() ?? question.title
  const flashcardBack = flashcardParts[1]?.trim() ?? ''

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-muted mb-8">
        <Link href={`/${locale}/questions`} className="hover:text-dark-heading">Questions</Link>
        <span>/</span>
        <Link href={`/${locale}/questions/${category}`} className={`hover:text-dark-heading ${cat?.color ?? ''}`}>
          {t(`categories.${category}`)}
        </Link>
        <span>/</span>
        <span className="text-dark-text truncate">{question.title}</span>
      </div>

      {/* Question header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-heading mb-4">{question.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={difficultyVariant[question.difficulty] ?? 'gray'}>
            {t(`question.difficulty.${question.difficulty}`)}
          </Badge>
          {question.tags.map(tag => (
            <Badge key={tag} variant="gray">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Split view content */}
      <QuestionSplitView
        questionPath={question.path}
        fullAnswer={question.fullAnswer}
        quickAnswer={question.quickAnswer}
        flashcardFront={flashcardFront}
        flashcardBack={flashcardBack}
      />
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Open `http://localhost:3000/questions/frontend/javascript/let-const-var` — should see the split view layout with the full answer on the left, quick answer and flip card on the right.

Test the flip card: click it, see the answer, click "Got it!" — then go back to the category page and verify the ✅ appears on the question card.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement question detail split view with MarkdownRenderer and FlashCard"
```

---

## Task 15: Static Pages

**Files:**
- Create: `src/app/[locale]/faq/page.tsx`
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/contribute/page.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/support/page.tsx`
- Create: `src/app/[locale]/storytelling/page.tsx`

- [ ] **Step 1: Create shared StaticPage wrapper**

Create `src/components/ui/StaticPage.tsx`:
```typescript
import { MarkdownRenderer } from './MarkdownRenderer'

type Props = {
  title: string
  subtitle?: string
  html: string
}

export function StaticPage({ title, subtitle, html }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{title}</h1>
      {subtitle && <p className="text-dark-muted mb-10">{subtitle}</p>}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
        <MarkdownRenderer html={html} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FAQ page**

Create `src/app/[locale]/faq/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { StaticPage } from '@/components/ui/StaticPage'

const FAQ_EN = `
## What is CodeQuestions?

CodeQuestions is a free, open-source portal with the most asked questions in tech interviews. Each question has a complete answer, a brief interviewer-ready answer, and an interactive flashcard.

## Who can contribute?

Anyone! CodeQuestions is open source. Submit questions by opening a Pull Request on GitHub. See the [Contribute](/en/contribute) page for instructions.

## What languages are supported?

English and Portuguese. Questions can be submitted in either language — you don't need to provide both.

## Is there a mobile app?

Not yet. The web portal is fully responsive and works great on mobile browsers.

## How is my progress stored?

Your study progress (Got it / Needs review) is stored locally in your browser using localStorage. It's private and never sent to any server.

## How can I support the project?

Visit the [Support](/en/support) page. Contributions via GitHub Sponsors, Ko-fi, or Pix are deeply appreciated.
`

const FAQ_PT = `
## O que é o CodeQuestions?

CodeQuestions é um portal gratuito e open source com as perguntas mais feitas em entrevistas de tecnologia. Cada pergunta tem uma resposta completa, uma resposta breve para o entrevistador e um flashcard interativo.

## Quem pode contribuir?

Qualquer pessoa! CodeQuestions é open source. Envie perguntas abrindo um Pull Request no GitHub. Veja a página [Contribuir](/pt/contribute) para instruções.

## Quais idiomas são suportados?

Inglês e português. Perguntas podem ser submetidas em qualquer um dos idiomas — não é necessário fornecer os dois.

## Existe um app mobile?

Ainda não. O portal web é totalmente responsivo e funciona bem em navegadores mobile.

## Como meu progresso é salvo?

Seu progresso de estudo (Sei! / Preciso estudar) é salvo localmente no seu navegador usando localStorage. É privado e nunca enviado para nenhum servidor.

## Como posso apoiar o projeto?

Visite a página [Apoie](/pt/support). Contribuições via GitHub Sponsors, Ko-fi ou Pix são muito apreciadas.
`

async function mdToHtml(md: string) {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(md)
  return result.toString()
}

export default async function FaqPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? FAQ_PT : FAQ_EN)
  return <StaticPage title={t('faq')} html={html} />
}
```

- [ ] **Step 3: Create About page**

Create `src/app/[locale]/about/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { StaticPage } from '@/components/ui/StaticPage'

const ABOUT_EN = `
## What is CodeQuestions?

CodeQuestions is an open-source interview preparation portal built by developers, for developers. It started as a personal project to organize the questions that come up over and over in tech interviews — and grew into a community resource.

## Why open source?

Because the best content comes from people who've been in the room. Every developer who has gone through an interview has something to share. An open PR-based model means the content stays current and community-validated.

## The project

- All content lives in Markdown files in the GitHub repository
- No database, no backend — just a static Next.js site deployed on Vercel
- Anyone can contribute by opening a Pull Request
- Content is available in English and Portuguese

## Get involved

- **Contribute questions:** [How to contribute](/en/contribute)
- **Report issues:** Open an issue on GitHub
- **Support the project:** [Support page](/en/support)
`

const ABOUT_PT = `
## O que é o CodeQuestions?

CodeQuestions é um portal open source de preparação para entrevistas criado por desenvolvedores, para desenvolvedores. Começou como um projeto pessoal para organizar as perguntas que aparecem repetidamente em entrevistas de tecnologia — e cresceu para se tornar um recurso da comunidade.

## Por que open source?

Porque o melhor conteúdo vem de pessoas que estiveram na sala. Todo desenvolvedor que passou por uma entrevista tem algo a compartilhar. Um modelo baseado em PRs significa que o conteúdo fica atualizado e validado pela comunidade.

## O projeto

- Todo o conteúdo fica em arquivos Markdown no repositório do GitHub
- Sem banco de dados, sem backend — apenas um site Next.js estático hospedado no Vercel
- Qualquer pessoa pode contribuir abrindo um Pull Request
- O conteúdo está disponível em inglês e português

## Participe

- **Contribuir com perguntas:** [Como contribuir](/pt/contribute)
- **Reportar problemas:** Abra uma issue no GitHub
- **Apoiar o projeto:** [Página de apoio](/pt/support)
`

async function mdToHtml(md: string) {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(md)
  return result.toString()
}

export default async function AboutPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? ABOUT_PT : ABOUT_EN)
  return <StaticPage title={t('about')} html={html} />
}
```

- [ ] **Step 4: Create Contribute page**

Create `src/app/[locale]/contribute/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { StaticPage } from '@/components/ui/StaticPage'

const CONTRIBUTE_EN = `
## How to contribute

Contributing to CodeQuestions is easy — you just need to know how to edit a Markdown file and open a GitHub Pull Request.

## Step 1: Fork the repository

Go to the [CodeQuestions GitHub repository](https://github.com/your-org/codequestions) and click **Fork**.

## Step 2: Create a new branch

\`\`\`bash
git checkout -b add/frontend-javascript-closures
\`\`\`

## Step 3: Add your question

Create a new \`.md\` file in the correct folder:

\`\`\`
src/content/en/frontend/javascript/closures.md
\`\`\`

Use this template:

\`\`\`markdown
---
title: "What is a closure in JavaScript?"
category: frontend
subcategory: javascript
tags: [closures, scope, functions]
difficulty: intermediate
lang: en
---

## Full Answer

Your complete answer here...

## Quick Answer

One or two sentences for the interviewer.

## Flashcard

**Q:** What is a closure?

**A:** A function that retains access to its outer scope even after the outer function has returned.
\`\`\`

## Step 4: Open a Pull Request

Push your branch and open a PR against \`main\`. A maintainer will review and merge it.

## Rules

- Questions must be in **English** or **Portuguese**
- All required frontmatter fields must be present
- The three sections (**Full Answer**, **Quick Answer**, **Flashcard**) are required
- Mind Map section is optional
- Be respectful and accurate — cite sources when relevant
`

const CONTRIBUTE_PT = `
## Como contribuir

Contribuir com o CodeQuestions é simples — você só precisa saber editar um arquivo Markdown e abrir um Pull Request no GitHub.

## Passo 1: Faça um fork do repositório

Vá ao [repositório do CodeQuestions no GitHub](https://github.com/your-org/codequestions) e clique em **Fork**.

## Passo 2: Crie um novo branch

\`\`\`bash
git checkout -b add/frontend-javascript-closures
\`\`\`

## Passo 3: Adicione sua pergunta

Crie um novo arquivo \`.md\` na pasta correta:

\`\`\`
src/content/pt/frontend/javascript/closures.md
\`\`\`

Use este template:

\`\`\`markdown
---
title: "O que é um closure em JavaScript?"
category: frontend
subcategory: javascript
tags: [closures, escopo, funções]
difficulty: intermediate
lang: pt
---

## Full Answer

Sua resposta completa aqui...

## Quick Answer

Uma ou duas frases para o entrevistador.

## Flashcard

**P:** O que é um closure?

**R:** Uma função que mantém acesso ao seu escopo externo mesmo após a função externa ter retornado.
\`\`\`

## Passo 4: Abra um Pull Request

Faça push do seu branch e abra um PR contra \`main\`. Um mantenedor vai revisar e fazer o merge.

## Regras

- As perguntas devem estar em **inglês** ou **português**
- Todos os campos obrigatórios do frontmatter devem estar presentes
- As três seções (**Full Answer**, **Quick Answer**, **Flashcard**) são obrigatórias
- A seção Mind Map é opcional
- Seja respeitoso e preciso — cite fontes quando relevante
`

async function mdToHtml(md: string) {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(md)
  return result.toString()
}

export default async function ContributePage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()
  const html = await mdToHtml(locale === 'pt' ? CONTRIBUTE_PT : CONTRIBUTE_EN)
  return <StaticPage title={t('contribute')} html={html} />
}
```

- [ ] **Step 5: Create Contact page**

Create `src/app/[locale]/contact/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'

export default async function ContactPage() {
  const t = await getTranslations('pages')
  const locale = await getLocale()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{t('contact')}</h1>
      <p className="text-dark-muted mb-10">
        {locale === 'pt'
          ? 'Tem uma dúvida, sugestão ou encontrou um problema?'
          : 'Have a question, suggestion, or found an issue?'}
      </p>

      <div className="flex flex-col gap-4">
        <a
          href="mailto:contact@codequestions.dev"
          className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-blue-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">✉️</span>
          <div>
            <div className="font-medium text-dark-heading group-hover:text-blue-400 transition-colors">
              {locale === 'pt' ? 'Enviar um email' : 'Send an email'}
            </div>
            <div className="text-sm text-dark-muted">contact@codequestions.dev</div>
          </div>
        </a>

        <a
          href="https://github.com/your-org/codequestions/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-surface border border-dark-border rounded-lg p-6 hover:border-blue-500/40 transition-colors flex items-center gap-4 group"
        >
          <span className="text-3xl">🐛</span>
          <div>
            <div className="font-medium text-dark-heading group-hover:text-blue-400 transition-colors">
              {locale === 'pt' ? 'Abrir uma issue no GitHub' : 'Open a GitHub issue'}
            </div>
            <div className="text-sm text-dark-muted">
              {locale === 'pt' ? 'Para bugs, sugestões e melhorias' : 'For bugs, suggestions, and improvements'}
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create Support page**

Create `src/app/[locale]/support/page.tsx`:
```typescript
import { getTranslations, getLocale } from 'next-intl/server'

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
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">🇧🇷</span>
            <div>
              <div className="font-medium text-dark-heading">Pix</div>
              <div className="text-sm text-dark-muted">{isPt ? 'Para contribuidores brasileiros' : 'For Brazilian contributors'}</div>
            </div>
          </div>
          <div className="bg-dark-bg border border-dark-border rounded p-3 font-mono text-sm text-dark-muted">
            contact@codequestions.dev
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create StoryTelling page**

Create `src/app/[locale]/storytelling/page.tsx`:
```typescript
import { getLocale, getTranslations } from 'next-intl/server'
import { getQuestion } from '@/lib/content'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

const FALLBACK_EN = `
## What is StoryTelling in interviews?

StoryTelling is the technique of presenting your professional experience as a coherent narrative rather than a list of facts. HR interviews are not technical — they are designed to understand who you are, how you think, and how you work with others.

## The STAR Method

Use STAR to structure every behavioral answer:

- **S**ituation — Set the context. Where were you, what was the project?
- **T**ask — What was your responsibility or challenge?
- **A**ction — What did YOU specifically do? (Use "I", not "we")
- **R**esult — What was the outcome? Quantify when possible.

## Common HR Questions

**"Tell me about yourself."**
This is not a life story. It is a 2-minute professional pitch: current role → relevant experience → why this company.

**"Why do you want to leave your current job?"**
Focus on growth and opportunity, never on frustration or blame.

**"Tell me about a challenge you faced."**
Use STAR. Choose a real challenge with a positive resolution that shows problem-solving.

**"Where do you see yourself in 5 years?"**
Align your answer with the role and the company's growth. Show ambition without arrogance.

**"What is your biggest weakness?"**
Choose a real weakness you are actively working on. Never say "I work too hard."

## Tips

- Prepare 3-5 STAR stories and adapt them to different questions
- Practice out loud — reading is not the same as speaking
- Keep answers under 3 minutes unless asked for more
- Research the company before the interview — mention specifics
`

const FALLBACK_PT = `
## O que é StoryTelling em entrevistas?

StoryTelling é a técnica de apresentar sua experiência profissional como uma narrativa coerente, não uma lista de fatos. Entrevistas com RH não são técnicas — elas existem para entender quem você é, como você pensa e como você trabalha em equipe.

## O Método STAR

Use STAR para estruturar cada resposta comportamental:

- **S**ituação — Contextualize. Onde você estava, qual era o projeto?
- **T**arefa — Qual era sua responsabilidade ou desafio?
- **A**ção — O que VOCÊ especificamente fez? (Use "eu", não "a gente")
- **R**esultado — Qual foi o resultado? Quantifique quando possível.

## Perguntas Comuns de RH

**"Fale sobre você."**
Não é sua história de vida. É um pitch profissional de 2 minutos: cargo atual → experiência relevante → por que esta empresa.

**"Por que você quer sair do emprego atual?"**
Foque em crescimento e oportunidade — nunca em frustração ou culpa.

**"Fale sobre um desafio que você enfrentou."**
Use o STAR. Escolha um desafio real com resolução positiva que demonstre resolução de problemas.

**"Onde você se vê em 5 anos?"**
Alinhe sua resposta com o cargo e o crescimento da empresa. Mostre ambição sem arrogância.

**"Qual é sua maior fraqueza?"**
Escolha uma fraqueza real que você está trabalhando ativamente. Nunca diga "trabalho demais".

## Dicas

- Prepare 3 a 5 histórias STAR e adapte-as a diferentes perguntas
- Pratique em voz alta — ler não é o mesmo que falar
- Mantenha as respostas abaixo de 3 minutos, salvo se pedirem mais
- Pesquise a empresa antes da entrevista — mencione especificidades
`

export default async function StorytellingPage() {
  const locale = await getLocale()
  const t = await getTranslations('pages')

  const question = await getQuestion(locale, 'soft-skills', 'storytelling')
  const html = question?.fullAnswer ?? null

  const { remark } = await import('remark')
  const remarkHtml = (await import('remark-html')).default
  const fallbackHtml = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(locale === 'pt' ? FALLBACK_PT : FALLBACK_EN)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-dark-heading mb-2">{t('storytelling')}</h1>
      <p className="text-dark-muted mb-10">
        {locale === 'pt'
          ? 'Como montar uma narrativa poderosa para a entrevista com o RH.'
          : 'How to build a powerful narrative for your HR interview.'}
      </p>
      <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
        <MarkdownRenderer html={html ?? fallbackHtml.toString()} />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Verify all static pages in browser**

```bash
npm run dev
```
Check each page:
- `http://localhost:3000/faq`
- `http://localhost:3000/about`
- `http://localhost:3000/contribute`
- `http://localhost:3000/contact`
- `http://localhost:3000/support`
- `http://localhost:3000/storytelling`

All should render with the Header and Footer.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add FAQ, About, Contribute, Contact, Support, and StoryTelling pages"
```

---

## Task 16: Deployment (Vercel + CI)

**Files:**
- Create: `.gitignore` (update)
- Create: `vercel.json`
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Update .gitignore**

Add to `.gitignore`:
```
.next/
node_modules/
.vercel/
.superpowers/
```

- [ ] **Step 2: Create vercel.json**

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

- [ ] **Step 3: Create GitHub Actions CI**

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Validate content frontmatter
        run: node scripts/validate-content.mjs
```

- [ ] **Step 4: Create content validation script**

Create `scripts/validate-content.mjs`:
```javascript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content')
const REQUIRED_FIELDS = ['title', 'category', 'subcategory', 'tags', 'difficulty', 'lang']
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const VALID_LANGS = ['en', 'pt']
const REQUIRED_SECTIONS = ['## Full Answer', '## Quick Answer', '## Flashcard']

let errors = 0

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).flatMap(f => {
    const full = path.join(dir, f)
    return fs.statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = walk(CONTENT_DIR).filter(f => f.endsWith('.md'))

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8')
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  const rel = path.relative(CONTENT_DIR, file)

  if (!fmMatch) {
    console.error(`❌ ${rel}: missing frontmatter`)
    errors++
    continue
  }

  const fm = Object.fromEntries(
    fmMatch[1].split('\n')
      .map(line => line.match(/^(\w[\w-]*):\s*(.+)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')])
  )

  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      console.error(`❌ ${rel}: missing required field "${field}"`)
      errors++
    }
  }

  if (fm.difficulty && !VALID_DIFFICULTIES.includes(fm.difficulty)) {
    console.error(`❌ ${rel}: invalid difficulty "${fm.difficulty}"`)
    errors++
  }

  if (fm.lang && !VALID_LANGS.includes(fm.lang)) {
    console.error(`❌ ${rel}: invalid lang "${fm.lang}"`)
    errors++
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!raw.includes(section)) {
      console.error(`❌ ${rel}: missing section "${section}"`)
      errors++
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s) found.`)
  process.exit(1)
} else {
  console.log(`✅ All ${files.length} content files validated.`)
}
```

- [ ] **Step 5: Run validation locally**

```bash
node scripts/validate-content.mjs
```
Expected: `✅ All 5 content files validated.`

- [ ] **Step 6: Final build check**

```bash
npm run build
```
Expected: build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Vercel config, GitHub Actions CI, and content validation script"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| Next.js 15 + TypeScript + Tailwind | Task 1 |
| MD files with gray-matter + remark | Tasks 4, 10 |
| next-intl en/pt with browser detection | Task 2 |
| Dark/light theme with localStorage | Task 3 |
| Category Hub navigation | Task 11 |
| Question list with status icons | Task 12 |
| Split view question page | Task 14 |
| 3D flip card flashcard | Task 13 |
| localStorage progress tracking | Task 5 |
| Progress badge on category cards | Tasks 8, 11 |
| Home page with hero + CTA | Task 9 |
| StoryTelling page | Task 15 |
| FAQ, About, Contribute, Contact, Support | Task 15 |
| Open source PR contribution flow | Tasks 10, 16 |
| Content validation CI | Task 16 |
| 7 categories (frontend, backend, devops, data, soft-skills, architecture, security) | Task 6 |
| Sample content in en + pt | Task 10 |

All spec requirements covered. No placeholders found. Types are consistent across tasks (`QuestionMeta`, `QuestionContent`, `QuestionStatus`, `Category` used consistently). `questionPath` format (`category/subcategory/slug`) is consistent between `content.ts` and `progress.ts`.
