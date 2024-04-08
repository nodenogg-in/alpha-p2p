export const getTimeSince = (timestamp: number): string => {
  const now = new Date().getTime()
  const diffInSeconds = Math.floor((now - timestamp) / 1000)

  const minute = 60
  const hour = 3600
  const day = 86400
  const week = 604800

  if (diffInSeconds < minute) {
    return 'just now'
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute)
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    const weeks = Math.floor(diffInSeconds / week)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
}
