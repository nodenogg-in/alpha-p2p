import { customRef } from 'vue'
import { isString } from '@nodenogg.in/utils'
import { State, type Signal, type Subscribable, type SubscribableType, derive } from '..'

export const useSignal = <S>(signal: Signal<S>) =>
  customRef<S>((track, set) => ({
    get: () => {
      track()
      return signal.get()
    },
    set,
    dispose: signal.on(set)
  }))

export const useState = <S extends object, K extends keyof S | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  (isString(key)
    ? (useSignal(state.key(key)) as K extends keyof S ? S[K] : never)
    : customRef<S>((track, set) => ({
        get: () => {
          track()
          return state.get()
        },
        set,
        dispose: state.on(set)
      }))) as K extends keyof S ? S[K] : S

export const useDerived = <Subs extends Subscribable<any>[], R>(
  subs: [...Subs],
  fn: (data: { [K in keyof Subs]: SubscribableType<Subs[K]> }) => R
) => useSignal(derive(subs, (data) => ({ value: fn(data) })))
