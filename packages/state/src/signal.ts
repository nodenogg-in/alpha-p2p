import { type Merge, isArray, isFunction, isObject, deepMerge } from '@nodenogg.in/utils'
import { createSubscriptions, type Subscription, type Unsubscribe } from './subscriptions'
import { type Equals, shallow } from './equals'
import { createEvents } from './events'

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>)) => void
  on: (sub: Subscription<[V, V]>) => Unsubscribe
  get: () => V
  dispose: () => void
  onDispose: (...sub: Unsubscribe[]) => void
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
  { equality = shallow, merge = deepMerge }: SignalOptions = {}
): Signal<V> => {
  let value: V = initial()
  const e = createEvents<{ state: [V, V] }>()
  const subs = createSubscriptions()
  const dispose = () => {
    e.dispose()
    subs.dispose()
  }

  const isObjectSignal = isObject(value)
  const isArraySignal = isArray(value)

  return {
    set: (v: V | Partial<V> | ((v: V) => V | Partial<V>)): void => {
      const next = isFunction(v) ? (v as (v: V) => V)(value) : v
      if (!equality(next, value)) {
        const previousState = value
        value = isObjectSignal && !isArray(next) ? merge(value, next) : (next as V)
        e.emit('state', [value, previousState])
      }
    },
    on: (sub: Subscription<[V, V]>) => e.subscribe('state', sub),
    get: () => value,
    dispose,
    onDispose: subs.add
  }
}
