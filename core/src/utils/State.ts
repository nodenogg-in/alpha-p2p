import { type StoreApi, createStore } from 'zustand/vanilla'
import type { Unsubscribe } from '../schema'
import { BaseSchema } from 'valibot'
import { getLocalStorage, setLocalStorage } from './local-storage'
import { isFunction } from './guards'
import { merge } from './object'
import { shallowEqual as shallowEqualFn, deepEqual as deepEqualFn } from 'fast-equals'

type PersistenceOptions<S extends object> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends string & keyof S = string & keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

type Equals = (s: unknown, t: unknown) => boolean

export const basicEquals: Equals = (state, prevState) => state === prevState
export const shallowEquals: Equals = shallowEqualFn
export const deepEquals: Equals = deepEqualFn

type StateOptions<S extends object = object> = {
  initial: () => S
  persist?: PersistenceOptions<S>
  throttle?: number
  equals?: Equals
}

const DEFAULT_THROTTLE = 200

export class State<S extends object, K extends string & keyof S = string & keyof S> {
  private store: StoreApi<S>
  private listeners: Unsubscribe[] = []
  private persist: PersistenceOptions<S>
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0
  private isEqual: (s: any, t: any) => boolean

  constructor({
    initial,
    persist,
    throttle = DEFAULT_THROTTLE,
    equals = shallowEquals
  }: StateOptions<S>) {
    this.isEqual = equals
    if (throttle) this.throttle = throttle
    if (persist) {
      this.persist = persist
      const initialStateFromStorage = getLocalStorage(
        this.persist.name,
        this.persist.schema,
        initial()
      )
      this.store = createStore(() => initialStateFromStorage)
    } else {
      this.store = createStore(initial)
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

  protected persistState = () => {
    const now = performance.now()
    if (!this.persist.interval || now - this.lastUpdate >= this.persist.interval) {
      setLocalStorage(this.persist.name, this.get())
      this.lastUpdate = now
    }
  }

  public set = (u: Partial<S> | ((store: S) => Partial<S>), throttle?: number) => {
    if (this.shouldThrottle(throttle)) return
    const update: Partial<S> = isFunction(u) ? u(this.store.getState()) : u
    this.store.setState((state) => merge(state, update))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public get = (): S => this.store.getState()

  public getKey = <Key extends K = K>(key: Key) => this.get()[key]

  public setKey = <Key extends K = K>(
    key: Key,
    update: Partial<S[Key]> | PartialStoreUpdate<S, Key>,
    throttle?: number
  ) => {
    if (this.shouldThrottle(throttle)) return
    const target = this.getKey(key)
    const updated = isFunction(update) ? update(target) : update
    this.store.setState((s) => ({
      ...s,
      [key]: merge(target, updated)
    }))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public onKey = <Key extends K = K>(
    sub: Key,
    handler: (data: S[Key], prev: S[Key]) => void
  ): Unsubscribe => {
    const subscription = this.store.subscribe((state, prevState) => {
      if (!this.isEqual(state[sub], prevState[sub])) handler(state[sub], prevState[sub])
    })
    this.listeners.push(subscription)
    return subscription
  }

  public on = (sub: (value: S, prev?: S) => void): Unsubscribe => {
    const subscription = this.store.subscribe((state, prevState) => {
      if (!this.isEqual(state, prevState)) sub(state, prevState)
    })
    this.listeners.push(subscription)
    return subscription
  }

  public clearListeners = () => {
    for (const unsubscribe of this.listeners) {
      unsubscribe()
    }
  }
}

export const derivedState = <R extends object, S extends object>(
  state: State<S>,
  deriveState: (s: S) => R
) => {
  const watch = new State<R>({ initial: () => deriveState(state.get()) })
  state.on((s) => watch.set(deriveState(s)))
  return watch
}
