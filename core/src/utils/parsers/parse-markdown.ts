import { starkdown } from 'starkdown'
import { sanitizeHTML } from './parse-html'

export const parseMarkdown = (md: string, sanitizeHtml: boolean = true) => {
  const parsed = starkdown(md)
  return sanitizeHtml ? sanitizeHTML(parsed) : parsed
}
