import { ParsedEntity, type FileParser } from './api'
import { isNotNullish, isString } from '@figureland/typekit/guards'
import { promiseSome } from '@figureland/typekit/promise'

export type ValidMimeType = (typeof IMPORT_FORMATS)[number]

export const MAX_FILE_SIZE = 1024 * 64

export const IMPORT_FORMATS = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml',
  'application/json'
] as const

type Parsers = Record<ValidMimeType, FileParser<ParsedEntity>>

const parsers: Parsers = {
  'application/json': (f) => import('./formats/json').then((m) => m.parseJSON(f)),
  'text/markdown': (f) => import('./formats/markdown').then((m) => m.parseMarkdown(f)),
  'text/plain': (f) => import('./formats/markdown').then((m) => m.parseMarkdown(f)),
  'text/html': (f) => import('./formats/html').then((m) => m.parseHtml(f)),
  'image/svg+xml': (f) => import('./formats/svg').then((m) => m.parseSVG(f))
}

export class Importer {
  static importFile = (file: File): Promise<ParsedEntity | null> =>
    new Promise(async (resolve) => {
      const fileType = file.type as ValidMimeType
      if (!IMPORT_FORMATS.includes(fileType)) {
        resolve(null)
      }

      try {
        const reader = new FileReader()
        reader.onload = async ({ target }) => {
          const result = target?.result
          if (isString(result)) {
            const content = await parsers[fileType](result)
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

  static importFiles = (file: File[]): Promise<ParsedEntity[]> =>
    promiseSome(file.map(this.importFile)).then(({ fulfilled }) => fulfilled.filter(isNotNullish))
}
