import { events, state, manager } from '@figureland/kit/state'
import { createTimestamp, createUuid } from '@nodenogg.in/microcosm'
import { isObject, isString, isValidURL, isArray } from '@figureland/kit/tools/guards'

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

export type ErrorLevel = 'info' | 'warn' | 'fail' | 'status'

type EventData = {
  name: string
  level: ErrorLevel
  error?: unknown
  message: string
  tags?: string[]
}

type TelemetryEvent = Omit<EventData, 'error'> & {
  type: 'telemetry'
  error?: Error
  created: string
}

/**
 *
 * @param error
 * @returns
 */
export const isTelemetryEvent = (error: unknown): error is TelemetryEvent =>
  isObject(error) &&
  isString((error as TelemetryEvent).created) &&
  (error as TelemetryEvent).type === 'telemetry'

/**
 *
 * @param error
 * @returns
 */
export const isError = (error: unknown): error is Error => error instanceof Error

/**
 *
 * @param session_id
 * @param type
 * @param data
 * @returns
 */
const createAnalyticsData = <T extends Record<string, unknown>>(
  session_id: string,
  type: string,
  data?: T
) => ({
  session_id,
  created: createTimestamp(),
  type,
  device: {
    userAgent: navigator.userAgent,
    language: navigator.language
  },
  app: {
    // schema: schemaVersion,
    // version: Instance.appVersion
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

/**
 * Global app Telemetry
 */
export class Telemetry {
  private manager = manager()
  private use = this.manager.use
  public dispose = this.manager.dispose

  events = events<{ events: TelemetryEvent[] }>()
  state = state<{ events: TelemetryEvent[] }>({ events: [] })
  public logEvents: boolean = true
  public emitter = events<Record<ErrorLevel, string>>()
  private remote: AnalyticsOptions
  private session_id = createUuid('telemetry')

  public init = ({ log = false, remote }: TelemetryOptions = {}) => {
    this.logEvents = log
    if (remote) {
      if (!isValidURL(remote.url)) {
        this.log({
          name: 'Telemetry',
          message: `Invalid remote URL (${remote.url})`,
          level: 'warn'
        })
        return
      }
      this.remote = remote
      const interval = remote.interval || 1000 * 60 * 1
      const i = setInterval(this.dispatch, interval)
      this.use(() => clearInterval(i))
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
        const data = this.state.get().events.filter((e) => levels.includes(e.level))
        const eventsData = data.slice(0, this.remote.count || 100)
        navigator.sendBeacon(
          this.remote.url,
          JSON.stringify(createAnalyticsData(this.session_id, 'events', { events: eventsData }))
        )
        this.state.set(({ events }) => ({
          events: events.filter((e) => !levels.includes(e.level))
        }))
      }
    })
  }

  /**
   * Logs an event
   * @param e - event data
   */
  public log = (e: EventData) => {
    const event = this.createEvent(e)
    this.state.set(({ events }) => ({ events: [...events, event] }))
    this.logEvent(event)
  }

  private createEvent = (
    { name, message, level, tags = [] }: EventData,
    error?: unknown
  ): TelemetryEvent => ({
    type: 'telemetry',
    message: isError(error) ? error.message : message,
    level,
    name,
    tags,
    created: new Date().toLocaleTimeString(),
    ...(isError(error) && error)
  })

  private logEvent = ({ name, message, level, error }: TelemetryEvent) => {
    if (this.logEvents) {
      log([
        [
          `⬤ ${level.toUpperCase()}`,
          `background: rgba(${logColors[level]},0.2); color: rgb(${logColors[level]},1.0); padding: 2px 4px; border-radius:2px; margin-right: 2px;`
        ],
        [name, logStyles.neutral],
        [message]
      ])
    }
    this.emitter.emit(level, message)
    if (level === 'fail' && this.logEvents) {
      console.trace(message)
    }
    if (isError(error)) {
      console.log(error)
    }
  }

  /**
   * Starts a timed event that is finished by calling .finish()
   * @param e - event data
   * @returns
   */
  public time = (e: EventData) => {
    const start = performance.now()
    return {
      finish: () => {
        const duration = performance.now() - start
        this.log({ ...e, message: `${e.message} [${duration.toFixed(2)}ms]` })
      }
    }
  }

  /**
   * Handles a thrown error
   *
   * @param e (optional) - event data
   */
  public throw = (e?: EventData) => {
    if (e) throw new TelemetryError(e)
  }

  /**
   * Catches the final error in a try...catch sequence
   *
   * @param e (optional) - event data
   */
  public catch = (e: unknown) => {
    if (isTelemetryError(e)) {
      this.logEvent(this.createEvent(e.data))
    } else if (isError(origin)) {
      this.logEvent(
        this.createEvent({ name: 'error', level: 'fail', message: origin.message }, origin)
      )
    } else {
      throw e
    }
  }
}

export class TelemetryError extends Error {
  readonly origin?: Error
  readonly type = 'telemetry'
  constructor(
    public data: EventData,
    origin?: unknown
  ) {
    super()
    if (isError(origin)) {
      this.origin = origin
      this.stack = origin.stack
    }
  }
}

export const isTelemetryError = (error: unknown): error is TelemetryError =>
  error instanceof TelemetryError

export const collectTelemetryErrors = (e: PromiseRejectedResult[]) =>
  e
    .map((r) => r.reason)
    .filter(isTelemetryError)
    .map((e) => e.data.message)
