import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryCard } from '../CategoryCard'
import type { Category } from '@/lib/categories'

vi.mock('next/link', () => ({
  default: ({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) =>
    <a href={href} className={className} style={style}>{children}</a>,
}))

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
}))

const mockCategory: Category = {
  slug: 'frontend',
  icon: '⚛️',
  color: 'text-blue-400',
  borderColor: 'border-blue-500/30',
  accentColor: '#58a6ff',
}

describe('CategoryCard', () => {
  it('renders category label and count', () => {
    render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={0} />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('48 perguntas')).toBeInTheDocument()
  })

  it('renders "não iniciado" when known is 0', () => {
    render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={0} />)
    expect(screen.getByText('não iniciado')).toBeInTheDocument()
  })

  it('renders progress label when known > 0', () => {
    render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={17} />)
    expect(screen.getByText('17/48 concluídas')).toBeInTheDocument()
  })

  it('links to the correct category URL', () => {
    render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={0} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pt/questions/frontend')
  })

  it('renders the category icon', () => {
    render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={0} />)
    expect(screen.getByText('⚛️')).toBeInTheDocument()
  })

  it('renders a progress bar with correct width', () => {
    const { container } = render(<CategoryCard category={mockCategory} label="Frontend" count={48} known={17} />)
    const fill = container.querySelector('[data-testid="progress-fill"]')
    expect(fill).toBeInTheDocument()
    expect(fill).toHaveStyle({ width: '35%' })
  })
})
