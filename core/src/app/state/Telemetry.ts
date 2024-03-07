export type ErrorLevel = 'info' | 'warn' | 'fail' | 'status'

type EventData = {
  name: string
  level: ErrorLevel
  error?: unknown
  message: string
  persist?: boolean
  trace?: boolean
}

class TelemetryError extends Error {}

export class LogEvent {
  message: string
  level: ErrorLevel
  error?: unknown
  created: string
  name: string

  constructor({ name, message, level, error }: EventData) {
    this.message = message
    this.level = level
    this.name = name
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

const printMessage = ({ name, message, level }: LogEvent) => [
  `%c[${level}] ${name}%c${message}`,
  `background: rgba(${colors[level]},0.2); color: rgb(${colors[level]},1.0); padding: 2px 4px; border-radius:2px; margin-right: 2px;`,
  `padding: 2px 4px; border-radius:2px; margin-right: 2px;`
]

export const isAppError = (error: any): error is LogEvent => error instanceof LogEvent
export const isError = (error: any): error is Error => error instanceof Error

export class Telemetry {
  public log: boolean = true
  readonly events: LogEvent[] = []

  constructor(log = true) {
    this.log = log
    this.events = []
  }

  public add = (e: EventData) => {
    const event = new LogEvent(e)
    this.events.push(event)
    if (this.log) {
      const log = console.log.bind(console)
      log(...printMessage(event))
    }
    if (e.trace) {
      console.trace(e)
    }
  }

  public time = (e: EventData) => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      return this.add({ ...e, message: `${e.message} [${duration.toFixed(2)}ms]` })
    }
  }

  public throw = (error: unknown, e: EventData) => {
    this.add({
      ...e,
      error,
      message: `${e.message} ${isError(error) ? `[${error.name}: ${error.message}]` : ''}`
    })
    console.trace(e.message)
    throw new TelemetryError(e.message)
  }
}
