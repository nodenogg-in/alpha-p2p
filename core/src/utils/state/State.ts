import type { BaseSchema } from 'valibot'
import type { Unsubscribe } from '../../schema'
import { getLocalStorage, setLocalStorage } from '../local-storage'
import { isFunction } from '../guards'
import * as equals from '../equals'
import { merge } from '../object'
import { type Store, store } from '../store'
import { createSubscriptions } from '../subscriptions'

export type PersistenceOptions<S extends object> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends keyof S = keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

export type StateOptions<S extends object = object> = {
  initial: () => S
  persist?: PersistenceOptions<S>
  throttle?: number
  equality?: equals.Equality
}

const DEFAULT_THROTTLE = 16 * 30 // Half a second at 60fps

export class State<S extends object, K extends keyof S = keyof S> {
  private store: Store<S>
  private subscriptions = createSubscriptions()
  private persist: PersistenceOptions<S>
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0
  private isEqual: (s: any, t: any) => boolean
  protected initial: () => S

  constructor({
    initial,
    persist,
    throttle = DEFAULT_THROTTLE,
    equality = 'shallow'
  }: StateOptions<S>) {
    this.initial = initial
    this.isEqual = equals[equality]
    if (throttle) this.throttle = throttle
    if (persist) {
      this.persist = persist
      this.store = store(() => getLocalStorage(this.persist.name, this.persist.schema, initial()))
    } else {
      this.store = store(initial)
    }
  }

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

  private persistState = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.get())
      this.lastUpdate = now
    }
  }

  public set = (u: Partial<S> | ((store: S) => Partial<S>), throttle?: number) => {
    if (this.shouldThrottle(throttle)) return
    const update: Partial<S> = isFunction(u) ? u(this.store.get()) : u
    this.store.set((state) => merge(state, update))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public get = (): S => this.store.get()

  public getKey = <Key extends K>(key: Key) => this.get()[key]

  public setKey = <Key extends K = K>(
    key: Key,
    update: Partial<S[Key]> | PartialStoreUpdate<S, Key>,
    throttle?: number
  ) => {
    if (this.shouldThrottle(throttle)) return
    const target = this.getKey(key)
    const updated = isFunction(update) ? update(target) : update
    this.store.set((s) => ({
      ...s,
      [key]: merge(target, updated)
    }))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public onKey = <Key extends K = K>(sub: Key, handler: (data: S[Key], prev: S[Key]) => void) => {
    const subscription = this.store.subscribe(([state, prevState]) => {
      if (!this.isEqual(state[sub], prevState[sub])) handler(state[sub], prevState[sub])
    })
    this.onDispose(subscription)
    return subscription
  }

  public on = (sub: (value: S, prev?: S) => void) => {
    const subscription = this.store.subscribe(([state, prevState]) => {
      if (!this.isEqual(state, prevState)) sub(state, prevState)
    })
    this.onDispose(subscription)
    return subscription
  }

  public dispose = () => {
    this.store.dispose()
    this.subscriptions.dispose()
    for (const entry of Object.values(this)) {
      if (isState(entry)) {
        entry.dispose()
      }
    }
  }

  public onDispose = (...sub: Unsubscribe[]) => this.subscriptions.add(...sub)

  public reset = () => {
    this.set(this.initial())
  }
}

export const isState = (s: any): s is State<any> => s instanceof State

export type StateType<S> = S extends State<infer T> ? T : never

type DeriveStateOptions = {
  throttle?: number
  equality?: equals.Equality
}

export const deriveState = <States extends State<any>[], R extends object>(
  states: [...States],
  derive: (
    ...states: {
      [K in keyof States]: StateType<States[K]>
    }
  ) => R,
  options: DeriveStateOptions = {}
) => {
  const load = (): R =>
    derive(
      ...(states.map((state) => state.get()) as {
        [K in keyof States]: StateType<States[K]>
      })
    )
  const state = new State<R>({
    initial: load,
    ...options
  })
  state.onDispose(...states.map((s) => s.on(() => state.set(load()))))
  return state
}
