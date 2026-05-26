import { describe, it, expect, beforeEach } from 'vitest'

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
