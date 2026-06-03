import { describe, it, expect } from 'vitest'
import { parseQuestionSlug, getCategoryFromPath, buildQuestionMeta } from '../content'

describe('parseQuestionSlug', () => {
  it('extracts category, subcategory and slug from a path', () => {
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
      difficulty: 'junior',
      lang: 'en',
    }
    const meta = buildQuestionMeta('let-const-var', fm)
    expect(meta.slug).toBe('let-const-var')
    expect(meta.title).toBe('let vs const')
    expect(meta.category).toBe('frontend')
    expect(meta.tags).toEqual(['es6'])
    expect(meta.path).toBe('frontend/javascript/let-const-var')
  })
})
