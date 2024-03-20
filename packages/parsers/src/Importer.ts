import { is, string } from 'valibot'
import { parseHtml } from './formats/html'
import { parseMarkdown } from './formats/markdown'
import { type FileParser, type ParsedNode } from './api'
import { parseJSON } from './formats/json'
import { parseSVG } from './formats/svg'

export type ValidMimeType = (typeof VALID_IMPORT_FORMATS)[number]

export const MAX_FILE_SIZE = 1024 * 64

export const VALID_IMPORT_FORMATS = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml',
  'application/json'
] as const

type Parsers = Record<ValidMimeType, FileParser>

const isNotBoolean = <T>(n: T | false): n is T => !!n

export class Importer {
  private readonly parsers: Parsers = {
    'application/json': parseJSON,
    'text/markdown': parseMarkdown,
    'text/plain': parseMarkdown,
    'text/html': parseHtml,
    'image/svg+xml': parseSVG
  }

  public importFile = (file: File): Promise<ParsedNode | false> =>
    new Promise((resolve) => {
      // Ensure file type is a valid mime type
      const fileType = file.type as ValidMimeType
      if (!VALID_IMPORT_FORMATS.includes(fileType)) {
        resolve(false)
      }

      try {
        const reader = new FileReader()
        const parse = this.parsers[fileType]
        reader.onload = async ({ target }) => {
          const result = target?.result
          if (is(string(), result)) {
            const content = await parse(result)
            resolve(content)
          } else {
            resolve(false)
          }
        }
        reader.onerror = () => resolve(false)
        reader.readAsText(file)
      } catch (err) {
        resolve(false)
      }
    })

  public importFiles = (file: File[]): Promise<ParsedNode[]> =>
    Promise.all(file.map(this.importFile)).then((result) => result.filter(isNotBoolean))
}
