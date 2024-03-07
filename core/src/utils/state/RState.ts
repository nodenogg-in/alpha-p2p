import { Stream } from '@thi.ng/rstream'
import type { BaseSchema } from 'valibot'
import type { Unsubscribe } from '../../schema'
import { getLocalStorage, setLocalStorage } from '../local-storage'
import { isFunction } from '../guards'
import * as equals from '../equals'
import { merge } from '../object'

export type RPersistenceOptions<S extends object> = {
  name: string[]
  schema: BaseSchema<S>
  interval?: number
}

type PartialStoreUpdate<S extends object, K extends keyof S = keyof S> = (
  state: S[K],
  prevState?: S[K]
) => Partial<S[K]>

export type RStateOptions<S extends object = object> = {
  initial: () => S
  persist?: RPersistenceOptions<S>
  throttle?: number
  equality?: equals.Equality
}

const DEFAULT_THROTTLE = 16 * 30 // Half a second at 60fps

export class RState<S extends object, K extends keyof S = keyof S> {
  protected stream: Stream<S>
  private listeners: Unsubscribe[] = []
  private persist: RPersistenceOptions<S>
  private lastUpdate: number = performance.now()
  private throttle: number
  private lastThrottle = 0
  protected initial: () => S

  constructor({ initial, persist, throttle = DEFAULT_THROTTLE }: RStateOptions<S>) {
    this.initial = initial
    if (throttle) this.throttle = throttle
    if (persist) {
      this.persist = persist
      this.stream = new Stream(getLocalStorage(this.persist.name, this.persist.schema, initial()))
    } else {
      this.stream = new Stream(initial())
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
    const update: Partial<S> = isFunction(u) ? u(this.get()) : u
    this.stream.next(merge(this.get(), update))
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public get = (): S => this.stream.deref() as S

  public setKey = <Key extends K = K>(
    key: Key,
    update: Partial<S[Key]> | PartialStoreUpdate<S, Key>,
    throttle?: number
  ) => {
    if (this.shouldThrottle(throttle)) return
    const target = this.get()[key]
    const updated = isFunction(update) ? update(target) : update
    const existing = this.get()
    this.stream.next({
      ...existing,
      [key]: merge(target, updated)
    })
    if (this.persist) requestAnimationFrame(this.persistState)
  }

  public on = (sub: (value: S) => void): Unsubscribe => {
    const subscription = this.stream.subscribe((state: S) => {
      sub(state)
    })
    this.onDispose(subscription.unsubscribe)
    return subscription.unsubscribe
  }

  public dispose = () => {
    this.stream.unsubscribe()
    this.stream.cancel()

    for (const unsubscribe of this.listeners) {
      unsubscribe()
    }
    for (const entry of Object.values(this)) {
      if (isRState(entry)) {
        entry.dispose()
      }
    }
  }

  public onDispose = (...sub: Unsubscribe[]) => {
    this.listeners.push(...sub)
  }

  public reset = () => {
    this.set(this.initial())
  }
}

export const isRState = (s: any): s is RState<any> => s instanceof RState
