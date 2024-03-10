import { customRef, type Ref } from 'vue'
import { DerivedState, isString, State, type StateType } from 'nodenoggin/utils'

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
    dispose: state.on(set)
  })) as K extends keyof S ? Ref<S[K]> : Ref<S>

export const useDerived = <States extends State<any>[], R>(
  states: [...States],
  derive: (...states: { [K in keyof States]: StateType<States[K]> }) => R
) => useState(new DerivedState(states, (...data) => ({ value: derive(...data) })), 'value')
