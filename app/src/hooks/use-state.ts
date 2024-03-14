import { isString } from '@nodenogg.in/utils'
import { deriveState, State, type Signal, type StateType, deriveSignal } from '@nodenogg.in/state'
import { customRef, type Ref } from 'vue'

export const useSignal = <S extends any>(signal: Signal<S>) =>
  customRef<S>((track, set) => ({
    get: () => {
      track()
      return signal.get()
    },
    set,
    dispose: signal.on(set)
  }))

export const useState = <S extends object, K extends (string & keyof S) | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  customRef((track, set) => ({
    get: () => {
      track()
      if (isString(key)) {
        return state.getKey(key) as K extends keyof S ? S[K] : never
      } else {
        return state.get() as K extends undefined ? S : never
      }
    },
    set,
    dispose: isString(key) ? state.onKey(key, set) : state.on(set)
  })) as K extends keyof S ? Ref<S[K]> : Ref<S>

export const useDerivedState = <States extends State<any>[], R>(
  states: [...States],
  fn: (states: { [K in keyof States]: StateType<States[K]> }) => R
) =>
  useState(
    deriveState(states, (data) => ({ value: fn(data) })),
    'value'
  )

export const useDerivedSignal = <States extends State<any>[], R>(
  states: [...States],
  fn: (states: { [K in keyof States]: StateType<States[K]> }) => R
) => useSignal(deriveSignal(states, (data) => ({ value: fn(data) })))
