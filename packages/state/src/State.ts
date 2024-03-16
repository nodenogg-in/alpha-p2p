import { isFunction } from '@nodenogg.in/utils'
import type { Unsubscribe } from './subscriptions'
import { type LocalStorageValidator, getLocalStorage, setLocalStorage } from './local-storage'
import * as equals from './equals'
import { merge, values } from '../../utils/src/object'
import { type Signal, signal } from './signal'
import { createSubscriptions } from './subscriptions'

export type PersistenceOptions = {
  name: string[]
  validate: LocalStorageValidator
  localStorage?: boolean
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends keyof S = keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

export type StateOptions<S extends object = object> = {
  initial: () => S
  persist?: PersistenceOptions
  throttle?: number
  equality?: equals.Equals
}

const DEFAULT_THROTTLE = 16 * 30 // Half a second at 60fps

/* Generic foundation class for managing reactive state */
export class State<S extends object, K extends keyof S = keyof S> {
  public signal: Signal<S>
  private subscriptions = createSubscriptions()
  private persist: PersistenceOptions
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0
  private isEqual: (s: any, t: any) => boolean
  protected initial: () => S

  constructor({
    initial,
    persist,
    throttle = DEFAULT_THROTTLE,
    equality = equals.shallow
  }: StateOptions<S>) {
    this.initial = initial
    this.isEqual = equality
    if (throttle) this.throttle = throttle

    if (persist) {
      this.persist = persist
      this.signal = signal(() => getLocalStorage(this.persist.name, this.persist.validate, initial))
    } else {
      this.signal = signal(initial)
    }
  }
  /*
   * @param t - throttle time in milliseconds
   * @returns true if the update should be throttled
   */
  private shouldThrottle = (t?: number): boolean => {
    const throttle = t || this.throttle
    if (!throttle) {
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
  private onChange = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.get())
      this.lastUpdate = now
    }
  }

  /*  Set the state using either a partial update or a function that returns a partial update */
  public set = (u: Partial<S> | ((store: S) => Partial<S>), throttle?: number) => {
    if (this.shouldThrottle(throttle)) return
    const update: Partial<S> = isFunction(u) ? u(this.signal.get()) : u
    this.signal.set((state) => merge(state, update))
    if (this.persist) requestAnimationFrame(this.onChange)
  }

  /*  Get the current state */
  public get = (): S => this.signal.get()

  /*  Get a specific key from the state */
  public getKey = <Key extends K>(key: Key) => this.get()[key]

  /*  Set a specific key in the state */
  public setKey = <Key extends K = K>(
    key: Key,
    update: Partial<S[Key]> | PartialStoreUpdate<S, Key>,
    throttle?: number
  ) => {
    if (this.shouldThrottle(throttle)) return
    const target = this.getKey(key)
    const updated = isFunction(update) ? update(target) : update
    this.signal.set((s) => ({
      ...s,
      [key]: merge(target, updated)
    }))
    if (this.persist) requestAnimationFrame(this.onChange)
  }

  /*  Subscribe to state changes from a specific key */
  public onKey = <Key extends K = K>(sub: Key, handler: (data: S[Key], prev: S[Key]) => void) => {
    const subscription = this.signal.on(([state, prevState]) => {
      if (!this.isEqual(state[sub], prevState[sub])) handler(state[sub], prevState[sub])
    })
    this.onDispose(subscription)
    return subscription
  }

  /* Subscribe to all state changes */
  public on = (sub: (value: S, prev?: S) => void) => {
    const subscription = this.signal.on(([state, prevState]) => {
      if (!this.isEqual(state, prevState)) sub(state, prevState)
    })
    this.onDispose(subscription)
    return subscription
  }

  /*  Subscribe to state changes */
  public dispose = () => {
    this.signal.dispose()
    this.subscriptions.dispose()
    for (const entry of values(this)) {
      if (isState(entry)) {
        entry.dispose()
      }
    }
  }

  /*
   *  Add a unsubscribe hook to be called when the state is disposed
   *  @param subs - unsubscribe hooks
   */
  public onDispose = (...sub: Unsubscribe[]) => this.subscriptions.add(...sub)

  /* Reset the state to its initial provided value, initial() */
  public reset = () => {
    this.set(this.initial())
  }
}

/*  Check if a value is a State */
export const isState = (s: any): s is State<any> => s instanceof State

export type StateType<S> = S extends State<infer T> ? T : never
