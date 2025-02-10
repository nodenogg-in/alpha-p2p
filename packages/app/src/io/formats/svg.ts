import type { FileParser, ParsedEntity } from '../api'

export const parseSVG: FileParser<ParsedEntity<'html'>> = async (body: string) => ({
  type: 'html',
  body
})
