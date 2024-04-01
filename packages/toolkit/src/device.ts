const hasUserAgent = () => typeof navigator !== 'undefined' && navigator.userAgent

export const isChrome = () => {
  const userAgent = hasUserAgent()
  return userAgent ? userAgent.includes('Chrome') || userAgent.includes('Chromium') : false
}

export const isSafari = (): boolean => {
  const userAgent = hasUserAgent()
  if (!userAgent || isChrome()) {
    return false
  }
  const isSafari = userAgent.includes('Safari')
  return isSafari
}

export const isMobile = (): boolean => {
  const userAgent = hasUserAgent()
  return userAgent
    ? /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    : false
}
