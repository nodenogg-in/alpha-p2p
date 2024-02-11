import { is, string } from 'valibot'
import { parseHtml } from './html'
import { parseMarkdown } from './markdown'

export const VALID_MIME_TYPES = ['text/markdown', 'text/plain', 'text/html']

export const parseFileToHTMLString = (file: File): Promise<string | false> =>
  new Promise((resolve) => {
    if (!VALID_MIME_TYPES.includes(file.type)) {
      resolve(false)
    } else {
      try {
        const parser = file.type === 'text/html' ? parseHtml : parseMarkdown
        const reader = new FileReader()

        reader.onload = (event) => {
          try {
            const result = event.target?.result
            if (is(string(), result) && result) {
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
