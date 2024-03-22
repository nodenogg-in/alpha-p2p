import { FileParser } from '../api'

export const parseSVG: FileParser = async (content: string) => ({ type: 'html', content })
