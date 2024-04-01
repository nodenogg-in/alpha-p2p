import { NiceMap } from '@nodenogg.in/toolkit'

export type Unsubscribe = () => void

export type Subscription<T extends any = any> = (value: T) => void

/**
 * Creates a managed list of subscriptions and unsubscribe functions
 */
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

  const each = (v: any) => {
    for (const sub of listeners) {
      sub(v)
    }
  }

  return {
    add,
    dispose,
    delete: deleteSub,
    each
  }
}

export type Subscriptions = {
  add: (...sub: Subscription[]) => Unsubscribe
  dispose: () => void
  delete: (sub: Subscription) => void
  each: (value: any) => void
}

/**
 * Creates a managed list of subscriptions grouped by topic
 */
export const createTopicSubscriptions = <T extends string = string>(): TopicSubscriptions<T> => {
  const subs = new NiceMap<T, Subscriptions>()

  const add = (topic: T, ...sub: Subscription[]): Unsubscribe => {
    subs.getOrSet(topic, createSubscriptions).add(...sub)
    return () => {
      for (const s of sub) {
        subs.get(topic)?.delete(s)
      }
    }
  }

  const dispose = () => {
    for (const [, sub] of subs) {
      sub.dispose()
    }
    subs.clear()
  }

  const each = (topic: T, value: any) => {
    subs.get(topic)?.each(value)
  }

  return {
    add,
    dispose,
    each
  }
}

export type TopicSubscriptions<T extends string> = {
  add: (topic: T, ...sub: Subscription[]) => Unsubscribe
  dispose: () => void
  each: (topic: T, value: any) => void
}
