import { describe, expect, it } from 'vitest'
import { parseHtml } from '../formats/html'
import { sanitizeHTML } from '../sanitize'

describe('sanitize', () => {
  it('should remove disallowed tags', () => {
    const dirtyHtml = '<script>alert("xss")</script><p>Safe content</p>'
    const cleanHtml = sanitizeHTML(dirtyHtml)
    expect(cleanHtml).not.toContain('<script>')
    expect(cleanHtml).toContain('<p>Safe content</p>')
  })

  it('should allow certain tags like <img>', () => {
    const htmlWithImg = '<img src="image.jpg" /><p>Image here</p>'
    const result = sanitizeHTML(htmlWithImg)
    expect(result).toContain('<img src="image.jpg" />')
    expect(result).toContain('<p>Image here</p>')
  })
})

describe('parseHtml', () => {
  it('should parse and sanitize HTML content', () => {
    const dirtyHtml = '<div><script>alert("xss")</script><p>Safe content</p></div>'
    const expectedHtml = '<div><p>Safe content</p></div>'
    const sanitizedHtml = parseHtml(dirtyHtml)
    expect(sanitizedHtml).toEqual(expectedHtml)
  })

  it('should throw an error for invalid HTML', () => {
    const invalidHtml = '<abcdefgh12344'
    expect(() => parseHtml(invalidHtml)).toThrow('Could not parse html document')
  })
})
