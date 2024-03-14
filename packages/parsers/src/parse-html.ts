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
      throw new Error('Could not parse HTML file')
    }
    return sanitized
  } catch (error) {
    throw error
  }
}
