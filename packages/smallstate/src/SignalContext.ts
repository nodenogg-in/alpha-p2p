import {
  type Merge,
  isArray,
  isFunction,
  isObject,
  isMap,
  isSet,
  simpleMerge
} from '@nodenogg.in/utils'
import { createSubscriptions, type Subscription, type Unsubscribe } from './utils/subscriptions'
import { shallowEquals, type Equals } from './utils/equals'
import { createEvents } from './utils/events'

class SignalContext {
  private subs = new Set<(s: Subscription<any>) => Unsubscribe>()
  public active: boolean = false

  public signal = <R>(
    fn: () => R,
    { track = true, equality = shallowEquals, merge = simpleMerge }: SignalOptions = {}
  ): Signal<R> => {
    this.active = true
    const s = this.createSignal<R>(fn, equality, merge)
    if (track) {
      const tracked = Array.from(this.subs)
      if (tracked.length > 0) {
        const update = () => s?.set(fn())
        s.use(...tracked.map((sub) => sub(update)))
        this.subs.clear()
      }
    }
    this.active = false
    return s
  }

  /**
   * Creates a simple {@link Signal} for tracking a value
   */
  private createSignal = <V>(initial: () => V, equality: Equals, merge: Merge): Signal<V> => {
    let value: V = initial()
    const e = createEvents<{ state: V }>()
    const subs = createSubscriptions()

    const on = (sub: Subscription<V>) => e.subscribe('state', sub)

    return {
      set: (v: V | Partial<V> | ((v: V) => V | Partial<V>), sync: boolean = true): void => {
        const next = isFunction(v) ? (v as (v: V) => V)(value) : v
        if (!equality || !equality(next, value)) {
          const shouldMerge = isObject(next) && !isArray(next) && !isMap(next) && !isSet(next)
          value = shouldMerge ? merge(value, next) : (next as V)
          if (sync) e.emit('state', value)
        }
      },
      on,
      get: () => {
        if (this.active) {
          this.subs.add(on)
        }
        return value
      },
      dispose: () => {
        e.dispose()
        subs.dispose()
      },
      use: subs.add
    }
  }
}

export const { signal } = new SignalContext()

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void
  on: (sub: Subscription<V>) => Unsubscribe
  get: () => V
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export type SignalOptions = {
  track?: boolean
  equality?: Equals
  merge?: Merge
}
