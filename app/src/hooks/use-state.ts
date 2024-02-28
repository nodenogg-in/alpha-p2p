import { customRef, type Ref } from 'vue'
import { isString, type State } from 'nodenoggin/utils'

export const useState = <S extends object, K extends (string & keyof S) | undefined = undefined>(
  state: State<S>,
  key?: K
) =>
  customRef((track, set) => ({
    dispose: state.on(set),
    get: () => {
      track()
      if (isString(key)) {
        return state.getKey(key) as K extends keyof S ? S[K] : never
      } else {
        return state.get() as K extends undefined ? S : never
      }
    },
    set
  })) as K extends keyof S ? Ref<S[K]> : Ref<S>

export const useDerived = <S extends object, R>(
  state: State<S>,
  compute: (value: S) => R
): Ref<R> =>
  customRef((track, set) => ({
    dispose: state.on(set),
    get: () => {
      track()
      return compute(state.get())
    },
    set
  }))
