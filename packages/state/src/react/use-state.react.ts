import { useSyncExternalStore } from 'react'
import { isString } from '@nodenogg.in/utils'
import { State, type Signal, type Subscribable, type SubscribableType, derive } from '..'

export const useSignal = <S extends any>(signal: Signal<S>) =>
  useSyncExternalStore(signal.on, signal.get)

export const useState = <S extends object, K extends (string & keyof S) | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  (isString(key)
    ? (useSignal(state.key(key)) as K extends keyof S ? S[K] : never)
    : useSyncExternalStore(state.on, state.get)) as K extends keyof S ? S[K] : S

export const useDerived = <Subs extends Subscribable<any>[], R>(
  signals: [...Subs],
  fn: (signals: { [K in keyof Subs]: SubscribableType<Subs[K]> }) => R
) => useSignal(derive(signals, (data) => ({ value: fn(data) })))
