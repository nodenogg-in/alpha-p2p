import { starkdown } from 'starkdown'
import { is, string } from 'valibot'
import { sanitizeHtml } from './sanitize-html/sanitize-html'

const options = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img']
}

export const sanitize = (html: string) => sanitizeHtml(html, options)

export const markdownToHtml = (md: string, sanitizeHtml: boolean = true) => {
  const parsed = starkdown(md)
  return sanitizeHtml ? sanitize(parsed) : parsed
}

const VALID_MIME_TYPES = ['text/markdown', 'text/plain']

export const readMarkdownFile = (file: File): Promise<string | false> =>
  new Promise((resolve) => {
    if (!VALID_MIME_TYPES.includes(file.type)) {
      resolve(false)
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result
      if (is(string(), result) && result) {
        resolve(result)
      } else {
        resolve(false)
      }
    }
    reader.onerror = () => {
      resolve(false)
    }
    reader.readAsText(file)
  })

export const parseFileListToMarkdown = async (files: File[]) => {
  const results = await Promise.all(files.map(readMarkdownFile))
  return results.filter((f) => f) as string[]
}
