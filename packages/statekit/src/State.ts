import { values } from '@nodenogg.in/toolkit'
import type { Unsubscribe } from './utils/subscriptions'
import {
  type LocalStorageValidator,
  getLocalStorage,
  setLocalStorage,
  listenToLocalStorage
} from './utils/local-storage'
import { createSubscriptions } from './utils/subscriptions'
import { type SignalObject, signalObject } from './signal-object'
import type { SignalOptions } from './signal'

export type PersistenceName = string[]

export type PersistenceOptions = {
  name: PersistenceName
  validate: LocalStorageValidator
  syncTabs?: boolean
  interval?: number
}

export type StateOptions<S extends object = object> = {
  initial: () => S
  persist?: PersistenceOptions
  throttle?: number
  signal?: SignalOptions
}

const DEFAULT_THROTTLE = 16 * 30 // Half a second at 60fps

/* Generic foundation class for managing reactive state */
export class State<S extends object, K extends string & keyof S = string & keyof S> {
  public signal: SignalObject<S>
  private subscriptions = createSubscriptions()
  private persist: PersistenceOptions
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0
  protected initial: () => S

  constructor({
    initial,
    persist,
    throttle = DEFAULT_THROTTLE,
    signal: signalOptions
  }: StateOptions<S>) {
    this.initial = initial
    if (throttle) this.throttle = throttle

    if (persist) {
      this.persist = persist
      this.signal = signalObject(
        getLocalStorage(this.persist.name, this.persist.validate, initial),
        signalOptions
      )
      if (persist.syncTabs) {
        // this.use(
        //   listenToLocalStorage<S>(this.persist.name, this.persist.validate, (data) =>
        //     this.set(data)
        //   )
        // )
      }
      this.signal.on(this.onChange)
    } else {
      this.signal = signalObject(initial(), signalOptions)
    }
  }

  /*
   * @param t - throttle time in milliseconds
   * @returns true if the update should be throttled
   */
  private shouldThrottle = (): boolean => {
    const t = this.throttle
    if (!t) {
      return false
    }
    const now = performance.now()
    if (t && now - this.lastThrottle < t) {
      return true
    }
    this.lastThrottle = now
    return false
  }

  /*  Persist the state to local storage */
  private onChange = (state: S) => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, state)
      this.lastUpdate = now
    }
  }

  /*  Set the state using either a partial update or a function that returns a partial update */
  public set = (u: Partial<S>, sync: boolean = true) => {
    if (this.shouldThrottle()) return
    this.signal.set(u, sync)
  }

  /*  Get the current state */
  public get = (): S => this.signal.get()

  public key = <Key extends K = K>(k: Key) => this.signal.key(k)

  /* Subscribe to all state changes */
  public on = (sub: (value: S) => void) => this.signal.on(sub)

  /*  Subscribe to state changes */
  public dispose = async () => {
    this.signal.dispose()
    this.subscriptions.dispose()
    for (const entry of values(this)) {
      if (isState(entry)) {
        await entry.dispose()
      }
    }
  }

  /*
   *  Add a unsubscribe hook to be called when the state is disposed
   *  @param subs - unsubscribe hooks
   */
  public use = (...sub: Unsubscribe[]) => this.subscriptions.add(...sub)

  /* Reset the state to its initial provided value, initial() */
  public resetInitial = () => {
    this.set(this.initial())
  }
}

/*  Check if a value is a State */
export const isState = (s: any): s is State<any> => s instanceof State

export type StateType<S> = S extends State<infer T> ? T : never
