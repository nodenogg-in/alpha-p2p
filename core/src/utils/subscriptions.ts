import { Unsubscribe } from '../schema'

export type Subscription<T extends any = any> = (value: T) => void

export const createSubscriptions = (): Subscriptions => {
  const listeners: Set<Subscription> = new Set()

  const deleteSub = (...sub: Subscription[]) => {
    for (const s of sub) {
      listeners.delete(s)
    }
  }

  const add = (...sub: Subscription[]) => {
    for (const s of sub) {
      listeners.add(s)
    }
    return () => deleteSub(...sub)
  }

  const dispose = () => {
    listeners.clear()
  }

  const each = (cb: (sub: Subscription) => void) => {
    for (const sub of listeners) {
      cb(sub)
    }
  }

  return {
    add,
    dispose,
    delete: deleteSub,
    each
  }
}

type Subscriptions = {
  add: (...sub: Subscription[]) => Unsubscribe
  dispose: () => void
  delete: (sub: Subscription) => void
  each: (cb: (sub: Subscription) => void) => void
}

export const createKeyedSubscriptions = () => {
  const subs: Map<string, Subscriptions> = new Map()

  const add = (key: string, ...sub: Subscription[]): Unsubscribe => {
    if (!subs.has(key)) subs.set(key, createSubscriptions())
    for (const s of sub) {
      subs.get(key)?.add(s)
    }
    return () => {
      for (const s of sub) {
        subs.get(key)?.delete(s)
      }
    }
  }

  const dispose = () => {
    for (const [, sub] of subs) {
      sub.dispose()
    }
    subs.clear()
  }

  const each = (key: string, cb: (sub: Subscription) => void) => {
    subs.get(key)?.each(cb)
  }

  return {
    add,
    dispose,
    each
  }
}

export type KeyedSubscriptions = {
  add: (key: string, ...sub: Subscription[]) => Unsubscribe
  dispose: () => void
  each: (key: string, cb: (sub: Subscription) => void) => void
}
