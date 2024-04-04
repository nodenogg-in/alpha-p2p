import type { Subscription, Unsubscribe } from '.'

export type SignalLike = Signal<any>

export type SignalLikeType = SignalLike extends Signal<infer T> ? T : never

export type UseSignalDependency = <S extends SignalLike>(u: S) => ReturnType<S['get']>

export type SignalType<S> = S extends Signal<infer T> ? T : never

export type Signal<V> = {
  id: string
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void
  on: (sub: Subscription<V>) => Unsubscribe
  get: () => V
  dispose: () => void
  use: (...sub: Unsubscribe[]) => void
}

export type SignalObject<R extends Record<string, any>, K extends keyof R = keyof R> = Signal<R> & {
  key: <K extends keyof R>(key: K) => Signal<R[K]>
  keys: K[]
}

export type SignalFSM<States extends string, Events extends string> = Signal<States> & {
  isIn: (...states: States[]) => boolean
  send: (event: Events) => void
}

export interface SignalState<S extends object, K extends string & keyof S = string & keyof S> {
  id: string
  signal: SignalObject<S>
  set: (u: Partial<S>, sync: boolean) => void
  get: () => S
  key: <Key extends K = K>(k: Key) => Signal<S[Key]>
  on: (sub: (value: S) => void) => Unsubscribe
  dispose: () => Promise<void>
  use: (...sub: Unsubscribe[]) => Unsubscribe
  resetInitial: () => void
}
