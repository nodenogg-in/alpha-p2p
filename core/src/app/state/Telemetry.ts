import { APP_VERSION, SCHEMA_VERSION } from '../../sync'
import { createTimestamp, createUuid, events, isArray } from '../../utils'
import { State } from '../../utils/State'
import { Instance } from '../Instance'

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

type TelemetryEvent = {
  message: string
  level: ErrorLevel
  error?: Error
  created: string
  name: string
  tags?: string[]
}

const createEvent = ({ name, message, level, error, tags = [] }: EventData): TelemetryEvent => ({
  message,
  level,
  name,
  tags,
  created: new Date().toLocaleTimeString(),
  ...(isError(error) && error)
})

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

export const isTelemetryError = (error: unknown): error is TelemetryError =>
  error instanceof TelemetryError
export const isError = (error: unknown): error is Error => error instanceof Error

const createAnalyticsData = (session_id: string, type: string, data?: any) => ({
  session_id,
  created: createTimestamp(),
  type,
  device: {
    userAgent: navigator.userAgent,
    language: navigator.language,
    size: Instance.ui.screen.getKey('screen')
  },
  app: {
    schema: SCHEMA_VERSION,
    version: APP_VERSION
  },
  ...(data && data)
})

type AnalyticsOptions = {
  url: string
  interval?: number
  levels?: ErrorLevel[]
  count?: number
}

export type TelemetryOptions = {
  log?: boolean
  remote?: AnalyticsOptions
}

export class Telemetry extends State<{ events: TelemetryEvent[] }> {
  public logEvents: boolean = true
  public events = events<Record<ErrorLevel, string>>()
  private readonly remote: AnalyticsOptions
  private session_id = createUuid('telemetry')

  constructor({ log = false, remote }: TelemetryOptions = {}) {
    super({
      initial: () => ({
        events: []
      })
    })
    this.logEvents = log
    if (remote) {
      this.remote = remote
      const interval = remote.interval || 1000 * 60 * 1
      const i = setInterval(this.dispatch, interval)
      this.onDispose(() => clearInterval(i))
      navigator.sendBeacon(
        this.remote.url,
        JSON.stringify(createAnalyticsData(this.session_id, 'pageload'))
      )
    }
  }

  private dispatch = () => {
    requestIdleCallback(() => {
      if (this.remote) {
        const levels = this.remote.levels || ['fail']
        const data = this.getKey('events').filter((e) => levels.includes(e.level))
        const eventsData = data.slice(0, this.remote.count || 100)
        navigator.sendBeacon(
          this.remote.url,
          JSON.stringify(createAnalyticsData(this.session_id, 'events', eventsData))
        )
        this.setKey('events', (items) => items.filter((e) => !levels.includes(e.level)))
      }
    })
  }

  public log = (e: EventData) => {
    const event = createEvent(e)
    this.setKey('events', (items) => [...items, event])
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
    if (e.trace || (e.level === 'fail' && this.logEvents)) {
      console.trace(e.message)
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

  public catch = (e: EventData) => {
    const message = `${e.message} ${isError(e.error) ? `[${e.error.name}: ${e.error.message}]` : ''}`

    this.log({
      ...e,
      message
    })
  }
}
