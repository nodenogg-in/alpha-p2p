import { keys } from '@nodenogg.in/toolkit'
import { type Signal, type SignalOptions, signal } from './signal'
import type { Subscription, Unsubscribe } from './utils/subscriptions'

export type SignalObject<R extends Record<string, any>, K extends keyof R = keyof R> = {
  key: <K extends keyof R>(key: K) => Signal<R[K]>
  keys: K[]
  set: (u: Partial<R>, sync?: boolean) => void
  on: (sub: Subscription<R>) => Unsubscribe
  get: () => R
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export const signalObject = <R extends Record<string, any>>(
  r: R,
  options?: SignalOptions
): SignalObject<R> => {
  const parent = signal<R>(() => r, options)
  const signals = {} as { [K in keyof R]: Signal<R[K]> }

  for (const k in r) {
    signals[k] = signal(() => r[k], options)
    parent.use(signals[k].on(() => parent.set(getObject())))
    parent.use(signals[k].dispose)
  }

  const key = <K extends keyof R>(k: K) => signals[k]

  const getObject = () => {
    const out = {} as R
    for (const k in r) {
      out[k] = key(k).get()
    }
    return out
  }

  const set = (u: Partial<R>, sync?: boolean) => {
    for (const k in u) {
      key(k).set(u[k] as R[typeof k], sync)
    }
  }

  const dispose = () => {
    parent.dispose()
  }

  return {
    keys: keys(signals),
    key,
    set,
    on: parent.on,
    get: parent.get,
    dispose: parent.dispose,
    use: parent.use
  }
}
