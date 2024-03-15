import { is, string } from 'valibot'
import { parseHtml } from './parse-html'
import { parseMarkdown } from './parse-markdown'
import { type FileParser, type ParsedHTMLNode, VALID_MIME_TYPES, type ValidMimeType } from './api'

type Parsers = {
  [key in ValidMimeType]: FileParser
}

const parsers: Parsers = {
  'text/markdown': parseMarkdown,
  'text/plain': parseMarkdown,
  'text/html': parseHtml,
  'image/svg+xml': async (content: string) => ({ type: 'html', content })
}

export const parseFileToHTML = (file: File): Promise<ParsedHTMLNode | false> =>
  new Promise((resolve) => {
    // Ensure file type is a valid mime type
    const fileType = file.type as ValidMimeType
    if (!VALID_MIME_TYPES.includes(fileType)) {
      resolve(false)
      return
    }

    try {
      const reader = new FileReader()
      const parse = parsers[fileType]
      reader.onload = async ({ target }) => {
        try {
          const result = target?.result
          if (is(string(), result)) {
            const content = await parse(result)
            resolve(content)
          } else {
            resolve(false)
          }
        } catch (err) {
          resolve(false)
        }
      }
      reader.onerror = () => {
        resolve(false)
      }
      reader.readAsText(file)
    } catch (err) {
      console.log('fail something')
      console.log(err)
      resolve(false)
    }
  })

const isNotBoolean = <T>(n: T | false): n is T => !!n

export const parseFilesToHTML = (file: File[]) =>
  Promise.all(file.map(parseFileToHTML)).then((result) => result.filter(isNotBoolean))
