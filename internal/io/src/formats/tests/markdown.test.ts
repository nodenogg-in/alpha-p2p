import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseMarkdown } from '../markdown'

describe('parseMarkdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should parse markdown to HTML', async () => {
    const markdown = 'Hello, World!'
    const result = await parseMarkdown(markdown)

    expect(result.content).toEqual('<p>Hello, World!</p>')
  })
})
