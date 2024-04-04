import { values } from '@nodenogg.in/toolkit'
import type { Unsubscribe } from './utils/subscriptions'
import { createSubscriptions } from './utils/subscriptions'
import { signalObject } from './signal-object'
import type { SignalOptions } from './signal'
import { type PersistenceOptions, persist } from './persist'
import { SignalObject, SignalState } from '.'

export type StateOptions<S extends object = object> = {
  initial: () => S
  persistence?: PersistenceOptions
  throttle?: number
  signal?: SignalOptions
}

const DEFAULT_THROTTLE = 16 * 30 // Half a second at 60fps

/* Generic foundation class for managing reactive state */
export class State<S extends object, K extends string & keyof S = string & keyof S>
  implements SignalState<S, K>
{
  public readonly id: string
  public signal: SignalObject<S>
  private subscriptions = createSubscriptions()
  private throttle: number
  private lastThrottle = 0
  protected initial: () => S

  constructor({
    initial,
    persistence,
    throttle = DEFAULT_THROTTLE,
    signal: signalOptions
  }: StateOptions<S>) {
    this.initial = initial
    if (throttle) this.throttle = throttle
    this.signal = signalObject(initial(), signalOptions)
    this.id = this.signal.id
    if (persistence) {
      persist(this.signal, persistence)
    }
  }

  /*
   * @param t - throttle time in milliseconds
   * @returns true if the update should be throttled
   */
  private shouldThrottle = (): boolean => {
    const t = this.throttle
    if (!t) {
      return false
    }
    const now = performance.now()
    if (t && now - this.lastThrottle < t) {
      return true
    }
    this.lastThrottle = now
    return false
  }

  /*  Set the state using either a partial update or a function that returns a partial update */
  public set = (u: Partial<S>, sync: boolean = true) => {
    if (this.shouldThrottle()) return
    this.signal.set(u, sync)
  }

  /*  Get the current state */
  public get = (): S => this.signal.get()

  public key = <Key extends K = K>(k: Key) => this.signal.key(k)

  /* Subscribe to all state changes */
  public on = (sub: (value: S) => void) => this.signal.on(sub)

  /*  Subscribe to state changes */
  public dispose = async () => {
    this.signal.dispose()
    this.subscriptions.dispose()
    for (const entry of values(this)) {
      if (isState(entry)) {
        await entry.dispose()
      }
    }
  }

  /*
   *  Add a unsubscribe hook to be called when the state is disposed
   *  @param subs - unsubscribe hooks
   */
  public use = (...sub: Unsubscribe[]) => this.subscriptions.add(...sub)

  /* Reset the state to its initial provided value, initial() */
  public resetInitial = () => {
    this.set(this.initial())
  }
}

/*  Check if a value is a State */
export const isState = (s: any): s is State<any> => s instanceof State

export type StateType<S> = S extends State<infer T> ? T : never
