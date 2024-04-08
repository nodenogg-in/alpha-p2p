import { describe, it, expect } from 'vitest'
import { getTimeSince } from '../time'

describe('getTimeAgo', () => {
  it('returns "just now" for timestamps less than a minute ago', () => {
    const timestamp = Date.now() - 30 * 1000 // 30 seconds ago
    expect(getTimeSince(timestamp)).toBe('just now')
  })

  it('returns "X minutes ago" for timestamps more than a minute and less than an hour ago', () => {
    const timestamp = Date.now() - 10 * 60 * 1000 // 10 minutes ago
    expect(getTimeSince(timestamp)).toBe('10 minutes ago')
  })

  it('returns "X hours ago" for timestamps more than an hour and less than a day ago', () => {
    const timestamp = Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
    expect(getTimeSince(timestamp)).toBe('2 hours ago')
  })

  it('returns "X days ago" for timestamps more than a day and less than a week ago', () => {
    const timestamp = Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
    expect(getTimeSince(timestamp)).toBe('3 days ago')
  })

  it('returns "X weeks ago" for timestamps more than a week ago', () => {
    const timestamp = Date.now() - 2 * 7 * 24 * 60 * 60 * 1000 // 2 weeks ago
    expect(getTimeSince(timestamp)).toBe('2 weeks ago')
  })
})
