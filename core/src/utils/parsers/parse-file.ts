import { is, string } from 'valibot'
import { parseHtml } from './parse-html'
import { parseMarkdown } from './parse-markdown'

// Define valid mime types as a union of string literals
type ValidMimeType = 'text/markdown' | 'text/plain' | 'text/html' | 'image/svg+xml'

export const VALID_MIME_TYPES: ValidMimeType[] = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml'
]

// Define the type of the parsers object
type Parsers = {
  [key in ValidMimeType]: (content: string) => string
}

const parsers: Parsers = {
  'text/markdown': parseMarkdown,
  'text/plain': parseMarkdown,
  'text/html': parseHtml,
  'image/svg+xml': (s: string) => s
}

export const parseFileToHTMLString = (file: File): Promise<string | false> =>
  new Promise((resolve) => {
    // Ensure file type is a valid mime type
    const fileType = file.type as ValidMimeType
    if (!VALID_MIME_TYPES.includes(fileType)) {
      resolve(false)
      return
    }

    try {
      const parser = parsers[fileType]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const result = event.target?.result
          if (is(string(), result) && result) {
            console.log('result', result)
            resolve(parser(result))
          } else {
            resolve(false)
          }
        } catch {
          resolve(false)
        }
      }
      reader.onerror = () => {
        resolve(false)
      }
      reader.readAsText(file)
    } catch {
      resolve(false)
    }
  })
