import { sanitizeHtml } from './libs/sanitize-html/sanitize-html'

export const sanitize = (html: string) => sanitizeHtml(html, options)

const options = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img']
}

export const parseHtml = (content: string) => {
  try {
    const parsed = new DOMParser().parseFromString(content, 'text/html')
    return sanitize(parsed.body.innerHTML)
  } catch {
    throw new Error('Could not parse html document')
  }
}
