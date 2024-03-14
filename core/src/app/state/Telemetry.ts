import { any, array, object } from 'valibot'
import { APP_VERSION, SCHEMA_VERSION } from '../../sync'
import { createTimestamp, createUuid, events, isArray, isObject, isString } from '../../utils'
import { State } from '../../utils/State'
import { Instance } from '../Instance'
import { log, logColors, logStyles } from '../../utils/log'

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
  persist?: boolean
}

/**
 * Global app Telemetry
 */
export class Telemetry extends State<{ events: TelemetryEvent[] }> {
  public logEvents: boolean = true
  public events = events<Record<ErrorLevel, string>>()
  private readonly remote: AnalyticsOptions
  private session_id = createUuid('telemetry')

  /**
   *
   * @param TelemetryOptions
   */
  constructor({ log = false, remote, persist = false }: TelemetryOptions = {}) {
    super({
      initial: () => ({
        events: []
      }),
      ...(persist && {
        persist: {
          name: Instance.getPersistenceName(['telemetry']),
          schema: object({
            events: array(any())
          })
        }
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

  /**
   * Logs an event
   * @param e - event data
   */
  public log = (e: EventData) => {
    const event = this.createEvent(e)
    this.setKey('events', (items) => [...items, event])
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

  private logEvent = ({ name, message, level }: TelemetryEvent) => {
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
    this.events.emit(level, message)
    if (level === 'fail' && this.logEvents) {
      console.trace(message)
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
    if (e) {
      console.log(e)
      this.createEvent(e)
    } else {
      this.createEvent({
        name: 'Telemetry',
        message: 'Unknown error',
        level: 'fail'
      })
    }
  }

  /**
   * Catches the final error in a try...catch sequence
   *
   * @param e (optional) - event data
   */
  public catch = (e: EventData, origin?: unknown) => {
    if (isError(origin)) {
      this.logEvent(this.createEvent(e, origin))
    } else if (origin && isTelemetryEvent(origin)) {
      this.logEvent(origin)
    } else {
      this.logEvent(this.createEvent(e, origin))
    }
  }
}

export class TelemetryError extends Error {}
