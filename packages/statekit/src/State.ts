import { values } from '@figureland/toolkit'
import type { Unsubscribe } from './utils/subscriptions'
import { createSubscriptions } from './utils/subscriptions'
import { signalObject } from './signal-object'
import type { SignalOptions } from './signal'
import type { SignalObject, SignalState } from '.'
import { type PersistenceOptions, persist } from './persist'

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

  constructor({ initial, persistence, throttle, signal: signalOptions }: StateOptions<S>) {
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

  public set: SignalState<S, K>['set'] = (u, sync) => {
    if (!this.shouldThrottle()) this.signal.set(u, sync)
  }

  /*  Get the current state */
  public get = (): S => this.signal.get()

  public key: SignalState<S, K>['key'] = (k) => this.signal.key(k)

  get keys() {
    return this.signal.keys as K[]
  }

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
  public reset = () => {
    this.set(this.initial())
  }
  mutate = (u: (val: S) => void, sync: boolean = true) => this.signal.mutate(u, sync)
}

/*  Check if a value is a State */
export const isState = (s: any): s is State<any> => s instanceof State

export type StateType<S> = S extends State<infer T> ? T : never
