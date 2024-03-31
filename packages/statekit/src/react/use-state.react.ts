import { useSyncExternalStore } from 'react'
import { isString } from '@nodenogg.in/toolkit'
import { State, type Signal, signal } from '..'

export const useSignal = <S>(signal: Signal<S>) => useSyncExternalStore<S>(signal.on, signal.get)

export const useState = <S extends object, K extends keyof S | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  (isString(key)
    ? (useSignal(state.key(key)) as K extends keyof S ? S[K] : never)
    : useSyncExternalStore<S>(state.on, state.get)) as K extends keyof S ? S[K] : S

export const useDerived = <R>(fn: () => R) => useSignal(signal(fn))