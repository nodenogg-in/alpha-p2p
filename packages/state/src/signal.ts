import { isArray, isFunction, isObject } from '@nodenogg.in/utils'
import { createSubscriptions, type Subscription, type Unsubscribe } from './subscriptions'
import { basic } from './equals'
import { createEvents } from './events'

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>)) => void
  on: (sub: Subscription<[V, V]>) => Unsubscribe
  get: () => V
  dispose: () => void
  onDispose: (...sub: Unsubscribe[]) => void
}

/**
 * Creates a simple {@link Signal} for tracking a value
 */
export const signal = <V>(initial: () => V): Signal<V> => {
  let value: V = initial()
  const e = createEvents<{ state: [V, V] }>()
  const subs = createSubscriptions()
  const dispose = () => {
    e.dispose()
    subs.dispose()
  }
  return {
    set: (v: V | Partial<V> | ((v: V) => V | Partial<V>)): void => {
      const next = isFunction(v) ? (v as (v: V) => V)(value) : v
      if (!basic(next, value)) {
        const previousState = value
        value = isObject(next) && !isArray(next) ? Object.assign({}, value, next) : (next as V)
        e.emit('state', [value, previousState])
      }
    },
    on: (sub: Subscription<[V, V]>) => e.subscribe('state', sub),
    get: () => value,
    dispose,
    onDispose: subs.add
  }
}
