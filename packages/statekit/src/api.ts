import type { Subscription, Unsubscribe } from '.'

export type SignalLike<T extends any = any, S extends Signal<T> = Signal<T>> = S

export type SignalLikeType<S> = S extends SignalLike<infer T> ? T : never

export type UseSignalDependency = <S extends SignalLike>(u: S) => SignalLikeType<S>

export type ReadonlySignal<S extends SignalLike> = Pick<S, 'id' | 'get' | 'on'>

export type Signal<V> = {
  id: string
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void
  on: (sub: Subscription<V>) => Unsubscribe
  get: () => V
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export interface SignalObject<R extends Record<string, any>, K extends keyof R = keyof R>
  extends Signal<R> {
  key: <K extends keyof R>(key: K) => Signal<R[K]>
  keys: K[]
}

export type SignalMachineTransitions<States extends string, Events extends string, D extends object> = {
  [State in States]: {
    on?: {
      [Event in Events]?: States
    }
    enter?: (data: Signal<D>, event: Events, from: States) => void
    exit?: (data: Signal<D>, event: Events, to: States) => void
  }
}

export type SignalMachine<
  States extends string,
  Events extends string,
  D extends object
> = Signal<States> & {
  is: (...states: States[]) => boolean
  send: (event: Events, d?: Partial<D>) => void
  data: Signal<D>
}

export interface SignalState<R extends Record<string, any>, K extends keyof R = keyof R>
  extends SignalObject<R, K> {
  reset: () => void
}
