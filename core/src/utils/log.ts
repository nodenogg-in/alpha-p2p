import type { ErrorLevel } from '../app'
import { isArray } from './guards'

export const logColors: Record<ErrorLevel, string> = {
  status: '96,21,255',
  info: '146,182,5',
  warn: '255,120,0',
  fail: '255,0,0'
}

export const logStyles = {
  neutral: `background: rgba(160,160,160,0.2); color: rgb(150,150,150); padding: 2px 4px; border-radius:2px; margin-right: 2px;`,
  none: `padding: 2px 4px; border-radius: 2px; margin-right: 2px;`
}

/**
 * Logs an array of messages to the console
 *
 * @param text - An array of strings and styles to log
 */
export const log = (text: ([string, string] | [string] | boolean)[]) => {
  const messages: string[] = []
  const styles: string[] = []

  for (const t of text) {
    if (isArray(t)) {
      messages.push(`%c${t[0]}`)
      styles.push(t[1] || logStyles.none)
    }
  }
  console.log(...[messages.join(''), ...styles])
}
