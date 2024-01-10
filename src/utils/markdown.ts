import { starkdown } from 'starkdown'
import sanitizeHtml from 'sanitize-html'
import { is, string } from 'valibot'

const options = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img']
}

export const markdownToHtml = (md: string, sanitize: boolean = true) => {
  const parsed = starkdown(md)
  return sanitize ? sanitizeHtml(parsed, options) : parsed
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
