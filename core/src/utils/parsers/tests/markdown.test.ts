import { describe, it, expect, vi, beforeEach } from 'vitest'

import { parseMarkdown } from '../parse-markdown'
import { sanitizeHTML } from '../parse-html'

vi.mock('../parse-html', () => ({
  sanitizeHTML: vi.fn()
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
    expect(sanitizeHTML).toHaveBeenCalledWith('<p>Hello, World!</p>')
  })

  it('should parse but not sanitize markdown when sanitizeHtml is false', () => {
    const markdown = 'Hello, World!'
    const result = parseMarkdown(markdown, false)
    expect(sanitizeHTML).not.toHaveBeenCalled()
    expect(result).toEqual('<p>Hello, World!</p>')
  })
})
