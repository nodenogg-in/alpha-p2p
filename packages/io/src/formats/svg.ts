import type { FileParser } from '../api'

export const parseSVG: FileParser<'html'> = async (body: string) => ({
  type: 'html',
  body
})
