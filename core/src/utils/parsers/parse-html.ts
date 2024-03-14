import { Instance } from '../../app/Instance'
import { sanitizeHtml } from './libs/sanitize-html/sanitize-html'

export const sanitizeHTML = (html: string) => sanitizeHtml(html, options)

const options = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img']
}

export const parseHtml = (content: string) => {
  try {
    const parsed = new DOMParser().parseFromString(content, 'text/html')
    const sanitized = sanitizeHTML(parsed.body.innerHTML)
    if (!parsed || !sanitized) {
      throw Instance.telemetry.throw({
        name: 'parseHtml',
        message: 'Invalid HTML file: could not parse',
        level: 'warn'
      })
    }
    return sanitized
  } catch (error) {
    throw Instance.telemetry.catch({
      name: 'parseHtml',
      message: 'Could not parse HTML file',
      level: 'warn',
      error
    })
  }
}
