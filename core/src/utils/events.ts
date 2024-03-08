import { type Unsubscribe } from '../schema'
import { createKeyedSubscriptions, createSubscriptions, type Subscription } from './subscriptions'

export type Events<S extends Record<string, any>, K extends string & keyof S = string & keyof S> = {
  subscribe: (key: K, sub: Subscription) => Unsubscribe
  any: (sub: Subscription<S>) => Unsubscribe
  subscribeMany: <TEventName extends K>(
    listeners: Record<TEventName, (eventArg: S[TEventName]) => void>
  ) => Unsubscribe
  emit: <Key extends K = K>(key: Key, value: S[Key]) => void
  dispose: () => void
}

export const events = <
  S extends Record<string, any>,
  K extends string & keyof S = string & keyof S
>(): Events<S, K> => {
  const subs = createKeyedSubscriptions()
  const anySub = createSubscriptions()

  const subscribe = <Key extends K = K>(key: Key, sub: Subscription<S[Key]>) => subs.add(key, sub)

  const subscribeMany = <Key extends K>(
    listeners: Record<Key, (eventArg: S[Key]) => void>
  ): Unsubscribe => {
    const unsubscribes: Unsubscribe[] = []

    for (const [eventName, handler] of Object.entries(listeners) as [Key, S[Key]][]) {
      unsubscribes.push(subs.add(eventName, handler))
    }

    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe()
      }
    }
  }

  const any = (sub: Subscription<S>) => anySub.add(sub)

  const emit = <Key extends K = K>(key: Key, value: S[Key]) => {
    subs.each(key, (sub) => sub(value))
    anySub.each((listener) => listener(value))
  }

  const dispose = () => {
    anySub.dispose()
    subs.dispose()
  }

  return {
    any,
    subscribe,
    subscribeMany,
    emit,
    dispose
  }
}
