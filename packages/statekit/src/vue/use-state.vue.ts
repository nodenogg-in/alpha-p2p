import { customRef } from 'vue'
import { isString } from '@figureland/toolkit'
import { State, signal, UseSignalDependency, Subscribable } from '..'

export const useSubscribable = <S>(subscribable: Subscribable<S>) =>
  customRef<S>((track, set) => ({
    get: () => {
      track()
      return subscribable.get()
    },
    set,
    dispose: subscribable.on(set)
  }))

export const useState = <S extends object, K extends keyof S | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  (isString(key)
    ? (useSubscribable(state.key(key)) as K extends keyof S ? S[K] : never)
    : customRef<S>((track, set) => ({
        get: () => {
          track()
          return state.get()
        },
        set,
        dispose: state.on(set)
      }))) as K extends keyof S ? S[K] : S

export const useDerived = <R>(fn: (use: UseSignalDependency) => R) => useSubscribable(signal(fn))
