import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryListClient } from '../CategoryListClient'
import type { Category } from '@/lib/categories'

vi.mock('next/link', () => ({
  default: ({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) =>
    <a href={href} className={className} style={style}>{children}</a>,
}))

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
}))

vi.mock('@/lib/progress', () => ({
  countProgress: vi.fn((slug: string) => {
    if (slug === 'frontend') return { known: 5, review: 0 }
    return { known: 0, review: 0 }
  }),
}))

const makeCategory = (slug: string): Category => ({
  slug,
  icon: '📦',
  color: 'text-blue-400',
  borderColor: 'border-blue-500/30',
  accentColor: '#58a6ff',
})

const categories = [
  { cat: makeCategory('frontend'), label: 'Frontend', count: 48 },
  { cat: makeCategory('backend'),  label: 'Backend',  count: 36 },
  { cat: makeCategory('devops'),   label: 'DevOps',   count: 24 },
]

describe('CategoryListClient', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all categories by default', () => {
    render(<CategoryListClient categories={categories} />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('DevOps')).toBeInTheDocument()
  })

  it('filters categories by text query', () => {
    render(<CategoryListClient categories={categories} />)
    fireEvent.change(screen.getByPlaceholderText('Filtrar categorias...'), {
      target: { value: 'front' },
    })
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.queryByText('Backend')).not.toBeInTheDocument()
    expect(screen.queryByText('DevOps')).not.toBeInTheDocument()
  })

  it('chip "com progresso" shows only categories with known > 0', () => {
    render(<CategoryListClient categories={categories} />)
    fireEvent.click(screen.getByText('com progresso'))
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.queryByText('Backend')).not.toBeInTheDocument()
    expect(screen.queryByText('DevOps')).not.toBeInTheDocument()
  })

  it('chip "não iniciadas" shows only categories with known === 0', () => {
    render(<CategoryListClient categories={categories} />)
    fireEvent.click(screen.getByText('não iniciadas'))
    expect(screen.queryByText('Frontend')).not.toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('DevOps')).toBeInTheDocument()
  })

  it('chip "todas" resets to show all categories', () => {
    render(<CategoryListClient categories={categories} />)
    fireEvent.click(screen.getByText('não iniciadas'))
    fireEvent.click(screen.getByText('todas'))
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('DevOps')).toBeInTheDocument()
  })

  it('shows empty message when no categories match', () => {
    render(<CategoryListClient categories={categories} />)
    fireEvent.change(screen.getByPlaceholderText('Filtrar categorias...'), {
      target: { value: 'xyznotfound' },
    })
    expect(screen.getByText('Nenhuma categoria encontrada.')).toBeInTheDocument()
  })
})
