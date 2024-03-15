import { is, string } from 'valibot'
import { parseHtml } from './parse-html'
import { parseMarkdown } from './parse-markdown'
import { type FileParser, type ParsedNode, VALID_MIME_TYPES, type ValidMimeType } from './api'
import { parseJSON } from './parse-json'
import { parseSVG } from './parse-svg'

type Parsers = {
  [key in ValidMimeType]: FileParser
}

const isNotBoolean = <T>(n: T | false): n is T => !!n

export class FileImporter {
  private readonly parsers: Parsers = {
    'application/json': parseJSON,
    'text/markdown': parseMarkdown,
    'text/plain': parseMarkdown,
    'text/html': parseHtml,
    'image/svg+xml': parseSVG
  }

  public parseFile = (file: File): Promise<ParsedNode | false> =>
    new Promise((resolve) => {
      // Ensure file type is a valid mime type
      const fileType = file.type as ValidMimeType
      if (!VALID_MIME_TYPES.includes(fileType)) {
        resolve(false)
        return
      }

      try {
        const reader = new FileReader()
        const parse = this.parsers[fileType]
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

  public parseFiles = (file: File[]): Promise<ParsedNode[]> =>
    Promise.all(file.map(this.parseFile)).then((result) => result.filter(isNotBoolean))
}
