import { State, createEvents } from '@nodenogg.in/smallstate'
import { isObject, isString, isValidURL } from '@nodenogg.in/utils'
import { any, array, is, object } from 'valibot'
import { createTimestamp, createUuid } from '../../api/utils/uuid'
import { Instance } from '../Instance'
import { log, logColors, logStyles } from '../log'

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
    screen: Instance.ui.screen.key('screen')
  },
  app: {
    schema: Instance.schemaVersion,
    version: Instance.appVersion
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
  public events = createEvents<Record<ErrorLevel, string>>()
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
          validate: (v) =>
            is(
              object({
                events: array(any())
              }),
              v
            )
        }
      })
    })

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
        const data = this.key('events')
          .get()
          .filter((e) => levels.includes(e.level))
        const eventsData = data.slice(0, this.remote.count || 100)
        navigator.sendBeacon(
          this.remote.url,
          JSON.stringify(createAnalyticsData(this.session_id, 'events', eventsData))
        )
        this.key('events').set((items) => items.filter((e) => !levels.includes(e.level)))
      }
    })
  }

  /**
   * Logs an event
   * @param e - event data
   */
  public log = (e: EventData) => {
    const event = this.createEvent(e)
    this.key('events').set((items) => [...items, event])
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
    this.events.emit(level, message)
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
    if (e) {
      console.log(e)
      console.trace(e)
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
