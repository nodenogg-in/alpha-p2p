import { describe, it, expect, beforeEach } from 'vitest'
import { parseHtml, serializeHTML } from '../html'
import { Node } from '@nodenogg.in/microcosm'

describe('parseHtml', () => {
  it('parses HTML content and extracts meta information', async () => {
    const htmlContent = `
      <html>
        <head>
          <meta name="nodenoggin:node:x" content="1">
          <meta name="nodenoggin:node:width" content="100">
        </head>
        <body>Sample Content</body>
      </html>`
    const parsed = (await parseHtml(htmlContent)) as Node<'html'>
    expect(parsed.type).toBe('html')
    expect(parsed.content).toBe('Sample Content\n      ')
    expect(parsed.x).toBe(1)
    expect(parsed.y).toBeUndefined()
    expect(parsed.width).toBe(100)
  })
})

describe('serializeHTML', () => {
  it('serializes a node to an HTML string', async () => {
    const node: Node<'html'> = {
      type: 'html',
      content: 'Sample Content',
      x: 0,
      y: 0,
      width: 100,
      height: 500,
      lastEdited: 0
    }

    const htmlString = await serializeHTML(node)
    expect(htmlString).toContain('<meta name="nodenoggin:node:x" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:y" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:width" content="100" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:height" content="500" />')
    expect(htmlString).toContain('<body>Sample Content</body>')
  })
})

describe('all', () => {
  it('serializes a node to an HTML string and then parses back', async () => {
    const node: Node<'html'> = {
      type: 'html',
      content: 'Sample Content',
      x: 0,
      y: 0,
      width: 100,
      height: 500,
      lastEdited: 0
    }

    const htmlString = await serializeHTML(node)
    expect(htmlString).toContain('<meta name="nodenoggin:node:x" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:y" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:width" content="100" />')
    expect(htmlString).toContain('<meta name="nodenoggin:node:height" content="500" />')
    expect(htmlString).toContain('<body>Sample Content</body>')

    const parsed = (await parseHtml(htmlString)) as Node<'html'>
    expect(parsed.type).toBe('html')
    expect(parsed.content).toBe('Sample Content')
    expect(parsed.width).toBe(100)
    expect(parsed.height).toBe(500)
    expect(parsed.x).toBe(0)
    expect(parsed.y).toBe(0)
  })
})
