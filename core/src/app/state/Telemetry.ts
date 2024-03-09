import { events, isArray } from '../../utils'

export type ErrorLevel = 'info' | 'warn' | 'fail' | 'status'

type EventData = {
  name: string
  level: ErrorLevel
  error?: unknown
  message: string
  persist?: boolean
  trace?: boolean
  tags?: string[]
}

export class TelemetryError extends Error {}

export class LogEvent {
  message: string
  level: ErrorLevel
  error?: unknown
  created: string
  name: string
  tags?: string[]

  constructor({ name, message, level, error, tags }: EventData) {
    this.message = message
    this.level = level
    this.name = name
    this.tags = tags
    this.created = new Date().toLocaleTimeString()
    if (error) this.error = error
  }
}

const colors: Record<ErrorLevel, string> = {
  status: '96,21,255',
  info: '146,182,5',
  warn: '255,120,0',
  fail: '255,0,0'
}

const log = (text: ([string, string] | [string] | boolean)[]) => {
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

const logStyles = {
  neutral: `background: rgba(160,160,160,0.2); color: rgb(200,200,200); padding: 2px 4px; border-radius:2px; margin-right: 2px;`,
  none: `padding: 2px 4px; border-radius: 2px; margin-right: 2px;`
}

export const isAppError = (error: any): error is LogEvent => error instanceof LogEvent
export const isTelemetryError = (error: unknown): error is TelemetryError =>
  error instanceof TelemetryError
export const isError = (error: unknown): error is Error => error instanceof Error

export class Telemetry {
  public logEvents: boolean = true
  readonly items: LogEvent[] = []
  public events = events<Record<ErrorLevel, string>>()

  constructor(logEvents = true) {
    this.logEvents = logEvents
    this.items = []
  }

  public log = (e: EventData) => {
    const event = new LogEvent(e)
    this.items.push(event)
    if (this.logEvents) {
      const { name, message, level } = event
      log([
        [
          `⬤ ${level.toUpperCase()}`,
          `background: rgba(${colors[level]},0.2); color: rgb(${colors[level]},1.0); padding: 2px 4px; border-radius:2px; margin-right: 2px;`
        ],
        [name, logStyles.neutral],
        [message]
      ])
    }
    this.events.emit(e.level, e.message)
    if (e.trace) {
      console.trace(e)
    }
  }

  public time = (e: EventData) => {
    const start = performance.now()
    return {
      finish: () => {
        const duration = performance.now() - start
        this.log({ ...e, message: `${e.message} [${duration.toFixed(2)}ms]` })
      }
    }
  }

  public throw = (error: unknown, e: EventData) => {
    this.log({
      ...e,
      error,
      message: `${e.message} ${isError(error) ? `[${error.name}: ${error.message}]` : ''}`
    })
    if (e.level === 'fail') {
      console.trace(e.message)
    }
    throw isTelemetryError(error) ? error : new TelemetryError(e.message)
  }
}
