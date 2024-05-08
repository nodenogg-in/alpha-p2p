import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseMarkdown } from '../markdown'
import type { Entity } from '@nodenogg.in/microcosm'
// import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'

// const markdownWithYaml = `---
// id: invalid
// ---
// Something
// `

// const validMarkdownWithYaml = `---
// id: ${createEntityID()}
// ---
// Something
// `

describe('parseMarkdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should parse markdown to HTML', async () => {
    const markdown = 'Hello, World!'
    const result = (await parseMarkdown(markdown)) as Entity<'html'>

    expect(result.body).toEqual('<p>Hello, World!</p>')
  })

  // it('should error on invalid YAML', async () => {
  //   await expect(() => parseMarkdown(markdownWithYaml)).rejects.toThrowError()

  //   const result = (await parseMarkdown(validMarkdownWithYaml)) as Node<'html'>
  //   expect(result.body).toEqual(`<p>Something</p>`)
  // })
})
