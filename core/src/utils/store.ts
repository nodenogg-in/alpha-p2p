import { Unsubscribe } from '../schema'
import { isFunction } from './guards'
import { basic as equals } from './equals'
import { events } from './events'
import { Subscription } from './subscriptions'

export type Store<S> = {
  set: (partial: S | Partial<S> | ((state: S) => S | Partial<S>)) => void
  subscribe: (sub: Subscription<[S, S]>) => Unsubscribe
  get: () => S
  dispose: () => void
}

/**
 * Creates a simple, event-driven subscribable {@link Store}
 */
export const store = <S>(initial: () => S): Store<S> => {
  let value: S = initial()
  const e = events<{ state: [S, S] }>()

  return {
    set: (partial: S | Partial<S> | ((state: S) => S | Partial<S>)): void => {
      const next = isFunction(partial) ? (partial as (state: S) => S)(value) : partial
      if (!equals(next, value)) {
        const previousState = value
        value = Object.assign({}, value, next)
        e.emit('state', [value, previousState])
      }
    },
    subscribe: (sub: Subscription<[S, S]>) => e.subscribe('state', sub),
    get: () => value,
    dispose: e.dispose
  }
}
