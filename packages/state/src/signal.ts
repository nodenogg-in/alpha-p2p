import { isFunction, isObject } from '@nodenogg.in/utils'
import type { Subscription, Unsubscribe } from './subscriptions'
import { basic as equals } from './equals'
import { events } from './events'

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>)) => void
  on: (sub: Subscription<[V, V]>) => Unsubscribe
  get: () => V
  dispose: () => void
}

/**
 * Creates a simple {@link Signal} for tracking a value
 */
export const signal = <V>(initial: () => V): Signal<V> => {
  let value: V = initial()
  const e = events<{ state: [V, V] }>()

  return {
    set: (v: V | Partial<V> | ((v: V) => V | Partial<V>)): void => {
      const next = isFunction(v) ? (v as (v: V) => V)(value) : v
      if (!equals(next, v)) {
        const previousState = value
        value = isObject(v) ? Object.assign({}, value, next) : (next as V)
        e.emit('state', [value, previousState])
      }
    },
    on: (sub: Subscription<[V, V]>) => e.subscribe('state', sub),
    get: () => value,
    dispose: e.dispose
  }
}

/**
 * Create a derived {@link Signal} from an array of {@link Signals}s
 */
export const derive = <Signals extends Signal<any>[], R extends object>(
  states: [...Signals],
  fn: (states: {
    [K in keyof Signals]: SignalType<Signals[K]>
  }) => R
): Signal<R> => {
  const load = (): R =>
    fn(
      states.map((s) => s.get()) as {
        [K in keyof Signals]: SignalType<Signals[K]>
      }
    )

  const s = signal<R>(load)

  states.forEach((s) => s.on(() => s.set(load())))
  return s
}
