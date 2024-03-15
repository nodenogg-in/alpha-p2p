import { FileParser } from './api'

export const parseHtml: FileParser = async (content: string) => {
  const parsed = new DOMParser().parseFromString(content, 'text/html')
  if (!parsed) {
    throw new Error('Could not parse HTML file')
  }
  return {
    type: 'html',
    content: parsed.body.innerHTML
  }
}
