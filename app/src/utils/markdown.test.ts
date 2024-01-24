import { describe, it, expect, vi, beforeEach } from 'vitest'

import { parseMarkdown } from './markdown'
import { sanitize } from './html'

vi.mock('./html', () => ({
  sanitize: vi.fn()
}))

describe('parseMarkdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should parse markdown to HTML', () => {
    const markdown = 'Hello, World!'
    const result = parseMarkdown(markdown, false)

    expect(result).toEqual('<p>Hello, World!</p>')
  })

  it('should parse and sanitize markdown by default', () => {
    const markdown = 'Hello, World!'
    parseMarkdown(markdown)
    expect(sanitize).toHaveBeenCalledWith('<p>Hello, World!</p>')
  })

  it('should parse but not sanitize markdown when sanitizeHtml is false', () => {
    const markdown = 'Hello, World!'
    const result = parseMarkdown(markdown, false)
    expect(sanitize).not.toHaveBeenCalled()
    expect(result).toEqual('<p>Hello, World!</p>')
  })
})
