export const sanitizeHTML = async (html: string): Promise<string> => {
  try {
    const lib = await import('dompurify')
    return lib.default.sanitize(html)
  } catch {
    return ''
  }
}
