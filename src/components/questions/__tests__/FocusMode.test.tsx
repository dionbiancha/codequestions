import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FocusMode } from '../FocusMode'
import type { QuestionMeta } from '@/lib/content'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
}))

vi.mock('@/lib/progress', () => ({
  getQuestionStatus: vi.fn(() => null),
}))

const mockQuestion: QuestionMeta = {
  slug: 'test-question',
  title: 'What is closure?',
  category: 'frontend',
  subcategory: 'javascript',
  path: 'frontend/javascript/test-question',
  difficulty: 'junior',
  tags: ['javascript', 'closures'],
  quickAnswer: 'A closure captures its lexical scope.',
  lang: 'pt',
}

describe('FocusMode', () => {
  const defaultProps = {
    question: mockQuestion,
    onNext: vi.fn(),
    onPrev: vi.fn(),
    hasPrev: false,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the question title', () => {
    render(<FocusMode {...defaultProps} />)
    expect(screen.getByText('What is closure?')).toBeInTheDocument()
  })

  it('calls onClose when × button is clicked', () => {
    render(<FocusMode {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('focusModeClose'))
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    render(<FocusMode {...defaultProps} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(defaultProps.onClose).toHaveBeenCalledOnce()
  })

  it('shows show-answer button initially, hides quick answer', () => {
    render(<FocusMode {...defaultProps} />)
    expect(screen.getByText('showAnswer')).toBeInTheDocument()
    expect(screen.queryByText('A closure captures its lexical scope.')).not.toBeInTheDocument()
  })

  it('reveals quick answer after clicking show answer', () => {
    render(<FocusMode {...defaultProps} />)
    fireEvent.click(screen.getByText('showAnswer'))
    expect(screen.getByText('A closure captures its lexical scope.')).toBeInTheDocument()
  })

  it('disables Anterior button when hasPrev is false', () => {
    render(<FocusMode {...defaultProps} hasPrev={false} />)
    expect(screen.getByText(/focusModePrev/)).toBeDisabled()
  })

  it('enables Anterior button when hasPrev is true', () => {
    render(<FocusMode {...defaultProps} hasPrev={true} />)
    expect(screen.getByText(/focusModePrev/)).not.toBeDisabled()
  })

  it('calls onPrev when Anterior button is clicked and hasPrev is true', () => {
    render(<FocusMode {...defaultProps} hasPrev={true} />)
    fireEvent.click(screen.getByText(/focusModePrev/))
    expect(defaultProps.onPrev).toHaveBeenCalledOnce()
  })

  it('calls onNext when Próxima button is clicked', () => {
    render(<FocusMode {...defaultProps} />)
    fireEvent.click(screen.getByText(/focusModeNext/))
    expect(defaultProps.onNext).toHaveBeenCalledOnce()
  })

  it('resets revealed state when question changes', () => {
    const { rerender } = render(<FocusMode {...defaultProps} />)
    fireEvent.click(screen.getByText('showAnswer'))
    expect(screen.queryByText('showAnswer')).not.toBeInTheDocument()

    const nextQuestion = { ...mockQuestion, slug: 'other', title: 'Other question', path: 'frontend/javascript/other' }
    rerender(<FocusMode {...defaultProps} question={nextQuestion} />)
    expect(screen.getByText('showAnswer')).toBeInTheDocument()
  })
})
