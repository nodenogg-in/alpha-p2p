import { starkdown } from 'starkdown'
import { sanitize } from './html'

export const parseMarkdown = (md: string, sanitizeHtml: boolean = true) => {
  const parsed = starkdown(md)
  return sanitizeHtml ? sanitize(parsed) : parsed
}
