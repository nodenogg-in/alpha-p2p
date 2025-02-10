import { describe, it, expect } from 'vitest'
import { parseHtml, serializeHTML } from '../html'
import { type Entity, createEntityID } from '@nodenogg.in/microcosm'

describe('parseHtml', () => {
  it('parses HTML content and extracts meta information', async () => {
    const htmlContent = `
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta name="nodenoggin:entity:type" content="html">
          <meta name="nodenoggin:entity:schema" content="1">
          <meta name="nodenoggin:entity:lastEdited" content="0">
          <meta name="nodenoggin:entity:created" content="0">
          <meta name="nodenoggin:entity:x" content="1">
          <meta name="nodenoggin:entity:width" content="100">
        </head>
        <body>Sample Content</body>
      </html>`
    const parsed = (await parseHtml(htmlContent)) as Entity<'html'>

    expect(parsed.type).toBe('html')
    expect(parsed.body).toBe('Sample Content')
    expect(parsed.x).toBe(1)
    expect(parsed.schema).toBe(1)
    expect(parsed.y).toBeUndefined()
    expect(parsed.width).toBe(100)
  })
})

describe('serializeHTML', () => {
  it('serializes a entity to an HTML string', async () => {
    const entity: Entity<'html'> = {
      id: createEntityID(),
      schema: 1,
      type: 'html',
      lastEdited: 0,
      created: 0,
      body: 'Sample Content',
      x: 0,
      y: 0,
      width: 100,
      height: 500
    }

    const htmlString = await serializeHTML(entity)

    expect(htmlString).toContain('<meta name="nodenoggin:entity:schema" content="1" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:x" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:y" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:width" content="100" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:height" content="500" />')
    expect(htmlString).toContain('<body>Sample Content</body>')
  })
})

describe('all', () => {
  it('serializes a entity to an HTML string and then parses back', async () => {
    const id = createEntityID()
    const body = `Sample Content (${Math.random()})`

    const entity: Entity<'html'> = {
      id,
      schema: 1,
      type: 'html',
      lastEdited: 0,
      created: 0,
      body,
      x: 0,
      y: 0,
      width: 100,
      height: 500
    }

    const htmlString = await serializeHTML(entity)

    expect(htmlString).toContain(`<meta name="nodenoggin:entity:id" content="${id}" />`)
    expect(htmlString).toContain('<meta name="nodenoggin:entity:type" content="html" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:schema" content="1" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:lastEdited" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:created" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:x" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:y" content="0" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:width" content="100" />')
    expect(htmlString).toContain('<meta name="nodenoggin:entity:height" content="500" />')
    expect(htmlString).toContain(`<body>${body}</body>`)

    const parsed = (await parseHtml(htmlString)) as Entity<'html'>

    expect(parsed.type).toBe('html')
    expect(parsed.body).toBe(body)
    expect(parsed.width).toBe(100)
    expect(parsed.height).toBe(500)
    expect(parsed.x).toBe(0)
    expect(parsed.y).toBe(0)
  })
})
