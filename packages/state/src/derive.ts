import { type Signal, signal } from './signal'
import type { State } from './State'
import type { Unsubscribe } from './subscriptions'

// Define interfaces for subscription and extraction of values
interface SubscribableBase {
  on: (callback: () => void) => Unsubscribe
}

interface Gettable<T> {
  get: () => T
}

// Union type for a subscribable entity, accommodating both Signal and State
export type Subscribable<T> = SubscribableBase &
  Gettable<T> &
  (Signal<T> | State<T extends object ? T : never>)

export type SubscribableType<S> = S extends Gettable<infer T> ? T : never

export const derive = <Subs extends Array<Subscribable<any>>, R>(
  subs: [...Subs],
  fn: (args: { [K in keyof Subs]: SubscribableType<Subs[K]> }) => R
): Signal<R> => {
  const load = (): R =>
    fn(subs.map((s) => s.get()) as { [K in keyof Subs]: SubscribableType<Subs[K]> })

  const instance = signal<R>(load)
  const event = () => instance.set(load())
  instance.onDispose(...subs.map((sub) => sub.on(event)))
  return instance
}
