import { isFunction, keys as toKeys } from '@nodenogg.in/utils'
import { type Signal, signal, SignalOptions } from './signal'
import { Subscription, Unsubscribe } from './subscriptions'

export type SignalObject<R extends Record<string, any>, K extends keyof R = keyof R> = {
  key: <K extends keyof R>(key: K) => Signal<R[K]>
  keys: K[]
  set: (u: Partial<R>) => void
  on: (sub: Subscription<R>) => Unsubscribe
  get: () => R
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export const signalObject = <R extends Record<string, any>>(
  r: R,
  options?: SignalOptions
): SignalObject<R> => {
  const { on, get, use, ...main } = signal<R>(() => r, options)

  const signals = {} as { [K in keyof R]: Signal<R[K]> }

  for (const k in r) {
    signals[k] = signal(() => r[k], options)
    signals[k].on(() => main.set(getObject()))
    use(signals[k].dispose)
  }

  const key = <K extends keyof R>(k: K) => signals[k]

  const keys = toKeys(signals)

  const getObject = () => {
    const out = {} as R
    for (const k in r) {
      out[k] = key(k).get()
    }
    return out
  }

  const set = (u: Partial<R>) => {
    for (const k in u) {
      key(k).set(u[k] as R[typeof k])
    }
  }

  const dispose = () => {
    main.dispose()
  }

  return {
    keys,
    key,
    set,
    on,
    get,
    dispose,
    use
  }
}
