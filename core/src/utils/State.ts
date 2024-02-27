import { type StoreApi, createStore } from 'zustand/vanilla'
import { deepmerge } from 'deepmerge-ts'
import type { Unsubscribe } from '../schema'
import { BaseSchema } from 'valibot'
import { getLocalStorage, setLocalStorage } from './local-storage'
import { isFunction } from './guards'

type PersistenceOptions<S extends object> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends string & keyof S = string & keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

type Equals<S> = (state: S, prevState: S) => boolean

export const basicEquals: Equals<any> = (state, prevState) => state === prevState

type StateOptions<S extends object = object> = {
  initial: () => S
  persist?: PersistenceOptions<S>
  throttle: number
}

const DEFAULT_THROTTLE = 16

export class State<S extends object, K extends string & keyof S = string & keyof S> {
  private store: StoreApi<S>
  private listeners: Unsubscribe[] = []
  private persist: PersistenceOptions<S>
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0

  constructor({ initial, persist, throttle = DEFAULT_THROTTLE }: StateOptions<S>) {
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
    const update = isFunction(u) ? u(this.store.getState()) : u
    this.store.setState(() => ({
      ...this.get(),
      ...update
    }))
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
      [key]: deepmerge(target, updated)
    }))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public onKey = <Key extends K = K>(sub: Key, handler: (data: S[Key], prev: S[Key]) => void) => {
    this.listeners.push(
      this.store.subscribe((state, prevState) => {
        if (!basicEquals(state, prevState)) handler(state[sub], prevState[sub])
      })
    )
  }

  public on = (sub: (value: S, prev?: S) => void) => {
    this.listeners.push(
      this.store.subscribe((state, prevState) => {
        sub(state, prevState)
      })
    )
  }

  public clearListeners = () => {
    for (const unsubscribe of this.listeners) {
      unsubscribe()
    }
  }
}
