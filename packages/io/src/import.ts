import { is, string } from 'valibot'
import { type FileParser, type ParsedNode } from './api'
import { isNotNullish } from '@figureland/typekit/guards'

export { isParsedNodeType } from './api'

export type { ParsedNode } from './api'
export type ValidMimeType = (typeof IMPORT_FORMATS)[number]

export const MAX_FILE_SIZE = 1024 * 64

export const IMPORT_FORMATS = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml',
  'application/json'
] as const

type Parsers = Record<ValidMimeType, () => Promise<FileParser>>

const isNotBoolean = <T>(n: T | false): n is T => !!n

const parsers: Parsers = {
  'application/json': () => import('./formats/json').then((m) => m.parseJSON),
  'text/markdown': () => import('./formats/markdown').then((m) => m.parseMarkdown),
  'text/plain': () => import('./formats/markdown').then((m) => m.parseMarkdown),
  'text/html': () => import('./formats/html').then((m) => m.parseHtml),
  'image/svg+xml': () => import('./formats/svg').then((m) => m.parseSVG)
}

export class Importer {
  public importFile = (file: File): Promise<ParsedNode | null> =>
    new Promise(async (resolve) => {
      // Ensure file type is a valid mime type
      const fileType = file.type as ValidMimeType
      if (!IMPORT_FORMATS.includes(fileType)) {
        resolve(null)
      }

      try {
        const reader = new FileReader()
        const parse = await parsers[fileType]()
        reader.onload = async ({ target }) => {
          const result = target?.result
          if (is(string(), result)) {
            const content = await parse(result)
            resolve(content)
          } else {
            resolve(null)
          }
        }
        reader.onerror = () => resolve(null)
        reader.readAsText(file)
      } catch (err) {
        resolve(null)
      }
    })

  public importFiles = (file: File[]): Promise<ParsedNode[]> =>
    Promise.all(file.map(this.importFile)).then((result) => result.filter(isNotNullish))
}
