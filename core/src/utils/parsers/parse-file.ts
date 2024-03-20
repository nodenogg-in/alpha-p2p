import { is, string } from 'valibot'
import { parseHtml } from './parse-html'
import { parseMarkdown } from './parse-markdown'

export const VALID_MIME_TYPES = ['text/markdown', 'text/plain', 'text/html', 'image/svg+xml']

const parsers = {
  'text/markdown': parseMarkdown,
  'text/plain': parseMarkdown,
  'text/html': parseHtml,
  'image/svg+xml': (s: string) => s
}

export const parseFileToHTMLString = (file: File): Promise<string | false> =>
  new Promise((resolve) => {
    if (!VALID_MIME_TYPES.includes(file.type)) {
      resolve(false)
    } else {
      try {
        const parser = parsers[file.type]
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
    }
  })
