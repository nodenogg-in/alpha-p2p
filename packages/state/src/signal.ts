import {
  type Merge,
  isArray,
  isFunction,
  isObject,
  isMap,
  isSet,
  simpleMerge
} from '@nodenogg.in/utils'
import { createSubscriptions, type Subscription, type Unsubscribe } from './subscriptions'
import { shallowEquals, type Equals } from './equals'
import { createEvents } from './events'

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>)) => void
  on: (sub: Subscription<V>) => Unsubscribe
  get: () => V
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export type SignalOptions = {
  equality?: Equals
  merge?: Merge
}

/**
 * Creates a simple {@link Signal} for tracking a value
 */
export const signal = <V>(
  initial: () => V,
  { equality = shallowEquals, merge = simpleMerge }: SignalOptions = {}
): Signal<V> => {
  let value: V = initial()
  const e = createEvents<{ state: V }>()
  const subs = createSubscriptions()

  return {
    set: (v: V | Partial<V> | ((v: V) => V | Partial<V>)): void => {
      const next = isFunction(v) ? (v as (v: V) => V)(value) : v
      if (!equality || !equality(next, value)) {
        const shouldMerge = isObject(next) && !isArray(next) && !isMap(next) && !isSet(next)
        value = shouldMerge ? merge(value, next) : (next as V)
        e.emit('state', value)
      }
    },
    on: (sub: Subscription<V>) => e.subscribe('state', sub),
    get: () => value,
    dispose: () => {
      e.dispose()
      subs.dispose()
    },
    use: subs.add
  }
}
