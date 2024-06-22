export const sanitizeHTML = async (html: string): Promise<string> =>
  await import('dompurify').then((p) => p.sanitize(html)).catch(() => '')
