import { entries } from '@nodenogg.in/toolkit'
import {
  createSubscriptions,
  createTopicSubscriptions,
  type Subscription,
  type Unsubscribe
} from './subscriptions'

export type Events<S extends Record<string, any>, K extends string & keyof S = string & keyof S> = {
  on: <Key extends K = K>(key: Key, sub: Subscription<S[Key]>) => Unsubscribe
  onAll: (sub: Subscription<S>) => Unsubscribe
  onMany: <TEventName extends K>(
    listeners: Record<TEventName, (eventArg: S[TEventName]) => void>
  ) => Unsubscribe
  emit: <Key extends K = K>(key: Key, value: S[Key]) => void
  dispose: () => void
}

/**
 * Creates a new event emitter
 */
export const createEvents = <
  S extends Record<string, any>,
  K extends string & keyof S = string & keyof S
>(): Events<S, K> => {
  const subs = createTopicSubscriptions()
  const all = createSubscriptions()

  /**
   * Subscribe to a specific event
   */
  const on = <Key extends K = K>(key: Key, sub: Subscription<S[Key]>) => subs.add(key, sub)

  return {
    on,
    onMany: <Key extends K>(listeners: Record<Key, (eventArg: S[Key]) => void>): Unsubscribe => {
      const unsubscribes = (entries(listeners) as [Key, S[Key]][]).map((listener) =>
        on(...listener)
      )

      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe()
        }
      }
    },
    onAll: (sub: Subscription<S>) => all.add(sub),
    emit: <Key extends K = K>(key: Key, value: S[Key]) => {
      subs.each(key, value)
      all.each(value)
    },
    dispose: () => {
      all.dispose()
      subs.dispose()
    }
  }
}